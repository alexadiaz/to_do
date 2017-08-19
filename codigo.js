var mysql = require("mysql");
const readline = require("readline");
var rl = leer_datos_pantalla();

rl.question("Que accion desea realizar? ",function(respuesta){
    var connection = crear_conexion_db();
    connection.connect();
    switch(respuesta) {
        case "consultar":
            consultar(connection,function(){
                connection.end();
                rl.close();
            }); 
        break;
        case "insertar":
            preguntar_datos_insertar(connection);
        break;
        case "renombrar":
            preguntar_datos_renombrar(connection);
        break;
        case "completar":
            preguntar_datos_completar(connection);
        break;
        default:
            console.log("Dato no valido");
            rl.close();
    }
});

function crear_conexion_db(){
    var connection = mysql.createConnection({
        host:'localhost',
        user:"root",
        password:"root",
        database:"to_do"
    });
    return connection;
}

function leer_datos_pantalla(){
    const rl= readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    return rl;
}

function consultar(connection,cb){
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
        cb();
    });
}

function preguntar_datos_insertar(connection){
    var existe_tarea = false;
    rl.question("Ingrese nombre de la tarea: ", function(respuesta){
        verificar_nombre(respuesta, existe_tarea,connection,function(){
            connection.end();
            rl.close();
        });
    });
}

function verificar_nombre(nombre_tarea, existe_tarea,connection,cb){
    connection.query("SELECT * FROM to_do.tareas",function(error, respuesta){
        for(i in respuesta){
            if (respuesta[i].nombre === nombre_tarea){
                existe_tarea = true;
                break;
            }
        }
        if (existe_tarea === false){
            console.log(nombre_tarea);
            insertar(nombre_tarea,connection,cb);
        }
        else{
             console.log("La tarea ya existe");
             cb();
        }
    });
}

function insertar(nombre_tarea,connection,cb){
    connection.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${nombre_tarea}','pendiente',now())`,function(error,respuesta){
        if (error) throw error;
    });
    cb();
    console.log("Datos ingresados ok");
}

function preguntar_datos_renombrar(connection){
    var datos_renombrar={};
    rl.question("Digite nombre de la tarea: ", function(respuesta){
        datos_renombrar.nombre_actual = respuesta;
        rl.question("Ingrese nuevo nombre de la tarea: ",function(respuesta){
            datos_renombrar.nuevo_nombre =  respuesta;
            renombrar(datos_renombrar,connection,function(){
                connection.end();
                rl.close();
            });
        });
    });
}

function renombrar(datos_renombrar,connection,cb){
    connection.query(`UPDATE to_do.tareas SET nombre = '${datos_renombrar.nuevo_nombre}' WHERE nombre = '${datos_renombrar.nombre_actual}'`,function(error,resultado){
        if(error) throw error;
    });
    cb();
    console.log("Datos renombrados ok");
}

function preguntar_datos_completar(connection){
    rl.question("Digite nombre de tarea: ",function(resultado){
        completar(resultado,connection,function(){
            connection.end();
            rl.close();
        });
    });
}

function completar(nombre_tarea,connection,cb){
    connection.query(`SELECT tareas.estado FROM to_do.tareas where nombre = '${nombre_tarea}'`,function(error, resultado){
        if (error) throw error;
        if (resultado[0].estado === "terminado"){
            cb();
            console.log("La tarea ya estaba terminada");
        }
        else{
            connection.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${nombre_tarea}'`, function(error2,respuesta){
               if (error2) throw error2;
                cb();
                console.log("Tarea terminada ok");
            });
        }
    });
}