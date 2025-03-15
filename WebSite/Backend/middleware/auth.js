import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { findUserById } from "../config/database.js";

async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.ENCRYPTION_SECRET)

        const user = await findUserById(decoded.uid);

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({ error: 'Please login again' })
    } 
}

export default auth;