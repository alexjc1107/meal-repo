'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { PORT, TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');
const { app, runServer, closeServer } = require('../server');
const { User, Meal } = require('../models');

const expect = chai.expect;

chai.use(chaiHttp);

let token = '';
let mealId = '';

describe('Meal endpoints', function() {
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

    describe('/meal', function() {
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

        it('GET should return status code 200', function() {
            return chai
                .request(app)
                .get('/meal')
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                });
        });

        it('POST should return status code 200', function() {
            return chai
                .request(app)
                .post('/meal')
                .send({
                    restaurant: 'restaurant',
                    dish: 'dish',
                    content: 'content',
                    username: username,
                    imageURL: 'imageURL'
                })
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    mealId = res.body._id;
                });
        });

        it('PUT should return status code 200', function() {
            return chai
                .request(app)
                .put('/meal')
                .send({
                    restaurant: 'restaurantUpdated',
                    dish: 'dishUpdated',
                    content: 'contentUpdated',
                    id: mealId
                })
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                });
        });

        it('DELETE should return status code 200', function() {
            return chai
                .request(app)
                .delete('/meal')
                .send({
                    id: mealId
                })
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                });
        });
    });
});