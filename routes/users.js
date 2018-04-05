const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Vehiculo = require('../models/vehiculo');
const Cita = require('../models/cita');
const Orden = require('../models/orden');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Repuesto = require('../models/repuesto'); 
const Marca = require('../models/marca');
const AccesoriosOrden = require('../models/accesoriosOrden'); 
const RepuestosOrden = require('../models/repuestosOrden'); 
const ImagenesVehiculo = require('../models/imagenesvehiculo'); 
const ImagenesOrden = require('../models/imagenesorden'); 

router.post('/modificarUsuario', (req, res, next) => {
	console.log("Estoy en modificar usuario"); 
	console.log(req.body);	
	let newUsuario = {
		idUsuario: req.body.idUsuario,
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		correo: req.body.correo,
		rol: req.body.rol,
		contraseña: req.body.contraseña,
		cedula: req.body.cedula,
		telefono: req.body.telefono,		
		direccion: req.body.direccion
	}

	User.modificarUsuario(newUsuario, (err, respuesta) => {
		if(err){
			res.json({success:false, msg:'No funciono'});
		} else {
			res.json({success:true, msg:'Usuario actualizado'});
		}
	});
}); 

//Register
router.post('/register', (req, res, next) => {

	let newUser = new User({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		correo: req.body.correo,
		rol: req.body.rol,
		contraseña: req.body.contraseña,
		cedula: req.body.cedula,
		telefono: req.body.telefono,
		direccion: req.body.direccion
	});
	User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success:false, msg:'No funciono el registro de usuario'});
		} else {
			res.json({success:true, msg:'Usuario registrado', user});
		}
	});
});


//Obtener un solo usuario por su id
router.post('/getUser', (req, res, next) => {
	id = req.body.ID;
	console.log('el id del usuario es:');
	console.log(id);

	User.getUserByID(id, (err, user) => {
		console.log('ESTE ES EL Usuario RESP:');
		console.log(user);
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!user){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Vehiculo not found'});
		}
		res.json({
			success: true,
			usuario: {
				idUsuario: user.idUsuario,
				nombre: user.nombre,
				apellido: user.apellido,
				correo: user.correo,
				rol: user.rol,
				contraseña: user.contraseña,
				cedula: user.cedula,
				direccion: user.direccion,
				telefono: user.telefono
			}
		});
	});
});

router.post('/eliminarCita', (req, res, next) => {
	console.log(req.body); 
	let cita = Cita.eliminarCitas(req.body.idCita, (err, cita) => {
		res.json( {
			success: true
		})
	})	
})

router.post('/eliminarRepuesto', (req, res, next) => {

	console.log("Estoy en eliminar repuesto"); 
	console.log(req.body); 
	Repuesto.eliminarRepuesto(req.body.idRepuesto, (err, repu) => {
		res.json( {
			success: true
		})
	})
	
})

router.post('/getOrdenes', (req, res, next) => { //Obtener todas las ordenes
	console.log("Estoy en obtener ordenes"); 
	let ordenes = Orden.getOrdenes(req, (err, ordenes) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!ordenes) {
			console.log("No hay ordenes"); 
		}
		console.log("Hare un response ahora"); 
		res.json( {
			success: true, 
			ordenes
		})
	});
})
router.post('/getUsers', (req, res, next) => {
	console.log("Estoy en obtener users"); 
	let usuarios = User.getUsers(req, (err, users) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!users) {
			console.log("No hay repuestos"); 
		}
		
		res.json( {
			success:true, 
			users
		})
	});
	
}); 

router.post('/getMecanicos', (req, res, next ) => {
	let mecanicos = User.getMecanicos(req, (err, mecanicos) => {
		res.json( {
			mecanicos
		})
	})
})
router.post('/modificarUsuario', (req, res, next) => {
	console.log("Estoy en modificar usuario"); 
	console.log(req.body);
	User.modificarUsuario(req.body);
	
}); 

	router.post('/getMarcas', (req, res, next) => {
		console.log("Estoy en obtener users"); 
		let marcas = Marca.getMarcas(req, (err, marcas) => {
			if (err) {
				console.log("algo fallo"); 
			}
			if(!marcas) {
				console.log("No hay marcas"); 
			}
			
			res.json( {
				success:true, 
				marcas 
			})
		});
		
		}); 


