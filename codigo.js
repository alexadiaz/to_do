var connection = crear_conexion_db();
var rl = leer_datos_pantalla();

rl.question("Que accion desea realizar? ",function(respuesta){
    switch(respuesta) {
        case "consultar":
            consultar(); 
            rl.close();      
        break;
        case "insertar":
            preguntar_datos();
        break;
        case "renombrar":
            preguntar_datos_cambiar();
        break;
        default:
            console.log("Dato no valido");
            rl.close();
    }
});

function crear_conexion_db(){
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host:'localhost',
        user:"root",
        password:"root",
        database:"to_do"
    });
    return connection;
}

function leer_datos_pantalla(){
    const readline = require("readline");
    const rl= readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    return rl;
}

function consultar(){
    connection.connect();
    connection.query("SELECT * FROM to_do.tareas",function(error,respuesta){
        if (error) throw error;
        for (var i in respuesta){
            console.log("id: " + respuesta[i].idtareas);
            console.log("Nombre: " + respuesta[i].nombre);
            console.log("Estado: " + respuesta[i].estado);
            console.log("Fecha de creacion: " + respuesta[i].creacion);
            console.log("Fecha de finalizacion: " + respuesta[i].finalizacion);
            console.log("");
        }
    });
    connection.end();
}

function preguntar_datos(){
    var datos={};
    rl.question("Ingrese nombre de la tarea: ", function(respuesta){
        datos.nombre = respuesta;
        rl.question("Ingrese estado de la tarea: ",function(respuesta){
            datos.estado = respuesta;
            rl.question("Ingrese fecha de creacion de la tarea: ",function(respuesta){
                datos.creacion = respuesta;
                if(datos.estado === "terminado"){
                    rl.question("Ingrese fecha de finalizacion de la tarea: ",function(respuesta){
                        datos.finalizacion = respuesta;
                        insertar(datos);
                        rl.close();
                    });
                }
                else{
                    datos.finalizacion = "";
                    insertar(datos);
                    rl.close();
                }
            });
        });
    });
}

function insertar(datos){
    connection.connect();
    connection.query(`INSERT INTO to_do.tareas (nombre,estado,creacion,finalizacion) VALUES ('${datos.nombre}','${datos.estado}','${datos.creacion}','${datos.finalizacion}')`,function(error,respuesta){
        if (error) throw error;
    });
    connection.end();
}

function preguntar_datos_cambiar(){
    var datos_cambiar={};
    rl.question("Digite Id de la tarea: ", function(respuesta){
        datos_cambiar.id = respuesta;
        rl.question("Ingrese nuevo nombre de la tarea: ",function(respuesta){
            datos_cambiar.nuevo_nombre =  respuesta;
            renombrar(datos_cambiar);
            rl.close();
        });
    });
}

function renombrar(datos_cambiar){
    connection.connect();
    connection.query(`UPDATE to_do.tareas SET nombre = '${datos_cambiar.nuevo_nombre}' WHERE idtareas = '${datos_cambiar.id}'`,function(error,resultado){
        if(error) throw error;
    });
    connection.end();
}