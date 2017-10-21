// My Mail Delivery Agent (MDA) for Dovecot

var http = require('http')
var SNSClient = require('aws-snsclient');
var AWS = require('aws-sdk');
var child_process = require('child_process');

var s3 = new AWS.S3();
var bucketName = '<bucket name>';


var auth = {
  region: '<region>'
  , account: '<account number>'
  , topic: '<SNS topic>'
};

var client = SNSClient(function(err, message) {
  console.log(message);
  var mail = JSON.parse(message.Message);
  console.log(mail);
  console.log(mail.mail.messageId);
  s3.getObject({Bucket: bucketName, Key: mail.mail.messageId}, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log("Raw email:\n" + data.Body);
      var p = child_process.spawn("sendmail", ["-t", "-i"]);
      p.stdin.write(data.Body);
      p.stdin.pause();
      p.stdin.destroy();
    }
  });
});

http.createServer(function(req, res) {
  if(req.method === 'POST' && req.url === '/receive') {
    return client(req, res);
  }
  res.writeHead(404);
  res.end('Not found.');
}).listen(9000);
