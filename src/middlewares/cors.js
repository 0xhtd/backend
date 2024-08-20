const cors = require("cors");

const origins = JSON.parse(process.env.CORS_ALLOW_URLS) || [];
console.log("process.env.CORS_ALLOW_URLS", process.env.CORS_ALLOW_URLS);
console.log("origins", origins);

const corsSetup = cors({
  origin: (origin, callback) => {
    origin = origin || "no-domain";

    if (origins.includes("no-domain")) {
      callback(null, true);
    } else if (origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});

module.exports = corsSetup;