router.post('/obtenerRepuestos', (req, res, next) => {
	console.log("Estoy en obtener repuestos"); 
	let repuestos2 = Repuesto.getRepuesto(req, (err, repuestos) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!repuestos) {
			console.log("No hay repuestos"); 
		}
		
		res.json( {
			success:true, 
			repuestos
		})
	});
});

//Obtener 1 repuesto por su ID
router.post('/obtenerRepuesto', (req, res, next) => {
	console.log("AQUI CAMBIANDO REPUESTOS");
	const id = req.body.ID;
	Repuesto.getRepuestoByID(id, (err, repuesto) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!repuesto){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Repuesto not found'});
		}
		res.json({
			success: true,
			repuesto: {
				idRepuesto: repuesto.idRepuesto,
				pieza: repuesto.pieza
			}
		});
	});
});  

//Obtener los id de repuestos de una orden
router.post('/obtenerRepuestosOrden', (req, res, next) => {
	console.log("Estoy en obtener repuestos de la orden"); 
	const id = req.body.idOrden;
	RepuestosOrden.getRepuestosOrden(id, (err, repuestosOrden) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!repuestosOrden) {
			console.log("No hay repuestos"); 
		}
		
		res.json( {
			success:true, 
			repuestosOrden
		})
	});
});

//Añadir un repuesto en una orden
router.post('/addRepuestosOrden', (req, res, next) => {
	console.log("AQUI AÑADIENDO REPUESTOS EN UNA ORDEN");
	/*const idRep = req.body.IDREP;
	const idOrden = req.body.IDORDEN;
	console.log(idRep);
	console.log(idOrden);*/
	let newRepuestoOrden = new RepuestosOrden({
        idOrden: req.body.idOrden,
        idRepuesto: req.body.idRepuesto     
    });
	console.log(newRepuestoOrden);
	RepuestosOrden.addRepuestoOrden(newRepuestoOrden, (err, repuestosOrden) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!repuestosOrden) {
			console.log("No hay repuestos"); 
		}
		
		res.json({
			success:true
		});
	});
});  


router.post('/addImagenesVehiculo', (req, res, next) => {
	console.log(req.body); 
	const imagenesVehiculo = {
		idVehiculo: req.body.idVehiculo,
		imagen: req.body.imagen
	}
	ImagenesVehiculo.addImagenesVehiculo(imagenesVehiculo, (err, imagenesVehiculo) => {
		if(err){
			res.json({success:false, msg:'NO se añadieron las imagenes'});
		} else {
			res.json({success:true, msg:'Se añadieron las imagenes'});
		}
		res.json({
			success: true
		});
	});
})
router.post('/addImagenesOrden', (req, res, next) => {
	console.log(req.body); 
	const imagenesOrden = {
		idOrden: req.body.idOrden,
		imagen: req.body.imagen
	}
	ImagenesOrden.addImagenesOrden(imagenesOrden, (err, imagenesOrden) => {
		if(err){
			res.json({success:false, msg:'NO se añadieron las imagenes'});
		} else {
			res.json({success:true, msg:'Se añadieron las imagenes'});
		}
		res.json({
			success: true,
		
		});
	});
})

router.post('/obtenerImagenesOrden', (req, res, next) => {
	console.log("Estoy en obtener repuestos de la orden"); 
	const id = req.body.idOrden;
	ImagenesOrden.getImagenesByOrden(id, (err, imagenesOrden) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!imagenesOrden) {
			console.log("No hay imagenes"); 
		}
		
		res.json( {
			success:true, 
			imagenesOrden
		})
	});
});
router.post('/obtenerImagenesVehiculo', (req, res, next) => {
	console.log("Estoy en obtener repuestos de la orden"); 
	const id = req.body.idVehiculo;
	ImagenesVehiculo.getImagenesByVehiculo(id, (err, imagenesVehiculo) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!imagenesVehiculo) {
			console.log("No hay imagenes"); 
		}
		
		res.json( {
			success:true, 
			imagenesVehiculo
		})
	});
});
//Obtener Vehiculos por cliente
/*router.post('/getVehiculos', (req, res, next) => {
	const id=req.body.idUsuario;
	console.log();
	Vehiculo.getVehiculosByDueño(id, (err, vehiculos) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!vehiculos){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		console.log(vehiculos);
		res.json({
			success: true,
			vehiculos});
	});
})*/


