import express from "express";
import passport from "passport";

const router = express.Router();

// Protected Route Example
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "This is a protected route" });
  }
);

export default router;
