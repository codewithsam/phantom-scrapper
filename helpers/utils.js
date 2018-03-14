module.exports.validateUrl = function(url){
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    var regex = new RegExp(expression);
    if(typeof url ==="string")
        return (url.match(regex)) ? true: false;
    else
        return false;
}