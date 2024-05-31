import { DataTypes } from 'sequelize';
import Roles from './Roles'
import {db} from '../modules/db';

export const User = db.define('Users', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  usernames: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  emails: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  passwords: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatars: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  isBlockeds: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  rolesId: {
    type: DataTypes.STRING(36),
    allowNull: true,
    defaultValue: null
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue:new Date().toLocaleString()
  },
  })


  User.belongsTo(Roles, { foreignKey: 'rolesId',targetKey:'id'});
  Roles.hasMany(User,{foreignKey:'rolesId'});
  export default User;
