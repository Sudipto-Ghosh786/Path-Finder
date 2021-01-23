const table = document.getElementById('table');
let a = [];
let visited = [];
let trackPreviousTargetPosition = [];
let trackPreviousSourcePosition = [];

let index1 = 0, index2 = 0;
let found = false;
let isToggled = false;
let showGrid = true;
let functionInProgress = false;

let speed = 18;


/**********Building 2d array out of the table********/

for(let i = 0;i < table.rows.length;i++) {
	let tableRows = table.rows[i];
	let temp = [];
	for(let j = 0;j < tableRows.cells.length;j++) {
		let element = tableRows.cells[j];
		temp.push(element);
	}
	a.push(temp);
}

let rows = a.length;
let col = a[0].length;


/**********Initializing seen for BFS*********/
let seen = [];
for(let i = 0;i < rows;i++) {
	let temp = [];
	for(let j = 0;j < col;j++) {
		temp.push([-1, -1]);
	}	
	seen.push(temp);
}

let distance = 0;
let shortestPath = [];


/*******Target Element Initial Values******/

let sourceElement = a[6][5];
let sourceX = 6;
let sourceY = 5;
let sourceElementSelected = false;
sourceElement.id = 'source';


let wallSelected = false;


/*******Source Element Initial Values******/

let targetElement = a[6][39];
targetElementSelected = false;
let targetX = 6;
let targetY = 39;
targetElement.id='target';

let bodyColor = 'black';













/********************************BREADTH FIRST SEARCH*******************************/

let elementFound = false;

async function bfs(x, y) {
	let q = [];
	q.push([x, y]);
	let flag = 1;
	while(q.length != 0) {
		let cor = q.shift();
		let i1 = cor[0];
		let i2 = cor[1];

		if(a[i1][i2] === targetElement) {
			elementFound = true;
			break;
		}
		if(i1 === x && i2 === y) {
			a[x][y].style.backgroundColor = 'lime';
		}
	 	else {
	 		a[i1][i2].style.animation = 'backgroundChange';
			a[i1][i2].style.animationDuration = '0.1s';

			await new Promise(resolve => {
				setTimeout((e) => {
					resolve();
				}, speed);
			})

			a[i1][i2].style.backgroundColor = 'red'; 
			a[i1][i2].style.animation = '';
			a[i1][i2].style.animationDuration = '';
 	
		}
		await new Promise(resolve => {
			setTimeout((e) => {
				resolve();
			}, speed);
		})

		if(i1 < a.length - 1 && visited[[i1 + 1, i2]] !== 1 && a[i1 + 1][i2].style.backgroundColor !== 'white') {
			q.push([i1 + 1, i2]);
			visited[[i1 + 1, i2]] = 1;
			seen[i1 + 1][i2] = [i1, i2];
		}
		if(i1 > 0 && visited[[i1 - 1, i2]] !== 1 && a[i1 - 1][i2].style.backgroundColor !== 'white') {
			q.push([i1 - 1, i2]);
			visited[[i1 - 1, i2]] = 1;
			seen[i1 - 1][i2] = [i1, i2];	
		}
		if(i2 < a[0].length - 1 && visited[[i1, i2 + 1]] !== 1 && a[i1][i2 + 1].style.backgroundColor !== 'white') {
			q.push([i1, i2 + 1]);
			visited[[i1, i2 + 1]] = 1;
			seen[i1][i2 + 1] = [i1, i2];
		}
		if(i2 > 0 && visited[[i1, i2 - 1]] !== 1 && a[i1][i2 - 1].style.backgroundColor !== 'white') {
			q.push([i1, i2 - 1]);
			visited[[i1, i2 - 1]] = 1;
			seen[i1][i2 - 1] = [i1, i2];
		}
		flag = 0;
	}
}



function backtrack(x, y) {
	let temp = seen[x][y];
	let flag = 1;
	shortestPath.push(temp);
	while(temp[0] !== -1 && temp[1] !== -1){
		let par = seen[temp[0]][temp[1]];
		temp = par;
		flag = 0;
		shortestPath.push(temp);
		distance++;
	}
}

async function bfsUtil() {
	removeSelect();
	resetGrid();
	disableButton();
	await bfs(sourceX, sourceY);
	seen[sourceX][sourceY] = [-1, -1];
	if(elementFound) {
		backtrack(targetX, targetY);
		await drawPath();
		elementFound = false;
		targetElement.style.backgroundColor = 'yellow';
	}else {
		alert("Damn, Path to target does not exists !");
	}
	enableButton();
}

/*************************************************************************************/


/*************************************DEPTH FIRST SEARCH**********************************/

let path = [];

