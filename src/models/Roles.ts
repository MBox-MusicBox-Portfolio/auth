import {DataTypes} from 'sequelize';
import {db} from '../modules/db';

const Roles = db.define('Roles', {
    Id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Roles',
    timestamps: false
});
export default Roles