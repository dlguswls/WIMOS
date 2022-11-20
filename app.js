const mysql = require('mysql')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const { response } = require('express')
//비밀번호 암호화
// const hash = crypto.createHAhs('sha1');
// hash.update(password);
// hash.digest('hex');
var options = {
    host:'localhost',
    user:'root',
    password:'DLguswls11!!',
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
        // const[,privateKey] = req.headers.cookie.split('=');
        // const userInfo = session[privateKey];
        // res.render('main_u',{
        //     isLogin:true,
        //     // userInfo,
        // });
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
    con.query(query, (err, result)=>{
        err ? res.send(err) : res.render("main", {data: result});
    })
});
app.get('/Retro',(req, res)=>{
    let query = "SELECT * from furniture where label='레트로' Order by rand()";    
    con.query(query, (err, result)=>{
        err ? res.send(err) : res.render("main", {data: result});
    })
});
app.get('/Romantic',(req, res)=>{
    let query = "SELECT * from furniture where label='로맨틱' Order by rand()";    
    con.query(query, (err, result)=>{
        err ? res.send(err) : res.render("main", {data: result});
    })
});
app.get('/NorthernEurope',(req, res)=>{
    let query = "SELECT * from furniture where label='북유럽' Order by rand()";    
    con.query(query, (err, result)=>{
        err ? res.send(err) : res.render("main", {data: result});
    })
});

//로그인 페이지
app.get('/login',(req, res)=>{
    res.render("login");
});
app.post('/login',(req,res)=>{
    const ID = req.body.ID;
    const password = req.body.password;
    con.query('SELECT * FROM customer where id=? AND password = ?',[ID, password], function(err, results){
        if (err) throw err;
        if (results.length!=0){
            req.session.id = ID;
            req.session.loggedin = true;
            res.send("<script>location.href='/'</script>");
        }else{
            res.send("<script>alert('다시 입력해주세요');location.href='/login'</script>");
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
app.get('/community',(req, res)=>{
    res.render("main");
});

//마이페이지

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));