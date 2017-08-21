var mysql = require("mysql");
const readline = require("readline");
var rl = leer_datos_pantalla();

rl.question("Que accion desea realizar? (Digite ayuda para conocer las acciones): ",function(accion){
    var connection = crear_conexion_db();
    connection.connect();
    switch(accion) {
        case "consultar":
            consultar(connection,function(){
                connection.end();
                rl.close();
            }); 
        break;
        case "insertar":
            preguntar_datos(accion,connection,function(){
                connection.end();
                rl.close();
            });
        break;
        case "renombrar":
            preguntar_datos(accion,connection,function(){
                connection.end();
                rl.close();
            });
        break;
        case "completar":
            preguntar_datos(accion,connection,function(){
                connection.end();
                rl.close();
            });
        break;
        case "borrar":
            preguntar_datos(accion,connection,function(){
                connection.end();
                rl.close();
            })
        break;
        case "ayuda":
            mostrar_ayuda();
            connection.end();
            rl.close();
        break;
        default:
            console.log("La accion no es valida");
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
        console.log("------------------------------------------------------------------------------------------------");
        console.log("   Id   |    Nombre    |      Estado     |      Fecha creacion      |    Fecha finalizacion    |");
        console.log("-----------------------------------------------------------------------------------------------");
        for (var i in respuesta){
            console.log("   " + respuesta[i].idtareas + "        ",respuesta[i].nombre + "        ",respuesta[i].estado + "        ",respuesta[i].creacion + "        ",respuesta[i].finalizacion);
        }
        console.log("-----------------------------------------------------------------------------------------------");
        cb();
    });
}

function preguntar_datos(accion,connection,cb){
    rl.question("Ingrese nombre de la tarea: ", function(nombre_tarea){
        if (nombre_tarea === ""){
            console.log("La tarea no debe estar en blanco");
            cb();
        }
        else{
            verificar_existe(accion,nombre_tarea,connection,cb);
        }
    });
}

function verificar_existe(accion,nombre_tarea,connection,cb){
    var existe_tarea = false;
    connection.query("SELECT * FROM to_do.tareas",function(error, tareas){
        for(i in tareas){
            if (tareas[i].nombre === nombre_tarea){
                existe_tarea = true;
                break;
            }
        }
        if (existe_tarea === false){
            switch (accion){
                case "insertar":
                    insertar(nombre_tarea,connection,cb);
                break;
                case "renombrar":
                case "completar":
                case "borrar":
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
                    preguntar_datos_renombrar(nombre_tarea,connection,cb);
                break;
                case "completar":
                    completar(nombre_tarea,connection,cb);
                break;
                case "borrar":
                    borrar(nombre_tarea,connection,cb);
                break;
            }
        }
    });
}

function preguntar_datos_renombrar(nombre_tarea,connection,cb){
    rl.question("Ingrese nuevo nombre de la tarea: ",function(nuevo_nombre_tarea){
        if (nuevo_nombre_tarea === ""){
            console.log("La tarea no debe estar en blanco");
            cb();
        }
        else{
            verificar_nuevo_nombre_existe(nombre_tarea,nuevo_nombre_tarea,connection,cb);
        }
    });
}

function verificar_nuevo_nombre_existe(nombre_tarea,nuevo_nombre_tarea,connection,cb){
    var existe_tarea = false;
    connection.query("SELECT * FROM to_do.tareas",function(error, tareas){
        for(i in tareas){
            if (tareas[i].nombre === nuevo_nombre_tarea){
                existe_tarea = true;
                break;
            }
        }
        if (existe_tarea === false){
            renombrar(nombre_tarea,nuevo_nombre_tarea,connection,cb);
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
    console.log("Tarea ingresada ok");
}

function renombrar(nombre_tarea,nuevo_nombre_tarea,connection,cb){
    connection.query(`UPDATE to_do.tareas SET nombre = '${nuevo_nombre_tarea}' WHERE nombre = '${nombre_tarea}'`,function(error,resultado){
        if(error) throw error;
    });
    cb();
    console.log("Tarea renombrada ok");
}

function completar(nombre_tarea,connection,cb){
    connection.query(`SELECT tareas.estado FROM to_do.tareas where nombre = '${nombre_tarea}'`,function(error, tareas){
        if (error) throw error;
        if (tareas[0].estado === "terminado"){
            cb();
            console.log("La tarea ya estaba terminada");
        }
        else{
            connection.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${nombre_tarea}'`, function(error2,respuesta){
                if (error2) throw error2;
                cb();
                console.log("Tarea completada ok");
            });
        }
    });
}

function borrar(nombre_tarea,connection,cb){
    connection.query(`DELETE FROM to_do.tareas WHERE nombre = '${nombre_tarea}'`,function(error,tareas){
        if (error) throw error;
    });
    cb();
    console.log("Tarea borrada ok");
}

function mostrar_ayuda(){
    console.log("");
    console.log(" Usted puede realizar las siguientes acciones: ");
    console.log("-----------------------------------------------");
    console.log("         Accion          |     Comando");
    console.log("-----------------------------------------------");
    console.log("    Insertar una tarea   |    insertar");
    console.log("    Renombrar una tarea  |    renombrar");
    console.log("    Completar una tarea  |    completar");
    console.log("    Borrar una tarea     |    borrar");
    console.log("-----------------------------------------------");
}