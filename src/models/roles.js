'use strict';
import {DataTypes} from 'sequelize';
import db from '../modules/db.js'; 
 
const Roles = db.define('Roles',{
    Id:{
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    Name:{
        type: DataTypes.STRING,
        unique:true
    }
});
export default Roles;