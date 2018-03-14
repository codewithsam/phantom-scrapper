const landingRouter = require('express').Router();
const validator = require('./../helpers/utils.js');
const phantom = require('phantom');
const evaluator = require('./../helpers/evaluator.js');

landingRouter.post('/', async (req,res) => {
    var t = req.body.query;
    t = t.trim();
    if(typeof t !== "string" || !validator.validateUrl(t) || !validator.subStrExists(t, "tigerdirect.com")){
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

            var reviewList = page.evaluate(evaluator.evaluateReviews);
            var prodName = page.evaluate(evaluator.evaluateProductName);
            var reviewCount = page.evaluate(evaluator.evaluateReviewCount);
            var overAllRating = page.evaluate(evaluator.overAllRating);
            var combinedPormises = [reviewList, prodName, reviewCount, overAllRating]; 
            
            Promise.all(combinedPormises).then((dump)=>{
                instance.exit();
                var combinedErrors = [];
                for(let i=0;i<dump.length;i++){
                    if(dump[i].errors.length > 0) combinedErrors.push(dump[i].errors);
                }
                if(combinedErrors.length> 0){
                    return res.status(500).render('error', { msg: combinedErrors});                
                }else{
                    return res.render('index', {
                        reviews: dump[0].result, 
                        productName: dump[1].result, 
                        reviewCount: dump[2].result, 
                        overAllRating: dump[3].result, 
                        title: "TigerDirect Crawler"
                    });                    
                }
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
