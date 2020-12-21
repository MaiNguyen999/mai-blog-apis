var {isValidParam, getQueryParams, fetchPosts, mergeArrays, dynamicSort,PARAM_INFO} = require('../utils')
var expect = require('chai').expect;

//#region isValidParam
describe('#isValidParam()', function(){
    context('with Tags', function(){
        it('should be false if undefined', function(){
            var tags = undefined
            var actual = isValidParam(tags, PARAM_INFO.TAGS.name)
            expect(actual).to.be.false;
        })
    })
    context('with SortBy', function(){
        it('should be false if not in id, reads, likes, popularity', function(){
            var sortBy = 'liked'
            var actual = isValidParam(sortBy, PARAM_INFO.SORT.name)
            expect(actual).to.be.false;
        })
        it('should be true if in id, reads, likes, popularity', function(){
            var sortBy = 'popularity'
            var actual = isValidParam(sortBy, PARAM_INFO.SORT.name)
            expect(actual).to.be.true;
        })
    })

    context('with Direction', function(){
        it('should be true if in asc, desc', function(){
            var direction = 'asc'
            var actual = isValidParam(direction, PARAM_INFO.DIR.name)
            expect(actual).to.be.true;
        })
        it('should be false if not in asc, desc', function(){
            var direction = 'asce'
            var actual = isValidParam(direction, PARAM_INFO.DIR.name)
            expect(actual).to.be.false;
        })
    })
})
//#endregion

//#region dynamicSort
var unsorted = [{id:95,likes:985,popularity:0.99},
                {id:2,likes:985,popularity:0.42},
                {id:76,likes:985,popularity:0.13},
                {id:190,likes:985,popularity:0.77}]

describe('#dynamicSort()', function(){
    context('with different key - order asc', function(){
        it('with float values', function(){
            var key = 'popularity'
            var direction = 'asc'
            var sorted = unsorted.sort(dynamicSort(key, direction))

            expect(sorted[0].popularity).to.equal(0.13)
            expect(sorted[1].popularity).to.equal(0.42)
            expect(sorted[2].popularity).to.equal(0.77)
            expect(sorted[3].popularity).to.equal(0.99)
        })
        it('with int values', function(){
            var key = 'id'
            var direction = 'asc'
            var sorted = unsorted.sort(dynamicSort(key, direction))

            expect(sorted[0].id).to.equal(2)
            expect(sorted[1].id).to.equal(76)
            expect(sorted[2].id).to.equal(95)
            expect(sorted[3].id).to.equal(190)
        })
    })
    context('with desc direction', function(){
        it('should reverse id order', function(){
            var key = 'id'
            var direction = 'desc'
            var sorted = unsorted.sort(dynamicSort(key, direction))
    
            expect(sorted[0].id).to.equal(190)
            expect(sorted[1].id).to.equal(95)
            expect(sorted[2].id).to.equal(76)
            expect(sorted[3].id).to.equal(2)
        })
    })
})
//#endregion

//#region mergeArray
var arrays = [[
                {"id":95,"likes":985,"popularity":0.42,"reads":55875},
                {"id":95,"likes":985,"popularity":0.42,"reads":55875},
              ],
              [
                {"id":94,"likes":124,"popularity":0.24,"reads":1231245},
                {"id":95,"likes":985,"popularity":0.42,"reads":55875},
              ]
             ]
describe('#mergeArray()', function(){
    it("should only return 2 elements", function(){
        var mergedArray = mergeArrays(arrays)
        console.log(mergedArray)
        expect(mergedArray.length).to.equal(2);
    })
})
//#endregion