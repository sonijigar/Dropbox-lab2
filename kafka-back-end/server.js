var connection =  new require('./kafka/Connection');
var login = require('./services/login');

var topic_name = 'login_topic';
var consumer = connection.getConsumer(topic_name);

// var topic_name1 = 'signup_topic';
// var consumer_sign = connection.getConsumer(topic_name1);

var producer = connection.getProducer();

// console.log('server is running');
// consumer.on('message', function (message) {
//     console.log('message is received');
//     console.log(JSON.stringify(message.value));
//     var data = JSON.parse(message.value);
//     login.handle_request(data.data, function(err,res){
//         console.log('after handle'+res);
//         var payloads = [
//             { topic: data.replyTo,
//                 messages:JSON.stringify({
//                     correlationId:data.correlationId,
//                     data : res
//                 }),
//                 partition : 0
//             }
//         ];
//         producer.send(payloads, function(err, data){
//             console.log(data);
//         });
//         return;
//     });
// });

consumer.on('message', function (message) {
    console.log('message is received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log(data);
    login.handleSignUp(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});