async function dfs(x, y, preElementInDFS) {
	if(x < 0 || y < 0 || x >= a.length || y >= a[0].length || visited[[x, y]] === 1 || a[x][y].style.backgroundColor === 'white')   {
		return false;
	}
	path.push([x, y]);
	if(targetElement === a[x][y]) {
		elementFound = true;
		shortestPath = path;
		return true;
	}
	if(sourceX === x && sourceY === y) {
		a[x][y].style.backgroundColor = 'lime'; 
	}else {
		a[x][y].style.animation = 'backgroundChange';
		a[x][y].style.animationDuration = '0.1s';
		  await new Promise(resolve => {
		  	setTimeout(() => {
		  		resolve();
		  	}, speed);
		  })
		 a[x][y].style.backgroundColor = 'red';
		 a[x][y].style.animation = '';
		a[x][y].style.animationDuration = '';

		preElementInDFS = a[x][y];
	}
	visited[[x, y]] = 1;

	await new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, speed);
	})

	if(await dfs(x - 1, y, preElementInDFS) === true) {
		return true;
	} 
	if(await dfs(x, y + 1, preElementInDFS) === true) {
		return true;
	}
	if(await dfs(x + 1, y, preElementInDFS) === true)  {
		return true;
	}
	if(await dfs(x, y - 1, preElementInDFS) === true) {
		return true;
	}
	path.pop();
	a[x][y].style.backgroundColor = 'black';
	await new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, speed);
	})
	return false;
}




async function dfsUtil() {
	disableButton();
	removeSelect();
	resetGrid();
	let preElementInDFS = null;
	await dfs(sourceX, sourceY, preElementInDFS);
	if(elementFound) {
		shortestPath.reverse(); 
		await drawPath();
		elementFound = false;
	}else {
		alert("Damn, Path to target does not exists !");
	}
	enableButton();
}



/*************************************************************************************/


/******HELPER FUNCTIONS*****/


/************************Disable all buttons******************************************/

function disableButton() {
	const allButtons = document.querySelectorAll('button');
	for(let i = 0;i < allButtons.length;i++) {
		allButtons[i].disabled = true;
	}
	functionInProgress = true;
}

/**********************************************************************************/


/********************************Enable all buttons******************************/

function enableButton() {
	const allButtons = document.querySelectorAll('button');
	for(let i = 0;i < allButtons.length;i++) {
		allButtons[i].disabled = false;
	}
	functionInProgress = false;
}

/**********************************************************************************/



/***************************Draw Walls*******************************/

function drawWalls(element) {
	if(wallSelected === true) {
		element.innerHTML = 'Enable Walls';
		wallSelected = false;
		return;
	}
	element.innerHTML = 'Disable Walls';
	sourceElementSelected = false;
	targetElementSelected = false;
	wallSelected = true;
	removeSelect();
}


/**********************************************************************************/


/**********************************Resetting grid*****************************/

function resetGrid() {
	for(let i = 0;i < rows;i++) {
		for(let j = 0;j < col;j++) {
			if(a[i][j].style.backgroundColor !== 'white') {
				a[i][j].style.backgroundColor = 'black';
			}
		}
	}
	visited = [];
	shortestPath = [];
}

/********************************************************************************/

/*******************************Clear walls**************************************/

function removeWalls() {
	resetGrid();
	for(let i = 0;i < rows;i++) {
		for(let j = 0;j < col;j++) {
			if(a[i][j].style.backgroundColor === 'white' && a[i][j] !== targetElement && a[i][j] !== sourceElement) {
				a[i][j].style.backgroundColor = 'black';
			}
		}
	}
}

/**********************************************************************************/



/*******************************Remove selected element***************************/
function removeSelect() {
	if(showGrid) {
		sourceElement.style.border = '0.1px solid skyblue';
		targetElement.style.border = '0.1px solid skyblue';
	}else {
		sourceElement.style.border = 'none';
		targetElement.style.border = 'none';
	}
}

/**********************************************************************************/

/*******************************DRAW THE PATH*************************************/

async function drawPath() {
	for(let i = shortestPath.length - 2;i >= 0;i--) {
		let t = shortestPath[i];
		a[t[0]][t[1]].style.backgroundColor = 'yellow';
		await new Promise(resolve => {
			setTimeout((e) => {
				resolve();
			}, speed);
		})
	}
	while(shortestPath.length > 0) {
		shortestPath.pop();
	}
}

/************************************************************************************/


/************************************Toggling grid************************************/

