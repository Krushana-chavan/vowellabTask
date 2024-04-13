const ProductsModel = require("../products.model");

const getAllProducts = async (page, limit, filter, sort,minPrice,maxPrice) => {
	
	try {
	  const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 32;
	  const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
	  const skip = (start - 1) * length;
	  const filterQuery = {
		
		active:true,
		/* price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } */
	  };
	
	 if(maxPrice){
		filterQuery.price =  { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
	 }
	
  
	  if (filter && filter.search !== undefined && filter.search !== "") {
		var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
		filterQuery.$or = [
		  { name: { $regex: searchRegex } },
		];
	  }
  
	  let sortQuery = { name: "1" };
  
	  if (sort != null) {
		sortQuery = sort;
	  
	  }



	  const ProductList = await ProductsModel.find(filterQuery)
		.skip(skip)
		.limit(length)
		.sort(sortQuery)
		.lean();
	  const totalResults = await ProductsModel.countDocuments(filterQuery);
  
	  const totalPages = Math.ceil(totalResults / length);
	  return {
		data: ProductList,
		totalPages,
		totalResults,
		page: start,
		limit: length,
		status: true,
		code: 200,
	  };
	} catch (error) {

	  return { status: false, code: 500, msg: error };
	}
  };
  

module.exports = getAllProducts