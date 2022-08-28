/**
 * 15-puzzle.js
 *
 * Copyright (c) 2015 Arnis Ritins
 * Released under the MIT license
 */
(function(){
	
	var state = 1;
	var puzzle = document.getElementById('puzzle');

	// Creates solved puzzle
	solve();
	
	// Listens for click on puzzle cells
	puzzle.addEventListener('click', function(e){
		if(state == 1){
			// Enables sliding animation
			puzzle.className = 'animate';
			shiftCell(e.target);
		}
	});
	
	// Listens for click on control buttons
	document.getElementById('solve').addEventListener('click', solve);
	document.getElementById('scramble').addEventListener('click', scramble);

	/**
	 * Creates solved puzzle
	 *
	 */
	function solve(){
		
		if(state == 0){
			return;
		}
		
		puzzle.innerHTML = '';
		
		var n = 1;
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				var cell = document.createElement('span');
				cell.id = 'cell-'+i+'-'+j;
				cell.style.left = (j*80+1*j+1)+'px';
				cell.style.top = (i*80+1*i+1)+'px';
				
				if(n <= 15){
					cell.classList.add('number');
					cell.classList.add((i%2==0 && j%2>0 || i%2>0 && j%2==0) ? 'dark' : 'light');
					cell.innerHTML = (n++).toString();
				} else {
					cell.className = 'empty';
				}
				
				puzzle.appendChild(cell);
			}
		}
		
	}

	/**
	 * Shifts number cell to the empty cell
	 * 
	 */
	function shiftCell(cell){
		
		// Checks if selected cell has number
		if(cell.clasName != 'empty'){
			
			// Tries to get empty adjacent cell
			var emptyCell = getEmptyAdjacentCell(cell);
			
			if(emptyCell){
				// Temporary data
				var tmp = {style: cell.style.cssText, id: cell.id};
				
				// Exchanges id and style values
				cell.style.cssText = emptyCell.style.cssText;
				cell.id = emptyCell.id;
				emptyCell.style.cssText = tmp.style;
				emptyCell.id = tmp.id;
				
				if(state == 1){
					// Checks the order of numbers
					setTimeout(checkOrder, 150);
				}
			}
		}
		
	}

	/**
	 * Gets specific cell by row and column
	 *
	 */
	function getCell(row, col){
	
		return document.getElementById('cell-'+row+'-'+col);
		
	}

	/**
	 * Gets empty cell
	 *
	 */
	function getEmptyCell(){
	
		return puzzle.querySelector('.empty');
			
	}
	
	/**
	 * Gets empty adjacent cell if it exists
	 *
	 */
	function getEmptyAdjacentCell(cell){
		
		// Gets all adjacent cells
		var adjacent = getAdjacentCells(cell);
		
		// Searches for empty cell
		for(var i = 0; i < adjacent.length; i++){
			if(adjacent[i].className == 'empty'){
				return adjacent[i];
			}
		}
		
		// Empty adjacent cell was not found
		return false;
		
	}

	/**
	 * Gets all adjacent cells
	 *
	 */
	function getAdjacentCells(cell){
		
		var id = cell.id.split('-');
		
		// Gets cell position indexes
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		
		var adjacent = [];
		
		// Gets all possible adjacent cells
		if(row < 3){adjacent.push(getCell(row+1, col));}			
		if(row > 0){adjacent.push(getCell(row-1, col));}
		if(col < 3){adjacent.push(getCell(row, col+1));}
		if(col > 0){adjacent.push(getCell(row, col-1));}
		
		return adjacent;
		
	}
	
	/**
	 * Chechs if the order of numbers is correct
	 *
	 */
	function checkOrder(){
		
		// Checks if the empty cell is in correct position
		if(getCell(3, 3).className != 'empty'){
			return;
		}
	
		var n = 1;
		// Goes through all cells and checks numbers
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				if(n <= 15 && getCell(i, j).innerHTML != n.toString()){
					// Order is not correct
					return;
				}
				n++;
			}
		}
		
		// Puzzle is solved, offers to scramble it
		if(confirm('Congrats, You did it! \nScramble the puzzle?')){
			scramble();
		}
	
	}

	/**
	 * Scrambles puzzle
	 *
	 */
	function scramble(){
	
		if(state == 0){
			return;
		}
		
		puzzle.removeAttribute('class');
		state = 0;
		
		var previousCell;
		var i = 1;
		var interval = setInterval(function(){
			if(i <= 100){
				var adjacent = getAdjacentCells(getEmptyCell());
				if(previousCell){
					for(var j = adjacent.length-1; j >= 0; j--){
						if(adjacent[j].innerHTML == previousCell.innerHTML){
							adjacent.splice(j, 1);
						}
					}
				}
				// Gets random adjacent cell and memorizes it for the next iteration
				previousCell = adjacent[rand(0, adjacent.length-1)];
				shiftCell(previousCell);
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 5);

	}
	
	/**
	 * Generates random number
	 *
	 */
	function rand(from, to){

		return Math.floor(Math.random() * (to - from + 1)) + from;

	}

}());
