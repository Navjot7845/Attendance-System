import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {

    // ? Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      secure: true,
      host: process.env.EMAIL_HOST,
      port:465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASS,
      }
    });

    // * Send emails to users
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email info: ", info);

    return info;
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;