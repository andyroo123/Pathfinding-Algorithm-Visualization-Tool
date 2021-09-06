const container = document.getElementById("map");

//Variables to keep track of starting and ending data
var startingPointX, startingPointY, startingPoint, startingPointSet = false;
var endingPointX, endingPointY, endingPoint, endingPointSet = false;

// Hold all cells in the grid
var allCells = [];
// Holds whether wallMode is currently engaged or not
var wallMode = false;
// Holds whether checkPoint is currently engaged or not
var chkPtMode = false;
// Holds whether to display the visual visited nodes or not
var visualNodes = true;
// Holds all cells that are walls
var walls = [];
// Holds all cells that are checkPoints
var checkPoints = [];
// Holds all cells that are part of the path to destination
var path = [];
// Holds all cels that are visited
var visitedNodes = [];
// Holds whether the current dragmode is make or delete
var dragMode = "makeWall";
// Holds the current algorithm in use
var currAlgo = "AStar";

var rows = 30, cols = 65;
makeRows(rows, cols);

function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);

  //Gets size for of map element and asigns to variables
  let mapWidth = map.offsetWidth;
  let mapHeight = map.offsetHeight;
  var xPos = document.createAttribute("xPos");
  var yPos = document.createAttribute("yPos");
  let x = 1, y = 1, currId = 0;

  for (c = 0; c < (rows * cols); c++) {
    //Create x and y position attributes
    let cell = document.createElement("div");
    var xPos = document.createAttribute("xPos");
    var yPos = document.createAttribute("yPos");
    var isWall = document.createAttribute("isWall");
    var idNum = document.createAttribute("idNum");
    var isCheckPoint = document.createAttribute("isChkPt");

    cell.style.height = mapWidth / cols + 'px';
    cell.setAttribute("idNum", currId.toString());
    currId = currId + 1;
    xPos.value = x;
    yPos.value = y;
    cell.setAttribute("xPos", xPos.value);
    cell.setAttribute("yPos", yPos.value);
    cell.setAttribute("isWall", "false");
    cell.setAttribute("isChkPt", "false");
    cell.setAttribute("draggable", "true");

    //cell.innerText = "(" + cell.getAttribute("idNum") + ")";
    container.appendChild(cell).className = "grid-item";
    cell.style.backgroundColor = "#E7F2F8";
    allCells.push(cell);

    x++;
    if(x > cols) x = 1;
    if(x == 1) y++;

    // Adds event listener for rightclick setting the endpoint
    cell.addEventListener("auxclick", function(){
      if(!endingPointSet) {
        endingPointSet = true;
      } else {
        endingPoint.style.backgroundColor = "#E7F2F8";
      }
      endingPointX = cell.getAttribute("xPos");
      endingPointY = cell.getAttribute("yPos");
      endingPoint = cell;
      endingPoint.style.backgroundColor = "red";
      cell.setAttribute("isWall", "NA");
      cell.setAttribute("isChkPt", "false");
    });

    // Adds event listener for leftclick setting depending on the wallmode
    cell.addEventListener("mousedown", function(){
      if(wallMode == false && chkPtMode == false && event.button == 0) {
        if(!startingPointSet) {
          startingPointSet = true;
        } else {
          startingPoint.style.backgroundColor = "#E7F2F8";
        }
        startingPointX = cell.getAttribute("xPos");
        startingPointY = cell.getAttribute("yPos");
        startingPoint = cell;
        cell.classList.add("cell-add-animation");
        startingPoint.style.backgroundColor = "green";
        cell.setAttribute("isWall", "NA");
      } else if(chkPtMode == true && event.button == 0) {
        chkPt = cell.getAttribute("isChkPt");
        cell.classList.add("cell-add-animation");
        if(chkPt == "false") {
          cell.style.backgroundColor = "#264e70";
          checkPoints.push(cell);
          cell.setAttribute("isChkPt", "true");
        } else {
          cell.style.backgroundColor = "#E7F2F8";
          cell.setAttribute("isChkPt", "false");
          for(i = 0; i < checkPoints.length; i++) {
            if(checkPoints[i] == cell)
            checkPoints.splice(i, 1);
          }
        }
      } else if(event.button == 0){
        currCellMode = cell.getAttribute("isWall");
        if(currCellMode == "false") {
          dragMode = "makeWall";
          walls.push(cell);
          cell.setAttribute("isWall", "true");
          cell.style.backgroundColor = "#74BDCB";
        } else if(currCellMode == "true") {
          dragMode = "deleteWall";
          removeFromArray(walls, cell);
          cell.setAttribute("isWall", "false");
          cell.style.backgroundColor = "#E7F2F8";
        }
      }
    });

    // Adds click and drag functionality to add walls quickly
    cell.addEventListener("dragover", function(){
      if(wallMode == true) {
        if(cell.getAttribute("isWall") == "false" && dragMode == "makeWall") {
          walls.push(cell);
          cell.setAttribute("isWall", "true");
          cell.classList.add("add-wall-animation");
          cell.classList.remove("delete-wall-animation");
          cell.style.backgroundColor = "#74BDCB";
        } else if(cell.getAttribute("isWall") == "true" && dragMode == "deleteWall"){
          cell.classList.remove("add-wall-animation");
          removeFromArray(walls, cell);
          cell.setAttribute("isWall", "false");
          cell.classList.add("delete-wall-animation");
          cell.style.backgroundColor = "#E7F2F8";
        }
      }
    });
  };
}

