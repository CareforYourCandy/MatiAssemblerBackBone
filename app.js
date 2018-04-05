const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/database');
const connection = config.connection;

// Sincroniza los cambios en los modelos
connection.sync({ logging: false });

const app = express();

const users = require('./routes/users');
const vehiculo = require('./routes/vehiculo');
//Port number
const port = process.env.PORT || 8080;

//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Index Route
app.get('/', (req, res) => {
	res.send('Invalid Endpoint');
});


app.listen(port, () => {
	console.log("Server started on port "+port);
});