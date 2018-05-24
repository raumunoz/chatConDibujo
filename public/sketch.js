
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
let btnEntrar;
let ingresearUsuario;
let Contenedorentrar;


function setup() {
    
      console.log("direccion ---"+window.location.hostname);
      
document.getElementById("Itexto").disabled = true;
document.getElementById("IbottonEnviar").disabled=true;
room='chat1';
ulUsuarios=document.getElementById("listaUsuarios");
btnEntrar = document.getElementById("entrar");
Contenedorentrar = document.getElementById("Contenedorentrar");
ingresearUsuario = document.getElementById("ingresarUsuario");
//myCanvas=createCanvas(273,433);
myCanvas=createCanvas(300,300);
myCanvas.parent("canvasDibujo");
//myCanvas.mouseMoved(()=>console.log("dentro del canvas"));
myCanvas.mousePressed(()=>{
    document.body.style.overflow="hidden";
    canvasPrecionado=true;
    //console.log("el mause se preciono");
});
myCanvas.mouseReleased(()=>{
    //console.log("el mause se soltó");
    document.body.style.overflow="auto";
});
myCanvas.mouseOut(()=>{
    document.body.style.overflow="auto";
    canvasPrecionado=false
});
//myCanvas.mouseMoved(dibuja);
background(51);
//socket=io.connect('http://localhost:3000/');
//||'https://chatderau.herokuapp.com/'
console.log("direcion href ++++"+ window.location.href);
socket=io.connect(localhost(window.location.href));
socket.on('mouse', newDrw);
socket.on('mensaje chat',agregarMensaje);
socket.on('usuario local',definirUsuarioLocal);
socket.on('connection',unirAchat);
socket.on('salida',mensajesPrevios);
socket.on('actualizar usuarios',actualizarUlUsuarios);
/*socket.on('salida',function(data){
    console.log(data);
});*/
document.getElementById("IbottonGuardar").onclick = guardarImagen;
document.getElementById("IbottonEnviar").onclick = enviarMensaje;
tablaChat=document.getElementById("tablaChat");
divChat=document.getElementById("chat");
}
function unirAchat(){
    console.log("el cliente se quiere unir ");
    //socket.emit('unir chat', room);
}
function definirUsuarioLocal(data){
    nombreUsuario=data;
    //console.log("Usuario local"+ nombreUsuario);
}
function newDrw(data){
    noStroke();
    fill(255,0,100);
    ellipse(data.x,data.y,15,15);
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
        //console.log('mandando '+(mouseX | 0)+','+(mouseY | 0));
    
    socket.emit('mouse',data);
    noStroke();
    fill(255);
    ellipse(mouseX,mouseY,15,15); 

   }
       
    
}
function guardarImagen(){
    
    saveCanvas(myCanvas,'imagenDelChat','jpg');
}
function enviarMensaje(){
    
    
    let mensaje=document.getElementById('Itexto').value;

    if (mensaje!='') {
        
        //console.log("mensaje a enviar "+ mensaje);
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
   // console.log("mensaje recibido en el cliente"+ datos.mensaje);
    if (datos.mensaje!='') {
        //console.log("mensaje recibido"+ datos.mensaje);
        //let row = tablaChat.insertRow(0);
        let row=tablaChat.insertRow(tablaChat.rows.length );
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = datos.mensaje;
        cell2.innerHTML = datos.usuario.substring(0,7);
        //divChat.scrollTop=0;  
        divChat.scrollTop = divChat.scrollHeight;
       
    }
}
function separarCadena(l,cadena){
    //console.log("entro alal funcion");
    let cadenaMejorada=""
    mitadA=cadena.substring(0,l);
    mitadA=mitadA+" \n"
    mitadB=cadena.substring(l,cadena.length);
    //console.log("la cadena b es: "+mitadB);
    cadenaMejorada=mitadA;
    let CadTemp="";
    while(mitadB.length>l){
        if(mitadB.length>l){
           
            CadTemp=mitadB.substring(0,l);
            CadTemp=CadTemp+ " \n";
            cadenaMejorada=cadenaMejorada+CadTemp;
            mitadB=mitadB.substring(l,mitadB.length);
            //console.log(cadenaMejorada);
        }
    }
    return cadenaMejorada;
}
function nuevoUsuario(){
    btnEntrar.style.background = "#ff00ff";
    if(ingresearUsuario.value == ""){
        alert('ingresa un usario');
    }else{
        document.getElementById("Itexto").disabled = false;
        document.getElementById("IbottonEnviar").disabled=false;
        socket.emit('ingresar usuario',ingresearUsuario.value);
        socket.emit('unir chat', room);
        Contenedorentrar.style.display = "none";  
    }
}
function mensajesPrevios(data){
    //console.log("mensaje   ++++++++++++"+data[1].usuario);
    
        if(data.length){
            for (let x = 0; x < data.length; x++) {
                
                agregarMensaje(data[x]);
            }
        }
        
   
}
function localhost(local){
    let address;
    if(local=='localhost'){
        address='http://'+local+":3000/"
    }else{
        return address;
    }
    console.log("direcion arreglada "+ address);
    return address;
}

/*function agregarMensaje(data){
    tabla =document.getElementById("tablaChat").onclick = guardarImagen;
}*/