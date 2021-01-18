const advancedResults = (model,populate) => async(req,res,next)=> {
    // query = url.parse(req.originalUrl,true).query

  let reqQuery = { ...req.query }
  let removeFields = ['select','sort','limit','page']
  removeFields.forEach(param => delete reqQuery[param] )
  
  // const bootcamp = await Bootcamp.find(query)
  let query;
  let queryStr = JSON.stringify(reqQuery) //avg[lte]

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g , match => `$${match}`) //g here means global to search for operator beyond the first one ,b = boundary
  
  query = model.find( JSON.parse(queryStr) )
//   .populate({
//     path: 'courses',
//     select : 'title description'
//   }); //can't take anything else except dot notation for nested objects

  if( req.query.select ){
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if( req.query.sort ){
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  }else {
    query = query.sort('-createdAt') //- for descending
  }

  //Pagination
  const page = parseInt( req.query.page , 10 ) || 1
  const limit = parseInt( req.query.limit , 10) || 25
  const startIndex = (page - 1 ) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()
  
  query = query.skip( startIndex ).limit( limit )

  if( populate ){
      query = query.populate(populate);
  }

  //Executing Query
  const results = await query;

  if( !results ){
    return next(
        new ErrorResponse( `Result has no data` , 404 )
    )
  }

  //Pagination Result
  const pagination = {}

  if( endIndex < total ){
    pagination.next = {
      page : page + 1,
      limit
    }
  }

  if( startIndex > 0 ){
    pagination.prev = {
      page : page - 1,
      limit
    }
  }

  res.advancedResults = {
        success : true,
        count : results.length,
        pagination,
        data : results
  }

  next()
}

module.exports = advancedResults