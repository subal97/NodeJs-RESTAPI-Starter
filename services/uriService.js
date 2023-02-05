exports.GetBaseUri = function(req){
    return `${req.protocol}://${req.hostname}:${req.client.localPort + req.baseUrl}`
};

exports.GetUriForPaginatedPosts = function(baseUri, paginationQuery){
    if(!paginationQuery.pageNumber) return null;
    const uri = baseUri + '?' + new URLSearchParams(paginationQuery).toString();
    return uri;
};