use cassandra_keyspace1;

CREATE TABLE cassandra_keyspace1.paciente (
      id UUID,
      rut text,
      nombre text,
      apellido text,
      email text,
      fecha_nacimiento text,
      PRIMARY KEY (id,rut)
      
    );

use cassandra_keyspace2;

CREATE TABLE cassandra_keyspace2.receta (
      id UUID,
      id_paciente UUID,
      comentario text,
      farmacos text,
      doctor text,
      PRIMARY KEY (id)
    );