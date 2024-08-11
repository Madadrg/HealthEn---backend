// routes/api/auth.js

const express = require("express");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/user");
const { sendVerificationEmail } = require("../../models/emailService");

const router = express.Router();

// Schema for validating the request body
const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Route to handle resending the verification email
router.post("/verify", async (req, res, next) => {
  try {
    // Validate the request body
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already verified
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    // Generate a new verification token (optional)
    user.verificationToken = uuidv4();
    await user.save();

    // Send the verification email
    await sendVerificationEmail(user.email, user.verificationToken);

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
