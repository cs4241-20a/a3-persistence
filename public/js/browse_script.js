window.onload = function()
{
  console.log("browse window loaded");
  
  getUserCookbook();
  
  //fetchAllRecipes();
}

let userCookbook = null;

function getUserCookbook()
{
  fetch('/get_cookbook', {
    method: 'GET',
    credentials: "include"
    
  }).then(response => response.json()).then(function(jsonData) {
      console.log("json cookbook: ", jsonData);
      userCookbook = jsonData;
      fetchAllRecipes();
  })
}

let recipeBook = []
function fetchAllRecipes()
{
 
  fetch ('/get_recipes', {
    method: 'GET',
    
  }).then(response => response.json()).then(function(jsonData) {
    recipeBook = []
    for(var i = 0; i < jsonData.length; i++)
      {
        var recipe = jsonData[i];
        console.log("recipe: "+recipe["recipe_title"]);
        recipeBook.push(recipe);
      }
    
    populateCards();
  }) 
}

function addRecipe(recipeId)
{
  console.log("add recipe id: ", recipeId);
  
  fetch("/add_to_cookbook", {
    method: 'POST',
    body: JSON.stringify({recipe_id: recipeId}),
    
    headers: {
      "Content-Type": "application/json"
    }
    
  }).then(response => response.json()).then(function(jsonData) {
    console.log("response from add request: ", jsonData);
    document.getElementById(recipeId).classList.add("disabled");
    document.getElementById(recipeId).innerHTML = "In Cookbook";
  })
}

let recipeCardTemplate = `
            <img src="RECIPE_IMAGE_URL" class="card-img-top" style="width:286px; height:286px" alt="...">
            <div class="card-body">
              <h5 class="card-title">RECIPE_TITLE</h5>
              <p class="card-text">RECIPE_CONTENT</p>
              <a href="#" id="RECIPE_DB_ID" class="btn btn-primary" onclick="addRecipe(this.id)">Add Recipe</a>
            </div>
          `;

function populateCards()
{
  var recipeContainer = document.getElementById("recipeListContainer");
  var currentRow = document.getElementById("firstRow");
  
  for(var i = 0; i < recipeBook.length; i++)
  {  
    var recipe = recipeBook[i];
    
    
    if(i > 0 && i % 3 == 0)
    {
      //create new row
      var newRow = document.createElement("div")
      newRow.classList.add("row");
      newRow.style.marginTop = "20px";
      recipeContainer.appendChild(newRow);
      currentRow = newRow;
    }
    
    var recipeTitle = recipe.recipe_title;
    var recipeDescription = "Description of the recipe.";
    var recipeUrl = recipe.image_url;
    if(!recipeUrl)
    {
        recipeUrl = "https://cdn.glitch.com/0438ed38-9212-4ea8-a202-27b7fee4918f%2Fdinner-plate.jpg";
    }
    
    var cardHtml = recipeCardTemplate.slice().replace("RECIPE_IMAGE_URL", recipeUrl).replace("RECIPE_TITLE", recipeTitle).replace("RECIPE_CONTENT", recipeDescription).replace("RECIPE_DB_ID", recipe._id);
    
    var newCardDiv = document.createElement("div");
    newCardDiv.style.overflow = "hidden";
    newCardDiv.style.marginLeft = "20px";
    newCardDiv.style.width = "18rem";
    newCardDiv.classList.add("card");
    newCardDiv.innerHTML = cardHtml;
    
    currentRow.appendChild(newCardDiv);
    
    if(userCookbook.recipes.includes(recipe._id))
    {
        //grey out the add recipe button
        console.log("recipe is in cookbook.");
        document.getElementById(recipe._id).classList.add("disabled");
        document.getElementById(recipe._id).innerHTML = "In Cookbook";
    }
  }
  
}