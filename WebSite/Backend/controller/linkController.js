import otpGenerator from "otp-generator";
import { findResetCode, saveResetCode } from "../config/database.js";

// TODO: Modify this for login and signup

async function sendResetLink(email) {
  try {

    // * 1. Generate the link
    let linkCode = otpGenerator.generate(16, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });

    // * 2. Make sure the Link is unique
    let result = await findResetCode(linkCode);

    // * 3. Gerate new Link till it's unique
    while (result) {
        linkCode = otpGenerator.generate(16, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
            specialChars: false,
        });

      result = await findResetCode(linkCode);
    }

    console.log(`The link code is ${linkCode}`);
    // * 4. Saves the unique OTP to the mongoDB database
    await saveResetCode(email, linkCode);

  } catch (error) {

    console.log(error.message);
    
    return Error({ success: false, error: error.message });
  }
};

export default sendResetLink;