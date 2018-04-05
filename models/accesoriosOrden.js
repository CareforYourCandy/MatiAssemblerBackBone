const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const AccesoriosOrden = connection.define('accesoriosorden', {
    idAccesoriosOrden: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idOrden: {
        type: Sequelize.INTEGER
    },
    cauchoRepuesto: {
        type: Sequelize.BOOLEAN
    },  
    llaves: {
        type: Sequelize.BOOLEAN 
    },
    gato: {
        type: Sequelize.BOOLEAN
    },
    herramientas: {
        type: Sequelize.BOOLEAN     
    },  
    equipodeSonido: {
        type: Sequelize.BOOLEAN
    },
    desperfectoCarroceria: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = AccesoriosOrden;

module.exports.getAccesorioByOrden= function(ID, callback){ //Obtener los accesorios del vehiculo por orden
    console.log('EL ID DE LA ORDEN ES:'+ID);
    const query = {where: {idOrden: ID}}
    AccesoriosOrden.findOne(query).then(dato => {
        //console.log(dato.get());
        return dato.get();
    })
    .then(datos => {
        console.log('aqui los datos son');
        console.log(datos);
        callback(null, datos);
    }); 

}

module.exports.addAccesorios = function(newAcces, callback) { //Añadir una nueva cita a la cola al solicitar una
            console.log("estoy en addCita");
            newAcces.save(callback);
            return callback();

}