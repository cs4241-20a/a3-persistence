let recipeBook = [];
let recipeObjects = [];

window.onload = function() {
  
  fetchRecipes();
  
  getUserCookbook();
}

function authGithub()
{
  fetch('/authenticate', {
    method: 'GET',
    mode: 'no-cors'
  }).then(response => console.log("auth response: ", response))
}

function getUserCookbook()
{
  fetch('/get_cookbook', {
    method: 'GET',
    credentials: "include"
    
  }).then(response => response.json()).then(function(jsonData) {
      console.log("json cookbook: ", jsonData);
      getRecipesFromIds(jsonData.recipes);
  } )
}

function getRecipesFromIds(idList)
{
  console.log("fetching user recipes... \n");
  fetch('/get_cookbook_recipes', {
    method: 'POST',
    body: JSON.stringify({recipes: idList}),
    
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json()).then(function(jsonData) {
    console.log("recipes response: ", jsonData);
    
    if(jsonData.recipes.length > 0)
      {
        
        recipeObjects = jsonData.recipes;
        for(var i = 0; i < jsonData.recipes.length; i++)
        {
          var listElement = document.createElement("li");
          listElement.classList.add("list-group-item");
          listElement.innerHTML = jsonData.recipes[i].recipe_title;
          listElement.id = jsonData.recipes[i]._id;
          listElement.addEventListener("click", populateRecipeInfo);
          document.getElementById("cookbookList").appendChild(listElement);
          console.log("child inserted. \n");
        }    
      }else{
        var listElement = document.createElement("li");
        listElement.classList.add("list-group-item");
        listElement.innerHTML = "It looks like you don't have any recipes in your cookbook! Click 'Browse Recipes' to find some. Or, click 'Add Recipe' below to add your own!";
        document.getElementById("cookbookList").appendChild(listElement);
      }
  })
}

function deleteRecipe()
{
  var recipeList = document.getElementById("cookbookList");
  var selectedElement = null;
  for(var i = 0; i < recipeList.children.length; i++)
  {
      if(recipeList.children[i].classList.contains("active"))
      {
        selectedElement = recipeList.children[i];
        break;
      }
  }
  
  console.log("selected id: ", selectedElement.id);
  //check if checkbox is checked.
  var checkboxValue = document.getElementById("deleteFromDb").checked;
  
  var deleteRequest = {
    recipe_id: selectedElement.id,
    delete_from_db: checkboxValue
  }
  
  fetch("/delete_recipe", {
    method: "POST",
    body: JSON.stringify(deleteRequest),
    
    headers: {
      "Content-Type": "application/json"
    }
    
  }).then(result => result.json()).then(function(jsonData) {
      //console.log("delete response: ", jsonData)
      //console.log("deleted_id: ", jsonData.deleted_id);
      jsonData = JSON.parse(jsonData);
      $("#deleteRecipeModal").modal('hide');
      //remove deleted element from the list
      var cookbookList = document.getElementById("cookbookList");
      for(var i = 0; i < cookbookList.children.length; i++)
      {
          if(cookbookList.children[i].id === jsonData["deleted_id"])
          {
              cookbookList.removeChild(cookbookList.children[i]);
              break;
          }else{
            console.log("deleted_id: ", jsonData["deleted_id"], ", id: ", cookbookList.children[i].id);
          }
      }
    
  })
  
}

function deleteRecipeModal()
{
  console.log("delete recipe called!");
  //get currently selected recipe
  var recipeList = document.getElementById("cookbookList");
  var selectedElement = null;
  for(var i = 0; i < recipeList.children.length; i++)
  {
      if(recipeList.children[i].classList.contains("active"))
      {
        selectedElement = recipeList.children[i];
        break;
      }
  }
  
  document.getElementById("deleteRecipeText").innerHTML = "Are you sure you want to delete '" + selectedElement.innerHTML + "' from your cookbook?";
}

function populateRecipeInfo()
{
  var id = this.id;
  //console.log("populateRecipeInfo( ", id, " )");
  var cookbookList = document.getElementById("cookbookList").children;
  document.getElementById("deleteButton").classList.remove('disabled');
  for(var i = 0; i < cookbookList.length; i++)
  {
      cookbookList[i].classList.remove("active");
  }
  this.classList.add("active");
  
  var recipeObject = null;
  for(var i = 0; i < recipeObjects.length; i++)
  {
    if(recipeObjects[i]._id === id)
      {
        recipeObject = recipeObjects[i];
        break;
      }
  }
  
  if(recipeObject == null)
  {
      console.log("No recipe cached. fetching... \n");
      fetch('/get_recipe?recipe_id='+id, {
        method:'GET'
      }).then(response => response.json()).then(function(jsonData) {
        insertRecipeInfo(jsonData)
        recipeObjects.push(jsonData);  
      });
  }else{
    insertRecipeInfo(recipeObject);
  }
  
//   var recipeInfo = document.getElementById("recipeInfo");
//   console.log("Recipe Object: "+JSON.stringify(recipeObject));
//   recipeInfo.innerHTML = "";
//   recipeInfo.innerHTML = "<h3>" +recipeObject.recipe_title + "</h3><br />";
//   var newIngredients = "<h4>Ingredients: </h3>"+recipeObject.ingredients;
//   newIngredients = newIngredients.split("\n").join("<br />");
//   recipeInfo.innerHTML += newIngredients + "<br />";
//   recipeInfo.innerHTML += "<h3> Instructions: </h3>";
//   recipeInfo.innerHTML += recipeObject.instructions;
//   //populate the table with the information from this recipe
  
}

function insertRecipeInfo(recipeObject)
{
  var recipeInfo = document.getElementById("recipeInfo");
  console.log("Recipe Object: "+JSON.stringify(recipeObject));
  recipeInfo.innerHTML = "";
  recipeInfo.innerHTML = "<h3>" +recipeObject.recipe_title + "</h3><br />";
  var newIngredients = "<h4>Ingredients: </h3>"+recipeObject.ingredients;
  newIngredients = newIngredients.split("\n").join("<br />");
  recipeInfo.innerHTML += newIngredients + "<br />";
  recipeInfo.innerHTML += "<h3> Instructions: </h3>";
  recipeInfo.innerHTML += recipeObject.instructions;
}

function submitRecipe()
{
  var recipeTitle = document.getElementById("recipeTitle").value;
  var recipeIngredients = document.getElementById("ingredientsText").value;
  var recipeInstructions = document.getElementById("instructionsText").value;
  var recipeImageUrl = document.getElementById("recipeImage").value;
  if(recipeImageUrl === "")
  {
      recipeImageUrl = "https://cdn.glitch.com/0438ed38-9212-4ea8-a202-27b7fee4918f%2Fdinner-plate.jpg";
  }
  
  console.log("submit recipe called.")
  if(recipeTitle.replace(" ", "") !== "")
  {
      if(recipeIngredients.replace(" ", "") !== "")
      {
        if(recipeInstructions.replace(" ", "") !== "")
        {
          //parse instructions into an array
          recipeInstructions = recipeInstructions.replace("/\r\n/g", "\n").split("\n");
          console.log("pushing recipe....");
          pushRecipe(recipeTitle, recipeIngredients, recipeInstructions, recipeImageUrl)
          
          document.getElementById("recipeTitle").value = "";
          document.getElementById("ingredientsText").value = "";
          document.getElementById("instructionsText").value = "";
          document.getElementById("recipeImage").value = "";
          document.getElementById("recipeTitleError").innerHTML = "";
          document.getElementById("recipeInstructionsError").innerHTML = "";
          document.getElementById("recipeIngredientsError").innerHTML = "";
        }
        else{
          console.log("recipe instructions was blank");
          document.getElementById("recipeInstructionsError").innerHTML = "Please provide instructions for this recipe.";
        }
      }else{
          console.log("recipe ingredients was blank");
          document.getElementById("recipeIngredientsError").innerHTML = "Please provide ingredients for this recipe.";
      }
      
  }else{
    console.log("recipe title was blank");
    document.getElementById("recipeTitleError").innerHTML = "Please provide title for this recipe.";
  }
}

function pushRecipe(title, ingredients, instructions, imageUrl)
{
  var recipe = {
    recipe_title: title,
    ingredients: ingredients,
    instructions: instructions,
    image_url: imageUrl
  }

  fetch( '/add_recipe', {
    method:'POST',
    body:JSON.stringify(recipe),
    
    headers: {
      "Content-Type": "application/json"
    }
    
  }).then(response => response.json())
  .then( function(jsonData) {
    console.log("response from recipe push. ");
    $("#addRecipeModal").modal('hide');
    console.log("closed modal. ");
    console.log("recipe: ", jsonData);
    var recipeTitle = jsonData.recipe_title;
    addRecipeToCookbook(jsonData._id, recipeTitle);
  }); 
}

function addRecipeToCookbook(recipe_id, recipeTitle)
{
  fetch("/add_to_cookbook", {
    method: 'POST',
    body: JSON.stringify({recipe_id: recipe_id}),
    
    headers: {
      "Content-Type": "application/json"
    }
    
  }).then(response => response.json()).then(function(jsonData) {
    var listItem = document.createElement("li");
    listItem.innerHTML = recipeTitle;
    listItem.classList.add("list-group-item");
    listItem.addEventListener("click", populateRecipeInfo);
    listItem.id = recipe_id;
    document.getElementById("cookbookList").appendChild(listItem);
  })
}

function fetchRecipes()
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
  }) 
}