// Removes the @element from @array
function removeFromArray(array, element) {
  for(i = 0; i < array.length; i++) {
    if(array[i] == element) {
      array.splice(i, 1);
      i = array.length;
    }
  }
}

// Sets visualizers current algorithm to AStar
function setAStarMode(){
  currAlgo = "AStar";
  document.getElementById("AStarBtn").style.backgroundColor = "#264e70";
  document.getElementById("DijkstraBtn").style.backgroundColor = "#e0fbfc";
}

// Sets visualizers current algorithm to Dijkstra
function setDijkstraMode(){
  currAlgo = "Dijkstra";
  document.getElementById("AStarBtn").style.backgroundColor = "#e0fbfc";
  document.getElementById("DijkstraBtn").style.backgroundColor = "#264e70";
}

// Sets up wall mode upon button press
function initWallMode() {
  var currButton = document.getElementById('wallBtn');
  if(wallMode == false && chkPtMode == true) {
    currButton.style.backgroundColor = "#1b2738";
    wallMode = true;
    document.getElementById("chkPtBtn").style.backgroundColor = "#e0fbfc";
    chkPtMode = false;
  } else if(wallMode) {
    currButton.style.backgroundColor = "#e0fbfc";
    wallMode = false;
  } else {
    currButton.style.backgroundColor = "#1b2738";
    wallMode = true;
  }
}

function changeVisualNodes() {
  var currButton = document.getElementById('showVisited');
  if(visualNodes == true) {
    currButton.style.backgroundColor = "#1b2738";
    visualNodes = false;
  } else {
    currButton.style.backgroundColor = "#e0fbfc";
    visualNodes = true;
  }
}

// Sets up checkpoint mode upon button press
function initChkPtMode() {
  var currButton = document.getElementById('chkPtBtn');
  if(chkPtMode == false && wallMode == true) {
    currButton.style.backgroundColor = "#1b2738";
    chkPtMode = true;
    document.getElementById("wallBtn").style.backgroundColor = "#e0fbfc";
    wallMode = false;
  } else if(chkPtMode) {
    currButton.style.backgroundColor = "#e0fbfc";
    chkPtMode = false;
  }
  else {
    currButton.style.backgroundColor = "#1b2738";
    chkPtMode = true;
  }
}

// Clears all walls on the map
function clearWallsAndChkPts() {
  while(walls.length > 0) {
    currCell = walls.pop();
    currCell.style.backgroundColor = "#E7F2F8";
    currCell.setAttribute("isWall", "false");
  }
  while(checkPoints.length > 0) {
    currCell = checkPoints.pop();
    currCell.style.backgroundColor = "#E7F2F8";
    currCell.setAttribute("isChkPt", "false");
  }
  clearPath(path);
}

// Start the desired algorithm
function startAlgo() {
  clearPath(path);
  if(currAlgo == "AStar") {
    if(checkPoints.length == 0) {
      var start = new Node(startingPointX, startingPointY);
      start.parent = 0;
      var end = new Node(endingPointX, endingPointY);
      var end = aStarAlgo(start, end);
      getPath(end);    
    } else {
      var start = new Node(startingPointX, startingPointY);
      start.parent = 0;
      var end = new Node(endingPointX, endingPointY);
      var end = aStarAlgoWithChkPoints(start, end);
      getPath(end);
    }
    addVisuals();
  }
}

