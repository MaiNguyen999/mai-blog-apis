var express = require("express");
var app = express();
var {getErrorMessage, getQueryParams, fetchPosts, mergeArrays, dynamicSort, PARAM_INFO} = require('./utils')
const DEFAULT_SORT = 'id'
const DEFAULT_DIR = 'asc'
const PORT = 3002

app.get("/api/ping", (req, res) => {
    return res.status(200).json({success:true})
})

app.get("/api/posts",  async (req,res,next)=>{
    var tags = getQueryParams(req,'tags')
    var sortBy = getQueryParams(req,'sortBy') || DEFAULT_SORT
    var direction = getQueryParams(req,'direction') || DEFAULT_DIR
    
    var message = getErrorMessage(tags,sortBy, direction)
    if (message != undefined || message != null ) 
        return res.status(400).json({error: message})
    
    var posts = await fetchPosts(tags).catch(e=>console.log(e))
    posts = mergeArrays(posts)
    posts = posts.sort(dynamicSort(sortBy, direction))
    return res.status(200).json({posts})
})
app.listen(PORT, () => {
 console.log("Server running on port ", PORT);
});

