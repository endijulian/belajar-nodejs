var multer = require('multer');

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

exports.process_add_news = function(req, res){
    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback){
            callback(null, file.originalname);
        }
    });

    var upload = multer({
        storage:storage,
    }).single('image');

    var date = new Date(Date.now());

    upload(req, res, function(err){
        if(err){
            return res.send('Error uploading image!');
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect){
            var post = {
                title: req.body.title,
                description: req.body.description,
                images: req.file.filename,
                createdate: date,
            }

            console.log(post);

            var sql = "INSERT INTO news_tbl SET ?";
            var query = connect.query(sql, post, function(err, results){
                console.log(query);
                if(err){
                    console.log('Error input news: %s', err);
                }

                req.flash('info', 'Created has been success');
                res.redirect('/express/admin/home');
            });
        });
    });
}

exports.edit_news = function(req, res){

    //mengambil id dari table newws
    var id_news = req.params.id_news

    req.getConnection(function(err, connect){
        var sql = "SELECT * FROM news_tbl WHERE id_news=?";

        var query = connect.query(sql, id_news, function(err, results){
            if(err){
                console.log('error show news: %s', err);
            }

            res.render('./admin/home',{
                id_news: id_news,
                pathname : 'edit_news',
                data: results
            });
        });
    });

};

exports.update_edit_news = function(req, res){
    var id_news = req.params.id_news;

    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback){
            callback(null, file.originalname);
        }
    });

    var upload = multer({storage:storage, }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err){
        if(err){
            var image = req.body.image_old;
            console.log("Error uploading image");
        }else if(req.file == undefined){
            var image = req.body.image_old;
        }else{
            var image = req.file.filename;
        }

        console.log(req.file);
        console.log(req.body);


        req.getConnection(function(err, connect){
            var post = {
                title: req.body.title,
                description: req.body.title,
                images: image,
                createdate: date,
            }
            
            var sql = "UPDATE news_tbl SET ? WHERE id_news=?";

            var query = connect.query(sql, [post, id_news], function(err, results){
                if(err){
                    console.log('Error edit news :', err)
                }

                req.flash('info', 'Succes edit data');
                res.redirect('/express/admin/home');
            });
        });
    });
}

exports.delete_news = function(req, res){
    var id_news = req.params.id_news;

    req.getConnection(function(err, connect){
        var sql = "DELETE FROM news_tbl WHERE id_news=?";

        var query = connect.query(sql, id_news, function(err, results){
            if(err){
                console.log("Error delete news: ", err);
            }

            res.redirect('/express/admin/home');
        });
    });
}