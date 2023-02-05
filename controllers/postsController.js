const model = require('../models/PostModel');
const {AddPagination, PaginationQuery, PagedResponse} = require('../helpers/pagination.helper');
const uriService = require('../services/uriService');

//mongoose.set('debug', true);

exports.GetAll = async(req, res, next) =>{
    let baseUri = uriService.GetBaseUri(req);
    let paginationQuery = new PaginationQuery(req.query);
    let query = BuildQuery(req.body, paginationQuery);
    try {
        let docs = await query.exec();
        res.locals.data = new PagedResponse(docs, paginationQuery.pageNumber, paginationQuery.pageSize, baseUri);
        res.status(200).json({
            status: 'success',
            ...res.locals.data
        });
        next();
    } catch (error) {
        next(error);
    }
};

exports.GetById = async(req, res, next) =>{
    try {
        const doc = await model.findOne({
            _id: req.params.id
        }).populate('Author', select={'Email':1, '_id':0});
        res.locals.data = doc;
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        });
        next();
    } catch (error) {
        next("ok");
    }
};

exports.Create = async(req, res, next) => {
    const post = {...req.body, Author: req.user._id};
    try {
        const doc = await model.create(post);
        await doc.populate('Author', select={'Email':1, '_id':0});
        res.status(201).json({
            status: 'success',
            results: doc.length,
            data: doc
        });
    } catch (error) {
        next(error)
    }
};

exports.Update = async(req, res, next) => {

    try {
        //check owenership of the post
        let doc = await model.findOne({_id: req.params.id});
        if(!doc) SendResponse(res, 404);
        if(!req.user._id.equals(doc.Author) && !req.user.Roles.includes('admin')){
            SendResponse(res, 405, "Operation not allowed")
        }
        
        const post = {...req.body };
        const result = await model.findOneAndUpdate({_id: req.params.id}, post, {new: true});
        await result.populate('Author', select={'Email':1, '_id':0});
        
        if(result != null){
            res.status(201).json({
                status: 'success',
                data: result
            });
        }else{
            res.status(404).send();
        }
    } catch (error) {
        next(error)
    }
};

exports.Delete = async(req, res, next) => {
    try {
        //check owenership of the post
        let doc = await model.findOne({_id: req.params.id});
        if(!doc) SendResponse(res, 404);
        if(!req.user._id.equals(doc.Author) && !req.user.Roles.includes('admin')){
            SendResponse(res, 405, "Operation not allowed")
        }
        doc = await model.deleteOne({_id: req.params.id});
        res.status(204).send();
    } catch (error) {
        next(error)
    }
};

exports.SeedData = async (req, res, next) =>{
    const dataSetSize = req.params.size || 5;

    let posts = [];
    let offset = 0;
    for(let i=1; i<=dataSetSize; i++){
        let post = {
            Title: `Post ${i+offset}`,
            Tags: ['javascript', 'rest'],
            Content: `Some content about Post ${i+offset}`,
            Author: req.user._id,

        };
        posts.push(post);
    }
    
    try {
        console.log(posts);
        const doc = await model.insertMany(posts);
        res.status(201).json({
            status: 'success',
            results: doc.length,
            data: doc
        });
    } catch (error) {
        next(error)
    }
    next();
};

function SendResponse(res, status, message=""){
    res.status(status).send({
        message: message
    });
}

function BuildQuery(body, paginationQuery){
    const query = model.find();

    if(body._id){
        query.where('_id', body._id);
    }
    
    if(body.Title){
        query.where('Title', body.Title);
    }
    
    if(body.Content){
        query.where('Content', body.Content);
    }
    
    if(body.Tags){
        query.in("Tags", body.Tags);
    }
    
    AddPagination(query, paginationQuery);
    
    query.populate('Author', select={'Email':1, '_id':0});
    
    return query;
}
