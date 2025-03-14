import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // ? The document will delete after 5 minutes automatically
  },
});

// * Function to send the otp mail
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(email, "Sora AI OTP Verification",
      `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

// * This saves the OTP to the database and sends it
otpSchema.pre('save', async function (next) {
  console.log("New OTP will be saved to the database");

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }

  next();
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
