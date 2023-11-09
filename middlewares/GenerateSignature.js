const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "dmljeib0i",
  api_key: "966342342222682",
  api_secret: "EaTN0vHUnXjKBBMGZiNf5XyyTEM",
});

exports.generateSignature = async (req, res) => {
  const { public_id } = req.query;

  const signature = await cloudinary.v2.utils.api_sign_request(
    {
      public_id,
      timestamp: Math.floor((new Date().getTime() + 31536000000) / 1000),
    },
    "EaTN0vHUnXjKBBMGZiNf5XyyTEM"
  );

  return res.status(200).json({ signature });
};
