

exports.onFail = function(req,res) {
    
};

exports.isAuthenticated = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        exports.onFail(req,res);
    }
}
