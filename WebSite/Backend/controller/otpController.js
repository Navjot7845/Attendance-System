import { generateOTP } from "../config/database.js";
import mailSender from "../utils/mailSender.js";

// TODO: Modify this for login and signup

async function sendOTP(req, res) {
  try {

    // * 1. Take the email
    const { email } = req.body;

    // * 2. Generate the OTP and save it
    let otp = await generateOTP(email);

    await mailSender(email, "Attendance Verification OTP", 
      `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`)

    console.log("Otp sent successfully")

    res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {

    console.log(error.message);
    
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default sendOTP;