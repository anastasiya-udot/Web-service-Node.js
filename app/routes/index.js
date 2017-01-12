module.exports = function(app){
    app.post('/data-post', require('./../controller/request.controller').post);
};