function toggleGrid(element) {
	if(showGrid === true) {
		element.value = 'Show Grid';
		showGrid = false;
	}else {
		for(let i = 0;i < trackPreviousSourcePosition.length;i++) {
			trackPreviousSourcePosition[i].style.border = 'none';
		}

		for(let i = 0;i < trackPreviousTargetPosition.length;i++) {
			trackPreviousTargetPosition[i].style.border = 'none';
		}

		trackPreviousTargetPosition = [];
		trackPreviousSourcePosition = [];
		showGrid = true;
		element.value = 'Hide Grid';
	}

	for(let i = 0;i < rows;i++) {
		for(let j = 0;j < col;j++) {
			if(showGrid) {
				a[i][j].style.border = '0.1px solid skyblue';
			}else {
				a[i][j].style.border = 'none';
			}
		}
	}
}

/******************************************************************************/


/******Event Listener*****/


/*****************************EVENT HANDLERS***********************/

document.addEventListener('click', (e) => {
	if(e.target && e.target.id === 'target') {
		if(targetElementSelected === false) {
			targetElementSelected = true;
			targetElement.style.border = '0.1px solid red';
			if(showGrid) {
				sourceElement.style.border = '0.1px solid skyblue';
			}else {
				sourceElement.style.border = 'none';
			}
			sourceElementSelected = false;
		}else {
			targetElementSelected = false;
	 		if(showGrid) {
	 			sourceElement.style.border = '0.1px solid skyblue';
	 			targetElement.style.border = '0.1px solid skyblue';
	 		}else {
	 			targetElement.style.border = 'none';
	 			sourceElement.style.border = 'none';
	 		}
	 		sourceElementSelected = false;
		}
		wallSelected = false;
	}
})


 document.addEventListener('click', (e) => {
 	if(e.target && e.target.id === 'source') {
 		if(!sourceElementSelected) {
 		sourceElementSelected = true;
 		sourceElement.style.border = '0.1px solid red';
 		if(showGrid) {
 			targetElement.style.border = '0.1px solid skyblue';
 		}else {
 			targetElement.style.border = 'none';
 		}
 		targetElementSelected = false;
 	}else {
 		sourceElementSelected = false;
 		if(showGrid) {
 			targetElement.style.border = '0.1px solid skyblue';
 			sourceElement.style.border = '0.1px solid skyblue';
 		}else {
 			targetElement.style.border = 'none';
 			sourceElement.style.border = 'none';
 		}
 		targetElementSelected = false;
 	}
 	wallSelected = false
 	}
 })



table.addEventListener('click', (e) => {

	if(functionInProgress === false) {


	if(wallSelected === true) {
		if(sourceElementSelected === false && targetElementSelected === false && e.target.tagName !== 'TBODY' && e.target !== table && e.target.className !== 'table-row'  && e.target !== sourceElement && e.target !== targetElement) {
			if(e.target.style.backgroundColor !== 'white') {
				e.target.style.backgroundColor = 'white';
			}else {
				e.target.style.backgroundColor = 'black';
			}
		}
	}


	if(targetElementSelected === true) {
		let preTarget = targetElement;
		let element = null;
		let newPosFound = false;
		for(let i = 0;i < rows;i++) {
			for(let j = 0;j < col;j++) {
				if(a[i][j] === e.target && a[i][j] !== sourceElement) {
					element = a[i][j];
					targetX = i;
					targetY = j;
					newPosFound = true;
					break;
				}
			}
		}
		if(newPosFound) {
			targetElement = element;
			preTarget.style.backgroundColor = bodyColor;
			preTarget.id = '';
			if(showGrid !== false) {
				preTarget.style.border = '0.1px solid skyblue';
			}else{
				preTarget.style.border = 'none';
			}
			if(showGrid === true) {
				trackPreviousTargetPosition.push(preTarget);
			}
			targetElement.id = 'target';
			targetElement.style.border = '0.1px solid red';
		}
	}


	if(sourceElementSelected === true) {
		let preSource = sourceElement;
		for(let i = 0;i < rows;i++) {
			for(let j = 0;j < col;j++) {
				if(a[i][j] === e.target && a[i][j] !== targetElement) {
					sourceElement = a[i][j];
					sourceX = i;
					sourceY = j;
					break;
				}
			}
		}
		preSource.style.backgroundColor = bodyColor;
		preSource.id = '';
		
		if(showGrid) {
			preSource.style.border = '0.1px solid skyblue';
		}else {
			preSource.style.border = 'none';
		}

		if(showGrid === true) {
			trackPreviousSourcePosition.push(preSource);
		}

		sourceElement.id = 'source';
		sourceElement.style.border = '0.1px solid red';	
	}
}
})




table.addEventListener('mousedown', (e) => {
	if(wallSelected === true) {
		isToggled = true;
	}
})


