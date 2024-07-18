const userRoute = require("express").Router();
const { QuizModel } = require("../model/Quizmodel");
const {Adminlogimodel}=require("../model/AdminModel")
const randomString=require('randomstring')
const { sendEmail } = require("../config/Mailer");
const { certificateModel } = require("../model/certificateModel");

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
        const mailBody = `Your confirmation code is ${genarateCode} to login your dashboard.`;
        await sendEmail(email, genarateCode+"-"+"Your confirmation code", mailBody);
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
        return res.status(202).json({message:"OTP must be 5 digit "})
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


userRoute.post("/deletequiz",async(req,res)=>{
  try {
    const {quizid}=req.body;
    const findQuizmodel=await QuizModel.findOne({quizId:quizid})
    if(findQuizmodel){
      const dltQuery=await QuizModel.deleteOne({quizId:quizid})
      if(dltQuery){
        return res.status(200).json({message:"Successfully delete quiz "})
      }else{
        return res.status(201).json({message:"Faild to delete quiz "})
      }
    }else{
      return res.status(202).json({message:"No quiz fount "})
    }
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
})


userRoute.post("/genaratecertificate",async(req,res)=>{
  try {
    const {info}=req.body
    const {candidateName,candidateNumber,candidateGrade,candidateTitle}=info


    if(info.candidateName!=="" && info.candidateNumber.length==11 && info.candidateNumber!=="" && info.candidateGrade!=="" && info.candidateTitle!==""){
      const findCertificate=await certificateModel.findOne({candidateNumber:info.candidateNumber})
      if(!findCertificate){
        const candirateId=randomString.generate({length:5,charset:"numeric"})
        const insertCertificateInfo=new certificateModel({

          crId:candirateId,
          candidateName,
          candidateNumber,
          candidateGrade,
          candidateTitle,
          genarateDate:new Date().toLocaleDateString()+" - " + new Date().toLocaleTimeString()
        })

        const saveQ=await insertCertificateInfo.save()
        if(saveQ){
         
          return res.status(200).json({message:"Successfully Genarate certificate"})
        }else{
          return res.status(201).json({message:"Faild to Genarate certificate"})
        }
      }else{
        return res.status(202).json({message:"Already have a Certificate this number"})
      }
    }else{
      return res.status(203).json({message:"Empty boxes or Number must be 11 digit "})
    }
  } catch (error) {
    return res.status(500).json({message:"Server error"})
  }
})


userRoute.get("/getcertificates",async(req,res)=>{
  try {
    const getCertificates=await certificateModel.find()
    if(getCertificates.length>0){
      return res.status(200).json({info:getCertificates})
    }else{
      return res.status(201).json({message:"Faild",data:null})
    }
  } catch (error) {
    return res.status(500).json({message:"Server error"})
  }
})

userRoute.post("/getcertificate",async(req,res)=>{
  try {
    const {id}=req.body;

    const singleCertificate=await certificateModel.findOne({crId:id})
    if(singleCertificate){
      return res.status(200).json({message:"Successfully get certificate",data:singleCertificate})
    }else{
      return res.status(201).json({message:"Faild to get certificate "})
    }
  
  } catch (error) {
    return res.status(500).json({message:"Server error"})
  }
})

module.exports = { userRoute };
 