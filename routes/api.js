const express  = require('express');
const authRouter = require('./authRouter')
const postsRouter = require('./postsRouter');
const authMiddleware = require('../middlewares/user.jwt.authenticator');

const app = express();

app.use('/auth', authRouter);

app.use(authMiddleware.authenticate);

app.use("/posts/", postsRouter)

module.exports = app;