table.addEventListener('mouseover', (e) => {
	 if(wallSelected === true && isToggled === true) {
	 	if(sourceElementSelected === false && targetElementSelected === false && e.target.tagName !== 'TBODY' && e.target !== table && e.target.className !== 'table-row'  && e.target !== sourceElement && e.target !== targetElement) {
	 		if(e.target.style.backgroundColor !== 'white') {
	 			e.target.style.backgroundColor = 'white';
	 		}
	 	}
	 }
})


table.addEventListener('mouseup', (e) => {
	if(wallSelected === true) {
		isToggled = false;
	}
})


document.querySelector('.dropdown-menu').addEventListener('click', (e) => {
	if(e.target.className === 'dropdown-item') {
		document.querySelector('#dropdownMenuButton').innerHTML = e.target.innerHTML;
		if(e.target.innerHTML === 'FAST') {
			speed = 18;
		}else if(e.target.innerHTML === 'MEDIUM') {
			speed = 25;
		}else {
			speed = 50;
		}
	}
})


/****************************************************************************************/




/**********MAZE GENERATION*********/





/*******************************RANDOMLY GENERATED WALLS*********************************/

function generateMaze() {
	resetGrid();
	removeWalls();
	removeSelect();
	for(let i = 0;i < rows;i++) {
		for(let j = 0;j < col;j++) {
			let XorY = Math.floor(Math.random() * 8);
			let randomNumber = Math.floor(Math.random() * 2);
			if(XorY === 0) {
				//rows
				let k = 0;
				while (k <= randomNumber && i + k < rows) {
					if(a[i + k][j] !== targetElement && a[i + k][j] !== sourceElement) {
						a[i + k][j].style.backgroundColor = 'white';
					}
					k++;
				}
			}else if(XorY === 1){
				let k = 0;
				while (k <= randomNumber && j + k < col) {
					if(a[i][j + k] !== targetElement && a[i][j + k] !== sourceElement) {
						a[i][j + k].style.backgroundColor = 'white';
					}
					k++;
				}
			}
		}
	}
}





function colorIndex(x, y) {
	if(x < 0 || y < 0 || x >= rows || y >= col) {
		return;
	}
	a[x][y].style.backgroundColor = 'red';
}








/**********************************RECURSIVE DIVISION MAZE*************************************/

async function addOuterWalls() {
	for(let i = 0;i < rows;i++) {
		if(i === 0 || i === (rows - 1)) {
			for(let j = 0;j < col;j++) {
				if(a[i][j] !== sourceElement && a[i][j] !== targetElement) {
					a[i][j].style.backgroundColor = 'white';
				}
			}
		}else {
			if(a[i][0] !== sourceElement && a[i][0] !== targetElement) {
				a[i][0].style.backgroundColor = 'white';
			}
			if(a[i][col - 1] !== sourceElement && a[i][col - 1] !== targetElement) {
				a[i][col - 1].style.backgroundColor = 'white'; 
			}
		}
	}
}


function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
} 

async function addHWall(minX, maxX, y) {
	let hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;
	for(let i = minX;i <= maxX;i++) {
		if(i === hole && a[y][i] !== targetElement && a[y][i] !== sourceElement) {
			a[y][i].style.backgroundColor = 'black';
		}else if(a[y][i] !== targetElement && a[y][i] !== sourceElement){
			a[y][i].style.backgroundColor = 'white';
		}
		await new Promise(resolve => {
			setTimeout((e) => {
				resolve();
			}, speed);
		})

	}
}

async function addVWall(minY, maxY, x) {
	let hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
	for(let i = minY;i <= maxY;i++) {
		if(i === hole && a[i][x] !== targetElement && a[i][x] !== sourceElement) {
			a[i][x].style.backgroundColor = 'black';
		}else if(a[i][x] !== targetElement && a[i][x] !== sourceElement){
			a[i][x].style.backgroundColor = 'white';
		}
		await new Promise(resolve => {
			setTimeout((e) => {
				resolve();
			}, speed);
		})
	}
}

async function addInnerWalls(h, minX, maxX, minY, maxY, gt) {
	if(h) {
		if(maxX - minX < 2) {
			return;
		}
		let y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
		await addHWall(minX, maxX, y);

		await addInnerWalls(!h, minX, maxX, minY, y - 1, gt);
		await addInnerWalls(!h, minX, maxX, y + 1, maxY, gt);
	}else {
		if(maxY - minY < 2) {
			return;
		}
		let x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
		await addVWall(minY, maxY, x);
		await addInnerWalls(!h, minX, x - 1, minY, maxY, gt);
		await addInnerWalls(!h, x + 1, maxX, minY, maxY, gt);
	}
}

async function recursiveDivision() {
	disableButton();
	resetGrid();
	removeWalls();
	removeSelect();
	await addOuterWalls();
	await addInnerWalls(true, 1, col - 2, 1, rows - 2, 'yolo');
	enableButton();
}

/**************************************************************************************/