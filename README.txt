Follow the steps on the terminal to start the servers:

Back-end server
	1. cd back-end
	2. npm install
	3. npm start

Front-end server
	1. cd front-end
	2. npm install
	3. npm start
	
Kafka-Backend server
	1. cd kafka-back-end
	2. node server.js
	
Run Zookeeper server:
bin/zookeeper-server-start.sh config/zookeeper.properties

Run Kafkaserver server:
bin/kafka-server-start.sh config/server.properties

Create following topics:
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic login_topic

bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic signup_topic

bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic response_topic

bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic file_topic

or run Topic.sh file to create topics