//Obtener Vehiculos por cliente
router.post('/getVehiculos', (req, res, next) => {
	const id=req.body.idUsuario;
	console.log();
	Vehiculo.getVehiculosByDueño(id, (err, vehiculos) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!vehiculos){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		console.log(vehiculos);
		res.json({
			success: true,
			vehiculos});
	});
})

//Obtener todos los Vehiculos
router.post('/getVehiculos2', (req, res, next) => {
	//console.log();
	Vehiculo.getVehiculos(req, (err, vehiculos) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!vehiculos){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		res.json({
			success: true,
			vehiculos});
	});
})

router.post('/getOrdenesMecanico', (req, res, next) => { //Obtener ordenes por mecánico
	console.log("Estoy en obtener ordenes por mecanico");
	let ordenes = Orden.getOrdenesByMecanico(req, (err, ordenes) => {
		
		res.json( {
			success:true, 
			ordenes
		})
	});
})
//Obtener la cola de citas por asignar
router.post('/getCitas', (req, res, next) => {
	console.log("Estoy en obtener citas"); 
	let citas = Cita.getCitas(req, (err, rcitas) => {
		if (err) {
			console.log("algo fallo"); 
		}
		if(!rcitas) {
			console.log("No hay citas"); 
		}
		console.log("Aqui esta rcitas"); 
		console.log(rcitas); 
		res.json({
			success: true,
			rcitas
			
		});
	});	
})

//Obtener los vehiculos de la cola de citas
router.post('/getVehiculosCola', (req, res, next) => {
	console.log("Estoy en obtener vehiculos de la cola"); 
	let idVehiculo = req.body.idVehiculo;
	Vehiculo.getVehiculoByID(idVehiculo, (err, carro) => {
				
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!carro){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Carro no encontrado'});
		}
		console.log('este es el carro:');
		console.log(carro);
		res.json({
			success: true,
			vehiculo: {
				idVehiculo: carro.idVehiculo,
				placa: carro.placa,
				marca: carro.marca,
				modelo: carro.modelo,
				activado: carro.activado,
				serialMotor: carro.serialMotor,
				ano: carro.ano,
				propietario: carro.propietario,
				fechaRegistro: carro.fechaRegistro
			}
		});

	});
});

//Obtener un solo vehiculo por su id
router.post('/getVehiculo', (req, res, next) => {
	id = req.body.ID;
	console.log(req.body);
	console.log('el id del vehiculo es:');
	console.log(id);
	Vehiculo.getVehiculoByID(id, (err, carro) => {
		console.log('ESTE ES EL VEHICULO RESP:');
		console.log(carro);
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!carro){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Vehiculo not found'});
		}
	
		res.json({
			success: true,
			vehiculo: {
				idVehiculo: carro.idVehiculo,
				placa: carro.placa,
				marca: carro.marca,
				modelo: carro.modelo,
				activado: carro.activado,
				serialMotor: carro.serialMotor,
				ano: carro.ano,
				propietario: carro.propietario,
				fechaRegistro: carro.fechaRegistro
			}
		});
	});
});

//Obtener una orden por su id
router.post('/getOrden', (req, res, next) => {
	id = req.body.ID;
	console.log('el id de la orden es:');
	console.log(id);
	Orden.getOrdenByID(id, (err, orden) => {
		console.log('ESTE ES EL VEHICULO RESP:');
		console.log(orden);
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!orden){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Orden not found'});
		}
		res.json({
			success: true,
			orden: {
				idOrden: orden.idOrden,
				idVehiculo: orden.idVehiculo,
				idMecanico: orden.idMecanico,
				diagnostico: orden.diagnostico,
				procedimiento: orden.procedimiento,
				activada: orden.activada,
				fecha: orden.fecha,
				motivo: orden.motivo
			}
		});
	});
});

