var mongo = require("./mongo")
var mongoURL = "mongodb://localhost:27017/login";
var mkdirp = require('mkdirp');
const fs = require('fs');

function list(msg, callback){
    fs.readdir('./uploads/' + msg.dirname, function(err, files){
        if(err){

            callback(err);
        }
        else {
            var obj = {}
            obj.filelist = [];
            obj.dirlist = [];
            var item = 0;
            files.forEach(eachfile => {
            fs.lstat('./uploads/' + msg.dirname + '/' + eachfile, function (err, stats) {

                if (err) {
                    console.log(err)
                }
                else {
                    if (stats.isFile()) {
                        obj.filelist.push(eachfile);
                    }
                    else if(stats.isDirectory()){
                        obj.dirlist.push(eachfile)
                    }
                }
                item++;
                if(item == files.length){
                    callback(null, obj);
                }
            })
        })
        }
        })
}

function listfromdir(msg, callback){

    fs.readdir('./uploads/' + msg.dirname + '/' + msg.name, function(err, files){
        console.log("path",'./uploads/' + msg.dirname + '/' + msg.name)
        if(err){
            callback(err);
        }
        else {
            var obj = {}
            obj.filelist = [];
            obj.dirlist = [];
            var item = 0;
            if(files.length == 0){
                console.log("null returned")
                callback(null, null)
            }
            files.forEach(eachfile => {
                fs.lstat('./uploads/' + msg.dirname + '/' + msg.name+ '/' + eachfile, function (err, stats) {

                    if (err) {
                        console.log(err)
                    }
                    else {
                        if (stats.isFile()) {
                            obj.filelist.push(eachfile);
                        }
                        else if(stats.isDirectory()){
                            obj.dirlist.push(eachfile)
                        }
                    }
                    item++;
                    if(item == files.length){
                        console.log("object:", obj);
                        callback(null, obj);
                    }
                })
            })
        }
    })
}
function upload(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var res = {};
            console.log("data", msg.filedetails.name);
            mkdirp(msg.filedetails.path, function (err) {
            fs.writeFile(msg.filedetails.path +'/'+msg.filedetails.name , Buffer.from(msg.data.data), function (err) {
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

function deleteFile(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var res = {};
            fs.unlinkSync(msg.path+'/'+msg.name);

            coll.deleteOne({"filedetail.name":msg.name}, function(err, result){
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

function deleteDir(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            var res = {};
            var rimraf = require('rimraf');
            rimraf(msg.path+'/'+msg.name, function(){

                callback(null, res);
            });
            //database is yet to maintain for directory structure
            // coll.deleteOne({"filedetail.name":msg.name}, function(err, result){
            //     if(err)
            //         res.code = 400;
            //     else {
            //         res.code = 200;
            //     }
            // })
        })
    }
    catch (e){
        console.log(e);
    }
}

function downloadFile(msg, callback){
    try{
        var res = {};
        fs.readFile(msg.path+'/'+msg.name, (err, data) => {
            res.data = data;
            res.name = msg.name;
            console.log("result is::",res);
            callback(null,res);
        });

    }
    catch (e){
        console.log(e);
    }
}

function createDir(msg, callback){
    mkdirp(msg.path, function (err) {
        var res = {};
        fs.lstat(msg.path + '/' + msg.name, function (err, stats) {
            if (err) {
                mkdirp(msg.path + '/' + msg.name, function (err) {
                    res.code = 200;
                    callback(null, res)
                });
            }
            else if (stats.isDirectory()) {
                mkdirp(msg.path + '/' + msg.name + '-copy', function (err) {
                    res.code = 201;
                    callback(null, res)
                })
            }
        })
    })
}

function shareFile(msg, callback){
    try{
        mongo.connect(mongoURL, function() {
            var coll = mongo.collection('file')
            //Do something with database
            //Add file id to all the shared user's database
            //Add shared flag equal to true to the file being shared
            //
            console.log("emails")
        });
    }
    catch(e){
        console.log(e);
    }
}

exports.shareFile = shareFile;
exports.deleteDir = deleteDir;
exports.createDir = createDir;
exports.downloadFile = downloadFile;
exports.deleteFile = deleteFile;
exports.upload = upload;
exports.list = list;
exports.listfromdir = listfromdir;