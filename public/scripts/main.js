let currentRecipe = {}
let existingRecipes = {}

function addNewRecipe(recipe) {
    console.log('adding', recipe.name)
}

function loadRecipesFromServer() {
    $("select[name=selectrecipe]").find("option:not([disabled])").remove()

    return fetch('/recipes', {
        method: 'GET'
    }).then(res => res.json())
        .then(json => {
            console.log(json[1])
            let newRecipes = {}
            json.forEach(e => {
                console.log(e)
                newRecipes[e._id] = e
                $(`optgroup[name=${e.type}]`).append(`<option value="${e._id}">${e.name}</option>`)
            })
            existingRecipes = newRecipes
        })
}

function displayRecipe(recipe) {
    currentRecipe = recipe;
    console.log(currentRecipe)
    $("#recipedisplay").css("visibility", "visible")
    $("#edit").css("visibility", "visible")
    $("#delete").css("visibility", "visible")
    console.log(recipe.name, recipe.type, recipe.time, recipe.ingredients, recipe.directions)
    $("#name").text(recipe.name)
    $("#cooktime").text(recipe.time)
    $('#recipedisplay > ul').empty()
    $('#recipedisplay > ul').append(
        recipe.ingredients.split(",").map(ingredient =>
            $("<li>").text(ingredient)
        )
    );
    $("#directions").text(recipe.directions)

}

$(function () {
    loadRecipesFromServer()
  

    $("select[name=selectrecipe]").on("change", e => {
        displayRecipe(existingRecipes[e.target.value])
    })

    $("#recipeForm").on("submit", event => {
        event.preventDefault()
        console.log("submitting")
        let data = {
            name: $("input[name=name]").val(),
            type: $("select[name=type]").val(),
            time: $("input[name=time]").val(),
            ingredients: $("#addingredients").val(),
            directions: $("textarea[name=directions]").val()
        }
        let json = JSON.stringify(data)
        fetch('/add', {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => addNewRecipe(json))
        console.log(json)
        loadRecipesFromServer()
        $("#recipeForm").trigger("reset")
        $("#addingredients").tagsinput("removeAll")

    })
})

function editRecipe() {
    $("#update").css("visibility", "visible")
    $("#submit").css("visibility", "hidden")

    // change h1 text to Edit Recipe
    $("#header").text("Edit Recipe")
    // auto fill the text fields
    $("#nameInput").val(currentRecipe.name)
    $("#typeInput").val(currentRecipe.type)
    $("#timeInput").val(currentRecipe.time)
    currentRecipe.ingredients.split(",").forEach(ingredient => {
        $("#addingredients").tagsinput('add', ingredient)
    })
    $("#directionsInput").val(currentRecipe.directions)
}

function updateRecipe() {
    $("#header").text("Add Recipe")
    let data = {
        id: currentRecipe._id,
        name: $("input[name=name]").val(),
        type: $("select[name=type]").val(),
        time: $("input[name=time]").val(),
        ingredients: $("#addingredients").val(),
        directions: $("textarea[name=directions]").val()
    }
    let json = JSON.stringify(data)
    fetch('/update', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(r => r.json())
        .then(r => {
            console.log(r)
            loadRecipesFromServer().then(() => {
                $('select[name=selectrecipe]').val(currentRecipe._id)
                console.log(currentRecipe)
                displayRecipe(existingRecipes[currentRecipe._id])
            })
            $("#recipeForm").trigger("reset")
            $("#addingredients").tagsinput("removeAll")
            $("#update").css("visibility", "hidden")
            $("#submit").css("visibility", "visible")

        })
}

function deleteRecipe() {
    let data = {id:currentRecipe._id};
    let json = JSON.stringify(data)

    fetch('/delete', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(r => r.json())
        .then(r => {
            console.log(r)
            loadRecipesFromServer().then(() => {
                $('select[name=selectrecipe]').val("default")
            })
            $("#recipeForm").trigger("reset")
            $("#addingredients").tagsinput("removeAll")
            $("#update").css("visibility", "hidden")
            $("#submit").css("visibility", "visible")
            $("#recipedisplay").css("visibility", "hidden")
        })
}

