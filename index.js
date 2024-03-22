var express = require("express");
const multer = require('multer');
const path = require('path');
const sharp = require('sharp')
const fs = require('fs');// creating variables to use all the installed dependancies  

var app = express();
var mysql = require('mysql');

app.use(express.static("views")); 
app.use(express.static("images"));  
app.use(express.static("style"));  
app.use(express.static("partials")); // instructing the app to use the folders created in the project
app.set('view engine', 'ejs'); // Set the template engine 

var bodyParser = require("body-parser") // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/');
    },
   
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
   
  var upload = multer({ storage: storage })

  app.use(express.static("uploads"));
  app.use(express.static("uploads/resized"));// setting up where to store the uploaded images





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




app.post('/add',upload.single("image"), async function(req,res){
    const {filename:image} = req.file;
    await sharp(req.file.path)
    .resize(500,500)
    .jpeg({ quality:90})
    .toFile(
        path.resolve(req.file.destination,'resized',image)
    )
    
//     sharp.jpeg((err) =>{
//         if(err){
//            alert("Upload correct file type");
//        } 
//         else{
//            alert('Looking good , uploaded');
//        }
//    })


    let sql = 'insert into ruha ( model, make,price,image) values (?, ?,?,?)';
    let query = db.query(sql,[req.body.model, req.body.make,req.body.price,req.file.filename], (err,result) => {
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

// app.get('/upload', function(req,res){
 
//     res.render( 'upload')   


// })                  THIS CODE WAS USED TO ADD THE UPLOAD OPTION FOR THE WEBSITE, CURRENTLY NOT USED AS A PAGE

// app.post('/upload', upload.single("image"), async function(req, res){
//     const { filename: image } = req.file;      
//     await sharp(req.file.path)
//         .resize(500, 500)
//         .jpeg({ quality: 90 })
//         .toFile(
//             path.resolve(req.file.destination,'images',image)
//         )
        
  
  
    
//     res.redirect('/');
//   });
// uploads page   THIS CODE WAS USED TO ADD THE UPLOAD OPTION FOR THE WEBSITE, CURRENTLY NOT USED AS A PAGE


   

    
app.get('/delete/:id', function(req,res){    
    let sql = 'DELETE FROM ruha WHERE id = ?';
let query = db.query(sql,[req.params.id], (err,result) => {
    if(err) throw err;
    console.log(result);
    res.redirect('/')   })

}); // THIS lets you delete a phone



app.get('/error', function(req,res){

    res.render('notfound')
  
  
  })
  
  app.get('/servererror', function(req,res){
  
    res.render('broken')
  
  
  })


  app.use((req, res, next) => {
    res.status(404);
    res.redirect('/error'); // Render a specific 404 page
    // or
    // res.json({ error: 'Not Found' }); // Send a JSON response
  });
  
  // Global error handling
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500);
    res.redirect('/servererror'); // Render a general error page
    // or
    // res.json({ error: 'Internal Server Error' }); // Send a JSON response
  });
  


// **********************************  Code to here **************************

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("New Full Demo is Live")
});