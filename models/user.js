const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const config = require('./../config/database');
const connection = config.connection;

//User Schema
module.exports = function(sequelize, DataTypes) {
	
	var rol = connection.import(path.join(process.cwd(), 'models', 'rol'));
	
	return sequelize.define('usuario', {
		idUsuario: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		nombre: {
			type: DataTypes.STRING
		},
		apellido: {
			type: DataTypes.STRING
		},
		correo: {
			type: DataTypes.STRING,
			unique: true
		},
		rol: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: rol,
				key: 'idRol'
			}
		}, 
		contraseña: {
			type: DataTypes.STRING,
			allowNull: false
		}, 
		cedula: {
			type: DataTypes.INTEGER,
			
		},
		telefono: {
			type: DataTypes.STRING,
		},
		direccion: {
			type: DataTypes.STRING, 
		}
		
	});	
}


const User = module.exports = connection.import(path.join(process.cwd(), 'models', 'user'));

module.exports.modificarUsuario = function(usuario, callback) {
	
	query = {
		nombre: usuario.nombre,
		apellido: usuario.apellido,
		correo: usuario.correo,
		rol: usuario.rol,
		cedula: usuario.cedula,
		telefono: usuario.telefono,
		direccion: usuario.direccion
	}
	console.log("ESTOY UPDATEANDO UN USUARIO");
	User.update(query, {where: {idUsuario: usuario.idUsuario}}); 
    console.log("update USUARIO exitoso");	
    return callback();
}

module.exports.getUserByID= function(ID, callback){
	//console.log('EL ID DEL VEHICULO ES:'+ID);
	const query = {where: {idUsuario: ID}}
	User.findOne(query).then(dato => {
		console.log(dato.get());
		return dato.get();
	})
	.then(datos => {
		//console.log('aqui los datos son');
		//console.log(datos);
		callback(null, datos);
	});	
}
module.exports.getUsers = function(id, callback){
	
	  User.findAll().then(datos => {
		  let users = datos.map(function(datoCrudo) {
			  dato = datoCrudo.dataValues;   
			  return dato; 
		  })          
		  return users; 
	  })
	  .then(datos => {             
		  return callback(null, datos);
	  });
  }

module.exports.getUsers = function(id, callback){
      
        User.findAll().then(datos => {
            let users = datos.map(function(datoCrudo) {
                dato = datoCrudo.dataValues;   
                return dato; 
            })          
            return users; 
        })
        .then(datos => {             
            return callback(null, datos);
        });
    }

module.exports.getUserByEmail = function(email, callback){
	const query = {where: {correo: email}}
	User.findOne(query).then(usuario => {
		console.log(usuario);
		return usuario.get();
	})
	.then(datos => {
		//console.log(datos);
		return callback(null, datos);
	});		
}

module.exports.addUser = function(newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.contraseña, salt, (err, hash) => {
			if(err) throw err;
			console.log(newUser.dataValues);
			console.log("contraseña vieja:");
			console.log(newUser.dataValues.contraseña);
			console.log("hash:");
			console.log(hash);
			newUser.dataValues.contraseña = hash;
			User.create(newUser.dataValues).then(function(usuarioGuardado) {
				console.log("EL USUARIO GUARDADO ES"); 
				console.log(usuarioGuardado.dataValues); 
				return callback(false,usuarioGuardado.dataValues);
				
			});

		});
	});
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		//if(err) throw err;
		console.log('HOLA QUE TAL')
		console.log(isMatch);
		callback(null, isMatch);
	});
}
