var connection = crear_conexion_db();
var rl = leer_datos_pantalla();

rl.question("Que accion desea realizar?",function(respuesta){
    switch(respuesta) {
        case "consultar":
            consultar();        
        break;
        default:
            console.log("Dato no valido");
    }
    rl.close();
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
        console.log(respuesta);
    });
    connection.end();
}