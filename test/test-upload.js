'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { PORT, TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');
const { app, runServer, closeServer } = require('../server');
const { User, Meal } = require('../models');
const fs = require('fs');
const expect = chai.expect;
chai.use(chaiHttp);
let token = '';

describe('Upload endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplePass';

    before(function() {
        return runServer(TEST_DATABASE_URL, PORT);
    });

    after(function() {
        return closeServer();
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password
            })
        );
    });

    afterEach(function() {
        return User.remove({});
    });

    describe('/upload', function() {
        it('Should return a valid auth token', function() {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username, password })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    token = res.body.authToken;
                    expect(token).to.be.a('string');
                });
        });

        it('POST should return status code 200', function() {
            return chai
                .request(app)
                .post('/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('photoUpload', fs.readFileSync('./testimage.JPG'), 'testimage.JPG')
                .then(res => {
                    expect(res).to.have.status(200);
                });
        });

        it('DELETE should return status code 200', function() {
            return chai
                .request(app)
                .delete('/upload')
                .send({
                    imageURL: './uploads/testimage.JPG'
                })
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                });
        });
    });
});