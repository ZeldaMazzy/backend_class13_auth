const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
    	default: 'user',
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false
	},
	verificationDate: Date
});

userSchema.pre('save', async function() {
	if(this.isModified("password") === false) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createToken = function() {
	return jwt.sign(
		{ userId: this._id, name: this.name, role: this.role },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	)
};

userSchema.methods.comparePasswords = async function(passwordToCompare) {
	const passwordsMatch = await bcrypt.compare(passwordToCompare, this.password);
	return passwordsMatch;
}

module.exports = mongoose.model("User", userSchema);