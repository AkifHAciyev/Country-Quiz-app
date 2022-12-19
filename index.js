const result = document.querySelector('.result');
const gameContainer = document.querySelector('.game-container');
const tryAgainBtn = document.querySelector('#try-again');
const scoreSpan = document.querySelector('.score');
let newArr = [];
let clicked = 0;
let finish = false;
let correctOjb = [];
let score = 0;
let countryForQuetion = [];
let randomNumber = [];
let randomQuestion = [];

const getCountry = async () => {
	const res = await axios.get('https://restcountries.com/v3.1/all');
	clicked = 0;
	randomGenerate(res.data);
	newArr.push(res.data);
};

function addPage(data) {
	const newArr = shuffleArr(randomQuestion);
	const shuffled = shuffleArr(randomNumber);

	gameContainer.innerHTML = '';
	const container = document.createElement('div');
	const questions = ['Which country does this flag belong to?', `${data[1].capital} is the capital of:`];
	let imgSrc = `${data[1].flags.svg}`;
	const correctAnswer = data[1].name.common;
	const header = document.createElement('header');
	const section = document.createElement('section');
	const h2 = document.createElement('h2');
	const img = document.createElement('img');

	container.classList.add('container');
	h2.innerHTML = `${questions[newArr[0]]}`;
	img.setAttribute('src', imgSrc);
	section.innerHTML = `<button class='hover'><span class='variant'>A</span>${data[shuffled[0]].name.common}</button>
	<button class='hover'><span class='variant'>B</span>${data[shuffled[1]].name.common}</button>
	<button class='hover'><span class='variant'>C</span>${data[shuffled[2]].name.common}</button>
	<button class='hover'><span class='variant'>D</span>${data[shuffled[3]].name.common}</button>`;

	if (h2.innerText.includes('capital')) {
		img.src = ' ';
		h2.style.marginTop = '50px';
	}

	header.appendChild(img);
	header.appendChild(h2);
	container.appendChild(header);
	container.appendChild(section);
	gameContainer.appendChild(container);

	const buttons = document.querySelectorAll('button');
	buttons.forEach((button) => {
		button.addEventListener('click', (e) => {
			clicked += 1;
			const value = e.target.innerText.substring(1);
			if (finish && clicked > 1) {
				button.setAttribute('id', 'rest');
			} else if (value.includes(correctAnswer)) {
				score = score + 1;
				button.classList.add('green');
				finish = true;
				setTimeout(getCountry, 1000);
			} else if (!value.includes(correctAnswer)) {
				button.classList.add('red');
				buttons.forEach((button) => {
					if (button.innerText.substring(1).includes(correctAnswer)) {
						button.classList.add('green');
					}
				});
				finish = true;
				setTimeout(() => {
					container.style.display = 'none';
					result.style.display = 'flex';
					scoreSpan.innerHTML = score;
				}, 1500);
			}
			if (finish) buttons.forEach((button) => button.classList.remove('hover'));
		});
	});
}

const randomGenerate = (data) => {
	countryForQuetion = [];
	let newArr = Array.from({ length: 4 }, () => ~~(Math.random() * 250));
	for (let i = 0; i < newArr.length; i++) {
		countryForQuetion.push(data[newArr[i]]);
	}
	addPage(countryForQuetion);
};

for (let i = 0; i < 50; i++) {
	if (randomNumber.indexOf(~~(Math.random() * 4)) === -1) {
		randomNumber.push(~~(Math.random() * 4));
	}
}

for (let i = 0; i < 4; i++) {
	if (randomQuestion.indexOf(~~(Math.random() * 2)) === -1) {
		randomQuestion.push(~~(Math.random() * 2));
	}
}

function shuffleArr(arr) {
	let newArr = [];
	arr.forEach((nums) => {
		const randomNum = ~~(Math.random() * arr.length);
		newArr.splice(randomNum, 0, nums);
	});

	return newArr;
}

tryAgainBtn.addEventListener('click', () => {
	score = 0;
	getCountry();
	result.style.display = 'none';
});

window.addEventListener('load', getCountry);
