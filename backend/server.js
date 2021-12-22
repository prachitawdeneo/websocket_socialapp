const express=require('express')
const PORT=8989;
const app=express();
const jwt=require('jsonwebtoken')
const jwtSecret='aaef4765879adfg579769e'
const cors=require('cors');
const mongoose=require('mongoose')
const http =require('http')
const httpServer=http.createServer(app);
const {Server}=require('socket.io');
const io = new Server(httpServer);
const { urlencoded } = require('express');
const {userPostModel, userRegisterModel}=require('./db/postSchema')
// const multer=require('multer')
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
// })
// var upload = multer({ storage: storage })
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());

 
//db connection
const db="mongodb://localhost:27017/social_app";
const connectDB=async()=>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true});
        console.log("MOngoDB connected");
    }
    catch(err){
        console.log(err.message);
    }
}
connectDB();

io.on('connection',(socket)=>{
    console.log("User Connected")   
    
    socket.on('message', (cmt) => {
        console.log(cmt)
        // console.log(id)
        
        userPostModel.updateOne({_id:cmt.id},{$push:{comment:{email:cmt.uid,data:cmt.data}}}, function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        })
            // io.emit('chat message', msg);
        
    }); 
    
})





function autenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    console.log(token)
    if(token==null){
        res.json({"err":1,"msg":"Token not match"})
    }
    else {
        jwt.verify(token,jwtSecret,(err,data)=>{
            if(err){
                res.json({"err":1,"msg":"Token incorrect"})
            }
            else {
                console.log("Match")
                next();
            }
        })
    }
}

app.get('/getuser',(req,res)=>{
    userRegisterModel.find({},(err,data)=>{
        if (err) {
            res.json({"err":1,"msg":"Something went wrong"})
        }
        else if(data===null && data.length<=0){
            res.json({"err":1,"msg":"Nothing to add"})
        }
        else{
            res.json({"err":0,"regUser":data})
        }
    })
})

app.post('/adduser',(req,res)=>{
    let name=req.body.name;
    let email=req.body.email
    let mobile=req.body.mobile;
    let address=req.body.address;
    let password=req.body.password;
    let con_password=req.body.con_password;
    //insert data
    let ins=new userRegisterModel({name:name,email:email,mobile:mobile,address:address,password:password,con_password:con_password});
    ins.save((err)=>{
        if(err){ res.send(err)}
        else{
        console.log("User Added!")
        // res.redirect('/login')
        }
    })
})
app.post('/loguser',(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
    userRegisterModel.findOne({email:email,password:password},(err,data)=>{
        console.log(email);
        if(err){
            res.json({"err":1,"msg":"Email or password is not correct"})
        }
        else if(data==null)
        {
            res.json({"err":1,"msg":"Email or password is not correct"})
        }
        else {
            let payload={
                uid:email
            }
            const token=jwt.sign(payload,jwtSecret,{expiresIn:360000})
            res.json({"err":0,"msg":"Login Success","token":token})
        }
        
    })
})

app.post('/addpost',(req,res)=>{
    // console.log(req.file)
    console.log(req.body);
    let title=req.body.title;
    let desc=req.body.desc
    let email=req.body.email;
    //insert data
    let ins=new userPostModel({title:title,desc:desc,email:email});
    ins.save((err)=>{
        if(err){ res.send(err)}
        else{
        console.log("Post Added!")
        // res.redirect('/login')
        }
    })
})

app.get('/getpost',(req,res)=>{
    userPostModel.find({},(err,data)=>{
        if (err) {
            res.json({"err":1,"msg":"Something went wrong"})
        }
        else if(data===null && data.length<=0){
            res.json({"err":1,"msg":"Nothing to add"})
        }
        else{
            res.json({"err":0,"post":data})
        }
    })
})

httpServer.listen(PORT,(err)=>{
    if (err) throw err;
    console.log(`Work on ${PORT}`);
})