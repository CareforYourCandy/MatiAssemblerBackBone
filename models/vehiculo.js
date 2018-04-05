const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const bcrypt = require('bcryptjs');
const path = require('path');


//User Schema
	//var marca = connection.import(path.join(process.cwd(), 'models', 'marca'));

const Vehiculo = connection.define('vehiculo', {
	idVehiculo: {
		type: Sequelize.INTEGER,
		unique: true, 
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	placa: {
		type: Sequelize.STRING,
		unique: true
	},
	marca: {
		type: Sequelize.INTEGER
	},
	modelo: {
		type: Sequelize.INTEGER
	},
	activado: {
		type: Sequelize.BOOLEAN
	},
	serialMotor: {
		type: Sequelize.STRING,
		unique: true
	}, 
	ano: {
		type: Sequelize.INTEGER
	}, 
	foto: {
		type: Sequelize.STRING
		
	},
	propietario: {
        type: Sequelize.INTEGER
    }, 
    fechaRegistro: {
        type: Sequelize.DATE
    }

});	

module.exports = Vehiculo;

module.exports.getVehiculoByID= function(ID, callback){
	console.log('EL ID DEL VEHICULO ES:'+ID);
	const query = {where: {idVehiculo: ID}}
	Vehiculo.findOne(query).then(dato => {
		//console.log(dato.get());
		return dato.get();
	})
	.then(datos => {
		console.log('aqui los datos son');
		console.log(datos);
		callback(null, datos);
	});	

}

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

module.exports.getVehiculosByDueño = function(elquetal, callback){

	const query = {where: {propietario: elquetal}}
	Vehiculo.findAll(query).then(vehiculos => {
		
		let vehiculos2 = vehiculos.map(function(vehiculo) {
			dato = vehiculo.dataValues;   
			return dato; 
		})
		vehiculos = vehiculos2;
		
		return vehiculos; 
	})
	.then(datos => {
		//console.log(datos); 
		return callback(null, datos);
	});		
}

module.exports.addVehiculo = function(vehiculoNuevo, callback) {
	console.log("EL VEHICULO NUEVO ES"); 
	console.log(vehiculoNuevo); 

			Vehiculo.create(vehiculoNuevo.dataValues).then(function(vehiculoGuardado) {
				console.log("EL VEHICULO GUARDADO ES"); 
				console.log(vehiculoGuardado.dataValues); 
				return callback(false,vehiculoGuardado.dataValues);
				
			});
		
}

module.exports.desactivarVehiculo = function(vehiculoID, callback) {
	Vehiculo.update(
		{activado: 0},
		{where: {idVehiculo: vehiculoID} }
	).then(datos => {
		//console.log(datos);
		return callback(null, datos);
	});	
}

module.exports.activarVehiculo = function(vehiculo, callback) {
	let usuario=vehiculo.propietario;
	let PLACA=vehiculo.placa;
	Vehiculo.update(
		{activado: 1, propietario: usuario},
		{where: {placa: PLACA}}
	).then(datos => {
		console.log("vehi activado:");
		console.log(datos);
		return callback(null, datos);
	});	

}

module.exports.getVehiculos = function(req, callback){ //Obtener lista completa de vehiculos 
	Vehiculo.findAll().then(vehiculos => {		
		let vehi2 = vehiculos.map(function(vehiculo) {
			dato = vehiculo.dataValues;   
			return dato; 
		})		
		return vehi2; 
	})
	.then(datos => {
		console.log(datos); 
		return callback(null, datos);
	});		
}





