create keyspace cassandra_keyspace1 with replication = {'class': 'SimpleStrategy', 'replication_factor': '2'};

create keyspace cassandra_keyspace2 with replication = {'class': 'SimpleStrategy', 'replication_factor': '3'};