//Obtener accesorio  por su idOrden
router.post('/getAccesorios', (req, res, next) => {
	id = req.body.ID;
	console.log(req.body);
	console.log('el id de la orden es:');
	console.log(id);
	AccesoriosOrden.getAccesorioByOrden(id, (err, accs) => {
		console.log(accs);
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!accs){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Vehiculo not found'});
		}
		res.json({
			success: true,
			accesorios: {
				idAccesoriosOrden: accs.idAccesoriosOrden,
				idOrden: accs.idOrden,
				cauchoRepuesto: accs.cauchoRepuesto,
				llaves: accs.llaves,
				gato: accs.gato,
				herramientas: accs.herramientas,
				equipodeSonido: accs.equipodeSonido,
				desperfectoCarroceria: accs.desperfectoCarroceria
			}
		});
	});
});

//Obtener todas las Ordenes por vehiculo de cliente
router.post('/getOrdenesVehiculo', (req, res, next) => {
	const id=req.body.idVehiculo;
	console.log();
	Orden.getOrdenesPorVehiculo(id, (err, ordenes) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!ordenes){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		res.json({
			success: true,
			ordenes});
	});
})
router.post('/getOrdenesFecha', (req, res, next) => {
	let fechas = req.body.fechas; 
	console.log(fechas); 
	Orden.getOrdenesByFecha(fechas, (err, ordenes) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!ordenes){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		res.json({
			success: true,
			ordenes});
	}) 
}) 
router.post('/getOrdenesMecanico', (req, res, next) => {
	const id=req.body.idMecanico
	console.log();
	Orden.getOrdenesByMecanico(id, (err, ordenes) => {
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!ordenes){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		res.json({
			success: true,
			ordenes});
	});
})
//Authenticate
router.post('/authenticate', (req, res, next) => {
	const correo = req.body.correo;
	const contraseña = req.body.contraseña;

	User.getUserByEmail(correo, (err, user) => {
				console.log(user);
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!user){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'Usuario no encontrado'});
		}
		User.comparePassword(contraseña, user.contraseña, (err, isMatch) => {
			console.log('estoy en comparar');
			if(err) {
				console.log('ERROR EN COMPARAR');
			}
			if(isMatch){
				const token = jwt.sign(user, config.secret, {
					expiresIn:604800 //Una semana
				});

				res.json({
					success: true,
					//token:  'JWT '+token,
					token:  'Bearer '+token,
					user: {
						idUsuario: user.idUsuario,
						nombre: user.nombre,
						apellido: user.apellido,
						correo: user.correo,
						rol: user.rol,
						contraseña: user.contraseña,
						cedula: user.cedula,
						direccion: user.direccion,
						telefono: user.telefono
					}
				});
			} else {
				return res.json({success:false, msg: 'Contraseña incorrecta'});
			}
		});
	});
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //console.log(req.user);
    res.json({ user: req.user });
});

router.post('/registerVehiculo', (req, res, next) => {
    
    let newVehiculo = new Vehiculo({
        placa: req.body.placa,
        marca: req.body.marca,
        modelo: req.body.modelo,
        activado: req.body.activado,
        serialMotor: req.body.serialMotor,
        ano: req.body.ano,
        propietario: req.body.propietario,
        fechaRegistro: req.body.fechaRegistro
       
    });
    Vehiculo.addVehiculo(newVehiculo, (err, vehiculo) => {
		console.log("EL VEHICULO ES"); 
		console.log(vehiculo); 
		if(err){
			res.json({success:false, msg:'No funciono el registro vehiculo'});
		} else {
			res.json({success:true, msg:'Vehiculo registrado', vehiculo});
		}
	});

});



router.post('/registerCita', (req, res, next) => {
    
    let newCita = new Cita({
        vehiculoCita: req.body.vehiculoCita,
        fechaSolicitud: req.body.fechaSolicitud 
        
    });
    Cita.addCita(newCita, (err, citaNueva) => {
		if(err){
			res.json({success:false, msg:'No funciono el registro de cita'});
		} else {
			res.json({success:true, msg:'Cita en cola :)', citaNueva});
		}
	});

});

