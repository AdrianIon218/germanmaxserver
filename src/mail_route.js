const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const sendMailWithCode = require("./send_mail");

const addTimerToDeleteTheCode = (email) => {
   setTimeout(
     async () => {
      const { error } = await supabase.from('expiring_code').delete().eq('email', email);
      if(error){
         console.error(error,`\nCould not delete the expiring code for email: ${email}`);
       }
     },
     10 * 60 * 1000,
   );
 };

router.post("/", async (req, res) => {
   const failReq = ()=>{
      res.json({status:"failed"});
   }
   const successReq = (email)=>{
      const expire_at = new Date();
      expire_at.setMinutes(expire_at.getMinutes() + 10);
      const expire_date = expire_at.toLocaleTimeString().replace("AM", "").replace("PM", "").trim();
      addTimerToDeleteTheCode(email);
      res.json({status:"ok", dateToExpire: expire_date});
   }
   const { email, code } = req.body;
   const mailObj = { to:email, code, failReq, successReq };

   try{
     await sendMailWithCode(mailObj);
   }
   catch(err){
     failReq();
   }
})

module.exports = router;