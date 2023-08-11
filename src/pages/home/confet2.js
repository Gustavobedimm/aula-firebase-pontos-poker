import confetti from "https://cdn.skypack.dev/canvas-confetti";
const doItNow = (evt, hard) => {
	const direction = Math.sign(lastX - evt.clientX);
	lastX = evt.clientX;
	const particleCount = hard ? r(122, 245) : r(2, 15);
	confetti({
		particleCount,
		angle: r(90, 90 + direction * 30),
		spread: r(45, 80),
		origin: {
			x: evt.clientX / window.innerWidth,
			y: evt.clientY / window.innerHeight
		}
	});
};
const doIt = (evt) => {
	doItNow(evt, false);
};

const doItHard = (evt) => {
	doItNow(evt, true);
};

let lastX = 0;


function r(mi, ma) {
	return parseInt(Math.random() * (ma - mi) + mi);
}