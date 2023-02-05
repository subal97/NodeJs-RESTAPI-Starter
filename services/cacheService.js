const {GetResponseCacheClient} = require('../redis.js');

const client = GetResponseCacheClient();

exports.GetCachedDataAsync = async function(key){
    if(key){
        let cachedData = await client.get(key);
        return JSON.parse(cachedData);
    }
    return null;
};

exports.CacheDataAsync = async function(cacheKey, data, timeToLive){
    if(!data){
        return;
    }
    let exists = await client.exists(cacheKey);
    if(exists == false){
        await client.set(cacheKey, JSON.stringify(data), 'ex', timeToLive);
    }
}



