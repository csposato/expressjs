const express = require("express");
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
var env = require('node-env-file');
env('./.env');

const PORT_IN = process.env.PORT_IN || '3000';
const DOG_SERVICE_URL = process.env.DOG_SERVICE_URL || 'http://localhost:';
const DOG_SERVICE_PORT = process.env.DOG_SERVICE_PORT || '4000';
const DOG_SERVICE_PATH = process.env.DOG_SERVICE_PATH || '/external';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let usuario = {
    nombre:'',
    apellido: ''
};
let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
};
app.get('/', function(req, res) {
    respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Punto de inicio'
    };
    res.send(respuesta);
});
app.route('/dogs')
    .get(function (req, res) {
        const url = DOG_SERVICE_URL + DOG_SERVICE_PORT + DOG_SERVICE_PATH;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };
        respuesta = {
            error: false,
            codigo: 200,
            mensaje: ''
        };
        fetch(url, options)
            .then(function(response) {
                console.log('Calling ', url);
                return response.json();
            })
            .then(function(data) {
                console.log('Sending data...');
                res.send(data);
                console.log('Data ok!');
            })
            .catch(function(err) {
                console.error('Error: ' + err);
            });
    });
app.route('/usuario')
    .get(function (req, res) {
        respuesta = {
            error: false,
            codigo: 200,
            mensaje: ''
        };
        if(usuario.nombre === '' || usuario.apellido === '') {
            respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'El usuario no ha sido creado'
            };
        } else {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'respuesta del usuario',
                respuesta: usuario
            };
        }
        res.send(respuesta);
    })
    .post(function (req, res) {
        if(!req.body.nombre || !req.body.apellido) {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo nombre y apellido son requeridos'
            };
        } else {
            if(usuario.nombre !== '' || usuario.apellido !== '') {
                respuesta = {
                    error: true,
                    codigo: 503,
                    mensaje: 'El usuario ya fue creado previamente'
                };
            } else {
                usuario = {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido
                };
                respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Usuario creado',
                    respuesta: usuario
                };
            }
        }

        res.send(respuesta);
    })
    .put(function (req, res) {
        if(!req.body.nombre || !req.body.apellido) {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo nombre y apellido son requeridos'
            };
        } else {
            if(usuario.nombre === '' || usuario.apellido === '') {
                respuesta = {
                    error: true,
                    codigo: 501,
                    mensaje: 'El usuario no ha sido creado'
                };
            } else {
                usuario = {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido
                };
                respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Usuario actualizado',
                    respuesta: usuario
                };
            }
        }

        res.send(respuesta);
    })
    .delete(function (req, res) {
        if(usuario.nombre === '' || usuario.apellido === '') {
            respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'El usuario no ha sido creado'
            };
        } else {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Usuario eliminado'
            };
            usuario = {
                nombre: '',
                apellido: ''
            };
        }
        res.send(respuesta);
    });
app.use(function(req, res, next) {
    respuesta = {
        error: true,
        codigo: 404,
        mensaje: 'URL no encontrada'
    };
    res.status(404).send(respuesta);
});
app.listen(PORT_IN, () => {
    console.log("El servidor está inicializado en el puerto: ", PORT_IN);
});