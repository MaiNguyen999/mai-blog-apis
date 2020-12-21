const axios = require('axios')
const API = "https://api.hatchways.io/assessment/blog/posts?"
const PARAM_INFO={
    SORT: {name: 'SORT', validValues: ['id', 'reads', 'likes', 'popularity'], errorMess: "sortBy parameter is invalid"},
    DIR: {name: 'DIR', validValues: ['desc','asc'], errorMess: "direction parameter is invalid"},
    TAGS: {name:'TAGS', errorMess:"Tags parameter is required"}
}

/**
 * Get all posts based on tags
 * @param {array} tags An array of tags to search from original posts
 */
module.exports.fetchPosts = async function (tags){
    var tagsToSearch = getSeparatedValues(tags, ',')
    var promises = [];
    for(var tag of tagsToSearch){
        var fetchPromise = fetchPostsByTag(tag)
        promises.push(fetchPromise)
    }
    return await Promise.all(promises).catch(e=>console.log(e))
}
/**
 * Fetch posts related to one tag
 * @param {string} tag A post tag
 */
async function fetchPostsByTag(tag){
    var url = `${API}tag=${tag}`
    var res = await axios.get(url).catch(e => console.log(e))
    return res.data.posts
}
/**
 * Merge and deduplicate 2 posts arrays
 * @param {array} arrays An array of posts array 
 */
module.exports.mergeArrays = function (arrays){
    var resultArray = [];
    var existedIds = {};
    for(var array of arrays){
        resultArray = [...resultArray, ...array]
    }
    resultArray =  resultArray.filter((item,index) => {
         if(existedIds[item.id] == null ) 
         {
             existedIds[item.id] = item.id;
            return true;
        } else return false;
        
    })
    return resultArray
}
/**
 * Sort the posts array based on key and direction
 * @param {string} key the key to sort the posts from
 * @param {string} direction asc||desc
 */
module.exports.dynamicSort = function (key, direction){
    var sortOrder = direction === 'asc'? 1 : -1
    return function (a,b) {
        return sortOrder == 1 ? a[key] - b[key]
                              : b[key] - a[key];
    }
}
/**
 * Seperate a string by specified character 
 * @param {string} str
 * @param {*} splitChar 
 */
function getSeparatedValues(str, splitChar){
    var modifiedStr = str.replace(/[\[\]']+/g,'').replace(' ',"")
    return modifiedStr.split(splitChar);
}

/**
 * Get value from query parameters 
 * @param {object} request 
 * @param {string} param specific parameter to get value from
 */
module.exports.getQueryParams = function (request, param){
    return (request.hasOwnProperty('query')
        && request.query.hasOwnProperty(param))
        ? request.query[param]
        : undefined;
}
/**
 * Check wether a parameter has a valid value
 * @param {string} paramValue 
 * @param {string} paramType 
 */
 function isValidParam (paramValue,paramType){
    return paramType === PARAM_INFO.TAGS.name && paramValue !== undefined 
        || paramType !== PARAM_INFO.TAGS.name && PARAM_INFO[paramType].validValues.includes(paramValue);
}
/**
 * Get the error message of the invalid query parameter
 * @param {string} tags 
 * @param {string} sortBy 
 * @param {string} direction 
 */
module.exports.getErrorMessage = function (tags,sortBy, direction){
    var errorMess;
    if(!isValidParam(tags,  PARAM_INFO.TAGS.name)) errorMess =  PARAM_INFO.TAGS.errorMess
    else if(!isValidParam(sortBy,  PARAM_INFO.SORT.name)) errorMess =  PARAM_INFO.SORT.errorMess
    else if(!isValidParam(direction,  PARAM_INFO.DIR.name)) errorMess =  PARAM_INFO.DIR.errorMess
    return errorMess ;
}
module.exports.PARAM_INFO = PARAM_INFO
module.exports.isValidParam = isValidParam