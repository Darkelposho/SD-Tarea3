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
1. Explique la arquitectura que Cassandra maneja. Cuando se crea el clúster ¿C´omo los nodos se conectan? ¿Qu´e
ocurre cuando un cliente realiza una petici´on a uno de los nodos? ¿Qu´e ocurre cuando uno de los nodos se desconecta?
¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

----
R:
  - Los nodos se conectan en el cluster como peer to peer.
  - El nodo al que se conecta el cliente actúa como coordinardor entre este y el resto de los nodos buscando los datos relacionados con la petición.
  - Cuando un nodo se desconecta un nodo, en el caso de que exista un factor de replica mayor a uno, otro nodo funcionaría en su lugar con una replica de la información del nodo desconectado.
  - La red generada no necesariamente puede ser eficiente, debido a que se requiere el conocer las queries se van a ejecutar, debido que se puede perjudicar las queries con SELECT dependiendo de la política con que se generan las replicas.
  - Dependiendo de como son implementadas las particiones, si son implementadas como partición aleatoria, si existe balanceo de carga. Por otro lado si es implementada una partición con preservación del orden las claves similiares se ubican muy cerca entre ellas, por lo que no existe una distribución regular entre los nodos.
----

2. Cassandra posee principalmente dos estrategias para mantener redundancia en la replicaci´on de datos. ¿Cu´ales son
estos? ¿Cu´al es la ventaja de uno sobre otro? ¿Cu´al utilizar´ıa usted para en el caso actual y por qu´e? Justifique
apropiadamente su respuesta.


3. Teniendo en cuenta el contexto del problema ¿Usted cree que la soluci´on propuesta es la correcta? ¿Qu´e ocurre
cuando se quiere escalar en la soluci´on? ¿Qu´e mejoras implementar´ıa? Oriente su respuesta hacia el Sharding (la
replicaci´on/distribuci´on de los datos) y comente una estrategia que podr´ıa seguir para ordenar los datos.
