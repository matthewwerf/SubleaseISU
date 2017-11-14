process.env.NODE_ENV = 'test';

// Testing Libs
let chai = require('chai'),
	assert = chai.assert,
	chaiHttp = require('chai-http'),
	should = chai.should();

// Database Libs
let mongoose = require("mongoose"),
	User = require('../models/userModel.js'),
	Property = require('../models/propertyModel.js')

chai.use(chaiHttp);

// Instantiate Server
let server = require('../main.js');

describe('Properties', () => {
	beforeEach((done) => {
		User.remove({}, (err) => { // Clear User DB
			done();
		});
		let newUser = {
				username: "username",
				hashedPassword: "hashedPassword"
			};
		newUser = new User(newUser);
		newUser.save((err, user) => {
			if (err) {
				console.log(err);
			}
		});
	});

	describe('GET property', (done) => {
		it('Should retrieve valid property', (done) =>{
			let newProperty = {
				propertyID: "propertyID",
				address: "123 Sheldon Ave"
			};
			newProperty = new Property(newProperty);
			newProperty.save((err, property) => {
				chai.request(server)
					.post('/property/propertyID')
					.send({
						username: "username",
						subleaseISUcookie: "f069d9f42153600e1ad8d8106aa12411760ae79c"
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('propertyID');
						res.body.should.have.property('address');
						done();
				});
			});
		});
	});
});