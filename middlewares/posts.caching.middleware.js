const cacheService = require('../services/cacheService')
const caching_enabled =  process.env.REDIS_ENABLED.toLowerCase() === 'true';

exports.Lookup = async function(req, res, next){
    if(!caching_enabled){        
        next();
        return;
    }
    const cacheKey = GenerateCacheKeyFromRequest(req);
    const cachedData = await cacheService.GetCachedDataAsync(cacheKey);
    if(cachedData){
        res.status(200).json({
            status: 'success',
            results: cachedData.length,
            data: cachedData
        });
        return;
    }
    next();
};

exports.CacheResponse = async(req, res, next) =>{
    if(!caching_enabled){
        next();
        return;
    }
    const cacheKey = GenerateCacheKeyFromRequest(req);
    await cacheService.CacheDataAsync(cacheKey, res.locals.data, 100);
};

function GenerateCacheKeyFromRequest(req){
    let cacheKey = req.originalUrl;
    const keys = Object.keys(req.query).sort();
    keys.forEach((key) => {
        const val = req.query[key];
        cacheKey += `|${key}-${val}`;
    });
    return cacheKey;
}