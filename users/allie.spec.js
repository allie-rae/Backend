const Users = require('./users-model');
const db = require('../database/dbConfig');
const supertest = require('supertest');
const server = require('../api/server');
const request = supertest(server);


// Register tests - These work! You might have to change the username to something unique in the 
// status 201 test to see it work properly.

describe('test register', function () {
  it('shows status 201', async function (done) {
    request
      .post('/api/auth/register')
      .send({ username: 'test6', password: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('shows status 500', async function (done) {
    request
      .post('/api/auth/register')
      .send({ username: 'test1', password: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
});


// Login tests

describe('test login', function () {
  it('shows status 200', async function (done) {
    request
      .post('/api/auth/login')
      .send({ username: 'test1', password: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('shows status 401', async function (done) {
    request
      .post('/api/auth/login')
      .send({ username: 'test', password: '000000' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })

  it('shows status 400', async function (done) {
    request
      .post('/api/auth/login')
      .send({ what: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
});


let token;

beforeAll((done) => {
  request
    .post('/api/auth/login')
    .send({
      username: 'test1',
      password: 'test',
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      console.log(token);
      done();
    });
});

// GET request tests

describe('GET /', () => {
  // token not being sent - should respond with a 401
  test('It should require authorization', () => {
    return request
      .get('/api/user/dashboard/1')
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test('dashboard responds with JSON', () => {
    return request
      .get('/api/user/dashboard/1')
      .set('Authorization', `${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');
      });
  });
  // testing multiple GET requests
  test('favorites responds with JSON', () => {
    return request
      .get('/api/user/dashboard/1/favorites')
      .set('Authorization', `${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');
      });
  });
});


// POST tests

describe('POST /', () => {
  // token not being sent - should respond with a 401
  test('It should require authorization', () => {
    return request
      .post('/api/user/dashboard/1/favorites')
      .send({ song_id: 'test', user_id: '1' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test('favorites responds with JSON and 201', () => {
    return request
      .post('/api/user/dashboard/1/favorites')
      .set('Authorization', `${token}`)
      .send({ song_id: 'test', user_id: '1' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.type).toBe('application/json');
      });
  });
});