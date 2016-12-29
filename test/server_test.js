var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var Item = require('../models/item');

chai.use(chaiHttp);
var expect = chai.expect;
var app = server.app;
var runServer = server.runServer;

describe('shopping list API', ()=>{
	var items;
	beforeEach((done)=>{
		runServer(function(err){
			Item.create({name: 'milk'},
						{name: 'eggs'},
						{name: 'bananas'}, function(err){
							var args = Array.prototype.slice.call(arguments);
							args.splice(0,1);
							items = args;
							done();
						});
		});
	});
	afterEach((done)=>{
		Item.remove(function(){
			done();
		});
	});
	describe('on get', ()=>{
		it('should return items', (done)=>{
			chai.request(app)
				.get('/items')
				.end((err, res)=>{
					expect(res.status).to.equal(200);
					expect(res.body.length).to.equal(3);
					expect(res.body[0].name).to.equal('milk');
					expect(res.body[1].name).to.equal('eggs');
					expect(res.body[2].name).to.equal('bananas');
					/*expect(res.body).to.deep.equal([
						{name:'milk', id:},
						{name:'eggs', id:},
						{name:'bananas', id:}
					]);*/
					done();
				});
		});
	})	;
	describe('on post', ()=>{
		it('should create items', (done)=>{
			chai.request(app)
				.post('/items')
				.send({'name':'butter'})
				.end((err, res)=>{
					expect(res.status).to.equal(201);
					expect(res.body.name).to.equal('butter');
					//expect(res.body).to.deep.equal({name:'butter', id:4});
					done();
				});
		});
		it('should return error when no name is provided', (done)=>{
			chai.request(app)
				.post('/items')
				.send({})
				.end((err,res)=>{
					expect(res.status).to.equal(400);
					expect(res.body.message).to.equal('Missing Name');
					done();
				});
		});
	});
	describe('on put', ()=>{
		it('should update item name', (done)=>{
			chai.request(app)
				.put('/items/'+ items[0]._id)
				.send({'name': 'creamer'})
				.end((err,res)=>{
					expect(res.body.name).to.equal('creamer');
					expect(res.body._id == items[0]._id).to.equal(true);
					done();
				});
		});
		it('should return an error if item id does not exist', ()=>{
			chai.request(app)
				.put('/items/6')
				.send({'name':'creamer'})
				.end((err,res)=>{
					expect(res.status).to.equal(500);
					expect(res.body.message.name).to.equal('CastError');
				});
		});
		it('should return error when no name is provided', ()=>{});
	});
	describe('on delete', ()=>{
		it('should delete item', ()=>{
			chai.request(app)
				.delete('/items/'+items[0]._id)
				.end((err,res)=>{
					expect(res.body).to.deep.equal({});
				});
				
		});
		it('should return an error if item id does not exist', ()=>{
			chai.request(app)
				.delete('/items/6')
				.end((err,res)=>{
					expect(res.status).to.equal(500);
					expect(res.body.message.name).to.equal('CastError');
				});
		});
	});
})