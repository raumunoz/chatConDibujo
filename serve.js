

console.log("mi servidor de server está corriendo");
let express = require('express');
let socket = require('socket.io');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const assert = require('assert');
let app = express();
let port = process.env.PORT || 5000;
let server = app.listen(port);
let io = socket(server);
let localhost=process.env.HOST;

const url = process.env.MongodbUri;
const dbName = 'mongochat';

let clients;
let numClients;
let nombreClientes = [];
let roomLocal;
let chat;
let status=false;
/*para hostear static files */

app.use(express.static('public'));
io.sockets.on('connection', newConnection);
/*exportar el nombre del localhost */


//io.sockets.on('')
function newConnection(socket) {

    /*socket id es la id de la conexion */
    socket.emit('connection');
    /*numero de clientes */
    /*para conectar ala base de datos */
    MongoClient.connect(url, function (err, client) {
        const db = client.db(dbName);
        chat = db.collection('chats');
        assert.equal(null, err);
        if (err) {
            throw err;
        }
        
        console.log("Connected successfully to server");
    });
    function mostrarDatos(){
        chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
            assert.equal(err,null);
            //console.log("datos a enviar"+res);
            socket.emit('salida',res);
        });
    }
    function removerDatos(){
        chat.remove({},function(){
            socket.emit('borrar');
        })
    }
    
    //console.log(io.sockets.sockets.length);
    // socket.broadcast.emit('usuario Nuevo',socket.id);
    // socket.emit('usario',socket.id);

    socket.on('unir chat', (room) => {
        if (status) {
            nombreClientes = [];
            roomLocal = room;
            socket.join(room);
            clients = io.sockets.adapter.rooms[room].sockets;
            numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
            for (var clientId in clients) {
                //console.log("cliente id " + clientId);
                //this is the socket of each client in the room.
                var clientSocket = io.sockets.connected[clientId];

                nombreClientes.push(clientSocket.username);
                //console.log("clientes "+clientSocket.id);
                //you can do whatever you need with this
                //clientSocket.emit('new event', "Updates");
                //nombreClientes.push(clientSocket.id);*/
                //  console.log("arreglo de clientes " + nombreClientes);


            }
            io.to(room).emit('actualizar usuarios', nombreClientes);
        }
    });
    socket.on('disconnect', function () {
        nombreClientes = nombreClientes.filter(item => item !== socket.username);
        io.to(roomLocal).emit('actualizar usuarios', nombreClientes);
        //console.log('user disconnected '+socket.id);
    });
    socket.on('mouse', (data) => {
        //console.log(data);
        socket.broadcast.emit('mouse', data);
    });
    socket.on('borrar',(data)=>{
        //remover todos los chats de la colecion
        chat.remove({},()=>{
            socket.emit('borrar');
        })
    })
    socket.on('mensaje chat', (msg) => {
        let nombre = socket.username;
        let mensaje = msg;
        chat.insert({ usuario: nombre, mensaje: mensaje }, function () {
            io.emit('mensaje chat', {
                usuario: nombre,
                mensaje: mensaje
                
            });

        });

    });
    socket.on('ingresar usuario',(data)=>{
        if(nombreClientes.length==0){
            socket.username = data;
            sendStatus(true);
            status=true;
            mostrarDatos();
        }else{
             if(nombreClientes.includes(data)==false){
                socket.username = data;
                sendStatus(true);
                 status=true;
                 mostrarDatos();
                
            }else{
                status=false;
                sendStatus(false);
            }
           
        }

    });
    /*codigo para la base de datos*/
    sendStatus = function (s) {
        socket.emit('status', s);
    }
    //obtenr chats de mongo coletions



}
