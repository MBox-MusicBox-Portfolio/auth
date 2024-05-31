import {DataTypes} from 'sequelize';
import {db} from '../modules/db'; 

const Roles = db.define('Roles', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  names: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Roles',
  timestamps: false
});
export default Roles