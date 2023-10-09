'use strict'
import User from '../models/user.js';
import db from '../modules/db.js';
import {DataTypes} from 'sequelize';

const Producer = db.define('Producers',{
   Id:{
    primaryKey:true,
      type:DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
   },
   UserId:{
    type:DataTypes.UUIDV4,
   }
});

Producer.belongsTo(User);
User.hasMany(Producer);

export default Producer;