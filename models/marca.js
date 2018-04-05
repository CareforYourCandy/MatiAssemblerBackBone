const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('./../config/database');
const connection = config.connection;
//Marca Schema
const Marca = connection.define('marca', {
		idMarca: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		marca: {
			type: Sequelize.STRING
		}
	});


module.exports.getMarcas = function(id, callback){	
	Marca.findAll().then(datos => {
		let marcas = datos.map(function(datoCrudo) {
			dato = datoCrudo.dataValues;   
			return dato; 
		})		
		return marcas; 
	})
	.then(datos => {			 
		return callback(null, datos);
	});
}

module.exports.getMarcaByID= function(ID, callback){
	//console.log('EL ID DEL VEHICULO ES:'+ID);
	const query = {where: {idMarca: ID}}
	Marca.findOne(query).then(dato => {
		console.log(dato.get());
		return dato.get();
	})
	.then(datos => {
		//console.log('aqui los datos son');
		//console.log(datos);
		callback(null, datos);
	});	
}
