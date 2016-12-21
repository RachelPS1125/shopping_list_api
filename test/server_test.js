var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);

var expect = chai.expect;
var app = server.app;
var storage = server.storage;


describe('shopping list API', ()=>{
	beforeEach(()=>{
		storage.add('milk');
		storage.add('eggs');
		storage.add('bananas');
	})
	afterEach(()=>{
		storage.clear();
	})
	describe('on get', ()=>{
		it('should return items', (done)=>{
			chai.request(app)
				.get('/items')
				.end((err, res)=>{
					expect(res.status).to.equal(200);
					expect(res.body.length).to.equal(3);
					expect(res.body).to.deep.equal([
						{name:'milk', id:1},
						{name:'eggs', id:2},
						{name:'bananas', id:3}
					]);
					done();
				})
		})
	})	
	describe('on post', ()=>{
		it('should create items', (done)=>{
			chai.request(app)
				.post('/items')
				.send({'name':'butter'})
				.end((err, res)=>{
					expect(res.status).to.equal(201);
					expect(res.body).to.deep.equal({name:'butter', id:4});
					done();
				})
		})
		it('should return error when no name is provided', (done)=>{
			chai.request(app)
				.post('/items')
				.send({})
				.end((err,res)=>{
					expect(res.status).to.equal(400);
					expect(res.body.message).to.equal('Missing Name');
					done()
				})
		})
	})
	describe('on put', ()=>{
		it('should update item name', (done)=>{
			chai.request(app)
				.put('/items/1')
				.send({'name': 'creamer'})
				.end((err,res)=>{
					expect(res.body.name).to.equal('creamer');
					expect(res.body.id).to.equal(1);
					done()
				})
		})
		it('should return an error if item id does not exist', ()=>{
			chai.request(app)
				.put('/items/6')
				.send({'name':'creamer'})
				.end((err,res)=>{
					expect(res.status).to.equal(400);
					expect(res.body.message).to.equal('Item does not exist');
				})
		})
		it('should return error when no name is provided', ()=>{})
	})
	describe('on delete', ()=>{
		it('should delete item', ()=>{})
		it('should return an error if item id does not exist', ()=>{})
	})
})