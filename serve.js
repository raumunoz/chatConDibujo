

console.log("mi servidor de server está corriendo");
let express=require('express');
let socket=require('socket.io');
let app=express();
let server=app.listen(3000);
let io=socket(server);
let clients;
let numClients;
let nombreClientes=[];
let roomLocal;
/*para hostear static files */

app.use(express.static('public'));

io.sockets.on('connection',newConnection);

//io.sockets.on('')
function newConnection(socket){
    /*socket id es la id de la conexion */
    console.log('new connection: '+ socket.id);
    socket.emit('usuario local', socket.id);
    socket.emit('connection');
    /*numero de clientes */
    //console.log(io.sockets.sockets.length);
   // socket.broadcast.emit('usuario Nuevo',socket.id);
   // socket.emit('usario',socket.id);
   
   socket.on('unir chat',(room)=>{
     nombreClientes=[];
     roomLocal=room;
    console.log("se quiere unir "+ room);
    socket.join(room);
    clients = io.sockets.adapter.rooms[room].sockets;
    numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

    console.log("Numero de clientes " +numClients);
    //socket.emit('actualiza clientes',);
    /*nombreClientes=clients.map((x)=>{
        io.sockets.connected[x].id;
    })*/
    
   for (var clientId in clients ) {
        console.log("cliente id "+ clientId);
        //this is the socket of each client in the room.
        var clientSocket = io.sockets.connected[clientId];
        
        
        nombreClientes.push(clientSocket.id);
        //console.log("clientes "+clientSocket.id);
        //you can do whatever you need with this
        //clientSocket.emit('new event', "Updates");
        //nombreClientes.push(clientSocket.id);*/
        console.log("arreglo de clientes "+nombreClientes);
   
}

io.to(room).emit('actualizar usuarios', nombreClientes);
  });
    socket.on('disconnect', function(){
        nombreClientes = nombreClientes.filter(item => item !== socket.id);
        io.to(roomLocal).emit('actualizar usuarios', nombreClientes);
        //console.log('user disconnected '+socket.id);
      });
    socket.on('mouse',(data)=>{
        console.log(data);
        socket.broadcast.emit('mouse',data);
    });
    socket.on('mensaje chat', (msg)=>{
        io.emit('mensaje chat', {
            usuario:socket.id,
            mensaje:msg
        });
        
      });
      
     
   
}
