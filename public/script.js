const name = document.getElementById("name"),
    password = document.getElementById("password"),
    newName = document.getElementById("newName"),
    newPswd = document.getElementById("newPswd"),
    loginB = document.getElementById("login"),
    signupB = document.getElementById("signup"),
    oauthB = document.getElementById("oauth"),
    username = document.getElementById("nameOfUser"),
    logoutB = document.getElementById("logout"),
    addB = document.getElementById("add");

window.onload = function(){
    if(loginB !== null){
        loginB.onclick = login;
        oauthB.onclick = oauth;
        signupB.onclick = signup;
    }
    if(logoutB !== null){
        logoutB.onclick = logout;
        getName();
        addB.onclick = add;
        updateTable();
    }

}

const add = function(e){
    e.preventDefault();

    let tea = document.querySelector("input[name='radiot']:checked"),
        milk = document.querySelector("input[name='radiom']:checked"),
        time = document.querySelector('#time').value,
        top=[];
    document.querySelectorAll("input[name='checkbox']:checked")
        .forEach(function(item){top.push(item)});

    if(!tea || !milk || !time){
        alert("Please fill in the tea, milk and pickup time in order to submit!")
    }else{
        tea = tea.value;
        milk = milk.value;
        if(top.length !== 0){
            top = top.map(t => t.value);
        }

        fetch('/addMilktea', {
            method: 'POST',
            body: JSON.stringify({tea,milk,top,time}),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(text => {
                if(text === 1){
                    alert('Successfully Added to the Cart!');
                    reset();
                    updateTable();
                }})
    }
}

function updateTable(){
    fetch('/appdata', {
        method:'GET'
    })
        .then(res => res.json())
        .then(arr => {
            let tbody = document.querySelector("tbody");
            tbody.innerHTML = "";
            for(let i = 0; i < arr.length; i++){
                let row = document.createElement("tr");
                for(let j = 0; j < 6; j++){
                    let cell = document.createElement("td");
                    let text;
                    switch(j){
                        case 0: text = document.createTextNode(arr[i].tea); break;
                        case 1: text = document.createTextNode(arr[i].milk); break;
                        case 2: text = document.createTextNode(arr[i].top); break;
                        case 3: text = document.createTextNode(arr[i].time); break;
                        case 4: text = document.createElement("Button"); break;
                        case 5: text = document.createElement("Button"); break;
                    }
                    if(j === 4){
                        text.innerHTML = "Modify";
                        text.id = 'M' + i.toString();
                        text.onclick = mod;
                        text.classList = ("mui-btn--small mui-btn--raise mui-btn--accent");
                    }
                    if(j === 5){
                        text.innerHTML = "Delete";
                        text.id = 'D' + i.toString();
                        text.onclick = del;
                        text.classList = ("mui-btn--small mui-btn--raise mui-btn--danger");
                    }
                    cell.appendChild(text);
                    row.appendChild(cell);
                }
                tbody.appendChild(row);
            }
        })
}

function reset(){
    document.querySelectorAll("input[name='checkbox'], input[name='radiom'], input[name='radiot']")
        .forEach(function(btn){btn.checked = false});
    document.querySelector('#time').value = null;
}

function getName(){
    fetch('/myname',{
        method: 'GET'
    })
        .then(response => response.json())
        .then(name => {
            username.innerHTML = 'Aloha, '+ name
        })
}

const del = function(e){
    e.preventDefault();
    let num = Number(e.target.id.substring(1));
    fetch('/appdata', {
        method:'GET'
    })
        .then(res => res.json())
        .then(arr => {
            fetch('/delete',{
                method:'POST',
                body: JSON.stringify(arr[num]),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    updateTable();
                })
        });
}

const mod = function(e){
    e.preventDefault();
    let num = Number(e.target.id.substring(1));

    fetch('/appdata', {
        method:'GET'
    })
        .then(res => res.json())
        .then(arr => {
            document.querySelector('#' + arr[num].tea).checked = true;
            document.querySelector('#' + arr[num].milk).checked = true;
            document.querySelector('#time').value = arr[num].time;
            arr[num].top.forEach(cb => {
                document.querySelector('#' + cb).checked = true;
            })
            alert("Fields are automatically filled. Please hit 'Add to Cart' when you finish modify the information.");
            fetch('/delete',{
                method:'POST',
                body: JSON.stringify(arr[num]),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    updateTable();
                })
        });

}

const logout = function(e){
    e.preventDefault();

    fetch('/logout', {
        method: 'GET'
    })
        .then(() =>{
            window.location.href = '/'
        })
};

const oauth = function(e){
    e.preventDefault();

    fetch('/login_github',{
        method: 'GET'
    })
        .then(response => response.json())
        .then(url =>{
            window.location.href = url;
        })
    return false;
}

const signup = function(e){
    e.preventDefault();

    fetch('/add', {
        method: 'POST',
        body: JSON.stringify({name: newName.value, password: newPswd.value, mt: []}),
        headers:{
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(json => {
            if(!json){
                alert("This username was used. Please choose another one :(")
            }else{
                alert("New user created and saved! You can login with your credential.");
            }
        })

    // reset
    newPswd.value = '';
    newName.value = '';
}

const login = function(e){
    e.preventDefault();

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({name: name.value, password: password.value}),
        headers:{
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(json => {
            if(!json){
                alert("Invalid username or password :(")
            }else{
                if(json.name === 'admin' && json.password === 'cs4342'){
                    window.location = '/allresults'
                }else{
                    window.location = '/yourdata'
                }
            }
        })

    // reset
    name.value = '';
    password.value = '';
}
