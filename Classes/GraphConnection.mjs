export class Connection {
	constructor(uuid, graphSurface, id = '') {
		// this.dragItem = null;    //reference to the dragging ite,
		// this.startPos = null;    //Used for starting position of dragging line,
		// this.offsetX = 0;        //OffsetX for dragging node,
		// this.offsetY = 0;        //OffsetY for dragging node,

		this.zoom_level = 1;
		this.activeElement = null;
		this.makingConnection = false;
		this.ConnectionDirection = null;

		this.isActive = false;
		this.hasEvent = {
			"Select": false,
			"FocusOut": false,
			"Delete": false
		};
		this.isVertical = false;
		this.isDragging = false;
		this.isDashed = false;
		this.colorMode = 'normal'; // or 'important'
		this.startPos = { x: 0, y: 0 };
		this.endPos = { x: 0, y: 0 };
		this.Source = null;
		this.Destination = null;
		this.uuid = uuid;
		this.id = id;
		if (id == '') this.id = uuid;
		this.svg = null;         //SVG where the line paths are drawn
		this.graphSurface = graphSurface;

		this.pathColor = {
			"Normal": "#999999",
			"Selected": "#86d530"
		};
		this.pathColorImportant = {
			"Normal": "#ff0000af",
			"Selected": "#d530d2af"
		};
		this.pathWidth = 5;
		this.pathDashArray = "20";
		this.path = null;
		this.pathMode = 'h';
	}
	//Creates an Quadratic Curve path in SVG
	createQCurve = function () {
		// console.log('this', this);
		let elm = document.createElementNS(this.graphSurface.svg.ns, "path");
		elm.setAttribute("id", this.id);
		elm.setAttribute("fill", "none");
		elm.setAttribute("stroke-width", this.pathWidth);
		elm.setAttribute("class", "graphConnections");
		elm.setAttribute("data-source", this.Source);
		elm.setAttribute("data-destination", this.Destination);
		elm.setAttribute("data-source_location", `${this.startPos.x},${this.startPos.y}`);
		elm.setAttribute("data-destination_location", `${this.endPos.x},${this.endPos.y}`);
		elm.setAttribute('marker-end', 'url(#arrowhead)');
		if (this.isDashed) elm.setAttribute("stroke-dasharray", this.pathDashArray);

		switch (this.colorMode) {
			case 'normal':
				elm.setAttribute("stroke", this.pathColor.Normal);
				switch (this.pathMode) {
					case 'v':
						this.isVertical = true;
						this.setQCurveDV(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
						break;
					default:
						this.setQCurveD(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
						break;
				}
				break;
			case 'important':
				elm.setAttribute("stroke", this.pathColorImportant.Normal);
				switch (this.pathMode) {
					case 'v':
						this.isVertical = true;
						this.setQCurveDV(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
						break;
					default:
						this.setQCurveD(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
						break;
				}
				break;
		}
		return elm;
	}

	//This is separated from the create so it can be reused as a way to update an existing path without duplicating code.
	setQCurveD = function (elm, x1, y1, x2, y2) {
		let dif = Math.abs(x1 - x2) / 1.5,
			str = "M" + (x1) + "," + y1 + " C" +	//MoveTo
				(x1 + dif) + "," + y1 + " " +	//First Control Point
				(x2 - dif) + "," + y2 + " " +	//Second Control Point
				(x2) + "," + y2;				//End Point
		elm.setAttribute('d', str);
	}

	setQCurveDV = function (elm, x1, y1, x2, y2) {
		let dif = Math.abs(y1 - y2) / 1.5,
			str = "M" + x1 + "," + (y1 + 15) + " C" +	//MoveTo
				(x1) + "," + (y1 + dif) + " " +	//First Control Point
				(x2) + "," + (y2 - dif) + " " +	//Second Control Point
				(x2) + "," + (y2 - 18);				//End Point
		// console.log('str in setQCurveD', str);
		// console.log('elm in setQCurveD', elm);
		elm.setAttribute('d', str);
	}

	setCurveColor = function (elm, isActive) {
		elm.setAttribute('stroke', (isActive) ? pathColorSelectedHorizontal : pathColor);
	}
}