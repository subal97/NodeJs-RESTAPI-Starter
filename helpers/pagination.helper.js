const uriService = require('../services/uriService');

class PagedResponse{
    Data;
    PageNumber;
    PageSize
    PreviousPage;
    NextPage;
    
    constructor(data, pageNumber, pageSize, baseUri){
        this.data = data;
        this.PageNumber = Number.parseInt(pageNumber >=1 ? pageNumber : null);
        this.PageSize = Number.parseInt(pageSize >= 1 ? pageSize : null);
        
        let PreviousPageNumber = this.PageNumber > 1 ? this.PageNumber - 1 : null;
        let NextPageNumber = this.data.length > 0 ? this.PageNumber + 1 : null;

        this.PreviousPage = uriService.GetUriForPaginatedPosts(baseUri, new PaginationQuery({pageNumber: PreviousPageNumber, pageSize: this.PageSize}));
        this.NextPage = uriService.GetUriForPaginatedPosts(baseUri, new PaginationQuery({pageNumber: NextPageNumber, pageSize: this.PageSize}));
    }
}

class PaginationQuery{
    pageNumber; pageSize;

    constructor({pageNumber=1, pageSize=10}){
        this.pageNumber = Number.parseInt(pageNumber);
        this.pageSize = Number.parseInt(pageSize);
    }
}

function AddPagination(query, paginationQuery){
    let skip = paginationQuery.pageSize * (paginationQuery.pageNumber - 1);
    query.skip(skip).limit(paginationQuery.pageSize);
}

module.exports = {PagedResponse, AddPagination, PaginationQuery}