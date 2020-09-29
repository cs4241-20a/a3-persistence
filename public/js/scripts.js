/**
 * Send an /add API HTTP request to add a new game's stats to the
 * table. The stats are taken from the "add" form in index.html.
 * The updated stats are then displayed in total_avg_results and
 * results_list tables in app.html.
 */
function handle_add(){
    //The following source showed me how to extract values from a
    //form: https://www.w3schools.com/jsref/coll_form_elements.asp
    const input = document.getElementById("add"),
          json = {
              "kills": input.elements[0].value,
              "assists": input.elements[1].value,
              "deaths": input.elements[2].value,
          },
          body = JSON.stringify(json);

    fetch( '/add', {
        method:'POST',
        headers: {"Content-Type": "application/json"},
        body
    }).then(function( response ) {
          if(response.status === 200){
              updateResults(response);
          }
    });
}

/**
 * Send a /modify API HTTP request to modifies a game's stats by
 * setting them to the values in the "modify" form in index.html.
 * The updated stats are then displayed in total_avg_results and
 * results_list tables in index.html.
 */
function handle_modify(){
    const input = document.getElementById("modify");
    let json = {
        "rows": [],
        "kills": input.elements[0].value,
        "assists": input.elements[1].value,
        "deaths": input.elements[2].value,
    }
    let table = document.getElementById("results_list").getElementsByTagName("tbody")[0];
    for(let i = 0; i < table.rows.length; i++){
        let rowItems = table.rows[i].childNodes;
        let checkbox = rowItems[0].childNodes[0];
        if(checkbox.checked){
            json.rows.push({
                id: checkbox.id,
                kills: rowItems[1].innerHTML,
                assists: rowItems[2].innerHTML,
                deaths: rowItems[3].innerHTML,
            });
        }
    }
    let body = JSON.stringify(json);
    fetch( '/modify', {
        method:'POST',
        headers: {"Content-Type": "application/json"},
        body
    }).then(function( response ) {
        if(response.status === 200){
            updateResults(response);
        }
    });
}

/**
 * Send a /delete API HTTP request to remove a game's stats from
 * the table. The ID# of the game to remove are taken from the
 * "delete" form in index.html The updated stats are then displayed
 * in total_avg_results and results_list tables in index.html.
 */
function handle_delete(){
    let json = {
        "rows": []
    }
    let table = document.getElementById("results_list").getElementsByTagName("tbody")[0];
    for(let i = 0; i < table.rows.length; i++){
        let rowItems = table.rows[i].childNodes;
        let checkbox = rowItems[0].childNodes[0];
        if(checkbox.checked){
            json.rows.push({
                "id": checkbox.id,
                "kills": rowItems[1].innerHTML,
                "assists": rowItems[2].innerHTML,
                "deaths": rowItems[3].innerHTML,
            });
        }
    }
    let body = JSON.stringify(json);
    fetch( '/delete', {
        method:'POST',
        headers: {"Content-Type": "application/json"},
        body
    }).then(function( response ) {
        if(response.status === 200){
            updateResults(response);
        }
    });
}

/**
 * Send a /clear API HTTP request to clear the all of the current
 * user's stats.
 */
function handle_clear(){
    fetch( '/clear', {
        method:'GET',
    }).then(function( response ) {
        if(response.status === 200){
            updateResults(response);
        }
    });
}

/**
 * Send a /signin API HTTP request to log into the application with the
 * given username and password.
 */
function handle_login(){
    let usernameField = document.getElementById("username_input");
    let passwordField = document.getElementById("password_input");
    let json = {
        "username": usernameField.value,
        "password": passwordField.value
    }
    let body = JSON.stringify(json);
    fetch("/signin", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    }).then(function(response){
        if(response.headers.get("new") === "true"){
            alert("User did not exist, so a new account was created with given username and password");
        }
        window.location = response.url;
    });
}

