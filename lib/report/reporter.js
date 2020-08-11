const mongodb = require("mongodb");
const db = await mongodb.connect('url', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).db('report'); //db initialize

module.exports = (url, fileName) => {
	db.insertOne({
		url: url,
		time: Date.now(),
		fileName: fileName
	}); //DB에 데이터를 넣음

	//TODO: report to government
};
