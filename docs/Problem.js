function Problem(rowCount, colCount, rowsDefinition, colsDefinition) {
	var rows = rowsDefinition;
	var cols = colsDefinition;
	if (rowCount !== rows.length) throw new Error("row count does not match the given rows definition");
	if (colCount !== cols.length) throw new Error("column count does not match the given columns definition");

	this.getRowDefinition = function(row) {
		return rows[row];
	}

	this.getColumnDefinition = function(col) {
		return cols[col];
	}

	this.getRowCount = function() {
		return rows.length;
	}

	this.getColumnCount = function() {
		return cols.length;
	}
}