# SD-Tarea3
# Instrucciones de uso
1. Descargar e instalar archivos del repositorio usando el siguiente comando:
```bash
git clone https://github.com/Darkelposho/SD-Tarea3.git
```
2. Escribir en la terminal ```Docker-compose up```
3. Esperar que los nodos de cassandra se calibren. (Dependiendo del sistema operativo esto puede tardar 5 minutos o solo 1 minuto.)
4. Abrir Postman o algun software diseñado en consultas API.
5. Usar la dirección `localhost:3000/create`
6. Escribir una consulta post con las variable de paciente con su receta
(Ejemplo)  
```bash
{
    "nombre": "Melon",
    "apellido": "Musk",
    "rut": "1",
    "email": "Xmelon_muskX@fruitter.com",
    "fecha_nacimiento": "28/06/1971",
    "comentario": "Amigdalitis",
    "farmacos": "Paracetamol",
    "doctor": "El Waton de la Fruta"
}
```
6. Usar la dirección `localhost:3000/edit`
7. Escribir una consulta post con las variable de la receta a editar
(Ejemplo)  
```bash
{
    "id": "58d3ed4d-5193-4734-b461-653e16acf833",
    "comentario": "Amigdalitis aguda",
    "farmacos": "Paracetamol con aguita",
    "doctor": "El Waton de la Fruta"
}
```
8. Usar la dirección `localhost:3000/delete`
9. Escribir una consulta post con el id de la receta a eliminar
(Ejemplo) 
```bash
{
    "id": "58d3ed4d-5193-4734-b461-653e16acf833"
}
```
**Caso Particular**
---
Se puede utilizar las direcciones ```localhost:3000/getpaciente``` o ```localhost:3000/getreceta``` para conocer los datos de los pacientes y recetas. Así es más fácil conocer el id a buscar para la edición y eliminación.


# Preguntas
1. Explique la arquitectura que Cassandra maneja. Cuando se crea el clúster ¿Cómo los nodos se conectan? ¿Qué
ocurre cuando un cliente realiza una petición a uno de los nodos? ¿Qué ocurre cuando uno de los nodos se desconecta?
¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

----
  - Los nodos se conectan en el cluster como peer to peer.
  - El nodo al que se conecta el cliente actúa como coordinador entre este y el resto de los nodos buscando los datos relacionados con la petición.
  - Cuando un nodo se desconecta un nodo, en el caso de que exista un factor de réplica mayor a uno, otro nodo funcionaría en su lugar con una réplica de la información del nodo desconectado.
  - La red generada no necesariamente puede ser eficiente, debido a que se requiere el conocer las queries se van a ejecutar, debido que se puede perjudicar las queries con SELECT dependiendo de la política con que se generan las réplicas.
  - Dependiendo de cómo son implementadas las particiones, si son implementadas como partición aleatoria, si existe balanceo de carga. Por otro lado, si es implementada una partición con preservación del orden las claves similares se ubican muy cerca entre ellas, por lo que no existe una distribución regular entre los nodos.
----

2. Cassandra posee principalmente dos estrategias para mantener redundancia en la replicación de datos. ¿Cuáles son
estos? ¿Cuál es la ventaja de uno sobre otro? ¿Cuál utilizaría usted para en el caso actual y por qué? Justifique
apropiadamente su respuesta.

----
- Las dos estrategias principalmente usadas son SimpleStrategy u NetworkTopologyStrategy. |LocalStrategy
- NetworkTopologyStrategy permite distribuir las réplicas de nodos en distintos centros de datos, por otro lado, SimpleStrategy permite hacerlo dentro de un solo centro de datos.
- Utilizaría SimpleStrategy para el caso actual debido a que se requiere implementar un cluster con tres nodos, implementadas de manera local. 

Existe una tercera estrategia para aplicar en Cassandra, LocalStrategy  es utilizada de manera interna por cassandra, por lo cual las keyspaces son definidas implícitamente. Debido a que en la tarea se requiere tener dos tablas, una maestra y una esclava lo que requiere una keyspace.
Fuente: https://www.geeksforgeeks.org/replication-strategy-in-cassandra/

----
3. Teniendo en cuenta el contexto del problema ¿Usted cree que la solución propuesta es la correcta? ¿Qué ocurre
cuando se quiere escalar en la solución? ¿Qué mejoras implementaría? Oriente su respuesta hacia el Sharding (la
replicación/distribución de los datos) y comente una estrategia que podría seguir para ordenar los datos.


----
- En el contexto actual del problema, si la solución propuesta es correcta.
- En el caso de que se requiera escalar la solución, esta empezaría a ser menos eficiente.
- Cambiaría la estrategia a NetworkTopologyStrategy, debido a que a medida que deben adicionarse nodos, mantener todos los nodos dentro de el mismo centro de datos lo haría propenso a caerse al perder este centro. Por otro lado, una vez elegida esta estrategia, dependiendo del tamaño de información administrada, la fragmentación de datos sería necesaria, para lo cual implementaría una partición tipo Murmur3partitioner el cual es 3 a 5 veces más veloz que RandomPartitioner, y a diferencia de la partición ByteOrderedPartitioner
la cual posee grandes problemas como el balanceo de carga debe ser manual, o la escritura secuencial de filas en un intervalo es asignado a un solo nodo.

Fuente:https://docs.datastax.com/en/archived/cassandra/3.0/cassandra/architecture/archTOC.html
