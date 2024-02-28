var express = require("express");
var app = express();
var mysql = require('mysql');

app.use(express.static("views")); 
app.use(express.static("images"));  

app.set('view engine', 'ejs'); // Set the template engine 

var bodyParser = require("body-parser") // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));



// ******************************** Start of SQL **************************************** //
// First we need to tell the application where to find the database
const db = mysql.createConnection({
// host: '127.0.0.1',
//     user: 'root',
//     port: '3306',
//     password: 'root',
//     database: 'mobileapp'
    host: 'den1.mysql1.gear.host',
    user: 'nci',
    password: 'Yo7A_B09i4?1',
    database: 'NCI'
 });

//  connection to the database

db.connect((err) =>{
     if(err){
        console.log("go back and check the connection details. Something is wrong.")
    } 
     else{
        console.log('Looking good the database connected')
    }
})// checking database connection


// **********************************  Code from here **************************
app.get('/', function(req,res){
    let sql = 'SELECT * FROM ruha';
    let query = db.query(sql, (err,result) => {
        if(err) throw err;
        console.log(result);
        res.render('home', {result})   
    });
    
})// going to the home page


app.get('/add', function(req,res){

    res.render('add')


})//going to the add page




app.post('/add', function(req,res){
    let sql = 'insert into ruha ( model, make,price,image) values (?, ?,?,?)';
    let query = db.query(sql,[req.body.model, req.body.make,req.body.price,req.body.image], (err,result) => {
        if(err) throw err;
        console.log(result);
        res.redirect( '/')   
    });//posting a new mobile on the add page
      
    
})

app.get('/individual/:id', function(req,res){    let sql = 'SELECT * FROM ruha WHERE id = ?';
let query = db.query(sql,[req.params.id], (err,result) => {
    if(err) throw err;
    console.log(result);
    res.render('individual', {result})   })

});// going to the page that filters the mobiles by id

app.get('/make/:model', function(req,res){   
    
    let sql = 'SELECT * FROM ruha WHERE model = ?';
let query = db.query(sql,[req.params.model], (err,result) => {
    if(err) throw err;
    console.log(result);
    res.render('model', {result})   })

});// going to the page that filters the mobile by make


   

    










// **********************************  Code to here **************************

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("New Full Demo is Live")
});