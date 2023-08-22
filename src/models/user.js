'use strict';
import {DataTypes, Sequelize } from 'sequelize';
import db from '../modules/db.js'
import Role from '../models/roles.js';

const User = db.define('Users', {
  Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  Name:{
    type: DataTypes.STRING,
    allowNull:false,
    length:255,
  },
  Email:{
    type:DataTypes.STRING,
    unique:true,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Please fill in the required email field"
      }
    }
  },
  IsEmailVerify:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false,
  },
  IsBlocked:{
    type:DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },
  Birthday:{
    type:DataTypes.DATE,
    allowNull:true
  },
  RoleId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  Password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg:"Please fill in the required password field"
      },
  },
},
});

User.belongsTo(Role);
Role.hasMany(User); 
export default User;
