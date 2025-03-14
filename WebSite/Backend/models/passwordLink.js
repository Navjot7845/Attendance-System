import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const passwordLinkSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // ? The document will delete after 5 minutes automatically
  },
});

// * Function to send the otp mail
async function sendVerificationEmail(email, code) {
  try {
    const mailResponse = await mailSender(
      email,
      "Sora AI Password Reset",
      `<h1>
            You can change your password now
        </h1>
        <p>
            click here to continue: ${process.env.BACKEND_URL}/user/change-password/${code}
        </p>
        `
    );
    console.log("Password reset Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);

    throw error;
  }
}

// * To not return senstive info to client
passwordLinkSchema.toJSON = function () {
  const link = this;
  const linkObject = link.toObject();

  delete linkObject.code;
  delete linkObject.__v;

  return linkObject;
};

passwordLinkSchema.pre("save", async function (next) {
  console.log("Password reset link will be saved to the database");

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.code);
  }

  next();
});

const ResetCode = mongoose.model("ResetCode", passwordLinkSchema);

export default ResetCode;
