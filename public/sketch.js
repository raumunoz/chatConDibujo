let socket;
let myCanvas;
let mensajeAenviar;
let tablaChat;
let divChat;
let ulUsuarios;
let usuarios=new Array;
let li;
let h1;
let nombreUsuario;
/*var ul = document.getElementById("list");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode("Four"));
  ul.appendChild(li);*/
function setup() {
/*var c = createCanvas(100, 100);
background(255, 0, 0);
saveCanvas(c, 'myCanvas', 'jpg');*/
usuarios[0]="toño";
//createElement('ul').id('listaUsuarios').parent('usuarios');
//h1 = createElement('h1','un h1 cualquiera');
ulUsuarios=document.getElementById("listaUsuarios");

myCanvas=createCanvas(600,400);
myCanvas.parent("canvasDibujo");
background(51);

socket=io.connect('http://localhost:3000');
socket.on('mouse', newDrw);
socket.on('usuario Nuevo', nuevoUsuario);
socket.on('mensaje chat',agregarMensaje);
socket.on('usuario local',definirUsuarioLocal);
/*socket.on('mensaje', agregarMensaje);*/
document.getElementById("IbottonGuardar").onclick = guardarImagen;
document.getElementById("IbottonEnviar").onclick = enviarMensaje;
tablaChat=document.getElementById("tablaChat");
divChat=document.getElementById("chat");
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
function nuevoUsuario(data){
    let cad;
    cad = data.substring(0,5);
    console.log('nuevo reducido'+cad);
    usuarios.push(cad);
   
    actualizarUlUsuarios();
}
function actualizarUlUsuarios(){
    while(ulUsuarios.firstChild) ulUsuarios.removeChild(ulUsuarios.firstChild);
    for (  usuario of usuarios) {
    li = document.createElement("li");
    li.appendChild(document.createTextNode(usuario));
    ulUsuarios.appendChild(li);
   }
    
}
function draw(){
   
   

}
function mouseDragged(){
    console.log('mandando '+(mouseX | 0)+','+(mouseY | 0));
    var data={
        x:mouseX,
        y:mouseY
    }
    socket.emit('mouse',data);
    noStroke();
    fill(255);
    ellipse(mouseX,mouseY,25,25);
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
        cell2.innerHTML = datos.usuario;
        //divChat.scrollTop=0;  
        divChat.scrollTop = divChat.scrollHeight;
       
    }
}
/*function agregarMensaje(data){
    tabla =document.getElementById("tablaChat").onclick = guardarImagen;
}*/