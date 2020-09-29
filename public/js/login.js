const createAccount = (event) => {
	event.preventDefault();

	const first = event.target.first_name.value;
	const last = event.target.last_name.value;
	const user = event.target.user_name.value;
	const pass = event.target.password.value;

	const loginData = {'first': first, 'last': last, 'user': user, 'password': pass};

	fetch('/createAccount', {
		method: 'POST',
		body: JSON.stringify(loginData),
    	headers: {'Content-Type':'application/x-www-form-urlencoded'}
	}).then((response) => {
		document.querySelector('#login_user_name').value = user;
		document.querySelector('#login_password').value = pass;
		M.updateTextFields();
		M.toast({html: 'Account Created, Now Press Login!'});
	}).catch((err) => { console.log(err) });
};

const login = (event) => {
	event.preventDefault();

	const user = event.target.user_name.value;
	const pass = event.target.password.value;

	const loginData = {'user_name': user, 'password': pass};

	fetch('/login', {
		method: 'POST',
		body: JSON.stringify(loginData),
    	headers: {'Content-Type':'application/x-www-form-urlencoded'}
	}).then((response) => {
		M.updateTextFields();
		M.toast({html: 'Logging you in!'});
	}).catch((err) => { console.log(err) });
};