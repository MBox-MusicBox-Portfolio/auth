import {DataTypes} from 'sequelize';
import Roles from './roles.models'
import {db} from '../modules/db.modules';

export const User = db.define('Users', {
    Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    IsEmailVerify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    IsBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    Birthday: {
        type: DataTypes.DATE,
        allowNull: true
    },
    RoleId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.belongsTo(Roles, {foreignKey: 'RoleId', targetKey: 'Id'});
Roles.hasMany(User, {foreignKey: 'RoleId'});
export default User;
