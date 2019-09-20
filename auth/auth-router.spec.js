const request = require('supertest');
const superagent = require('superagent');
const server = require('../api/server');
const db=require('../database/auth-model');

describe('auth-router', () => {
    describe('register', () => {
        it('fails without username and password', () => {
            return request(server)
            .post('/api/auth/register')
            .then(res => {
                expect(res.status).toBe(400);
            });
        });
        it('passes with username and password', () => {
            db.deleteUser('bob');
            return request(server)
            .post('/api/auth/register')
            .send({username:'bob',password:'bob123'})
            .then(res => {
                expect(res.status).toBe(200);
            })
            .catch(err => console.log(err));
        })
    });
    describe('login', () => {
        db.insert({username:'bob',password:'bob123'}).catch(err=>err);
        it('fails without username and password', () => {
            return request(server)
            .post('/api/auth/login')
            .then(res => expect(res.status).toBe(400));
        });
        it('fails with incorrect password', () => {
            return request(server)
            .post('/api/auth/login')
            .send({username:'bob',password:'password'})
            .then(res => expect(res.status).toBe(401));
        });
        it('passes with correct password', () => {
            return request(server)
            .post('/api/auth/login')
            .send({username:'bob',password:'bob123'})
            .then(res => expect(res.status).toBe(200));
        });
    });
    describe('jokes', () => {
        it('fails when logged out', () => {
            return request(server)
            .get('/api/jokes')
            .then(res => expect(res.status).toBe(401));
        });
        const agent = request.agent(server);
        it('should login', () => {
            agent.post('/api/auth/login')
            .send({username:'bob',password:'bob123'})
            .then(res => expect(res.status).toBe(200));
        })
        it('passes when logged in', () => {
            agent.get('/api/jokes')
            .then(res => expect(res.status).toBe(200));
        })
    });

});