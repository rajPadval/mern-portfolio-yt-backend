const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];

    // check if token is not present
    if (!prevToken)
      return res
        .status(401)
        .json({ success: false, message: "Please Login First" });

    // verify token
    jwt.verify(prevToken, process.env.JWT_SECRET, (error, user) => {
      if (error)
        return res.status(403).json({ success: false, message: error.message });

      // clear the previous token
      res.clearCookie("token");

      //   creating a new token
      const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "30s",
      });

      //   setting the new token in cookie
      res.cookie("token", newToken, {
        path: "/",
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 30),
        sameSite: "lax",
      });

      req.id = user.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
