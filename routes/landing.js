const landingRouter = require('express').Router();
const validateUrl = require('./../helpers/utils.js').validateUrl;
var phantom = require('phantom');

landingRouter.post('/', async (req,res) => {
    var t = req.body.query;
    if(typeof t !== "string" || !validateUrl(t)){
        return res.status(500).render('error', { msg: `The URL entered is not Valid. please try again` });
    }
    try{
        t += "&pagenumber=0&recordsPerPage=1000000";
        const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
        const page = await instance.createPage();
        page.setting('userAgent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36');
        const status = await page.open(t);
        if(status === 'fail'){
            instance.exit();
            return res.status(500).render('error', {msg: 'Unable to process request!'}); 
        }else{
            var reviewList = page.evaluate(function(){
                var resultedList = [];
                var viewList = document.querySelectorAll('.review');
                for(var i=0;i<viewList.length;i++){
                    var reviewerList = viewList[i].querySelectorAll('.reviewer > dd');
                    var reviewer = reviewerList[0].innerHTML;
                    var reviewDate = reviewerList[1].innerHTML;
                    var reviewTitle = viewList[i].querySelector('.rightCol h6').innerHTML;
                    var reviewComment = viewList[i].querySelector('.rightCol p').innerHTML;
                    var overAllRating = viewList[i].querySelectorAll('.itemReview dd');
                    var userCombinedRating = overAllRating[0].innerText;
                    var userValuesRating = overAllRating[1].innerText;
                    var userFeaturesRating = overAllRating[2].innerText;
                    var userQualityRating = overAllRating[3].innerText;
                    var userPerformanceRating = overAllRating[4].innerText;
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
                return resultedList;
            });
            var prodName = page.evaluate(function(){
                return document.querySelector('.prodName > h1').innerHTML;
            });
            Promise.all([reviewList,prodName]).then(([reviews,productName])=>{
                instance.exit();                
                return res.render('index', {reviews, productName, title: "TigerDirect Crawler"});
            }).catch((err) => {
                instance.exit();
                return res.status(500).render('error', { msg: err});
            });
        }
    }catch(e){
        console.log(e);
        return res.status(500).render('error', { msg: e});
    }
});

landingRouter.get('/', async (req,res) => {
    return res.render('index',{title:"TigerDirect Crawler"});
});    

module.exports = landingRouter;
