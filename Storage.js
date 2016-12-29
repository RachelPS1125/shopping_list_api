'use strict';
class Storage {
	constructor(){
		this.items = [];
		this.idNum = 1;
	}
	add(item){
		var itemObject = {
			name: item,
			id: this.idNum++
		};
		this.items.push(itemObject);
		return itemObject;
	}
	update(name, id){
		var foundAt = this.items.findIndex(function(el){
			return el.id === parseInt(id);
		});
		if(foundAt===-1){
			return false;
		}
		this.items[foundAt].name = name;
		return this.items[foundAt];
	}
	getAll(){
		return this.items;
	}
	delete(id){
		var foundAt =this.items.findIndex(function(el){
			return el.id === parseInt(id);
		})
		this.items.splice(foundAt, 1);
	}
	clear(){
		this.items = [];
		this.idNum = 1;
	}
}
module.exports = Storage;