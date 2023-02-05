

async function ConnectDB(){
    let mongodb_url = process.env.DATABASE_URL;
    let mongoose = require('mongoose');
    try{
        mongoose.connect(mongodb_url);
    }catch(err){
        console.log(err.message);
        console.log("Application is shutting down...");
        process.exit(1);
    }

    // const conn = mongoose.connection;
    // const dbs = await conn.db.admin().listDatabases();
    // console.log(dbs.databases);

    return mongoose.connection;
}

module.exports = ConnectDB