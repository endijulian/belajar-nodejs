exports.login = function(req, res){
    res.render('./admin/index');
};

exports.home = function(req, res){
    res.render('./admin/home',{
        pathname : 'home',
    });
};