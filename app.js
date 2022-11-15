//git push 테스트///?????

const mysql = require('mysql')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
// import mysql from mysql
// import path from path
// import express from express
// import bodyParser from "body-parser"
// import { filtervalue } from "./public/javascripts/scripts.js"

const app = express()
const port = 3000


const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'DLguswls11!!',
    database:'my_db'
});

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
    // if (filtervalue != 'all'){
    //     query = `SELECT * from test where label='${filtervalue}'`;
    // }
    con.query(query, (err, result)=>{
        err ? res.send(err) : res.render("main", {data: result});
    })
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
//회원가입 페이지
//커뮤니티 페이지
//마이페이지

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));