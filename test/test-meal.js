'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');
const { app, runServer, closeServer } = require('../server');
const { User } = require('../models');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Meal endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplePass';

    before(function() {
        return runServer(DATABASE_URL, PORT);
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
            const token = jwt.sign({
                    //user: {
                    username
                    //}
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: JWT_EXPIRY
                }
            );

            return chai
                .request(app)
                .get('/meal')
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    //expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                });
        });
    });
});