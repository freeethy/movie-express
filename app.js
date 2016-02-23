var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var bodyParser= require('body-parser');
var port = process.env.PORT || 3000;
var Movie = require('./models/movie');
var app = express();
app.locals.moment = require('moment');

mongoose.connect('mongodb://localhost/imooc');

app.set('views','./views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
/*app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded*/
app.use(express.static(path.join(__dirname,'public')));
app.listen(port);

console.log('imooc started on port '+ port);

//index page
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('index',{
            title: 'imooc 首页',
            movies:movies
        });
    })
});

//detail page
app.get('/movie/:id',function(req,res){
    var id = req.params.id;
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title: 'imooc'+ movie.title,
            movie: movie
        });
    })
});

//admin page
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'imooc 后台录入页',
        movie: {
            title: "机械战警",
            doctor: "何塞·帕迪里亚",
            country: "America",
            language: "English",
            year: 2014,
            poster: "http://img4.douban.com/view/photo/photo/public/p2175671736.jpg",
            summary: "《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。"+
            "影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来",
            flash:'http://player.youku.com/player.php/sid/XMTQyMDEyNzAwOA==/v.swf'
        }
    });
});

//admin update movie
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:'imooc 后台更新页面',
                movie: movie
            })
        })
    }
})

//admin post movie
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !== 'undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }

            _movie = _.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    }else{
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })

        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)
        })
    }
});

//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('list',{
            title: 'imooc 列表页',
            movies:movies
        });
    })
});

//list delete movie
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id}, function (err,movie) {
            if(err){
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
});