'use strict'
import Producer  from '../models/producer.js';
import db from '../modules/db.js'
import {DataTypes} from 'sequelize';

const Band = db.define('Bands',{
    Id:{
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4,
        type:DataTypes.UUIDV4
    },
    Avatar:{
        type:DataTypes.TEXT
    },
    Name:{
        type:DataTypes.TEXT
    },
    ProducerId:{
        type:DataTypes.UUIDV4
    },
    CreatedAt:{
        type:DataTypes.DATE
    },
    FullInfo:{
        type:DataTypes.TEXT
    },
    IsBlocked:{
        type:DataTypes.BOOLEAN
    }
})

Band.belongsTo(Producer);
Producer.hasMany(Band);


export default Band;