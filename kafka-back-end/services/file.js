var mongo = require("./mongo")
var mongoURL = "mongodb://localhost:27017/login";

function upload(msg, callback){
    try{
        mongo.connect(mongoURL, function(){
            var coll = mongo.collection('file')
            var res = {};
            coll.insertOne({filedetail:msg.filedetails, user_id:msg.user_id}, function(err, result){
                if(err)
                    res.code = 400;
                else {
                    res.code = 200;
                }
                callback(null, res);
            })
            //coll.insertOne({filename:req.file.filename, path: req.file.path, type:req.file.mimetype, size:req.file.size})
        })
    }
    catch (e){
        console.log(e);
    }
}

exports.upload = upload;