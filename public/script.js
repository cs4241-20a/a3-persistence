// // define variables that reference elements on our page
// const dreamsList = document.getElementById("dreams");
// const dreamsForm = document.querySelector("form");

// // a helper function that creates a list item for a given dream
// function appendNewDream(dream) {
//   const newListItem = document.createElement("li");
//   newListItem.innerText = dream;
//   dreamsList.appendChild(newListItem);
// }

// // fetch the initial list of dreams
// fetch("/dreams")
//   .then(response => response.json()) // parse the JSON from the server
//   .then(dreams => {
//     // remove the loading text
//     dreamsList.firstElementChild.remove();
  
//     // iterate through every dream and add it to our page
//     dreams.forEach(appendNewDream);
//   });

// // listen for the form to be submitted and add a new dream when it is
// dreamsForm.addEventListener("submit", event => {
//   // stop our form submission from refreshing the page
//   event.preventDefault();

//   fetch("/add", {
//     method: "POST",
//     body: JSON.stringify({dream: dreamsForm.elements.dream.value}),
//     headers: {
//       "Content-Type":"application/json"
//     }
//   })
//   .then(res => res.json())
//   .then(json => {
//     appendNewDream(json.dream);
//   })

//   // reset form
//   dreamsForm.reset();
//   dreamsForm.elements.dream.focus();
// });

//maze generation
class Cell {
  constructor(wallList) {
    this.walls = wallList
  }
  
  getWalls() {
    return this.walls;
  }
}

class Wall {
  constructor() {
    this.exists = true
    this.owner = []
  }
  
  breakWall() {
    this.exists = false
  }
  
  addOwner(newOwner) {
    this.owner.push(newOwner)
  }
}

//from here https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function makeMaze(mazeCol, mazeRow) {
  let grid = []
  for(let i=0; i<mazeRow; i++) {
    grid.push(new Array(mazeCol))
  }
  for(let r=0; r<mazeRow; r++) {
    for(let c=0; c<mazeCol; c++) {
        let top = new Wall()
        let left = new Wall()
        if(r != 0) {
            top = grid[r - 1][c].getWalls()[2]
        }
        if(c != 0) {
            left = grid[r][c - 1].getWalls()[1]
        }
        grid[r][c] = new Cell([top, new Wall(), new Wall(), left])
        for(let i=0; i<4; i++) {
          grid[r][c].getWalls()[i].addOwner(grid[r][c])
        }
    }
  }
  let maze = []
  let wallsToDo = []
  let randomCell = grid[randInt(0, mazeRow - 1)][randInt(0, mazeCol - 1)]
  maze.push(randomCell)
  for(let i=0; i<4; i++) {
      wallsToDo.push(randomCell.getWalls()[i])
  }
  
  while(maze.length < mazeCol * mazeRow) {
    let random = Math.floor(Math.random() * (wallsToDo.length - 1))
    let randomWall = wallsToDo[random]
    if(randomWall.owner.length > 1 && (!maze.includes(randomWall.owner[0]) || !maze.includes(randomWall.owner[1]))) {
      randomWall.breakWall()
      let newOwner = randomWall.owner[!maze.includes(randomWall.owner[0]) ? 0 : 1]
      maze.push(newOwner)
      for(let i=0; i<4; i++) {
        if(newOwner.getWalls()[i].exists) {
          wallsToDo.push(newOwner.getWalls()[i])
        }
      }
    }
    wallsToDo = wallsToDo.filter(wall => wall != randomWall)
    if(wallsToDo.length == 0) {
      console.log("Got Stuck")
      return makeMaze(mazeCol, mazeRow)
    }
  }
  console.log("Done Generating")
  return grid
}

function drawMaze(grid, pS) {
  document.getElementById("maze").innerHTML = ""
  for(let r=0; r<grid.length; r++) {
    let row = document.createElement('div')
    row.style.cssText = 'display:block;width:' + (pS * grid[0].length) + 'px;height:' + pS + 'px;'
    document.getElementById("maze").appendChild(row)
    for(let c=0; c<grid[0].length; c++) {
      let cell = document.createElement('div')
      cell.style.cssText = 'display:inline-block;width:' + pS + 'px;height:' + pS + 'px;background:#E3E3E3'
      if(grid[r][c].getWalls()[0].exists) {cell.style.cssText += 'border-top: 1px solid black'} //top
      if(grid[r][c].getWalls()[1].exists) {cell.style.cssText += 'border-right: 1px solid black'} //right
      if(grid[r][c].getWalls()[2].exists) {cell.style.cssText += 'border-bottom: 1px solid black'} //down
      if(grid[r][c].getWalls()[3].exists) {cell.style.cssText += 'border-left: 1px solid black'} //left
      row.appendChild(cell)
    }
  }
}

function newMaze() {
  let name = document.getElementById("name").value
  let row = parseInt(document.getElementById("rowNum").value, 10)
  let col = parseInt(document.getElementById("colNum").value, 10)
  let s = parseInt(document.getElementById("size").value, 10)
  if(name == "") {
    alert("You must enter a name for your maze.");
  } else if(isNaN(row)) {
    alert("You must enter a number of rows.");
  } else if(isNaN(col)) {
    alert("You must enter a number of columns.");
  } else if(isNaN(s)) {
    alert("You must enter a number for passage width.");
  } else {
    let newMaze = makeMaze(col,row)
    drawMaze(newMaze, s)
    document.getElementById("mazeName").innerText = name
    console.log("Done Drawing") 
  }
}