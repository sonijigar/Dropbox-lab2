var express = require('express');
var multer  =   require('multer');
var crypto = require('crypto');
var app = express();
const fs = require('fs');
const uuidv4 = require('uuid/v4');
var mkdirp = require('mkdirp');
var mongoURL = "mongodb://localhost:27017/login";
var mongo = require("./mongo");
var kafka = require('./kafka/client');
var storage = multer.diskStorage({
    destination: function (req, file, callback){
        var userId = req.session.user._id
        console.log("userIDDD", userId);
        mkdirp('./uploads/'+userId, function(err){
            callback(null, './uploads/'+userId);
        });
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage:storage}).single('file');

var router = express.Router();

router.post('/createdir', function(req, res, next){
        if(req.session.user._id) {
            var userId = req.session.user._id;
            mkdirp('./uploads/' + userId, function (err) {
                var name = req.body.name;
                fs.lstat('./uploads/' + userId + '/' + name, function (err, stats) {
                    if (err) {
                        mkdirp('./uploads/' + userId + '/' + name, function (err) {
                            res.status(201).json({message: 'dir created'});
                        });
                    }
                    else if (stats.isDirectory()) {
                        mkdirp('./uploads/' + userId + '/' + name + '-copy', function (err) {
                            res.status(201).json({message: 'copy dir created'});
                        })
                    }
                })
            })
        }
})

router.post('/upload', function(req, res, next){
    console.log("users id", req.session.user._id)
    if(req.session.user._id) {
        var userId = req.session.user._id;
        mkdirp('./uploads/' + userId, function (err) {
            upload(req, res, function (err) {
                console.log("req body:", req.body);
                console.log("req file:", req.file);
                if (err) {
                    res.status(401).json({message: "upload Error"});
                }
                else {
                    var userId = req.session.user._id;
                    kafka.make_request('file_topic', {
                        "operation": "upload",
                        "filedetails": req.file,
                        "user_id": userId
                    }, function (err, result) {
                        if (result.code = 200) {
                            res.status(201).json({message: "upload working"});
                        }
                        else
                            res.status(400).json({message: "upload not working"});
                    });
                }
            })
        })
    }
    else{
        res.status(400).json({message:"session expired"})
    }

});

router.post('/list', function(req, res, next){
    if(req.session.user._id){
        var userId = req.session.user._id;
        console.log(userId);
        fs.readdir('./uploads/'+userId, function(err, files){
            if(err){
                console.log("here")
                res.status(401).send();
         }
            else{
            //var response;
            //     var files = []
            //     for(i=0;i<files.length;i++){
            //         fs.lstat('./upload/'+ userId + files[i], function(err, stats){
            //         if(err){
            //             console.log("error");
            //         }
            //         else{
            //             if(stats.isFile()){
            //                 files.push(file[i]);
            //             }
            //         }
            //         })
            //     }
                console.log(files);
                res.status(200).send(files);
        }
    })
    }
    else{
        res.status(401).json({message:"session expired"})
    }
})

module.exports = router;
