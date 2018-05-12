

console.log("mi servidor de server está corriendo");
let express=require('express');
let socket=require('socket.io');
let app=express();
let server=app.listen(3000);
let io=socket(server);
/*para hostear static files */

app.use(express.static('public'));

io.sockets.on('connection',newConnection);

//io.sockets.on('')
function newConnection(socket){
    /*socket id es la id de la conexion */
    console.log('new connection: '+ socket.id);
    socket.emit('usuario local', socket.id);
    /*numero de clientes */
    //console.log(io.sockets.sockets.length);
    socket.broadcast.emit('usuario Nuevo',socket.id)<
   // socket.emit('usario',socket.id);
    socket.on('disconnect', function(){
        console.log('user disconnected '+socket.id);
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
