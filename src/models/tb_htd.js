// models/htd.js
const { Model, DataTypes, Op } = require('sequelize');
const { MyBatisMapper, sequelize } = require(`../modules/sequelize`);
const util = require(`../modules/util`);

class HTD extends Model {

}

HTD.init({
  // 모델 정의
  htd_idx: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    comment: 'IDX',
  },
  create_idx: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '생성 관리자 아이디',
  },
  create_role_cd: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '생성 관리자 코드',
  },
  create_dt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '생성일자',
  },
  update_idx: {
    type: DataTypes.INTEGER.UNSIGNED,
    comment: '수정 관리자 아이디',
  },
  update_role_cd: {
    type: DataTypes.STRING(20),
    comment: '수정 관리자 코드',
  },
  update_dt: {
    type: DataTypes.DATE,
    comment: '수정일자',
  },
}, {
  sequelize,
  modelName: 'tb_htd',
  // 모델 옵션
});

module.exports = HTD;
