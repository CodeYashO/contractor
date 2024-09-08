const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.email",
      port: 587,
      auth: {
        user: "dubeyyash2422@gmail.com",
        pass: "dgji hzmg zvyk qfrw",
      },
    }); 

    const info = await transporter.sendMail({   
      from: "dubeyyash2422@gmail.com",
      to: email,  
      subject: subject,
      text: message, 
    }); 

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error); 
  }  
}; 

module.exports = sendEmail;
