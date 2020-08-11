const fs = require("fs");

const cheerio = require("cheerio"); //HTML 파싱 라이브러리 로드

const media_downloader = require("media_downloader");
const deepfake = require("../deepfake/deepfake");
const reporter = require("../report/reporter");

const media_extension = [
	"mp4", "avi", "mkv", "png", "jpg", "jpeg", "tiff", "tif", "gif"
];

/**
 * body의 HTML을 분석하여 추가로 분석할 URL을 Queue에 넣거나 미디어를 다운로드합니다.
 *
 * @param {String} url
 * @param {String} body
 * @returns {Promise<Array<String>>}
 */
const parse = async (url, body) => {
	let $ = await cheerio(body); //HTML 코드 파싱
	let ret = [];

	for (let a_element of $.querySelectorAll("a[href]")) { //a 태그의 href 값을 가진 요소만 로드
		let href = a_element.getAttribute('href');
		if (!href.startsWith("http://") && !href.startsWith("https://")) continue;
		if (href.endsWith("/")) { //유효한 url이고 directory라고 생각되면 리턴할 url의 리스트에 추가
			ret.push(href);
		}

		for (let ext of media_extension)
			if (href.endsWith(ext)) {
				media_downloader(href).then(filePath => deepfake(filePath).then(ret => {
					if (ret) reporter(url, filePath);
					else fs.unlinkSync(filePath);
				})); //미디어 다운 -> 딥페이크 여부 확인 -> 최종 report
				break;
			}
	}

	return ret;
};

module.exports = parse;
