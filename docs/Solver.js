function Solver() {

	function calcLinePossibleSolutions(lineDefinition, size) {
		var solutions = [];

		function calcTotalLength(def, part) {
			var i, len, total = 0;
			for (i = part, len = def.length; i < len; i++) {
				if (i > part) total += 1; // Add space
				total += def[i];
			}
			return total;
		}

		function calcRecursive(solution, def, size, location, part) {
			// If no more parts to lay - add the solution and return true
			if (part >= def.length) {
				solutions.push(solution.slice(0));
				return true;
			}
			// If the remaining parts cannot fit in the current location and size - return false
			var defTotalLength = calcTotalLength(def, part);
			if (defTotalLength > (size-location)) return false;
			// For each location from current location to size
			var i, j, result;
			for (i = location; i < (size-defTotalLength+1); i++) {
			// - Place the current part and continue recursively to the next part
				for (j = location; j < size; j++) solution[j] = false;
				for (j = i; j < i+def[part]; j++) solution[j] = true;
				result = calcRecursive(solution, def, size, i+def[part]+1, part+1);
			// - If the return value is false - break
				if (result === false) break;
			}
			return true;
		}

		var i, solution = [];
		for (i = 0; i < size; i++) solution[i] = false;
		calcRecursive(solution, lineDefinition, size, 0, 0);
		return solutions;
	}

	this.solve = function(problem, progressMonitor) {
		progressMonitor = progressMonitor || { onProgress : function() {} };
		var rowCount = problem.getRowCount();
		var colCount = problem.getColumnCount();
		var grid = new Grid(rowCount, colCount);
		var optionsCount = 1;
		var optionIndex = 1;
		var row, col;

		// Initialize a set of possible solutions for each column and row
		var colPossibleSolutions = [];
		for (col = 0; col < colCount; col++) {
			colPossibleSolutions[col] = calcLinePossibleSolutions(problem.getColumnDefinition(col), rowCount);
			if (colPossibleSolutions[col].length === 0) return null;
			optionsCount *= colPossibleSolutions[col].length;
		}
		var rowPossibleSolutions = [];
		for (row = 0; row < rowCount; row++) {
			rowPossibleSolutions[row] = calcLinePossibleSolutions(problem.getRowDefinition(row), colCount);
			if (rowPossibleSolutions[row].length === 0) return null;
		}

		function updateProbabilities(grid, rowCount, colCount, rowPossibleSolutions, colPossibleSolutions) {
			var i, value, row, col, changed, trueCount, falseCount;
			changed = false;
			for (row = 0; row < rowCount; row++) {
				for (col = 0; col < colCount; col++) {
					value = grid.getCellValue(row, col);
					if (value !== null && (value["true"] === 0 || value["false"] === 0)) continue;
					changed = true;
					value = { "true" : 0, "false" : 0 };
					grid.setCellValue(row, col, value);
					// - rows
					trueCount = falseCount = 0;
					for (i = 0; i < rowPossibleSolutions[row].length; i++) {
						if (rowPossibleSolutions[row][i][col] === true) trueCount++;
						else falseCount++;
					}
					value["true"] = trueCount;
					value["false"] = falseCount;
					if (trueCount === 0 || falseCount === 0) continue;
					// - columns
					trueCount = falseCount = 0;
					for (i = 0; i < colPossibleSolutions[col].length; i++) {
						if (colPossibleSolutions[col][i][row] === true) trueCount++;
						else falseCount++;
					}
					value["true"] = trueCount == 0 ? 0 : value["true"] + trueCount;
					value["false"] = falseCount == 0 ? 0 : value["false"] + falseCount;
				}
			}
			return changed;
		}

		function removeFalseSolutions(grid, rowCount, colCount, rowPossibleSolutions, colPossibleSolutions) {
			var i, value, row, col, changed, toRemove, expected;
			changed = false;
			for (row = 0; row < rowCount; row++) {
				for (col = 0; col < colCount; col++) {
					value = grid.getCellValue(row, col);
					if (value === null) continue;
					else if (value["true"] !== 0 && value["false"] !== 0) continue;
					expected = value["true"] !== 0;
					// - rows
					toRemove = [];
					for (i = 0; i < rowPossibleSolutions[row].length; i++) {
						if (rowPossibleSolutions[row][i][col] !== expected) toRemove.push(i);
					}
					for (i = toRemove.length-1; i >= 0; i--) rowPossibleSolutions[row].splice(toRemove[i], 1);
					// - columns
					toRemove = [];
					for (i = 0; i < colPossibleSolutions[col].length; i++) {
						if (colPossibleSolutions[col][i][row] !== expected) toRemove.push(i);
					}
					for (i = toRemove.length-1; i >= 0; i--) colPossibleSolutions[col].splice(toRemove[i], 1);
					changed = true;
				}
			}
			return changed;
		}

		return {
			grid : grid,
			hasNext : true,
			next : function() {
				hasNext = updateProbabilities(grid, rowCount, colCount, rowPossibleSolutions, colPossibleSolutions);
				if (hasNext) hasNext = removeFalseSolutions(grid, rowCount, colCount, rowPossibleSolutions, colPossibleSolutions);
				optionsCount = hasNext ? optionIndex+1 : optionIndex;
				progressMonitor.onProgress(optionIndex, optionsCount);
				optionIndex++;
				return hasNext;
			}
		}
	}

}