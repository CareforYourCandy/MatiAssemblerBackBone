const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const bcrypt = require('bcryptjs');
const path = require('path');

const Repuesto = connection.define('repuesto', {
    idRepuesto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    pieza: {
        type: Sequelize.STRING
    },
    modelo: {
        type: Sequelize.STRING
    },
    marca: {
        type: Sequelize.INTEGER
    }  
});
module.exports = Repuesto;

module.exports.addRepuesto = function(newRepuesto, callback) { //Añadir un nuevo repuesto
    console.log("estoy en addRepuesto");
    //newRepuesto.save(callback);
    Repuesto.create(newRepuesto); 
    return callback();
    console.log("añadi");

}
  
module.exports.getRepuesto = function(id, callback){
           
    Repuesto.findAll().then(datos => {
        

        let repuestos = datos.map(function(datoCrudo) {
            dato = datoCrudo.dataValues;   
            return dato; 
        })
               
        return repuestos; 
    })
    .then(datos => {
        console.log("repuestos todos:");
        console.log(datos); 
        return callback(null, datos);
    });
}

module.exports.getRepuestoByID= function(ID, callback){
    const query = {where: {idRepuesto: ID}}
    console.log(" AQUI ADENTRO DEL CAMBIO");
    Repuesto.findOne(query).then(dato => {
        console.log(dato.get());
        return dato.get();
    })
    .then(datos => {
        callback(null, datos);
    }); 
}

module.exports.eliminarRepuesto = function(id, callback) {
    const query = {where: {idRepuesto: id}}
    Repuesto.destroy(query).then( repuesto => {
        return callback(null, repuesto); 
    })
}
