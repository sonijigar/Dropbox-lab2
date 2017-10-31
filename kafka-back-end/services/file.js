var mongo = require("./mongo")
var mongoURL = "mongodb://localhost:27017/login";
var mkdirp = require('mkdirp');
const fs = require('fs');

function list(msg, callback){
    fs.readdir('./uploads/' + msg.dirname, function(err, files){
        if(err){
            console.log("here")
            callback(err);
        }
        else{
            var filelist = [];
            for(var i=0; i<files.length; i++){
                fs.lstat('./uploads/' + msg.dirname + '/' + files[i], function(err, stats){
                    if(err){
                        console.log(err)
                    }
                    else{
                        if(stats.isFile()){
                            console.log("checkfile", files[i]);
                            filelist.push(files[i]);
                        }
                    }
                })
            }
            console.log(files)
            callback(null,filelist);
        }
        })
}
function upload(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var res = {};
            console.log("dataaaa", msg.filedetails.name);
            mkdirp(msg.filedetails.path, function (err) {
            fs.writeFile(msg.filedetails.path +'/'+msg.filedetails.name , msg.data.data, function (err) {
                if (err)
                    console.log("error", err)
                else
                    console.log("cool");
            })
        })
            coll.insertOne({filedetail:msg.filedetails, user_id:msg.user_id}, function(err, result){
                if(err)
                    res.code = 400;
                else {
                    res.code = 200;
                }
                callback(null, res);
            })
       })
    }
    catch (e){
        console.log(e);
    }
}

exports.upload = upload;
exports.list = list;