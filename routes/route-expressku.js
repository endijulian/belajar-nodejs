exports.home = function(req, res){
    req.getConnection(function(err,connect){
        var query   = connect.query('SELECT * FROM news_tbl', function(err, rows){
            if(err){
                console.log('Error Message : ', err);
            }
            res.render('home', {
                page_title : 'Express News',
                data : rows,
            });
        });
    });
}
exports.about = function(req, res){
    res.render('about');
}
exports.contact = function(req, res){
    res.render('contact');
}
exports.gallery = function(req, res){
    res.render('gallery');
}
exports.news = function(req, res){
    // res.render('news');
    req.getConnection(function(err,connect){
        var query   = connect.query('SELECT * FROM news_tbl', function(err, rows){
            if(err){
                console.log('Error Message : ', err);
            }
            res.render('news', {
                page_title : 'Express News - News',
                data : rows,
            });
        });
    });
}

exports.news_detail = function(req, res){
    var id_news = req.params.id_news;
    req.getConnection(function(err,connect){
        var query   = connect.query('SELECT * FROM news_tbl WHERE id_news=?', id_news, function(err, rows){
            if(err){
                console.log('Error Message : ', err);
            }
            res.render('news_detail', {
                page_title : 'Details News',
                data : rows,
            });
        });
    });
}
