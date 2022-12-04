const mysql = require('mysql')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const { response } = require('express')
const multer = require("multer")
//비밀번호 암호화
// const hash = crypto.createHAhs('sha1');
// hash.update(password);
// hash.digest('hex');
var options = {
    host:'localhost',
    user:'newuser',
    password:'1111',
    database:'my_db'
}

const con = mysql.createConnection(options)

const app = express()
const port = 3000
const sessionStore = new MySQLStore(options);

app.use(session({
    secret:'guswlscodnjs',
    resave:false,
    saveUninitialized:true,
    store:sessionStore
}));

con.connect(function(err){
    if (err) throw err;
    console.log('Connected');
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs'); // 템플릿 엔진에 ejs 이용하기 위한 설정

//메인 페이지
app.get('/',(req, res)=>{
    let query = "SELECT * from furniture Order by rand()";
    if(req.session.loggedin == true){
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main_u", {data: result});
        })
    }else{
        let query = "SELECT * from furniture Order by rand()";
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main", {data: result});
        })
    }
    
});

//필터링 페이지
app.get('/Modern',(req, res)=>{

    let query = "SELECT * from furniture where label='모던시크' Order by rand()";
    if(req.session.loggedin == true){
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main_u", {data: result});
        })
    }else{
            con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main", {data: result});
        })
    }

});
app.get('/Retro',(req, res)=>{  
    let query = "SELECT * from furniture where label='레트로' Order by rand()";
    if(req.session.loggedin == true){
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main_u", {data: result});
        })
    }else{
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main", {data: result});
        })
    }
});
app.get('/Romantic',(req, res)=>{
    let query = "SELECT * from furniture where label='로맨틱' Order by rand()";    
    if(req.session.loggedin == true){
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main_u", {data: result});
        })
    }else{
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main", {data: result});
        })
    }
});
app.get('/NorthernEurope',(req, res)=>{
    let query = "SELECT * from furniture where label='북유럽' Order by rand()";    
    if(req.session.loggedin == true){
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main_u", {data: result});
        })
    }else{
        con.query(query, (err, result)=>{
            err ? res.send(err) : res.render("main", {data: result});
        })
    }
});


//로그인 페이지
var uid="uid"

app.get('/login',(req, res)=>{
    res.render("login");
});
app.post('/login',(req,res)=>{
    const ID = req.body.ID;
    uid = ID
    const password = req.body.password;
    con.query('SELECT * FROM customer where id=? AND password = ?',[ID, password], function(err, results){
        if (err) throw err;
        if (results.length!=0){
            req.session.userid = ID;
            req.session.loggedin = true;
            res.send("<script>location.href='/'</script>");
        }else{
            res.send(`<script>alert('${ID}님, 다시 입력해주세요');location.href='/login'</script>`);
        }
    })
})

//회원가입 페이지
app.get('/registor',(req, res)=>{
    res.render("registor");
});
app.post('/registor', (req, res)=>{
    const ID = req.body.ID;
    const password = req.body.password;
    const email = req.body.email;
    // const pwHash = getHash(password);
    
    con.query('SELECT * FROM customer where id=?',[ID], function(err, results, fields){
        if (err) throw err;
        if (results.length <=0){
            con.query('INSERT INTO customer (id, password, email) VALUES (?,?,?)',[ID,password,email])
            res.send("<script>location.href='/'</script>");
        }else{
            res.send("<script>alert('해당 ID가 이미 존재합니다');location.href='/registor'</script>");
        };     
    });
});

//로그아웃
app.get('/logout',(req, res)=>{
    req.session.loggedin = false;
    res.send("<script>location.href='/'</script>");
})
   
//커뮤니티 페이지
// 데이터 조회​
app.get('/community', function(req, res, next) {
    // var page = req.params.page;
    var sql = "select idx, name, title, hit,date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from board";
    con.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('list', {title: '게시판 리스트', rows: rows});
    });
});

// app.get('/community', function(req, res, next) {
//     res.redirect('/community/1');
// });

  // 데이터 추가​
app.get('/create',(req, res)=>{
    res.render("write",{title : "게시판 글 쓰기"});
});

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb('', "public/images/");
    },
    filename:function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb('', path.basename(file.originalname, ext) + "-" + Date.now() + ext);
    },
});
var upload = multer({storage:storage});
app.post('/create', upload.single("image"), (req, res)=>{
    const name = req.body.name;
    const title = req.body.title;
    const content = req.body.content;
    const passwd = req.body.passwd;
    const image = `/images/${req.file.filename}`;
    const datas = [name, title, content, passwd, image];
    const sql = `insert into board(name, title, content, regdate, modidate, passwd, hit, image) values(?,?,?,now(),now(),?, 0, ?)`
    con.query(sql, datas)
    res.send("<script>location.href='/community'</script>");
})
    
    
app.get('/read/:idx',function(req,res,next)
{
var idx = req.params.idx;
    var sql = "select idx, name, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit,image from board where idx=?";
    con.query(sql,[idx], function(err,row)
    {
        if(err) console.error(err);
            res.render('read', {title:"글 상세", row:row[0]});
    })
    var hit = req.body.hit;
    data = [idx,hit];
    var sql2 = "update board set hit=hit+1 where idx=?";
    con.query(sql2,data, function(err,result)
    {
        if(err) console.error(err);
    });
    
});

//data 수정
app.post('/update',upload.single("image"),function(req,res,next)
{
    var idx = req.body.idx;
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name,title,content,idx,passwd];
 
 
    var sql = "update board set name=? , title=?,content=?, modidate=now() where idx=? and passwd=?";
    con.query(sql,datas, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows == 0)
        {
            res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
        }
        else
        {
            res.redirect('/read/'+idx);
        }
    });
});

//마이페이지
app.get('/mypage',(req, res)=>{
    res.render('mypage');
});

app.get('/mypage',(req, res)=>{
    let query = 'select SUBSTRING_INDEX(SUBSTRING_INDEX(data,\'\"\',-4),\'\"\',1) as userid from sessions;';    
    con.query(query, (err, result)=>{
        err ? res.send(err) : res.render("mypage", {data: result});
        })
    });

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));