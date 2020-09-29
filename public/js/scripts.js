const url = new URL(window.location.href);
let sessionId = '';

const start = () => {
	const authtype = url.searchParams.get('auth');
	
	if (authtype === 'git') {
		sessionId = url.searchParams.get('access_token');
		fetch('/githubUserName?access_token=' + token)
			.then(res => res.json())
			.then(res => document.querySelector("#name").innerText = res.name);
	} else if (authtype === 'login') {
		sessionId = url.searchParams.get('id');
		let name = url.searchParams.get('name').split(',')[0] + ' ' + url.searchParams.get('name').split(',')[1]
		document.querySelector("#name").innerText = name;
	}

	$(document).ready(function(){
		$('.sidenav').sidenav();
	});

	newScrambled();
	updateScores();
	updateCurrentScore();
	let inp = document.querySelector('#answer');

	inp.addEventListener('keyup', (e) => {
		event.preventDefault();

		if (e.code === 'Enter') {
			guessWord(inp.value);
		}
	});
}

/****TODO****/
const deleteEverything = () => {
	endGame();
	fetch('/deleteEverything', {
		method: 'GET'
	}).then(() => {
		document.querySelector('#currScore').innerHTML = 0;
		updateScores();
		newScrambled();
	});
}


// const hint = () => {
// 	let inp = document.querySelector('#answer');

// 	fetch('/hint', {
//   		method: 'POST',
//   		body: inp.dataset.hint.length
// 	}).then((res) => {
//   		res.text().then(char => {
//   			inp.dataset.hint = inp.dataset.hint ? inp.dataset.hint + char : char;
//   			inp.value = inp.dataset.hint;
//   		});
// 	});
// }


const updateCurrentScore = () => {
	fetch('/getCurrScore?id=' + sessionId, {
		method: 'GET'
	}).then((res) => {
		res.text().then(score => {
			document.querySelector('#currScore').innerHTML = score;
		});
	});
}

/****TODO****/
const updateScores = () => {
	fetch('/getScores', {
		method: 'GET'
	}).then((res) => {
		res.text().then((scores) => {
			let insertDiv = document.querySelector('#serverscores');

			scores = JSON.parse(scores);

			insertDiv.innerHTML = '';

			console.log(scores);

			Object.entries(scores).forEach((score, i) => {
				console.log(score, i);
  				let ele = document.createElement('tr');

  				ele.innerHTML = `${score.name}: ${score.score}`;
  				insertDiv.appendChild(ele);
			});
		});
	});
}

/****TODO****/
const endGame = () => { // ends the game and sends score to the server
	let name = document.querySelector('#name').value ? document.querySelector('#name').value : '???';
	let date = new Date();
	let scorejson = JSON.stringify({"date": date, "name": name.toUpperCase(), "score": 0});

	fetch('/newScore', {
		method: 'POST',
		body: scorejson
	}).then(() => {
		updateScores();
		newScrambled();
		updateCurrentScore();
	});
}


const changeInputUnderlines = () => {  // Change all the css styling needed for the dynamic character underlines
	let length = document.querySelector('#scrambledWord').innerText.length,
		input = document.querySelector('#answer'),
		charWidth = 1,
		gap = 0.5 * charWidth,
		totalWidth = length * (charWidth + gap);

	input.value = '';
	input.dataset.hint = '';
	input.maxLength = length;
	input.style.width = `${totalWidth}ch`;
	input.style.letterSpacing = `${gap}ch`;
	input.style.background = `repeating-linear-gradient(to right, black 0, black ${charWidth}ch, transparent 0, transparent ${charWidth + gap}ch) 0 100% / ${totalWidth - gap}ch 2px no-repeat`;
}


const newScrambled = () => { // Changes the scrambled word to a new one from the server
	document.querySelector('#scrambledWord').innerHTML = 'Loading...';
	fetch('/currentWord?id=' + sessionId, {
		method: 'GET'
	}).then((res) => {
		res.text().then((newWord) => {
			document.querySelector('#scrambledWord').innerHTML = newWord;
		changeInputUnderlines();
		});
	});
}


const guessWord = (guess) => { // takes in a value and sends it to the server to see if its correct
	let data = JSON.stringify({'guess': guess});
	console.log(data, guess);
	fetch('/guess?id=' + sessionId + '&guess=' + guess, {
		method: 'GET'
	}).then((res) => {
		res.text().then((correct) => { // is either true or false to see if that was the correct word
			let scrambled = document.querySelector('#scrambledWord');

			if (correct === 'false') {

				scrambled.classList.add('incorrect');
				setTimeout(() => scrambled.classList.remove('incorrect'), 2500);
			} else {
				scrambled.classList.remove('incorrect');
				updateCurrentScore();
				newScrambled();
			}
		});
	});
}


window.onload = () => {
	start();
	M.AutoInit();
}