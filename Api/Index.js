const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');

const app = express();

const client1 = new cassandra.Client({
  contactPoints: ['cassandra-node1', 'cassandra-node2'],
  localDataCenter: 'datacenter1',
  keyspace: 'cassandra_keyspace1',
  authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra')
});

const client2 = new cassandra.Client({
  contactPoints: ['cassandra-node1', 'cassandra-node2', 'cassandra-node3'],
  localDataCenter: 'datacenter1',
  keyspace: 'cassandra_keyspace2',
  authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra')
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3000;
var host = process.env.PORT || '0.0.0.0';

app.post("/create", (req, res) => {
  console.log("Creando receta");
  (async () => {
    var idpaciente = uuidv4();
    var idreceta = uuidv4();
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var rut = req.body.rut;
    var email = req.body.email;
    var fecha_nacimiento = req.body.fecha_nacimiento;
    var comentario = req.body.comentario;
    var farmacos = req.body.farmacos;
    var doctor = req.body.doctor;
    //Si el paciente no existe, debera crearlo junto a la receta unica.
    var query = "SELECT * FROM paciente WHERE rut = '" + rut + "' ALLOW FILTERING";
    //Insertar en la tabla paciente los datos del paciente.
    var query1 = "INSERT INTO paciente (id, nombre, apellido, rut, email, fecha_nacimiento) VALUES (" + idpaciente + ", '" + nombre + "', '" + apellido + "', '" + rut + "', '" + email + "', '" + fecha_nacimiento + "')";
    //Insertar en la tabla receta los datos de la receta.
    var query2 = "INSERT INTO receta (id, id_paciente, comentario, farmacos, doctor) VALUES (" + idreceta + ", " + idpaciente + ", '" + comentario + "', '" + farmacos + "', '" + doctor + "')";

    //Si el paciente no existe, debera crearlo junto a la receta unica.
    await client1.execute(query, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if (result.rows.length == 0) {
          console.log("Paciente no existe, se creara");
          client1.execute(query1, (err, result) => {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              console.log("Paciente creado");
              client2.execute(query2, (err, result) => {
                if (err) {
                  console.log(err);
                  res.send(err);
                } else {
                  console.log("Receta creada");
                  res.send("Receta creada");
                }
              });
            }
          });
        } else {
          console.log("Paciente existe, se creara la receta");
          //buscar el id del paciente
          var query3 = "SELECT id FROM paciente WHERE rut = '" + rut + "' ALLOW FILTERING";
          client1.execute(query3, (err, result) => {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              console.log("Paciente encontrado");
              var idpacienteviejo = result.rows[0].id;
              //Insertar receta con el id del paciente
              var query4 = "INSERT INTO receta (id, id_paciente, comentario, farmacos, doctor) VALUES (" + idreceta + ", " + idpacienteviejo + ", '" + comentario + "', '" + farmacos + "', '" + doctor + "')";
              client2.execute(query4, (err, result) => {
                if (err) {
                  console.log(err);
                  res.send(err);
                } else {
                  console.log("Receta creada");
                  res.send("Receta creada");
                }
              });
            }
          });
        }
      }
    });
  })();
});
app.post("/edit", (req, res) => {
  console.log("Editando receta");
  (async () => {
    var id = req.body.id;
    var comentario = req.body.comentario;
    var farmacos = req.body.farmacos;
    var doctor = req.body.doctor;
    //Este metodo debera enviar los datos a editar de la receta, siendo necesario el id de este  ́ultimo
    var query = "UPDATE receta SET comentario = '" + comentario + "', farmacos = '" + farmacos + "', doctor = '" + doctor + "' WHERE id = " + id + "";
    client2.execute(query, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("Receta editada");
        res.send("Receta editada");
      }
    });
  })();
});


app.post("/delete", (req, res) => {
  console.log("Eliminando receta");
  (async () => {
    var id = req.body.id;
    //Se elimina receta
    var query = "DELETE FROM receta WHERE id = " + id + "";
    client2.execute(query, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("Receta eliminada");
        res.send("Receta eliminada");
      }
    });
  })();
});


app.get("/", (req, res) => {
  res.send("Y aqui estamos de vuelta!!!");
});

app.get("/getreceta", (req, res) => {
  console.log("Obteniendo recetas");
  client2.execute(
    `SELECT * FROM receta`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        res.send(result.rows);
      }
    }
  );
});

app.get("/getpaciente", (req, res) => {
  console.log("Obteniendo pacientes");
  client1.execute(
    `SELECT * FROM paciente`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        res.send(result.rows);
      }
    }
  );
});

//Se crea el puerto
app.listen(port, host, () => {
  console.log(`API run in: http://localhost:${port}.`);

});