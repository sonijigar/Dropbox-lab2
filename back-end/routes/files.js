var express = require('express');
var multer  =   require('multer');
var crypto = require('crypto');
var app = express();
const fs = require('fs');
const uuidv4 = require('uuid/v4');
var mkdirp = require('mkdirp');
var storage = multer.diskStorage({
    destination: function (req, file, callback){
        mkdirp('./uploads/userId', function(err){
            callback(null, './uploads/userId');
        });
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
        var path = './uploads'+ 'A-'+ file.originalname;
        var type = file.originalname.split(".");
        console.log(req.param('dirId'));
        console.log("hey");
        // if(req.param('dirId')== null){
        //     //mysql.addFileToDb(req, 1, file.originalname, path, type[type.length - 1], req.session.user[0].user_id);
        // }
        // else {
        //     //mysql.addFileToDb(req, req.param('dirId'), file.originalname, path, type[type.length - 1], req.session.user[0].user_id);
        // }
    }
});
var upload = multer({storage:storage}).single('file');

var router = express.Router();

router.post('/createdir', function(req, res, next){
    mkdirp('./uploads/userId', function(err){
        var name = req.body.name;
        fs.lstat('./uploads/userId/'+ name, function(err, stats){
            if(err){
                console.log("err");
                mkdirp('./uploads/userId/'+name, function(err){
                    res.status(201).json({message:'dir created'});
            });
            }
            //console.log(`${stats.isDirectory()}`);
            else if(stats.isDirectory()){
                mkdirp('./uploads/userId/'+name+'-copy', function(err){
                    res.status(201).json({message:'dir created'});
                })
            }
        })
    })
})

router.post('/upload', function(req, res, next){
    // uplo
    mkdirp('./uploads/userId', function(err){
        upload(req, res, function(err){
                console.log("req body:", req.body);
                console.log("req file:", req.file);
                if(err){
                    res.status(401).json({message:"upload Error"});
                }
                else
                    //code to add file in database
                    res.status(201).json({message:"upload working"});
            })
    })

});

module.exports = router;
