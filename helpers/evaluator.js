module.exports.evaluateReviews = function(){
    var resultedList = [];
    var errorList = [];
    var viewList = (document.querySelectorAll('.review') || []);
    if(viewList.length <1){
        errorList.push("Cannot find review block, possible change in element (.review)");
    }
    else{
        for(var i=0;i<viewList.length;i++){
            var reviewerList = viewList[i].querySelectorAll('.reviewer > dd') || [];
            if(reviewerList.length < 1){
                errorList.push("Cannot Find Reviewer Name and Date, possible change in element( .reviewer > dd)");
            }else{
                var reviewer = (reviewerList[0] || {}).innerHTML;
                var reviewDate = (reviewerList[1] || {}).innerHTML;
            }
            var reviewTitle = (viewList[i].querySelector('.rightCol h6') || {}).innerHTML;
            var reviewComment = (viewList[i].querySelector('.rightCol p') || {}).innerHTML;
            var overAllRating = (viewList[i].querySelectorAll('.itemReview dd') || []);
            if( overAllRating < 1){
                errorList.push("Cannot Find user Ratings, possible change in element( .itemReview dd)");            
            }else{
                var userCombinedRating = (overAllRating[0] || {}).innerText;
                var userValuesRating = (overAllRating[1] || {}).innerText;
                var userFeaturesRating = (overAllRating[2] || {}).innerText;
                var userQualityRating = (overAllRating[3] || {}).innerText;
                var userPerformanceRating = (overAllRating[4] || {}).innerText;
            }
    
            if(!reviewer) errorList.push("Cannot Find reviewer Name, possible change in element (.reviewer > dd:first-child)");
            if(!reviewDate) errorList.push("Cannot Find reviewer Date, possible change in element (.reviewer > dd:second-child)");
            if(!reviewTitle) errorList.push("Cannot Find review Title, possible change in element (.rightCol h6)");
            if(!reviewComment) errorList.push("Cannot Find review comment, possible change in element (.rightCol p)");
            if(!userCombinedRating) errorList.push("Cannot Find User Overall Rating, possible change in element (.reviewer > dd:nth-child(0))");
            if(!userValuesRating) errorList.push("Cannot Find user value rating, possible change in element (.reviewer > dd:nth-child(1))");
            if(!userFeaturesRating) errorList.push("Cannot Find user feature rating, possible change in element (.reviewer > dd:nth-child(2))");
            if(!userQualityRating) errorList.push("Cannot Find user quality rating, possible change in element (.reviewer > dd:nth-child(3))");
            if(!userPerformanceRating) errorList.push("Cannot Find user performance rating, possible change in element (.reviewer > dd:nth-child(4))");        
            
            if(errorList.length > 0){
                break;
            }
            
            resultedList.push({
                reviewer: reviewer,
                reviewDate: reviewDate,
                reviewTitle: reviewTitle,
                reviewComment: reviewComment,
                userCombinedRating: userCombinedRating,
                userValuesRating: userValuesRating,
                userFeaturesRating: userFeaturesRating,
                userQualityRating: userQualityRating,
                userPerformanceRating: userPerformanceRating
            });
        }
    }
    return {errors: errorList, result: resultedList};
}

module.exports.evaluateProductName = function(){
    var errorList = [];
    var prodname = (document.querySelector('.prodName > h1') || {}).innerHTML;
    if(!prodname) errorList.push("Cannot find product name, possible change in element (.prodName > h1)");
    return {errors: errorList, result: prodname};        
}

module.exports.evaluateReviewCount = function(){
    var errorList = [];
    var prodname = (document.querySelector('#reviewtab span') || {}).innerText;
    if(!prodname) errorList.push("Cannot find total review count, possible change in element (#reviewtab span)");
    return {errors: errorList, result: prodname};        
}

module.exports.overAllRating = function(){
    var errorList = [];
    var prodname = (document.querySelector('.piRatingVal') || {}).innerText;
    if(!prodname) errorList.push("Cannot find product name, possible change in element (.prodName > h1)");
    return {errors: errorList, result: prodname}; 
}