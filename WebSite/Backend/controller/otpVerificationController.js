import { findOTP, deleteOTP } from "../config/database.js";

async function verifyOtp(res, email, otp) {

    // * 1. Here we check if the OTP exists or not
    if (!otp) {
        return res.status(400).json({ error: "The OTP is required" });
    }

    // * 2. Check for the OTP related to this email
    const storedOTP = await findOTP(email);

    if (!storedOTP || otp !== storedOTP) {
        return res.status(400).json({ error: "The OTP is not valid" });
    }

    // * 3 Delete the OTP
    await deleteOTP(email);
}

export default verifyOtp;

