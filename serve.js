

console.log("mi servidor de server está corriendo");
let express = require('express');
let socket = require('socket.io');
const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');
let app = express();
let port = process.env.PORT || 3000;
let server = app.listen(port);
let io = socket(server);
//nombre y url de la base de datos
//const url = 'mongodb://127.0.0.1/websockets';
const url = 'mongodb://chatderau.herokuapp.com/websockets';
const dbName = 'mongoChat';

let clients;
let numClients;
let nombreClientes = [];
let roomLocal;
let chat;
/*para hostear static files */

app.use(express.static('public'));
io.sockets.on('connection', newConnection);



//io.sockets.on('')
function newConnection(socket) {

    /*socket id es la id de la conexion */
    //console.log('new connection: ' + socket.id);
    socket.emit('usuario local', socket.id);
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
            console.log("datos a enviar"+res);
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
        nombreClientes = [];
        roomLocal = room;
        //console.log("se quiere unir " + room);
        socket.join(room);
        clients = io.sockets.adapter.rooms[room].sockets;
        numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
        //console.log("Numero de clientes " + numClients);
        for (var clientId in clients) {
            //console.log("cliente id " + clientId);
            //this is the socket of each client in the room.
            var clientSocket = io.sockets.connected[clientId];
            
                console.log("nombre de usarui es -----------------"+clientSocket.username);
           
            
            nombreClientes.push(clientSocket.username);
            //console.log("clientes "+clientSocket.id);
            //you can do whatever you need with this
            //clientSocket.emit('new event', "Updates");
            //nombreClientes.push(clientSocket.id);*/
          //  console.log("arreglo de clientes " + nombreClientes);


        }


        io.to(room).emit('actualizar usuarios', nombreClientes);
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
            sendStatus({
                message: "mesage sent",
                clear: true
            });

        })

    });
    socket.on('ingresar usuario',(data)=>{
        
        socket.username = data;
        console.log("dar mensajes al ingresar");
        mostrarDatos();
        

    });
    /*codigo para la base de datos*/
    sendStatus = function (s) {
        socket.emit('status', s);
    }
    //obtenr chats de mongo coletions



}
