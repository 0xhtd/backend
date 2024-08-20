const socketIO = require('socket.io');
const jwt = require(`../middlewares/jwt`);

let io;
const sessions = {};  // 세션을 메모리에 저장

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: "*",
      },
      transports: ['websocket']
    });

    io.on('connection', async (socket) => {
      const token = socket.handshake.auth.token;
      const newJwt = await jwt.verify({ token });
      let user_token = newJwt;
      const userId = user_token.id;

      if (userId) {
        // 기존 세션이 있다면 새 소켓으로 업데이트
        if (sessions[userId]) {
          sessions[userId].socket = socket;
        } else {
          // 새로운 세션 생성
          sessions[userId] = { socket };
        }
      }

      socket.on('registerSession', ({ userId, sessionId }) => {
        if (sessions[userId]?.sessionId === sessionId) {
          sessions[userId].socket = socket;
          console.log(`Session registered for user ${userId} with socket ID ${socket.id}`);
        }
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        // 세션에서 소켓 연결 삭제
        for (let userId in sessions) {
          if (sessions[userId].socket === socket) {
            delete sessions[userId];
            break;
          }
        }
      });
    });
  },
  addSession: (userId, sessionId, socket) => {
    sessions[userId] = { sessionId, socket };
  },
  getSession: (userId) => {
    return sessions[userId];
  },
  sendMessage: async (userIds, message) => {
    userIds.forEach(userId => {
      if (sessions[userId]?.socket) {
        sessions[userId].socket.emit('message', message);
      }
    });
  }
};