function addVisuals() {
  var currIndex = 0;
  if(visualNodes) {
    var animate = setInterval(function(){
      if(visitedNodes[currIndex] != endingPoint && visitedNodes[currIndex].getAttribute("isChkPt") == "false") {
        visitedNodes[currIndex].style.backgroundColor = "#f9b4ab";
        visitedNodes[currIndex].classList.add("cell-add-animation");
      }
      currIndex++;
      if(currIndex == visitedNodes.length - 1)
      {
        for(i = 0; i < path.length - 1; i++) {
          var currX = path[i].xPos;
          var currY = path[i].yPos;
          var currID = (currX - 1) + cols * (currY - 1);
          var currCell = allCells[currID];
          currCell.style.backgroundColor = "#679186";
          for(j = 0; j < checkPoints.length; j++) {
            if(currCell == checkPoints[j]){
              currCell.style.backgroundColor = "#264e70";
            } 
          }
        }
        clearInterval(animate);
      }
    }, 60);
  } else {
    for(i = 0; i < path.length - 1; i++) {
      var currX = path[i].xPos;
      var currY = path[i].yPos;
      var currID = (currX - 1) + cols * (currY - 1);
      var currCell = allCells[currID];
      currCell.style.backgroundColor = "#679186";
      for(j = 0; j < checkPoints.length; j++) {
        if(currCell == checkPoints[j]){
          currCell.style.backgroundColor = "#264e70";
        } 
      }
    }
  } 
}

// Constructor for creating new nodes
class Node {
  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.gScore = 0;
    this.fScore = 0;
    this.parent = Node;
  }
}

// Gets the path from the end node to the start node, stores in array
function getPath(node) {
  let iteration = 0;
  while(node.parent != null) {
    if(iteration != 0)
      path.push(node);
    node = node.parent;
    iteration = 1;
  }
}

// clears the previous path
function clearPath(path) {
  for(i = 0; i < visitedNodes.length; i++){
    if(visitedNodes[i] != endingPoint)
      visitedNodes[i].style.backgroundColor = "#E7F2F8";
  }
  visitedNodes.splice(0, visitedNodes.length);
  path.splice(0, path.length);
}
// Uses AStar pathinfinding algorithm to find closest distance between two nodes while visiting all checkpoints
function aStarAlgoWithChkPoints(start, end) {
  var nodeCheckPoints = [];
  startNode = start;

  for(i = 0; i < checkPoints.length; i++) {
    nodeCheckPoints.push(new Node(checkPoints[i].getAttribute("xPos"), checkPoints[i].getAttribute("yPos")));    
  }
  shortestDistNode = nodeCheckPoints[0];
  while(nodeCheckPoints.length > 0) {
    shortestDistanceToStart = euclideanDistance(start, nodeCheckPoints[0]);
    currIndexOfShortestDist = 0;
    for(i = 1; i < nodeCheckPoints.length; i++) {
      currDist = euclideanDistance(start, nodeCheckPoints[i]);
      if(currDist < shortestDistanceToStart) {
        shortestDistanceToStart = currDist;
        shortestDistNode = nodeCheckPoints[i];
      }
    }

    endNode = aStarAlgo(startNode, nodeCheckPoints[currIndexOfShortestDist])
    startNode = nodeCheckPoints[currIndexOfShortestDist];
    startNode.parent = endNode;
    nodeCheckPoints.splice(currIndexOfShortestDist, 1);
  }
  lastPath = aStarAlgo(endNode, end);
  return lastPath;
}

// Uses AStar pathinfinding algorithm to find closest distance between two nodes
function aStarAlgo(start, end) {

  // Create start/end nodes along with open/closed lists
  var openList = [start];
  var closedList = [];

  start.fScore = start.gScore + diagonalDistance(start, end);
  var currentNode;
  while (openList.length != 0) {
    currentNode = getLowFScoreFromOpen(openList);
    if (currentNode.xPos == end.xPos && currentNode.yPos == end.yPos) {
      return currentNode;
    }      
    // Adds currentNode to closedList
    closedList.push(currentNode);
    var neighbors = getNeighbors(currentNode);
    for(a = 0; a < neighbors.length; a++) {
      if(!isNodeInList(neighbors[a], closedList)) {
        neighbors[a].fScore = neighbors[a].gScore + diagonalDistance(neighbors[a], end);
        if(!isNodeInList(neighbors[a], openList)) {
          openList.push(neighbors[a]);
          showNode(neighbors[a]);
        } else {
          neighborInOpenList = neighbors[a];
          if(neighbors[a].gScore < neighborInOpenList.gScore) {
            neighborInOpenList.gScore = neighbors[a].gScore;
            neighborInOpenList.parent = neighbors[a].parent;
          }
        }
      }
    }
  }
  alert("PATH NOT FOUND");
}

// Updates the asthetic of the @node
function showNode(node) {
  currCell = allCells[(node.xPos - 1) + cols * (node.yPos - 1)];
  visitedNodes.push(currCell);
}

