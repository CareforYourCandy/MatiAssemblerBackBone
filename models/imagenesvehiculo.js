const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const ImagenesVehiculo = connection.define('imagenesvehiculo', {
     idImagenesVehiculo:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },   
    idVehiculo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    imagen: {
        type: Sequelize.STRING
    },
    
});

module.exports = ImagenesVehiculo;

module.exports.getImagenesByVehiculo= function(ID, callback){ //Obtener las imagenes por orden 
    console.log('EL ID DEL VEHICULO ES:'+ID);
    const query = {where: {idVehiculo: ID}}
    ImagenesVehiculo.findAll(query).then(imagenes => {		
		let imagenes2 = imagenes.map(function(imagen) {
			dato = imagen.dataValues;   
			return dato; 
		})		
		return imagenes2; 
	})
	.then(datos => {
		console.log(datos); 
		return callback(null, datos);
	});

}
module.exports.addImagenesVehiculo = function(vehiculoImagenes, callback) { //Añadir un nuevo repuesto
    
        ImagenesVehiculo.create(vehiculoImagenes); 
   



    
    return callback();
    

}