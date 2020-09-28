window.onload = function(){
    const logoutB = document.getElementById('logout_admin');
    logoutB.onclick = logout;
    updateTable();
}

function updateTable(){
    fetch('/alldata', {
        method:'GET'
    })
        .then(res => res.json())
        .then(arr => {
            console.log(arr);
            let tbody = document.querySelector("tbody");
            tbody.innerHTML = "";
            for(let i = 0; i < arr.length; i++){
                arr[i].mt.forEach(amt => {
                    let row = document.createElement("tr");
                    for(let j = 0; j < 5; j++){
                        let cell = document.createElement("td");
                        let text;
                        switch(j){
                            case 0: text = document.createTextNode(arr[i].name); break;
                            case 1: text = document.createTextNode(amt.tea); break;
                            case 2: text = document.createTextNode(amt.milk); break;
                            case 3: text = document.createTextNode(amt.top); break;
                            case 4: text = document.createTextNode(amt.time); break;
                        }
                        cell.appendChild(text);
                        row.appendChild(cell);
                    }
                    tbody.appendChild(row);
                })
            }
        })
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
