const express = require('express');
const router = express.Router();
const User = require('../models/user');
const vehiculo = require('../models/vehiculo'); 
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');



router.post('/registerVehiculo', (req, res, next) => {
    
        let newVehiculo = new vehiculo({
            placa: req.body.placa,
            modelo: req.body.modelo,
            serialMotor: req.body.serialMotor,
            ano: req.body.ano,
            dueño: req.body.dueño, 
           
        });
        vehiculo.addVehiculo(newVehiculo, (err, vehiculo) => {
            if(err){
                res.json({success:false, msg:'No funciono el registro de usuario'});
            } else {
                res.json({success:false, msg:'Usuario registrado :)'});
            }
        });
    });