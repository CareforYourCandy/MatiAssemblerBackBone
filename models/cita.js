const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const bcrypt = require('bcryptjs');
const path = require('path');


//Cita Schema
//const vehiculo = connection.import(path.join(process.cwd(), 'models', 'vehiculo'));	
const Cita = connection.define('cita', {
		idCita: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		vehiculoCita: {
			type: Sequelize.INTEGER
		},
		fechaSolicitud: {
			type: Sequelize.DATE
		} 
		
	});	

module.exports = Cita;

module.exports.eliminarCitas = function(id, callback) {
	const query = {where: {idCita: id}}
	Cita.destroy(query).then( cita => {
		return callback(null, cita); 
	})
}

module.exports.getCitas = function(req, callback){ //Obtener la cola de citas (PARA EL GERENTE)
	Cita.findAll().then(citas => {		
		let citas2 = citas.map(function(cita) {
			dato = cita.dataValues;   
			return dato; 
		})
		//citas = citas2;		
		return citas2; 
	})
	.then(datos => {
		console.log("LOS DATOS ESTAN AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
		console.log(datos); 
		return callback(null, datos);
	});		
}


module.exports.addCita = function(newCita, callback) { //Añadir una nueva cita a la cola al solicitar una
	console.log("estoy en addCita");
	Cita.create(newCita.dataValues).then(function(citaGuardada) {
		console.log("LA CITA GUARDADA ES"); 
		console.log(citaGuardada.dataValues); 
		return callback(false,citaGuardada.dataValues);
		
	});

}
