process.env.NODE_ENV = 'test';

// Testing Libs
let chai = require('chai'),
	assert = chai.assert,
	chaiHttp = require('chai-http'),
	should = chai.should();

// Database Libs
let mongoose = require("mongoose"),
	User = require('../models/userModel.js');

chai.use(chaiHttp);

// Instantiate Server
let server = require('../main.js');


describe('Users', () => {
	beforeEach((done) => {
		User.remove({}, (err) => { // Clear User DB
			done();
		});
	});

	describe('GET non-existant User', () => {
		it('Should return error', (done) => {
			chai.request(server)
				.get('/users/username')
				.end((err, res) => {
					res.should.have.status(401);
					JSON.parse(res.error.text).error.should.be.eql("username not recognized");
					done();
				});
		});
	});

	describe('POST new User', () => {
		it('Should create user with all reqs', (done) => {
			let newUser = {
				username: "Username",
				hashedPassword: "hashedPassword"
			};

			chai.request(server)
				.post('/users')
				.send(newUser)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('username');
					res.body.should.have.property('hashedPassword');
					done();
				});
		});
	});

});