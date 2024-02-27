const nodemailer = require("nodemailer");

const nodemailerConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'una25@ethereal.email',
    pass: 'F4Y4w9mcWvMb7Wj4te',
  },
};

const sendEmail = async (name, email, token) => {
	let testAccount = await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport(nodemailerConfig);
	const linkText = `http://localhost:5000/api/v1/auth/verify?verificationToken=${token}&email=${email}`

	const emailBody = `
		<p>Thanks for signing up, ${name}! Please click on the link below to verify your email.</p>
		<a href="${linkText}">Verify</a>
	`

	return transporter.sendMail({
		from: "zelda <zelda@zelda.zelda>",
		to: email,
		subject: "Verify your Email",
		html: emailBody
	})
}

module.exports = sendEmail;