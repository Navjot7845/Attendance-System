import otpGenerator from "otp-generator";
import OTP from "../models/otp.js";

// TODO: Modify this for login and signup

async function sendOTP(req, res) {
  try {

    // * 1. Take the email
    const { email } = req.body;

    // * 2. Generate the otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // * 3. Make sure the OTP is unique
    // ! This is a very rare case tho haha
    let result = await OTP.findOne({ otp: otp });

    // * 4. Gerate new OTP till it's unique
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    // * 5. Saves the unique OTP to the mongoDB database
    await OTP.create({ email, otp });

    console.log("Otp sent successfully")

    res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {

    console.log(error.message);
    
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default sendOTP;