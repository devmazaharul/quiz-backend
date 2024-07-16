const userRoute = require("express").Router();
const { QuizModel } = require("../model/Quizmodel");
const {Adminlogimodel}=require("../model/AdminModel")
const randomString=require('randomstring')
const { sendEmail } = require("../config/Mailer");

userRoute.get("/allquiz", async(req,res)=>{
    try {
        
        const getQuizquery=await QuizModel.find()
        if(getQuizquery.length>0){
          res.json(getQuizquery)
            return {message:"Success",data:getQuizquery,status:200}
        }else{
          return {message:"faild to fetch quiz data",status:201}
        }

    } catch (error) {
        return {message:"server error",status:500}
    }
});
userRoute.get("/getadmininfo", async(req,res)=>{
    try {
        const getAdminquery=await Adminlogimodel.findOne({email:"expertmazaharul@gmail.com"})
        if(getAdminquery){
            return res.status(200).json({message:"Success",data:getAdminquery})
        }else{
          return res.status(201).json({message:"faild to fetch Admin info "})
        }
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
});

userRoute.post("/api/verifyadmin", async (req, res) => {
  try {
    const { email, code_send_status } = req.body;
    if (code_send_status) {
      const genarateCode = await randomString.generate({
        charset: "numeric",
        length: 5,
      });
      const findAdmin = await Adminlogimodel.findOne({ email });
     
      if (findAdmin) {
        findAdmin.loginCode = genarateCode,
          findAdmin.adminStatus = "authorize";
       
        await findAdmin.save();
        const mailBody = `Your confirmation code is ${genarateCode}`;
        await sendEmail(email, "Confirmation code", mailBody);
        return res.status(200).json({ message: "Successfully send email"});
      } else {
        return res.status(201).json({ message: "Faild to send email" });
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server error " });
  }
});


userRoute.post("/api/verifyadmincode",async(req,res)=>{
    try {
        const loginCode=req.body.confirm_code
        const macthcode=await Adminlogimodel.findOne({email:"expertmazaharul@gmail.com",loginCode:loginCode})
     if(loginCode.length==5){
      const toNum=parseInt(macthcode.totalLogin)
        if(macthcode){
            macthcode.loginCode=loginCode
            macthcode.adminStatus="authorize",
            macthcode.totalLogin=toNum+1
            macthcode.lastLogin=new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString();
            await macthcode.save()
            
            return res.status(200).json({message:"Succees",token:macthcode.id})
        }else{
            return res.status(201).json({message:"Faild "})
        }
     }else{
        return res.status(202).json({message:"OTP musb be 5 digit "})
     }

        
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
})


userRoute.post("/api/add-quiz",async(req,res)=>{
  try {
    const {title,desc}=req.body.data;
    if(title.length>5 && desc.length>10){
    const genId=await randomString.generate({charset:"numeric",length:6})
      const addQuizquer=new QuizModel({
        quizId:genId,
        title,
        desc,
        insertDate:new Date().toLocaleDateString()+ " - "+new Date().toLocaleTimeString()
      })
      
     const saveQuiq=await addQuizquer.save()
     if(saveQuiq){
      return res.status(200).json({message:"Success",data:genId})
     }else{

      return res.status(201).json({message:"faild "})
     }
    }else{
      return res.status(202).json({message:"Title length min 5 and description min 10 digit "})
    }

  
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
})


module.exports = { userRoute };
