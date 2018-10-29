function GriddlerViewer() {

	var cellSize = 20;

	function buildCellID(row, col) {
		return "gridcell-" + row + "," + col;
	}

	function parseCellID(cellID) {
		var parts = cellID.substring(9).split(",");
		return {
			row : +parts[0],
			col : +parts[1]
		};
	}

	function calcGrayValue(value) {
		var ratio = value["false"] / (value["true"] + value["false"]);
		var colorValue = Math.round(255 * ratio);
		var hex = colorValue.toString(16);
		hex = hex.length > 1 ? hex : "0" + hex;
		var color = "#"+hex+hex+hex;
		return color;
	}

	function getCellColor(value) {
		return (value === null) ? "azure" : (value["false"] === 0) ? "black" : (value["true"] === 0) ? "papayawhip" : calcGrayValue(value);
	}

	this.setCellSize = function(size) {
		cellSize = size;
	}

	this.printProblemState = function(div, problem, grid) {
		var row, rowCount, maxRowDefLength = 0;
		for (row = 0, rowCount = problem.getRowCount(); row < rowCount; row++) {
			maxRowDefLength = Math.max(problem.getRowDefinition(row).length, maxRowDefLength);
		}
		var col, colCount, maxColDefLength = 0;
		for (col = 0, colCount = problem.getColumnCount(); col < colCount; col++) {
			maxColDefLength = Math.max(problem.getColumnDefinition(col).length, maxColDefLength);
		}
		var html = "";
		html += "<table style='border-collapse:collapse;'>";
		// Column definition headers
		html += "<tr><td colspan='" + maxRowDefLength + "' rowspan='" + maxColDefLength + "'></td>";
		var value, i, i_;
		var colDef;
		for (i = 0; i < maxColDefLength; i++) {
			if (i > 0) html += "<tr>";
			for (col = 0, colCount = problem.getColumnCount(); col < colCount; col++) {
				colDef = problem.getColumnDefinition(col);
				i_ = i - (maxColDefLength - colDef.length);
				value = (i_ >= 0 && i_ < colDef.length) ? colDef[i_] : "";
				html += "<td style='text-align:center;border-style:solid;border-width:0px;border-left-width:1px;border-right-width:1px;width:" + cellSize + ";height:" + cellSize + ";font-size:" + Math.ceil(cellSize*0.7) + "'>" + value + "</td>";
			}
			html += "</tr>";
		}
		// Rows
		var rowDef, cellID, borderLeftWidth, borderTopWidth;
		for (row = 0, rowCount = problem.getRowCount(); row < rowCount; row++) {
			html += "<tr>";
			// Row definitions
			rowDef = problem.getRowDefinition(row);
			for (i = 0; i < maxRowDefLength; i++) {
				i_ = i - (maxRowDefLength - rowDef.length);
				value = (i_ >= 0 && i_ < rowDef.length) ? rowDef[i_] : "";
				html += "<td style='text-align:center;border-style:solid;border-width:0px;border-top-width:1px;border-bottom-width:1px;width:" + cellSize + ";height:" + cellSize + ";font-size:" + Math.ceil(cellSize*0.7) + "'>" + value + "</td>";
			}
			// Row values
			for (col = 0, colCount = problem.getColumnCount(); col < colCount; col++) {
				borderLeftWidth = (col > 0 && col % 5 == 0) ? 2 : 1;
				borderTopWidth = (row > 0 && row % 5 == 0) ? 2 : 1;
				value = null;
				cellID = buildCellID(row, col);
				html += "<td id='" + cellID + "' style='width:" + cellSize + ";height:" + cellSize + ";border-style:solid;border-width:1;border-left-width:" + borderLeftWidth + "px;border-top-width:" + borderTopWidth + "px;background-color:" + getCellColor(value) + "'></td>";
			}
			html += "</tr>";
		}
		html += "</table>";
		div.innerHTML = html;
		var cell;
		for (row = 0, rowCount = grid.getRowCount(); row < rowCount; row++) {
			for (col = 0, colCount = grid.getColumnCount(); col < colCount; col++) {
				cellID = buildCellID(row, col);
				cell = document.getElementById(cellID);
				value = grid.getCellValue(row, col);
				cell.style.backgroundColor = getCellColor(value);
				cell.onclick = (function(cell, row, col) {
					return function(event) {
						var dir = (event && event.button && event.button === 2) /*right button click*/ ? false : true;
						var value = grid.toggleCellValue(row, col, dir);
						cell.style.backgroundColor = getCellColor(value);
					}
				})(cell, row, col);
			}
		}
	}

}