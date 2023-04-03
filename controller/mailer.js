import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "kaboom9999992022@outlook.com",
    pass: "11@kaboomM",
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailer = (email, name) => {
  const mailOptions = {
    from: "kaboom9999992022@outlook.com",
    to: email,
    subject: "Welcome to Hospital Navigation!",
    html: `
      <p>Hello ${name},</p>
      <p>Thank you for signing up to Hospital navigation! We're excited to have you on board.</p>
      <p>Regards,</p>
      <p>The Hospital Navigation Team</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      // res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      // res.status(200).send("Signed up successfully");
    }
  });
};
