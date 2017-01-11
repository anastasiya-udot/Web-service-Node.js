let express = require('express');
let http = require('http');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let constant    = require('./libs/constant');
let db = require('./libs/data-base');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

let dbConnectionPromise = new Promise((resolve, reject) => {
    try {
        db.connection.initialize();
        resolve()
    } catch(err) {
        reject(err);
    }
});

dbConnectionPromise.then(() => {
    db.connection.check().then(() => {
        console.log("Database was connected");
        require('./routes/index')(app);
    }, (err) => {
       console.log(`Error database: ${err.message}`);
    });

}, (err) => {
    console.log(err.message);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        if(err){
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

http.createServer(app).listen(constant.PORT, function(){
    console.log("Server listening on port " + constant.PORT);
});

