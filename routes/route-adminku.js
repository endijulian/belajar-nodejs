exports.login = function(req, res){
    var sess = req.session;
    var message = '';
    var md5 = require('md5');

    if (req.method == 'POST') {
        var post = req.body;
        var name = post.username;
        var password = post.email;
        var pass = md5(post.password);

        req.getConnection(function(err,connect){
            var sql = "SELECT id_admin, username, name, admin_level FROM admin_tbl WHERE username='"+name+"' AND password='"+pass+"'";
            var query   = connect.query(sql, function(err, results){
                if(results){
                    req.session.adminId = results[0].id_admin;
                    req.session.admin   = results[0];
                    console.log(results[0].id_admin);
                    res.redirect('./home');
                }else{
                    message = 'Username or password incorrect! please try again';
                    res.render('./admin/index', {
                        message: message,
                        sql: sql,
                    });
                }
            });
        });
    } else {
        res.render('./admin/index', {
            message: message
        });
    }
};

exports.home = function(req, res){

    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin='+ adminId);

    if(adminId == null){
        res.redirect('/express/admin/login');
        return;
    }
    
    req.getConnection(function(err, connect){
        var sql = "SELECT * FROM news_tbl ORDER BY createdate DESC";

        var query = connect.query(sql, function(err, results){
            res.render('./admin/home',{
                pathname : 'home',
                data : results,
            });
        });
    });

};

exports.add_news = function(req, res){
    res.render('./admin/home',{
        pathname : 'add_news',
    });
};

exports.edit_news = function(req, res){
    res.render('./admin/home',{
        pathname : 'edit_news',
    });
};