const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup route
exports.signup = async (req, res) => {
  //  getting user data from req.body
  const { name, email, password } = req.body;

  let user;

  try {
    //   checking if user already exists
    user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // hashing the password
    const securePassword = await bcrypt.hash(password, 10);

    //   creating a new user
    user = await User.create({
      name,
      email,
      password: securePassword,
    });

    //   saving user to db
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //  checking if user exists
    let user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Please sign up" });

    //  checking if password matches
    const comparePassword = await bcrypt.compare(password, user.password);

    // if password does not match
    if (!comparePassword)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect credentials" });

    // if password matches

    // check if "token" cookie exists in the request
    const existingToken = req.cookies.token;

    if (existingToken) {
      // clear the existing token cookie
      res.clearCookie("token");
    }

    // creating a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30s",
    });

    // sending token in cookie
    res.cookie("token", token, {
      domain: ".mern-portfolio-yt-frontend-8mut.vercel.app",
      secure: true,
      httpOnly: true, // client side js cannot access the cookie
      expiresIn: new Date(Date.now() + 1000 * 30), // expires in 30s
      sameSite: "none",
    });

    return res.status(200).json({ success: true, message: "Logged in" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
