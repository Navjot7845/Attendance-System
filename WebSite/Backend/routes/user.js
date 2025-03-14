import { Router } from "express";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import sendOTP from "../controller/otpController.js";
import OTP from "../models/otp.js";
import sendResetLink from "../controller/linkController.js";
import ResetCode from "../models/passwordLink.js";

const userRoutes = Router();

/*  
* This route takes [name, username, email, password, otp]
* for signingup the users
*/
userRoutes.post('/signup', async (req, res) => {
    try {

        const otp = await OTP.find({ email: req.body.email }).sort({ createdAt: -1 }).limit(1);

        if (!req.body.otp) {
            return res.status(400).json({ error: "The OTP is required" });
        }

        if ( (req.body.otp).length == 0 || req.body.otp != otp[0].otp) {
            return res.status(400).json({ error: "The OTP is not valid" });
        }

        await OTP.deleteMany({ email: req.body.email });

        const user = await User.create(req.body);

        const token = await user.generateAuthToken();

        console.log(`User created: ${user}`);

        res.status(201).json({ user, token });

    } catch (error) {
        console.error(`Error creating user: ${error.message}`);

        if (error.code === 11000) {
            return res.status(409).json({ error: "Email or username already exists" });
        }

        if (error.message.includes('minimum allowed length')) {
            return res.status(409).json({ error: "Minimum length of your password should be 7" });
        }

        if (error.message.includes('maximum allowed length')) {
            return res.status(409).json({ error: "Username's length should be less than 17" });
        }

        res.status(400).json({ error: error.message });
    }
});


// ! This route is to be called before login and signup
userRoutes.post('/send-otp', sendOTP);


// * Login route which return JWT Token
// * This route takes [email, password, otp]
userRoutes.post('/login', async (req, res) => {
    try {

        const otp = await OTP.find({ email: req.body.email }).sort({ createdAt: -1 }).limit(1);

        if (!req.body.otp) {
            return res.status(400).json({ error: "The OTP is required" });
        }

        if ( (req.body.otp).length == 0 || req.body.otp != otp[0].otp) {
            return res.status(400).json({ error: "The OTP is not valid" });
        }

        await OTP.deleteMany({ email: req.body.email });

        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.status(201).json({ user, token });

    } catch (error) {
        console.error(error);

        if (error.message === "Email is invalid" || error.message === "Wrong password entered") {
            return res.status(401).json({ error: "Invalid email or password entered" }); // Use 401 for authentication failures
        }

        res.status(500).json({ error: "Internal Server Error" }); // 500 for unexpected errors
    }
});


// * LogOut Route
// TODO This should be .delete request
userRoutes.patch('/logout', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $pull: { tokens: { token: req.token } } }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.status(200).send({ message: "Logged out successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


// * Get user via id
userRoutes.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(`Got user ${user}`);

        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// TODO make a forgot password route which sends email to user.
userRoutes.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(`Got user ${user}`);

        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        sendResetLink(req.body.email);

        res.status(200).json({message: "Reset password email sent successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

// * This route is to change the password of the user
userRoutes.patch('/change-password/:code', async (req, res) => {
    try {
        const code = await ResetCode.findOne({ code: req.params.code });

        if (!code) { 
            return res.status(404).json({ error: "Link is not valid or has expired" });
        }

        const user = await User.findOneAndUpdate(
            { email: code.email },
            { password: req.body.password }, 
            { new: true }
        );

        console.log(`Got user ${user}`);

        if (!user) { 
            return res.status(404).json({ error: "User not found" });
        }

        await code.deleteOne();

        res.status(200).json({message: "Password updated successfully."});
         
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

// * This route is to fetch the EJS file and allow user to change the password.
userRoutes.get('/change-password/:code', async (req, res) => {
    try {
        const code = await ResetCode.findOne({ code: req.params.code });

        if (!code) {
            return res.status(404).json({ error: "Code has expired" });
        }

        res.render("passwordReset", { 
            code: req.params.code, 
            email: code.email 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

export default userRoutes;
