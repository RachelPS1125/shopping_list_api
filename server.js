var express = require('express');
var bodyParser = require('body-parser');
var Storage = require('./Storage');

var jsonParser = bodyParser.json();

var app = express(); 
var storage = new Storage();

app.use(express.static('public'));
app.get('/items', function(req, res){
	res.json(storage.getAll());
});
app.post('/items', jsonParser, function(req, res){
	if(!req.body.name){
		res.status(400).json({message: 'Missing Name'});
		return;
	}
	var item = storage.add(req.body.name);
	res.status(201).json(item);

});
app.put('/items/:id', jsonParser, function(req, res){
	var item = storage.update(req.body.name, req.params.id);
	if (item){
		res.json(item);
	} else {
		res.status(400).json({message: 'Item does not exist'});
	}
})
app.delete('/items/:id', function(req, res){
	storage.delete(req.params.id);
	res.json({});
});

app.listen(8080);

exports.app = app;
exports.storage = storage;