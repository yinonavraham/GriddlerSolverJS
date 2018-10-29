function Grid(rowCount, colCount) {
	var rows = rowCount;
	var cols = colCount;
	var cells = [];

	init();

	function init() {
		var row, col;
		for (row = 0; row < rows; row++) {
			cells[row] = [];
			for (col = 0; col < cols; col++) {
				cells[row][col] = null;
			}
		}
	}

	this.setCellValue = function(row, col, value) {
		if (row < 0 || row >= rows.length) throw new Error("row out of bounds: " + row);
		if (col < 0 || col >= cols.length) throw new Error("col out of bounds: " + col);
		if (typeof value === "object") cells[row][col] = value;
		else throw new Error("value must be an object");
	}

	this.setRowValues = function(row, values) {
		var col;
		for (col = 0; col < cols; col++) this.setCellValue(row, col, values[col]);
	}

	this.setColumnValues = function(col, values) {
		var row;
		for (row = 0; row < rows; row++) this.setCellValue(row, col, values[row]);
	}

	this.getCellValue = function(row, col) {
		return cells[row][col];
	}

	this.getRowValues = function(row) {
		return cells[row].slice(0);
	}

	this.toggleCellValue = function(row, col, normalDirection) {
		normalDirection = normalDirection === false ? false : true;
		var value = this.getCellValue(row, col);
		if (normalDirection) {
			value = value === null ? { "true" : 1, "false" : 0 } : value["false"] === 0 ? { "true" : 0, "false" : 1 } : null;
		} else {
			value = value === null ? { "true" : 0, "false" : 1 } : value["true"] === 0 ? { "true" : 1, "false" : 0 } : null;
		}
		this.setCellValue(row, col, value);
		return value;
	}

	this.getRowCount = function() {
		return rows;
	}

	this.getColumnCount = function() {
		return cols;
	}
}