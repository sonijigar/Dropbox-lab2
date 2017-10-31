var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var file = require('./services/file');
//

var topic_name = ['login_topic', 'signup_topic', 'file_topic'];
var consumer = connection.getConsumer(topic_name);

// var topic_name1 = 'signup_topic';
// var consumer_sign = connection.getConsumer(topic_name1);

var producer = connection.getProducer();

consumer.on('message', function (message) {
    console.log('message is received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log(data);
    if(data.data.operation == "signup"){
        login.handleSignUp(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }
    else if(data.data.operation == "login"){
        login.handle_request(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }
    else if(data.data.operation == "upload"){
        file.upload(data.data, function(err, res){
            var payloads = [
                {
                    topic:data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data:res
                    }),
            partition:0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    }
    else if(data.data.operation == "list"){
        file.list(data.data, function(err, res){
            var payloads = [
                {
                    topic:data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data:res
                    }),
                    partition:0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    }
});


// consumer.on('message', function (message) {
//     console.log('message is received');
//     console.log(JSON.stringify(message.value));
//     var data = JSON.parse(message.value);
//     console.log(data);
// if(data.data.operation == "signup"){
//     login.handleSignUp(data.data, function (err, res) {
//         console.log('after handle' + res);
//         var payloads = [
//             {
//                 topic: data.replyTo,
//                 messages: JSON.stringify({
//                     correlationId: data.correlationId,
//                     data: res
//                 }),
//                 partition: 0
//             }
//         ];
//         producer.send(payloads, function (err, data) {
//             console.log(data);
//         });
//         return;
//     });
// }
// else if(data.data.operation == "login"){
//     login.handle_request(data.data, function (err, res) {
//         console.log('after handle' + res);
//         var payloads = [
//             {
//                 topic: data.replyTo,
//                 messages: JSON.stringify({
//                     correlationId: data.correlationId,
//                     data: res
//                 }),
//                 partition: 0
//             }
//         ];
//         producer.send(payloads, function (err, data) {
//             console.log(data);
//         });
//         return;
//     });
// }
// });