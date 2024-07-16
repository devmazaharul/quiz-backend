const mongoose=require("mongoose")
const AdminloginSchima=mongoose.Schema({
    id:String,
    name:{
        type:String,
        require:true,
    },email:{
        type:String,
        require:true
    },
    loginCode:{
        require:true,
        type:Number
    },
    adminStatus:{
  
        type:String
    },
    totalLogin:{
        type:String,
        require:true,
    },
    lastLogin:{
        type:String,
        require:true
    }
})

 const Adminlogimodel=mongoose.models.adminlogin || mongoose.model("adminlogin",AdminloginSchima)
 module.exports={Adminlogimodel}

