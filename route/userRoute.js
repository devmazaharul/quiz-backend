const { Hisab_user_model } = require("../model/Usermodel")

const user_router=require("express").Router()

user_router.get("/users",async(req,res)=>{

    try {
        const getAlluser=await Hisab_user_model.find()
        if(getAlluser.length>0){
            return res.json({data:getAlluser,status:200,msg:"Successfully "})
        } else{
            return res.json({data:getAlluser,status:200,msg:"Faild"})
        }
    } catch (error) {
        return res.json({status:500,msg:"Server error"})
    }

})






module.exports=user_router

