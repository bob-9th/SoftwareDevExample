const axios = require("axios"); //HTTP(S) Request module을 불러옵니다.

const parser = require("parser");

let vis = {};

class Queue {

	url = [];

	/**
	 * 방문하지 않은 url만 queue에 추가합니다.
	 *
	 * @param {Array<String>} url
	 */
	push(url) {
		for (let u of url) {
			if (vis[u] === undefined) {
				vis[u] = true;
				url.push(u);
			}
		}
	}

	/**
	 * Queue에서 가장 앞에 있는 url을 제거하고 반환합니다.
	 *
	 * @returns {String|undefined}
	 */
	shift() {
		return this.url.shift();
	}
}

const running = false; //크롤링 진행 여부
const queue = new Queue();      //url 큐

/**
 * 크롤링을 시작합니다.
 *
 * @param {Array<String>} hosts
 * @param {Boolean}       force
 */
const startCrawling = (hosts = [], force = false) => {
	if (running && !force) { //작동 중인 경우 에러 표시
		throw new Error("크롤링이 이미 실행 중입니다.");
	}

	queue.push(hosts);

	run();
};

/**
 *
 *
 * @returns {Promise<void>}
 */
const run = async () => {
	if (queue.length < 1) {
		setTimeout(() => run(), 1000);
		return;
		//queue가 비어있으면 1초 뒤에 다시 run을 실행합니다.
	}

	let url = queue.shift(); //가장 앞에 있는 URL을 가져옵니다.
	let body = (await axios.get(url).catch(() => {})).data; //GET 요청으로 body를 가져옵니다.
	if (body.length >= 1) parser(url, body).then(retURLs => queue.push(retURLs)); //body가 있으면 parser에 보내서 파싱을 하고, 새롭게 색인할 URL들을 Queue에 넣습니다.
	setTimeout(() => run(), 500); //run 함수를 1초 뒤에 다시 실행합니다.
};

module.exports = startCrawling;
