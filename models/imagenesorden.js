const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const ImagenesOrden = connection.define('imagenesorden', {
    idImagenesOrden:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idOrden: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    imagen: {
        type: Sequelize.STRING
    },
    
});

module.exports = ImagenesOrden;

module.exports.getImagenesByOrden= function(ID, callback){ //Obtener las imagenes por orden 
  
    const query = {where: {idOrden: ID}}
    ImagenesOrden.findAll(query).then(imagenes => {		
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
module.exports.addImagenesOrden = function(ordenImagenes, callback) { //Añadir una imagen a la orden
    ImagenesOrden.create(ordenImagenes); 
    return callback();
    

}