/**
 * Send a /results API HTTP request to retrieve all the current stats
 * for the current user stored in the database. The updated stats are
 * then displayed in total_avg_results and results_list tables in
 * index.html.
 */
function getLatestResults(){
    fetch( '/results', {
        method:'GET'
    }).then(function( response ) {
        if(response.status === 200){
            updateResults(response);
        }
    });
}

/**
 * Downloads all of the current user's stats from the database as a CSV
 * file called "stats.csv".
 */
function handle_csv(){
    /*
     * This source explained to me that you can't just use the "Content-Disposition"
     * header to download files from GET requests:
     * https://stackoverflow.com/questions/26737883/content-dispositionattachment-not-triggering-download-dialog
     *
     * The top answer from the following source taught me how to download
     * a file using fetch. It essentially says to download the response,
     * get the blob with the file data, create a URL to it, and then create
     * an <a> element that, when clicked, downloads the object at the URL,
     * which is our file. The code between lines 140-151 comes from this source,
     * and the comments that start with "OA" are comments from the original post
     * by that Original Author. The original post used arrow shorthand notation
     * but I changed cause I didn't like it :)
     *
     * https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
     */
    fetch( '/csv', {
        method:'GET'
    }).then(function(response){
          return response.blob()
    })
      .then(function(blob) {
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(blob);
          a.download = "stats.csv";
          document.body.appendChild(a);// OA: we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();// OA: afterwards we remove the element again
      });
}

/**
 * Updates the contents of the total_avg_results and results_list
 * tables in index.html with the data in <b>response</b>.
 *
 * @param response an HTTP response with the data to be displayed in
 *     the total_avg_results and results_list tables in index.html
 */
function updateResults(response){
    //Delete existing table and add a new, empty one. The following
    //source gave me the idea of swapping the tbody element of the
    //table, and showed me how to do it:
    //https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
    let table = document.getElementById("results_list");
    //table.removeChild(table.children[1]);
    let tbody = table.getElementsByTagName("tbody")[0];
    let newBody = document.createElement("tbody");
    table.replaceChild(newBody, tbody);

    //The following source showed me how to extract json from the HTTP
    //response: https://developer.mozilla.org/en-US/docs/Web/API/Body/json
    response.json().then(function(data) {
        //The following source was used to learn how to insert a row into
        //a table in JS: https://www.w3schools.com/jsref/met_table_insertrow.asp
        let numRows = data.numRows;
        let rows = data.rows;
        for (let i = 0; i < numRows; i++) {
            let newRow = newBody.insertRow(i);
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = rows[i]._id;
            newRow.insertCell(0).appendChild(checkbox);

            let currentCell = newRow.insertCell(1);
            currentCell.innerHTML = `${rows[i].kills}`;
            currentCell.classList.add("has-text-centered");

            currentCell = newRow.insertCell(2);
            currentCell.innerHTML = `${rows[i].assists}`;
            currentCell.classList.add("has-text-centered");

            currentCell = newRow.insertCell(3);
            currentCell.innerHTML = `${rows[i].deaths}`;
            currentCell.classList.add("has-text-centered");

            currentCell = newRow.insertCell(4);
            currentCell.innerHTML = `${rows[i].kd_ratio}`;
            currentCell.classList.add("has-text-centered");

            currentCell = newRow.insertCell(5);
            currentCell.innerHTML = `${rows[i].ad_ratio}`;
            currentCell.classList.add("has-text-centered");
        }

        //Now updates the boxes holding the totals and averages
        document.getElementById("total_kills").innerHTML = `${data.totals.kills}`;
        document.getElementById("avg_kills").innerHTML = `${data.avgs.kills}`;
        document.getElementById("total_assists").innerHTML = `${data.totals.assists}`;
        document.getElementById("avg_assists").innerHTML = `${data.avgs.assists}`;
        document.getElementById("total_deaths").innerHTML = `${data.totals.deaths}`;
        document.getElementById("avg_deaths").innerHTML = `${data.avgs.deaths}`;
    });
}