const User = require("../db/user.schema");
const crypto = require("crypto");

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if(!email || !password) {
			throw new Error("Email and Password are required");
		};

		const user = await User.findOne({ email: email });
		if(!user) {
			throw new Error("Invalid Credentials");
		};

		const passwordsMatch = await user.comparePasswords(password);
		if(passwordsMatch == false) {
			throw new Error("Invalid Credentials");
		};

		if(user.isVerified == false) {
			throw new Error("Please verify your email");
		};

		const token = user.createToken();

		res.status(200).json({ message: "Successfully logged in", accessToken: token });
	} catch(e) {
		res.status(400).send(":( " + e.message);
	}
};

const register = async (req, res) => {
	const sendEmail = require("../db/mailer.db");
	try {
		const { name, email, password } = req.body;

		if(!name || !email || !password) {
			throw new Error("Name, Email and Password are required");
		}

		const emailExists = await User.findOne({ email: email });
		if(emailExists) {
			throw new Error("Email already exists");
		}

		const isFirstAccount = (await User.countDocuments({})) === 0;
  		const role = isFirstAccount ? 'admin' : 'user';
  		const verificationToken = crypto.randomBytes(40).toString('hex');

  		const user = await User.create({
  			name,
		    email,
		    password,
		    role,
		    verificationToken
  		});

  		await sendEmail(name, email, verificationToken);

		res.status(201).json({ message: "User Created", data: user });
	} catch(e) {
		res.status(400).send("T_T " + e.message);
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { verificationToken, email } = req.query;
		if(!verificationToken || !email) {
			throw new Error("Missing token or email")
		}

		const user = await User.findOne({ email: email });
		if(!user) {
			throw new Error("User with this email does not exist");
		}

		const tokensMatch = user.verificationToken == verificationToken;
		if(tokensMatch == false) {
			throw new Error("Invalid Verification Token");
		}

		user.isVerified = true;
		user.verified = Date.now();
		user.verificationToken = '';

		await user.save();

		console.log("Email Verified");
		res.status(200).send("Email Verified");
	} catch(e) {
		console.error("D: ", e.message);
		res.status(400).send("D: " + e.message);
	}
}

module.exports = {
	login, register, verifyEmail
}