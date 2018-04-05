const Sequelize = require('sequelize');
const config = require('./../config/database');
const connection = config.connection;

const bcrypt = require('bcryptjs');
const path = require('path');
var nodemailer = require('nodemailer');
const User = require('../models/user');
const Vehiculo = require('../models/vehiculo');
const Marca = require('../models/marca');
const Op = Sequelize.Op; 
const RepuestosOrden = require('../models/repuestosOrden'); 
const Repuesto = require('../models/repuesto'); 
const accesoriosOrden = require('../models/accesoriosOrden'); 
const Orden = connection.define('orden', {
    idOrden: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idVehiculo: {
        type: Sequelize.INTEGER
    },
    idMecanico: {
        type: Sequelize.INTEGER
    },
    diagnostico: {
        type: Sequelize.STRING
    },  
    /*imagenes: {
        type: Sequelize.STRING  
    },*/
    fecha: {
        type: Sequelize.DATE
    },
    motivo: {
        type: Sequelize.STRING      
    },  
    activada: {                  //1: en curso, 2: finalizada, 0: cerrada
        type: Sequelize.INTEGER
    },
    procedimiento: {
        type: Sequelize.STRING      
    }
});

module.exports = Orden;

module.exports.desactivarOrden = function(ordenID, callback) {
	Orden.update(
		{activada: 2},
		{where: {idOrden: ordenID} }
	).then(datos => {
		//console.log(datos);
		return callback(null, datos);
	});	
}

module.exports.activarOrden = function(ordenID, callback) {
    Orden.update(
        {activada: 1},
        {where: {idOrden: ordenID} }
    ).then(datos => {
        //console.log(datos);
        return callback(null, datos);
    }); 
}

module.exports.cerrarOrden = function(orden, callback) {
    Orden.update(
        {activada: 0},
        {where: {idOrden: orden.idOrden} }
    );

    Vehiculo.getVehiculoByID(orden.idVehiculo, (err, carro) => {

        User.getUserByID(carro.propietario, (err, user) => {

            Marca.getMarcaByID(carro.marca, (err, marca) => {

                RepuestosOrden.getRepuestosOrden(orden.idOrden, (err, repuestosOrden) => {
                    console.log('adentro de obtener los id repuestos orden');
                    console.log(repuestosOrden);
                    if(err) {
                        console.log('AQUI PASO ALGO');
                    }
                    if(!repuestosOrden){
                        console.log('AQUI PASO ALGO2');
                        return res.json({success: false, msg:'Vehiculo not found'});
                    }
                    const repuestosFinal = [];

                    for (let i = 0; i < repuestosOrden.length; i++) {
                        Repuesto.getRepuestoByID(repuestosOrden[i].idRepuesto, (err, repuesto) => {
                            //console.log('adentro de obtener cada nombre repuestos orden');
                            //console.log(repuesto);
                            if(err) {
                                console.log('AQUI PASO ALGO');
                            }
                            if(!repuesto){
                                console.log('AQUI PASO ALGO2');
                                return res.json({success: false, msg:'Repuesto not found'});
                            }                        
                            repuestosFinal.push(repuesto);

                            if(i == (repuestosOrden.length-1)){
                                console.log('array repuestos final:');
                                console.log(repuestosFinal);
                                    //------Enviar EMAIL ----------//
                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        secure: false,
                                        port: 25,
                                        auth: {
                                            user: 'matiassembler@gmail.com',
                                            pass: 'comprometido100'
                                        },
                                        tls: {
                                            rejectUnauthorized: false
                                        }
                                    }); 

                                    var mostrarRepuestos = "";
                                    repuestosFinal.forEach(function(element) {
                                        
                                        mostrarRepuestos= mostrarRepuestos + 
                                                        "    <li>"+element.pieza+"</li>";
                                    });
                                    console.log(mostrarRepuestos);


                                    let HelperOptions = {
                                        from: '"Equipo MatiAssembler" <matiassembler@gmail.com>',
                                        to: user.correo,
                                        subject: 'Reparación de vehículo finalizada.',                                      
                                        html: `
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                            <meta charset="utf-8" />
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <meta name="viewport" content="width=device-width, initial-scale=1">
                                        </head>
                                        <body class="bg-light">
                                                    <div class="container-fluid">
                                                        <div class="row clearfix">
                                                            <div class="card mx-auto my-5 p-5 col-12 col-md-8 col-lg-6">
                                                                <p class="lead body">
                                                                    <span class="titulo">Hola ${user.nombre}, la reparación de su ${marca.marca} ${carro.modelo} fue culminada.</span>
                                                                    <br>
                                                                    <p>   Motivo: ${orden.motivo}</p>
                                                                    <p>   Diagnostico: ${orden.diagnostico}</p>
                                                                    <p>   Procedimiento: ${orden.procedimiento}</p>
                                                                    <p>   Repuestos utilizados:</p>
                                                                        <div>
                                                                            ${mostrarRepuestos}
                                                                        </div>

                                                                    <br>Gracias por confiar en nosotros la reparación de su vehículo! Puede acudir a retirarlo cuando desee. 
                                                                    <br>
                                                                    Saludos,<h4> Equipo Matiassembler</h4>.
                                                                </p>          
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <style>
                                                        .title {
                                                            min-height: 10rem;
                                                        }
                                                        .titulo {
                                                            font-size: 20pt;
                                                        }
                                                        .body {
                                                            font-size: 16pt;
                                                        }
                                                        .card {
                                                            box-shadow: 0px 3px 15px rgba(0,0,0,0.2) !important;
                                                        }
                                                    </style>
                                                    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
                                                        crossorigin="anonymous"></script>
                                        </body>
                                        <script>
                                            demoP = document.getElementById("demo");
                                            function myFunction(item, index) {
                                                demoP.innerHTML = demoP.innerHTML + "index[" + index + "]: " + item + "<br>"; 
                                            }
                                        </script>        
                                        </html>   
                                    `};

                                    transporter.sendMail(HelperOptions, (error, info) => {
                                        if(error){
                                            return console.log(error);
                                        }
                                        console.log("El mail fue enviado con exito!");
                                        console.log(info);
                                    })
                                    //---------------FIN ENVIAR MAIL ----------------------
                            }                
                        });            
                    }                  
                });
            });
        });
    });
    return callback();
}

