var connection = crear_conexion_db();
var rl = leer_datos_pantalla();

rl.question("Que accion desea realizar? ",function(respuesta){
    switch(respuesta) {
        case "consultar":
            consultar(); 
            rl.close();      
        break;
        case "insertar":
            preguntar_datos_insertar();
        break;
        case "renombrar":
            preguntar_datos_renombrar();
        break;
        case "completar":
            preguntar_datos_completar();
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

function preguntar_datos_insertar(){
    rl.question("Ingrese nombre de la tarea: ", function(respuesta){
        insertar(respuesta);
        rl.close();
    });
}

function insertar(nombre_tarea){
    connection.connect();
    connection.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${nombre_tarea}','pendiente',now())`,function(error,respuesta){
        if (error) throw error;
    });
    connection.end();
    console.log("Datos ingresados ok");
}

function preguntar_datos_renombrar(){
    var datos_renombrar={};
    rl.question("Digite nombre de la tarea: ", function(respuesta){
        datos_renombrar.nombre_actual = respuesta;
        rl.question("Ingrese nuevo nombre de la tarea: ",function(respuesta){
            datos_renombrar.nuevo_nombre =  respuesta;
            renombrar(datos_renombrar);
            rl.close();
        });
    });
}

function renombrar(datos_renombrar){
    connection.connect();
    connection.query(`UPDATE to_do.tareas SET nombre = '${datos_renombrar.nuevo_nombre}' WHERE nombre = '${datos_renombrar.nombre_actual}'`,function(error,resultado){
        if(error) throw error;
    });
    connection.end();
    console.log("Datos renombrados ok");
}

function preguntar_datos_completar(){
    rl.question("Digite nombre de tarea: ",function(resultado){
        completar(resultado);
        rl.close();
    });
}

function completar(nombre_tarea){
    connection.connect();
    connection.query(`SELECT tareas.estado FROM to_do.tareas where nombre = '${nombre_tarea}'`,function(error, resultado){
        if (error) throw error;
        if (resultado[0].estado === "terminado"){
            connection.end();
            console.log("La tarea ya estaba terminada");
        }
        else{
            connection.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${nombre_tarea}'`, function(error2,respuesta){
               if (error2) throw error2;
                connection.end();
                console.log("Tarea terminada ok");
            });
        }
    });
}