// Returns true if node is in list, returns false otherwise
function isNodeInList(node, list) {
  for(i = 0; i < list.length; i++) {
    if(node.xPos == list[i].xPos && node.yPos == list[i].yPos)
      return true;
  }
  return false;
}

// Returns the set of possible neighbors to the current node and calcs the g score
function getNeighbors(node) {
  var listOfNeighbors = [];
  // Adds possible neighbors to listOfNeighbors
  for(i = -1; i <= 1; i++) {
    for(j = -1; j <= 1; j++) {
      let possibleNeighbor = new Node(Number(node.xPos) + i, Number(node.yPos) + j);
      if(1 <= possibleNeighbor.xPos && possibleNeighbor.xPos <= 65 && 1 <= possibleNeighbor.yPos && possibleNeighbor.yPos <= 30) {
        if(!(i == 0 && j == 0) && checkIfWall(possibleNeighbor) == false && checkCorner(i, j, possibleNeighbor)) {
          listOfNeighbors.push(possibleNeighbor);  
        }
      }
    }
  }
  // Calcs the g score for each neighbor node
  for(i = 0; i < listOfNeighbors.length; i++) {
    // if neighbor is a diagonal to node
    if(Math.abs(node.xPos - listOfNeighbors[i].xPos) == 1 && Math.abs(node.yPos - listOfNeighbors[i].yPos) == 1) {
      listOfNeighbors[i].gScore = node.gScore + 1.414; // diagonal dist const
    } else { // if neighbor is not a diagonal to node
      listOfNeighbors[i].gScore = node.gScore + 1; // non diagonal dist const
    }
    listOfNeighbors[i].parent = node;
  }
  return listOfNeighbors;
}

// Checks is the current node is a wall
function checkIfWall(possibleNeighbor) {
  for(let i = 0; i < walls.length; i++){
    if(walls[i].getAttribute("xPos") == possibleNeighbor.xPos && walls[i].getAttribute("yPos") == possibleNeighbor.yPos) {
      return true;
    }
  }
  return false;
}

// Checks is a corner neighbor is surrounded by walls therefore making a path to it impossible
function checkCorner(i, j, node) {
  let nextTo1, nextTo2, found = false;
  if(i == 1 && j == 1) {
    nextTo1 = new Node(Number(node.xPos), Number(node.yPos) - 1);
    nextTo2 = new Node(Number(node.xPos) - 1, Number(node.yPos));
    found = true;
  } else if(i == -1 && j == -1) {
    nextTo1 = new Node(Number(node.xPos) + 1, Number(node.yPos));
    nextTo2 = new Node(Number(node.xPos), Number(node.yPos) + 1);
    found = true;
  } else if(i == -1 && j == 1) {
    nextTo1 = new Node(Number(node.xPos), Number(node.yPos) - 1);
    nextTo2 = new Node(Number(node.xPos) + 1, Number(node.yPos));
    found = true;
  } else if(i == 1 && j == -1) {
    nextTo1 = new Node(Number(node.xPos) - 1, Number(node.yPos));
    nextTo2 = new Node(Number(node.xPos), Number(node.yPos) + 1);
    found = true;
  }
  if(found) {
    if(checkIfWall(nextTo1) && checkIfWall(nextTo2)) {
      return false;
    }
  }
  return true;
}

// Returns the node with the lowest fScore from the open list
function getLowFScoreFromOpen(openList) {
  var lowestF = openList[0], lowestFPos = 0;
  for(let i = 1; i < openList.length; i++) {
    if(openList[i].fScore < lowestF.fScore)
      lowestF = openList[i], lowestFPos = i;
  }
  openList.splice(lowestFPos, 1);
  return lowestF;
}

// Calculates the Heuristic score between two nodes using euclidean distance
function euclideanDistance(start, next) {
  var hScore = Math.sqrt(Math.pow(start.xPos - next.xPos, 2) + Math.pow(start.yPos - next.yPos, 2));
  return hScore
}

// Calculates the diaginal heuristic distance between start and next
function diagonalDistance(start, next) {
  var xDif = Math.abs(start.xPos - next.xPos);
  var yDif = Math.abs(start.yPos - next.yPos);
  if(xDif > yDif) {
    var maxDif = xDif;
    var minDif = yDif;
   } else {
     var maxDif = yDif;
     var minDif = xDif;
   }
  return 1.414 * minDif + 1 * (maxDif - minDif);
}

// Calculate the manhattan Heuristic score between two nodes
function manhattanHeuristic(start, next) {
  var hScore = Math.abs(start.xPos - next.xPos) + Math.abs(start.yPos - next.yPos);
  return hScore;
}

function dropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