module.exports.addOrden = function(ordenNueva, callback) {
    console.log("estoy en addOrden");
    console.log(ordenNueva);
    //Orden.create(orden);
    Orden.create(ordenNueva).then(function(ordenGuardada) {
        console.log("EL VEHICULO GUARDADO ES"); 
        console.log(ordenGuardada.dataValues); 
        let URL = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURI(ordenGuardada.dataValues.idOrden)  + "&size=200x200";

    Vehiculo.getVehiculoByID(ordenGuardada.idVehiculo, (err, carro) => {
        //console.log('adentro de obtener el vehiculo');
        //console.log(carro);
        if(err) {
            console.log('AQUI PASO ALGO');
        }
        if(!carro){
            console.log('AQUI PASO ALGO2');
            return res.json({success: false, msg:'Vehiculo not found'});
        }

        User.getUserByID(carro.propietario, (err, user) => {
            //console.log('adentro de obtener el usuario');
            //console.log(user);
            if(err) {
                console.log('AQUI PASO ALGO');
            }
            if(!user){
                console.log('AQUI PASO ALGO2');
                return res.json({success: false, msg:'User not found'});
            }

            Marca.getMarcaByID(carro.marca, (err, marca) => {
                //console.log('adentro de obtener la marca');
                //console.log(marca);
                if(err) {
                    console.log('AQUI PASO ALGO');
                }
                if(!marca){
                    console.log('AQUI PASO ALGO2');
                    return res.json({success: false, msg:'Marca not found'});
                }

                //------Enviar EMAIL ----------//
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25,
                    auth: {
                        user: 'matiassembler@gmail.com',
                        pass: 'comprometido100'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                }); 

                let HelperOptions = {
                    from: '"Equipo MatiAssembler" <matiassembler@gmail.com>',
                    to: user.correo,
                    subject: 'Se procesó la admisión de vehículo!',                                      
                    html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body class="bg-light">
                                <div class="container-fluid">
                                    <div class="row clearfix">
                                        <div class="card mx-auto my-5 p-5 col-12 col-md-8 col-lg-6">
                                            <p class="lead body">
                                                <span class="titulo">Hola ${user.nombre},</span>
                                                <br>
                                                <br>La solicitud de reparación para su ${marca.marca} ${carro.modelo} fue procesada con éxito. Su vehículo será admitido el dia ${ordenNueva.fecha} al taller, lo esperamos!
                                                <br>El servicio de ${ordenNueva.motivo} solicitado se realizará tan pronto su vehículo llegue.
                                                <br><h5> Codigo QR <h5> 
                                                <img src="${URL}">                                                
                                                <br><br>
                                                Gracias por confiar en nosotros la reparación de su vehículo.   
                                                Saludos,<h4> Equipo Matiassembler</h4>.
                                            </p>          
                                        </div>
                                    </div>
                                </div>
                                <style>
                                    .title {
                                        min-height: 10rem;
                                    }
                                    .titulo {
                                        font-size: 20pt;
                                    }
                                    .body {
                                        font-size: 16pt;
                                    }
                                    .card {
                                        box-shadow: 0px 3px 15px rgba(0,0,0,0.2) !important;
                                    }
                                </style>
                                <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
                                    crossorigin="anonymous"></script>
                    </body>        
                    </html>   
                `};

                transporter.sendMail(HelperOptions, (error, info) => {
                    if(error){
                        return console.log(error);
                    }
                    console.log("El mail fue enviado con exito!");
                    console.log(info);
                })
                //---------------FIN ENVIAR MAIL ----------------------
            });
        });
    });
        
    return callback(false,ordenGuardada.dataValues);
        
    }); 
}


module.exports.getOrdenes =  function(req, callback){ //Obtener lista completa de ordenes
	Orden.findAll().then(ordenes => {		
		let ordenes2 = ordenes.map(function(orden) {
			dato = orden.dataValues;   
			return dato; 
		})		
		return ordenes2; 
	})
	.then(datos => {
		console.log(datos); 
		return callback(null, datos);
	});		
}

module.exports.getOrdenbyMecanico = function(id, callback){
	const query = {where: {idMecanico: id }}
	Orden.findOne(query).then(orden => {
		console.log(orden);
		return orden.get();
	})
	.then(datos => {

        return callback(null, datos);
        
	});		
}

module.exports.getOrdenesByMecanico = function(req, callback){
 console.log(req.body); 
	const query = {where: {idMecanico: req.body.idMecanico }}
	Orden.findAll(query).then(ordenes => {
        let ordenes2 = ordenes.map(function(orden) {
            dato = orden.dataValues;   
            return dato; 
        })
        ordenes = ordenes2;
        return ordenes; 
    })
    .then(datos => {
        console.log(datos); 
        return callback(null, datos);
    });     	
}

module.exports.getOrdenesPorVehiculo = function(elquetal, callback){

    const query = {where: {idVehiculo: elquetal}}
    Orden.findAll(query).then(ordenes => {
        
        let ordenes2 = ordenes.map(function(orden) {
            dato = orden.dataValues;   
            return dato; 
        })
        ordenes = ordenes2;
        return ordenes; 
    })
    .then(datos => {
        console.log(datos); 
        return callback(null, datos);
    });     
}

module.exports.getOrdenByID= function(ID, callback){
    const query = {where: {idOrden: ID}}
    Orden.findOne(query).then(dato => {
        return dato.get();
    })
    .then(datos => {
        //console.log('aqui los datos son');
        //console.log(datos);
        callback(null, datos);
    }); 
}

module.exports.getOrdenesByFecha = function(fechas, callback) {
    const query = { where: { fecha: { 
        [Op.between] : [fechas.fechaInicio, fechas.fechaFinal]
    }

    }};
    Orden.findAll(query).then(ordenes => {
        
        let ordenes2 = ordenes.map(function(orden) {
            dato = orden.dataValues;   
            return dato; 
        })
        ordenes = ordenes2;
        return ordenes; 
    })
    .then(datos => {
        console.log(datos); 
        return callback(null, datos);
    });     
}

module.exports.modificarOrden = function(orden, callback) {
    
    query = {diagnostico: orden.diagnostico,
        procedimiento: orden.procedimiento,
        activada: orden.activada
    }
    
    console.log("ESTOY UPDATEANDO ORDENES");
    Orden.update(query, {where: {idOrden: orden.idOrden}}); 

    return callback();
    console.log("update orden exitosa");
}



