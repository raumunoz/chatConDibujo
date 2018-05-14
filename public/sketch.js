let socket;
let myCanvas;
let mensajeAenviar;
let tablaChat;
let divChat;
let ulUsuarios;

let li;
let h1;
let nombreUsuario;
let room;
let canvasPrecionado=false ;
function setup() {

room='chat1';
ulUsuarios=document.getElementById("listaUsuarios");

//myCanvas=createCanvas(273,433);
myCanvas=createCanvas(270,270);
myCanvas.parent("canvasDibujo");
//myCanvas.mouseMoved(()=>console.log("dentro del canvas"));
myCanvas.mousePressed(()=>{
    canvasPrecionado=true;
    console.log("el mause se preciono");
});
myCanvas.mouseReleased(()=>{
    console.log("el mause se soltó");
    
});
myCanvas.mouseOut(()=>canvasPrecionado=false);
//myCanvas.mouseMoved(dibuja);
background(51);
//socket=io.connect('http://localhost:3000/');
socket=io.connect('https://glacial-fortress-88770.herokuapp.com/');
socket.on('mouse', newDrw);
socket.on('mensaje chat',agregarMensaje);
socket.on('usuario local',definirUsuarioLocal);
socket.on('connection',unirAchat);
socket.on('actualizar usuarios',actualizarUlUsuarios);

document.getElementById("IbottonGuardar").onclick = guardarImagen;
document.getElementById("IbottonEnviar").onclick = enviarMensaje;
tablaChat=document.getElementById("tablaChat");
divChat=document.getElementById("chat");
}
function unirAchat(){
    console.log("el cliente se quiere unir ");
    socket.emit('unir chat', room);
}
function definirUsuarioLocal(data){
    nombreUsuario=data;
    console.log("Usuario local"+ nombreUsuario);
}
function newDrw(data){
    noStroke();
    fill(255,0,100);
    ellipse(data.x,data.y,25,25);
}

function actualizarUlUsuarios(usuarios){
    while(ulUsuarios.firstChild) ulUsuarios.removeChild(ulUsuarios.firstChild);
    for (  usuario of usuarios) {
    li = document.createElement("li");
    li.appendChild(document.createTextNode(usuario.substring(0,5)));
    ulUsuarios.appendChild(li);
   }
    
}

function mouseDragged(){
   if(canvasPrecionado){
    var data={
        x:mouseX,
        y:mouseY
    }
        console.log('mandando '+(mouseX | 0)+','+(mouseY | 0));
    
    socket.emit('mouse',data);
    noStroke();
    fill(255);
    ellipse(mouseX,mouseY,25,25); 

   }
       
    
}


function guardarImagen(){
    
    saveCanvas(myCanvas,'imagenDelChat','jpg');
}
function enviarMensaje(){
    
    
    let mensaje=document.getElementById('Itexto').value;
    if (mensaje!='') {
        console.log("mensaje a enviar "+ mensaje);
        //let row = tablaChat.insertRow(0);
       /* let row=tablaChat.insertRow(tablaChat.rows.length );
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = mensaje;
        cell2.innerHTML = "anonimo";
        //divChat.scrollTop=0;  
        divChat.scrollTop = divChat.scrollHeight;*/
        socket.emit('mensaje chat',mensaje);
    }
}
function agregarMensaje(datos){
    console.log("mensaje recibido en el cliente"+ datos.mensaje);
    if (datos.mensaje!='') {
        console.log("mensaje recibido"+ datos.mensaje);
        //let row = tablaChat.insertRow(0);
        let row=tablaChat.insertRow(tablaChat.rows.length );
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = datos.mensaje;
        cell2.innerHTML = datos.usuario.substring(0,5);
        //divChat.scrollTop=0;  
        divChat.scrollTop = divChat.scrollHeight;
       
    }
}
/*function agregarMensaje(data){
    tabla =document.getElementById("tablaChat").onclick = guardarImagen;
}*/