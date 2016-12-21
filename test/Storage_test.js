var chai = require('chai');
var Storage = require('../Storage');

var expect = chai.expect;

describe('Storage class', ()=>{
	it('should add items', ()=>{
		var storage = new Storage();
		var testItem = storage.add('test item');
		expect(testItem).to.deep.equals({
			name: 'test item',
			id: 1
		});
	});
	it('should update items', ()=>{
		var storage = new Storage();
		storage.add('test item');
		var testItem = storage.update('item', 1);
		expect(testItem).to.deep.equals({
			name: 'item',
			id: 1
		});
	});
	it('should retrieve all items', ()=>{
		var storage = new Storage();
		storage.add('test');
		storage.add('item');
		storage.add('list');
		var items = storage.getAll();
		expect(items).to.have.length(3);
	});
	it('should delete items', ()=>{
		var storage = new Storage();
		var addedItem = storage.add('test');
		expect(storage.getAll()).to.have.length(1);
		storage.delete(addedItem.id);
		expect(storage.getAll()).to.have.length(0);
	});
	it('should clear all items', ()=>{
		var storage = new Storage();
		storage.add('milk');
		storage.add('eggs');
		storage.add('bananas');
		storage.clear()
		expect(storage.getAll()).to.have.length(0);
		storage.add('milk');
		expect(storage.getAll()[0].id).to.equal(1);
	})
})