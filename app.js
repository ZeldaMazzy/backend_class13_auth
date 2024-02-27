const express = require("express");
const app = express();
require("dotenv").config();

const PORT = 5000;
const SERVER_URL = `http://localhost:${PORT}`;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

app.use(express.json());

const start = async () => {
	const connectToDB = require("./db/mongoose.db");
	try {
		await connectToDB(CONNECTION_STRING);
		app.listen(PORT, () => {
			console.log("Server is running: ", SERVER_URL);
		})
	} catch(e) {

	}
}

app.get("/", (req, res) => {
	res.send("Auth")
});

app.use("/api/v1/auth", require("./routes/auth.route"));

start();