router.post('/desactivarVehiculo',  (req, res, next) => {
	console.log(req.body); 
	Vehiculo.desactivarVehiculo(req.body.idVehiculo, (err, vehiculo)  => {
		if (err) {
			res.json({success:false, msg:'No funciono'});
		} else {
			res.json({success:true, msg:'furula'});
		}
	})
}); 

router.post('/activarVehiculo',  (req, res, next) => {
	console.log(req.body); 
	Vehiculo.activarVehiculo(req.body, (err, vehiculo)  => {
		if (err) {
			res.json({success:false, msg:'No funciono'});
		} else {
			res.json({success:true, msg:'furula'});
		}
	})
}); 

router.post('/desactivarOrden',  (req, res, next) => {
	console.log(req.body); 
	Orden.desactivarOrden(req.body.idOrden, (err, orden)  => {
		if (err) {
			res.json({success:false, msg:'No funciono'});
		} else {
			res.json({success:true, msg:'furula'});
		}
	})
}); 

router.post('/activarOrden',  (req, res, next) => {
	console.log(req.body); 
	Orden.activarOrden(req.body.idOrden, (err, orden)  => {
		if (err) {
			res.json({success:false, msg:'No funciono'});
		} else {
			res.json({success:true, msg:'furula'});
		}
	})	
}); 

router.post('/cerrarOrden',  (req, res, next) => {
	console.log(req.body); 
	Orden.cerrarOrden(req.body, (err, orden)  => {
		if (err) {
			res.json({success:false, msg:'No funciono'});
		} else {
			res.json({success:true, msg:'furula'});
		}
	})	
});

router.post('/registerRepuesto', (req, res, next) => {
	let newRepuesto = {
		pieza:  req.body.pieza,
		modelo: req.body.modelo,
		marca: req.body.marca 
	}

	Repuesto.addRepuesto(newRepuesto, (err, repuesto) => {
		if(err){
			res.json({success:false, msg:'No funciono el registro de usuario'});
		} else {
			res.json({success:true, msg:'Usuario registrado'});
		}
	});
});

router.post('/registerOrden', (req, res, next) => {
	console.log(req.body);
	
	let newOrden = {
		idVehiculo: req.body.idVehiculo,
		idMecanico: req.body.idMecanico,
		//diagnostico: req.body.diagnostico,
		motivo: req.body.motivo,
		fecha: req.body.fecha,
		activada: 1, 
	}
	console.log(newOrden); 

    Orden.addOrden(newOrden, (err, orden) => {
		if(err){
			res.json({success:false, msg:'No funciono el registro orden'});
		} else {
			res.json({success:true, msg:'Orden Registrada', orden});
		}
	});

}); 

router.post('/addAccesorios', (req, res, next) => {
    
    let newAccesorios = new AccesoriosOrden({
		idOrden: req.body.idOrden,
		cauchoRepuesto: req.body.cauchoRepuesto,
		llaves: req.body.llaves,
		gato: req.body.gato,
		herramientas: req.body.herramientas,
		equipodeSonido: req.body.equipodeSonido,
		desperfectoCarroceria: req.body.desperfectoCarroceria 
    });
    AccesoriosOrden.addAccesorios(newAccesorios, (err, accs) => {
		if(err){
			res.json({success:false, msg:'No funciono el registro de cita'});
		} else {
			res.json({success:true, msg:'Accesorios registrados'});
		}
	});

});


router.post('/modificarOrden', (req, res, next) => {
	console.log(req.body);
	
	let newOrden = {	
		idOrden: req.body.idOrden,
		diagnostico: req.body.diagnostico,
		procedimiento: req.body.procedimiento,
		activada: req.body.activada, 
	}
	console.log(newOrden); 

    Orden.modificarOrden(newOrden, (err, orden) => {
		if(err){
			res.json({success:false, msg:'No funciono la actualizacion de orden'});
		} else {
			res.json({success:true, msg:'Orden actualizada'});
		}
	});

}); 

module.exports = router;

