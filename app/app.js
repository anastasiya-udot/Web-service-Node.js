let express = require('express');
let http = require('http');
let path = require('path');
let logger = require('morgan');;
let bodyParser = require('body-parser');
let config    = require('./config/config');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


require('./routes/index')(app);

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

http.createServer(app).listen(config.port, function(){
    console.log("Server listening on port " + config.port);
});

module.exports = app;
