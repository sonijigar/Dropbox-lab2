var mongo = require("./mongo")
var mongoURL = "mongodb://localhost:27017/login";
function handle_request(msg, callback){
    try {
                mongo.connect(mongoURL, function(){
                    console.log('Connected to mongo at: ' + mongoURL);
                    var coll = mongo.collection('login');
                    var res = {};
                    coll.findOne({username:msg.username, password:msg.password}, function(err, user){
                        if (user) {

                            console.log("here");
                            res.code = "200";
                            res.user = user;

                        } else {
                            console.log("there");
                            res.code = "401";
                            res.value = "Failed Login";
                        }
                        callback(null, res);
                    });
                });
            }
            catch (e){
                console.log("Request Handled in catch")
            }
}

function handleSignUp(msg, callback){
    try {
        mongo.connect(mongoURL, function() {
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('login');
            var res = {};

            coll.insertOne({username: msg.username, password: msg.password, email:msg.email, phone:msg.phone, activity:[],shared_paths:[]}, function (err, users) {
                coll.findOne({username: msg.username, password: msg.password}, function (err, user) {
                    if (user) {
                        res.code = "200";
                        res.user = user;
                    } else {
                        res.code = "401";
                        res.value = "Failed Sign Up";
                    }
                    callback(null, res);
                });
            });
        });
    }
    catch (e){
        console.log("Request Handled in catch")
    }
}

exports.handle_request = handle_request;
exports.handleSignUp = handleSignUp;