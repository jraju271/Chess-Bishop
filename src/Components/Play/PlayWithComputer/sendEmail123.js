// const nodemailer = require("nodemailer");

// const MailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.Mail_User,
//     pass: process.env.Mail_Password,
//   },
// });

// async function Send_Email_PDF(toEmail, originalname, buffer) {
//   try {
//     const mailOptions = {
//       from: process.env.Mail_User, // Sender's email
//       to: toEmail, // Recipient's email
//       //cc: ccEmails.length ? ccEmails : undefined,
//       subject: "Chess Performance Report",
//       //text: `Hi ${name},\n\nYour quiz score is ${quizScore}.\n\nPlayer Category: ${category}.\n\nPlease find your performance report attached.`,
//       text: `Hi,\n\nPlease find your performance report attached.`,
//       attachments: [
//         {
//           filename: originalname,
//           content: buffer, // Attach the file buffer
//         },
//       ],
//     };

//     await MailTransporter.sendMail(mailOptions);
//     console.log("Email sent successfully to:", toEmail);
//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return false;
//   }
// }

// module.exports = { Send_Email_PDF };



import nodemailer from 'nodemailer';

const MailTransporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.Mail_User,
    pass: process.env.Mail_Password,
  },
});

export async function Send_Email_PDF(toEmail, originalname, buffer) {
  try {
    const mailOptions = {
      from: process.env.Mail_User, // Sender's email
      to: toEmail, // Recipient's email
      //cc: ccEmails.length ? ccEmails : undefined,
      subject: 'Chess Performance Report',
      //text: `Hi ${name},\n\nYour quiz score is ${quizScore}.\n\nPlayer Category: ${category}.\n\nPlease find your performance report attached.`,
      text: `Hi,\n\nPlease find your performance report attached.`,
      attachments: [
        {
          filename: originalname,
          content: buffer, // Attach the file buffer
        },
      ],
    };

    await MailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', toEmail);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}