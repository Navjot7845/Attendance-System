import { findOTP, deleteOTP } from "../config/database.js";

async function verifyOtp(res, email, otp) {
    const storedOTP = await findOTP(email);

    if (!storedOTP || otp !== storedOTP) {
        return res.status(400).json({ error: "The OTP is not valid" });
    }

    await deleteOTP(email);
}

export default verifyOtp;

