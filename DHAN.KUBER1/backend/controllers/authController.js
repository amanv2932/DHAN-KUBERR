const User = require("../model/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const runtimeStore = require("../store");
const { signToken } = require("../utils/auth");

const usingDatabase = () => mongoose.connection.readyState === 1;

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);

    let user;

    if (usingDatabase()) {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }

      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashed,
      });
    } else {
      runtimeStore.reload();
      const existingUser = runtimeStore.users.find((item) => item.email === normalizedEmail);

      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }

      user = {
        _id: `local-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: hashed,
      };

      runtimeStore.users.push(user);
      runtimeStore.save();
    }

    const token = signToken(user._id);

    return res.status(201).json({
      message: "User created",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to sign up right now." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user;

    if (usingDatabase()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      runtimeStore.reload();
      user = runtimeStore.users.find((item) => item.email === normalizedEmail);
    }

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = signToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to log in right now." });
  }
};
