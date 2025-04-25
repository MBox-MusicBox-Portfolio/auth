import {DataTypes} from 'sequelize';
import {db} from '../modules/db.modules';
 
export const Roles = db.define('Roles', {
    Id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false
    },
    Name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Roles',
    timestamps: false
});
