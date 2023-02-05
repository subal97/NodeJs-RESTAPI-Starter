const Redis = require('ioredis');

let _db;

function Init(){
    if(_db){
        console.log('Redis connection ready!');
        return;
    }
    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT

    try {
        _db = new Redis({
            'host': host,
            'port': port
        });
    } catch (error) {
        console.log("Can't connect to redis", error);
    }
}

function GetResponseCacheClient(){
    if(!_db){
        Init();
    }
    return _db;
}

module.exports = {
    GetResponseCacheClient,
    Init
};