const chai = require("chai");
const chaiHttp = require("chai-http");
const { PORT, DATABASE_URL } = require('../config');
const { app, runServer, closeServer } = require("../server");
const expect = chai.expect;
chai.use(chaiHttp);

describe("HTML Test", function() {
    before(function() {
        return runServer(DATABASE_URL, PORT);
    });

    after(function() {
        return closeServer();
    });
    it('Should return HTML and status 200', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});