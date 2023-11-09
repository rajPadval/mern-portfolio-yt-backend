const { createTransport } = require("nodemailer");

const sendMessage = async (userMsg) => {
  // important things to know is createTransport and sendMail

  // setting up transporter
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  // sending the message
  const sentMessage = await transporter.sendMail({
    from: process.env.APP_EMAIL,
    to: process.env.APP_EMAIL,
    subject: "New Message from Portfolio Site",
    text: userMsg,
  });

  return sentMessage;
};
module.exports = { sendMessage };
