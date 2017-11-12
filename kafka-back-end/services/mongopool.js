var MongoClient = require('mongodb').MongoClient;
var connected = false;
var mongoURL = "mongodb://localhost:27017/dropbox";
var db;
/**
 * Connects to the MongoDB Database with the provided URL
 */

//Without Connection Pool
exports.connect = function(url, callback){
    MongoClient.connect(url,
      function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

//With Connection Pool
function getConnection() {
	var db = require('monk')('localhost/dropbox');
	return db;
}

function Pool(connection_no) {
	this.pool = [];
	this.isAvailable = [];
	for (var i = 0; i < connection_no; i++) {
      this.pool.push(getConnection());
	}
	for (var j = 0; j < connection_no; j++) {
		this.isAvailable.push(true);
	}
}

Pool.prototype.get = function(useConnection) {
	var cli;
	var connectionNumber;
	for (var i = 0; i < this.pool.length; i++) {
		if (this.isAvailable[i]) {
      cli = this.pool[i];
      console.log("connection: "+cli);
			this.isAvailable[i] = false;
			connectionNumber = i;
			break;
		}
		if (i === this.pool.length - 1) {
			i = 0;
		}
	}
	useConnection(connectionNumber, cli);
};

Pool.prototype.release = function(connectionNumber) {
	this.isAvailable[connectionNumber] = true;
};

function initializeConnectionPool() {
	var p = new Pool(100);
	return p;
}
var connectionPool=initializeConnectionPool();

exports.getConnection = (callback) => {
  connectionPool.get( (connectionNumber,db)=> {
    callback(connectionNumber,db);
  });
}

exports.releaseConnection = (connectionNumber) => {
  connectionPool.release(connectionNumber,db);
}



/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};