import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASS,
  },
});

async function mailSender(to, subject, content) {
  try {
    await transporter.sendMail({
      from: `"Attendance system 👻" <${process.env.EMAIL}>`,
      to: `${to}`,
      subject: `${subject}`,
      text: `${content}`,
      html: `<b>${content}</b>`, 
    });
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }
}

export default mailSender;
