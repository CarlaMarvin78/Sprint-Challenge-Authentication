const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const dbConfig = require('../database/dbConfig');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
  name: 'oatmeal_raisin',
  secret: process.env.SESSION_SECRET || 'For the horde',
  cookie: {
      maxAge: 1000 * 60 * 60, // in milliseconds
      secure: false, // true means only send cookie over https
      httpOnly: true, // true means JS has no access to the cookie
  },
  resave: false,
  saveUninitialized: true, // GDPR compliance
  store: new KnexSessionStore({
      knex: dbConfig,
      tablename: 'knexsessions',
      sidfieldname: 'sessionid',
      createtable: true,
      clearInterval: 1000 * 60 * 30, // clean out expired session data
  }),
};


const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
