const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const sendMailWithCode = async (mailObj) => {
  const { to, code, failReq, successReq} = mailObj;
  const emailSender = process.env.USER;

  try {
    let transporter = nodemailer.createTransport({
      service: "yahoo",
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: false,
      auth: {
        user: emailSender,
        pass: process.env.PASS,
      },
      logger: true,
    });

    return ejs.renderFile(
      path.resolve(__dirname, "mail.ejs"),
      { code: code },
      (err, data) => {
        if (err) {
          console.log(err);
          failReq()
        } else {
          transporter.sendMail(
            { from: emailSender, to: to, subject: "Resetare parolă cont GermanMax", text: "", html: data },
            (error, info) => {
              if (error) {
                console.log(error);
                transporter.close();
                failReq();
              } else { 
                transporter.close();
                console.log("Email sent: " + info.response);
                successReq(to);
              }
            },
          );
        }
      },
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`,
    );
  }
};

module.exports = sendMailWithCode;
