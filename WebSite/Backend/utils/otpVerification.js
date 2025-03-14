import OTP from "../models/otp.js";

async function verifyOTP(req, res) {
  const otp = await OTP.find({ email: req.body.email })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!req.body.otp) {
    return res.status(400).json({ error: "The OTP is required" });
  }

  if (req.body.otp.length == 0 || req.body.otp != otp[0].otp) {
    return res.status(400).json({ error: "The OTP is not valid" });
  }

  await OTP.deleteMany({ email: req.body.email });
}

export default verifyOTP;
