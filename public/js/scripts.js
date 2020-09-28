const query = window.location.search.substring(1);
const token = query.split('access_token=')[1];


fetch('/githubUserName?access_token=' + token)
	.then(res => res.json())
	.then(res => {
		console.log(res.name);
		const nameNode = document.createTextNode(`Welcome, ${res.name}`);
		document.body.appendChild(nameNode);
});