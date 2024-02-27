const mongoose = require("mongoose");

const connectToDB = async (connectionString) => {
	try {
		console.log("Attempting to connect to the database");
		const connection = await mongoose.connect(connectionString);
		if(!connection) {
			throw new Error("Connection Failed");
		}

		console.log("Successfully connected to database");
		return connection;
	} catch(e) {
		console.error("There was an error connecting to the database: ", e.message);
	}
}

module.exports = connectToDB;