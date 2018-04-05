const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

//Rol Schema
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('rol', {
		idRol: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		rol: {
			type: DataTypes.STRING
		}
	});
}