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
            preguntar_datos("insertar",connection);
        break;
        case "renombrar":
            preguntar_datos("renombrar",connection);
        break;
        case "completar":
            preguntar_datos_completar(connection);
        break;
        default:
            console.log("Dato no valido");
            connection.end();
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

function preguntar_datos(accion,connection){
    var existe_tarea = false;
    var datos={};
    rl.question("Ingrese nombre de la tarea: ", function(respuesta){
        datos.nombre_actual = respuesta;
        verificar_nombre(accion,datos, existe_tarea,connection,function(){
            connection.end();
            rl.close();
        });
    });
}

function verificar_nombre(accion,datos,existe_tarea,connection,cb){
    if (datos.nombre_actual === ""){
        console.log("La tarea no debe estar en blanco");
        cb();
    }
    else{
        verificar_nombre_existe(accion,datos,existe_tarea,connection,cb);
    }
}

function verificar_nombre_existe(accion,datos,existe_tarea,connection,cb){
    connection.query("SELECT * FROM to_do.tareas",function(error, respuesta){
        for(i in respuesta){
            if (respuesta[i].nombre === datos.nombre_actual){
                existe_tarea = true;
                break;
            }
        }
        if (existe_tarea === false){
            switch (accion){
                case "insertar":
                    insertar(datos,connection,cb);
                break;
                case "renombrar":
                    console.log("La tarea no existe");
                    cb();
                break;
            }
        }
        else{
            switch (accion){
                case "insertar":
                    console.log("La tarea ya existe");
                    cb();
                break;
                case "renombrar":
                    preguntar_datos_renombrar(datos,connection,cb);
                break;
            }
        }
    });
}

function preguntar_datos_renombrar(datos,connection,cb){
    var existe_tarea = false;
    rl.question("Ingrese nuevo nombre de la tarea: ",function(respuesta){
        datos.nuevo_nombre =  respuesta;
        verificar_nuevo_nombre(datos,existe_tarea,connection,cb);
    });
}

function verificar_nuevo_nombre(datos,existe_tarea,connection,cb){
    if (datos.nuevo_nombre === ""){
        console.log("La tarea no debe estar en blanco");
        cb();
    }
    else{
       verificar_nuevo_nombre_existe(datos,existe_tarea,connection,cb);
    }
}

function verificar_nuevo_nombre_existe(datos,existe_tarea,connection,cb){
    connection.query("SELECT * FROM to_do.tareas",function(error, respuesta){
        for(i in respuesta){
            if (respuesta[i].nombre === datos.nuevo_nombre){
                existe_tarea = true;
                break;
            }
        }
        if (existe_tarea === false){
            renombrar(datos,connection,cb);
        }
        else{
            console.log("La tarea ya existe");
            cb();
        }
    });
}

function insertar(datos,connection,cb){
    connection.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${datos.nombre_actual}','pendiente',now())`,function(error,respuesta){
        if (error) throw error;
    });
    cb();
    console.log("Datos ingresados ok");
}

function renombrar(datos,connection,cb){
    connection.query(`UPDATE to_do.tareas SET nombre = '${datos.nuevo_nombre}' WHERE nombre = '${datos.nombre_actual}'`,function(error,resultado){
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