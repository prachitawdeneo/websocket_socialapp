const mongoose=require('mongoose');

const userRegSchema=new mongoose.Schema({
    name:{
        type: String,
        required:'This field is required'
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true        
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    con_password:{
        type:String,
        required:true
    }

})

const userPostSchema=new mongoose.Schema({
    title:{
        type: String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true,
        
    },
    // image:{
    //     type:String,
    //     required:true,
    // },
    date:{
        type:Date,
        default:Date.now
    },
    comment:{
        type:Array
        
    },
    email:{
        type:String,
        required:true,
    }
})

const userPostModel=mongoose.model('post',userPostSchema)
const userRegisterModel=mongoose.model('userReg',userRegSchema)

module.exports={userRegisterModel,userPostModel};
