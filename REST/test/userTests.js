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

	describe('GET existing User', () => {
		it('Should retrieve valid user', (done) =>{
			let newUser = {
				username: "username",
				hashedPassword: "hashedPassword"
			};
			newUser = new User(newUser);
			newUser.save((err, user) => {
				chai.request(server)
					.get('/users/username')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('username');
						res.body.should.have.property('hashedPassword');
						done();
				});
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

	describe('Auth Existing User', () => {
		it('Should return cookie on valid auth', (done) => {
			let newUser = {
				username: "username",
				hashedPassword: "hashedPassword"
			};
			newUser = new User(newUser);
			newUser.save((err, user) => {
				chai.request(server)
					.post('/login/username')
					.send({
						hashedPassword: "hashedPassword",
						username: "username"
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('subleaseISUcookie');
						done();
				});
			});
		});
	});

	describe('PUT existing User', () => {
		it('Should update valid user', (done) =>{
			let newUser = {
				username: "username",
				hashedPassword: "hashedPassword"
			};
			newUser = new User(newUser);
			newUser.save((err, user) => {
				chai.request(server)
					.put('/users/username')
					.send({
						username: "username",
						subleaseISUcookie: "f069d9f42153600e1ad8d8106aa12411760ae79c",
						email: "newEmailTest@test.com"
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('username');
						res.body.should.have.property('hashedPassword');
						res.body.should.have.property('email');
						res.body.email.should.be.eql('newEmailTest@test.com');
						done();
				});
			});
		});
	});

	describe('DELETE existing User', () => {
		it('Should error out if user does not exist', (done) => {
			chai.request(server)
				.delete('/users/username')
				.send({
					username: "username",
					subleaseISUcookie: "f069d9f42153600e1ad8d8106aa12411760ae79c"
				})
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.be.eql('Username not recognized');
					done();
				});
		});

		it('Should delete valid user', (done) =>{
			let newUser = {
				username: "username",
				hashedPassword: "hashedPassword"
			};
			newUser = new User(newUser);
			newUser.save((err, user) => {
				chai.request(server)
					.delete('/users/username')
					.send({
						username: "username",
						subleaseISUcookie: "f069d9f42153600e1ad8d8106aa12411760ae79c"
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('msg');
						res.body.msg.should.be.eql('User successfully deleted');
						done();
				});
			});
		});

		it('Should error out if auth fails', (done) => {
			let newUser = {
				username: "username",
				hashedPassword: "hashedPassword"
			};
			newUser = new User(newUser);
			newUser.save((err, user) => {
				chai.request(server)
					.delete('/users/username')
					.send({
						username: "username",
						subleaseISUcookie: "incorrect"
					})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('error');
						res.body.error.should.be.eql('Incorrect cookie');
						done();
				});
			});
		});

	});




});