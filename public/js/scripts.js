const url = new URL(window.location.href);
let sessionId = '';
let username = '';

const start = () => {
	const authtype = url.searchParams.get('auth');
	
	if (authtype === 'git') {
		fetch('/githubUserName?access_token=' + url.searchParams.get('access_token'))
			.then(res => res.json())
			.then(res => {
				document.querySelector("#name").innerText = res.name;
				username = res.login;

				let loginData = {'name': res.name, 'user': res.login, 'password': res.node_id};

				fetch('/createAccount', {
					method: 'POST',
					body: JSON.stringify(loginData),
			    	headers: {'Content-Type':'application/x-www-form-urlencoded'}
				})
				.then((res) => res.text())
				.then((res) => {

					sessionId = res;
					newScrambled();
					updateScores();
					updateCurrentScore();
				});
			});
	} else if (authtype === 'login') {
		let name = url.searchParams.get('name').split(',')[0] + ' ' + url.searchParams.get('name').split(',')[1]
		sessionId = url.searchParams.get('id');
		username = url.searchParams.get('user');
		document.querySelector("#name").innerText = name;
		newScrambled();
		updateScores();
		updateCurrentScore();
	}


	let inp = document.querySelector('#answer');

	inp.addEventListener('keyup', (e) => {
		event.preventDefault();

		if (e.code === 'Enter') {
			guessWord(inp.value);
		}
	});
}


const deleteEverything = () => {
	endGame();
	fetch('/deleteEverything', {
		method: 'GET'
	}).then(() => {
		document.querySelector('#currScore').innerHTML = 0;
		newScrambled();
		updateScores();
	});
}


const updateCurrentScore = () => {
	fetch('/getCurrScore?id=' + sessionId + '&user=' + username, {
		method: 'GET'
	}).then((res) => {
		res.text().then(score => {
			document.querySelector('#currScore').innerHTML = score;
		});
	});
}


const updateScores = () => {
	fetch('/getScores', {
		method: 'GET'
	}).then((res) => {
		res.text().then((scores) => {
			let insertDiv = document.querySelector('#serverscores');

			scores = JSON.parse(scores);
			insertDiv.innerHTML = '';

			Object.keys(scores).forEach((key, i) => {
  				let ele = document.createElement('h6');
  				ele.innerHTML = `${scores[key].name}: ${scores[key].score}`;
  				insertDiv.appendChild(ele);
			});
		});
	});
}

/****TODO****/
const endGame = () => { // ends the game and sends score to the server
	fetch('/endGame?id=' + sessionId, {
		method: 'GET'
	})
	window.location.href = '/';
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
	// input.style.width = `${totalWidth}ch !important`;
	// input.style.letterSpacing = `${gap}ch !important`;
	// input.style.background = `repeating-linear-gradient(to right, black 0, black ${charWidth}ch, transparent 0, transparent ${charWidth + gap}ch) 0 100% / ${totalWidth - gap}ch 2px no-repeat !important`;
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

	fetch('/guess?id=' + sessionId + '&user=' + username + '&guess=' + guess, {
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

$(document).ready(function(){
	$('.sidenav').sidenav();
});

window.onload = () => {
	start();
	M.AutoInit();
}