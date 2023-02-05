require("dotenv").config({path: './envfile'});


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const DBConnect = require("./db");
DBConnect();

const redis = require('./redis');
redis.Init();

const app = require('./app');

//start server
const PORT = process.env.PORT;
app.listen(PORT, ()=> console.log(`Server listening on port: http://localhost:${PORT}`));