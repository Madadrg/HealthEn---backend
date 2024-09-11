const express = require("express");
const User = require("../../models/user");
const router = express.Router();

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.verificationToken,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
