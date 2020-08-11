const axios = require("axios");
const fs = require("fs");

module.exports = async (url) => {
	let fileName = `C_${Date.now()}.${url.split("/").reverse().shift()}`; //임시 파일명을 구성합니다.
	let body = (await axios.get(url).catch(e => {})).data; //GET으로 파일을 다운하고
	if (body.length > 1) fs.writeFileSync(fileName, body); //파일을 작성하고
	return body.length > 1 ? fileName : ""; //파일명 리턴
};
