const fs = require("fs");

/**
 * 파일 경로를 받아 파일을 읽은 뒤, 딥페이크 된 것인지 리턴
 * @param {String} filePath
 *
 * @return {Boolean}
 */
module.exports = filePath => {
	if (filePath.length < 1) return;

	let content = fs.readFileSync(filePath);
	return;//check content is deep-faked.
};
