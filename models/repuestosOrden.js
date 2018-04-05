const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const RepuestosOrden = connection.define('repuestosorden', {
    idOrden: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    idRepuesto: {
        type: Sequelize.INTEGER
    }
});

module.exports = RepuestosOrden;

module.exports.getRepuestosOrden = function(ID, callback){
    const query = {where: {idOrden: ID}}           
    RepuestosOrden.findAll(query).then(repuestos => {

            console.log("REPUESTOS:");
            console.log(repuestos); 
        let repuestos2 = repuestos.map(function(repuesto) {
            dato = repuesto.dataValues; 
            console.log("datos brutos:");
            console.log(repuesto);  
            return dato; 
        })
               
        return repuestos2; 
    })
    .then(datos => {
        console.log("repuestos orden");
        console.log(datos); 
        return callback(null, datos);
    });
}

module.exports.addRepuestoOrden = function(newRep, callback) { 
            console.log("estoy en addCita");
            RepuestosOrden.create(newRep.dataValues); 
            return callback();

}