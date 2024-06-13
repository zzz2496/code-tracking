class GraphComposer {
	constructor(element) {
		this.dragMode = 0;
		this.dragItem = null;    //reference to the dragging ite,
		this.startPos = null;    //Used for starting position of dragging line,
		this.offsetX = 0;        //OffsetX for dragging node,
		this.offsetY = 0;        //OffsetY for dragging node,
		this.svg = null;         //SVG where the line paths are drawn,

		this.pathColor = "#999999";
		this.pathColorA = "#86d530";
		this.pathWidth = 2;
		this.pathDashArray = "20,5,5,5,5,5";
	}
	init(element) {
		this.svg = document.getElementById(element);
		this.svg.ns = this.svg.namespaceURI;
	}
	//Trail up the parent nodes to get the X,Y position of an element
	getOffset(elm) {
		let pos = { x: 0, y: 0 };
		while (elm) {
			pos.x += elm.offsetLeft;
			pos.y += elm.offsetTop;
			elm = elm.offsetParent;
		}
		return pos;
	}
	//Gets the position of one of the connection points
	getConnPos(elm) {
		let pos = this.getOffset(elm);
		pos.x += (elm.offsetWidth / 2) + 1.5; //Add some offset so its centers on the element
		pos.y += (elm.offsetHeight / 2) + 0.5;
		return pos;
	}
	//Used to reset the svg path between two nodes
	updateConnPath(o) {
		let pos1 = o.output.getPos(),
			pos2 = o.input.getPos();
		this.setQCurveD(o.path, pos1.x, pos1.y, pos2.x, pos2.y);
	}
	//Creates an Quadratic Curve path in SVG
	createQCurve(x1, y1, x2, y2) {
		let elm = document.createElementNS(this.svg.ns, "path");
		elm.setAttribute("fill", "none");
		elm.setAttribute("stroke", this.pathColor);
		elm.setAttribute("stroke-width", this.pathWidth);
		elm.setAttribute("stroke-dasharray", this.pathDashArray);

		this.setQCurveD(elm, x1, y1, x2, y2);
		return elm;
	}
	//This is separated from the create so it can be reused as a way to update an existing path without duplicating code.
	setQCurveD(elm, x1, y1, x2, y2) {
		let dif = Math.abs(x1 - x2) / 1.5,
			str = "M" + x1 + "," + y1 + " C" +	//MoveTo
				(x1 + dif) + "," + y1 + " " +	//First Control Point
				(x2 - dif) + "," + y2 + " " +	//Second Control Point
				(x2) + "," + y2;				//End Point
		elm.setAttribute('d', str);
	}
	setCurveColor(elm, isActive) { elm.setAttribute('stroke', (isActive) ? this.pathColorA : this.pathColor); }
	/*Creates a straight line*/
	createLine(x1, y1, x2, y2, color, w) {
		let line = document.createElementNS(this.svg.ns, 'line');
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', color);
		line.setAttribute('stroke-width', w);
		return line;
	}

	/*Dragging Nodes */
	beginNodeDrag(n, x, y) {
		if (this.dragMode != 0) return;
	
		this.dragMode = 1;
		this.dragItem = n;
		this.offsetX = n.offsetLeft - x;
		this.offsetY = n.offsetTop - y;
	
		window.addEventListener("mousemove", this.onNodeDragMouseMove);
		window.addEventListener("mouseup", this.onNodeDragMouseUp);
	}
	onNodeDragMouseUp(e) {
		e.stopPropagation(); e.preventDefault();
		this.dragItem = null;
		this.dragMode = 0;
	
		window.removeEventListener("mousemove", this.onNodeDragMouseMove);
		window.removeEventListener("mouseup", this.onNodeDragMouseUp);
	}
	onNodeDragMouseMove(e) {
		e.stopPropagation(); e.preventDefault();
		if (this.dragItem) {
			this.dragItem.style.left = e.pageX + this.offsetX + "px";
			this.dragItem.style.top = e.pageY + this.offsetY + "px";
			this.dragItem.ref.updatePaths();
		}
	}
	
	/*Dragging Paths */
	beginConnDrag(path) {
		if (this.dragMode != 0) return;
	
		this.dragMode = 2;
		this.dragItem = path;
		this.startPos = path.output.getPos();
	
		this.setCurveColor(path.path, false);
		window.addEventListener("click", this.onConnDragClick);
		window.addEventListener("mousemove", this.onConnDragMouseMove);
	}
	endConnDrag() {
		this.dragMode = 0;
		this.dragItem = null;
	
		window.removeEventListener("click", this.onConnDragClick);
		window.removeEventListener("mousemove", this.onConnDragMouseMove);
	}
	onConnDragClick(e) {
		e.stopPropagation(); e.preventDefault();
		this.dragItem.output.removePath(this.dragItem);
		this.endConnDrag();
	}
	onConnDragMouseMove(e) {
		e.stopPropagation(); e.preventDefault();
		if (this.dragItem) this.setQCurveD(this.dragItem.path, this.startPos.x, this.startPos.y, e.pageX, e.pageY);
	}
	
	/*Connection Event Handling */
	onOutputClick(e) {
		e.stopPropagation(); e.preventDefault();
		let path = e.target.parentNode.ref.addPath();
	
		this.beginConnDrag(path);
	}
	onInputClick(e) {
		e.stopPropagation(); e.preventDefault();
		let o = this.parentNode.ref;
	
		switch (this.dragMode) {
			case 2: //Path Drag
				o.applyPath(this.dragItem);
				this.endConnDrag();
				break;
			case 0: //Not in drag mode
				let path = o.clearPath();
				if (path != null) this.beginConnDrag(path);
				break;
		}
	}

	//###########################################################################
	// Connector Object
	//###########################################################################

	Connector (pElm, isInput, name) {
		this.name = name;
		this.root = document.createElement("li");
		this.dot = document.createElement("i");
		this.label = document.createElement("span");
	
		//Input/Output Specific values
		if (isInput) this.OutputConn = null;		//Input can only handle a single connection.
		else this.paths = [];    				//Outputs can connect to as many inputs is needed
	
		//Create Elements
		pElm.appendChild(this.root);
		this.root.appendChild(this.dot);
		this.root.appendChild(this.label);
	
		//Define the Elements
		this.root.className = (isInput) ? "Input" : "Output";
		this.root.ref = this;
		this.label.innerHTML = name;
		this.dot.innerHTML = "&nbsp;";
	
		this.dot.addEventListener("click", (isInput) ? this.onInputClick : this.onOutputClick);

		/*Common Methods */

		//Get the position of the connection ui element
		this.prototype.getPos = function () { return this.getConnPos(this.dot); }

		//Just updates the UI if the connection is currently active
		this.prototype.resetState = function () {
			let isActive = (this.paths && this.paths.length > 0) || (this.OutputConn != null);

			if (isActive) this.root.classList.add("Active");
			else this.root.classList.remove("Active");
		}

		//Used mostly for dragging nodes, so this allows the paths to be redrawn
		this.prototype.updatePaths = function () {
			if (this.paths && this.paths.length > 0) for (let i = 0; i < this.paths.length; i++) GraphComposer.updateConnPath(this.paths[i]);
			else if (this.OutputConn) this.updateConnPath(this.OutputConn);
		}


		/*Output Methods */
		//This creates a new path between nodes
		this.prototype.addPath = function () {
			let pos = this.getConnPos(this.dot),
				dat = {
					path: this.createQCurve(pos.x, pos.y, pos.x, pos.y),
					input: null,
					output: this
				};

			this.svg.appendChild(dat.path);
			this.paths.push(dat);
			return dat;
		}

		//Remove Path
		this.prototype.removePath = function (o) {
			let i = this.paths.indexOf(o);

			if (i > -1) {
				this.svg.removeChild(o.path);
				this.paths.splice(i, 1);
				this.resetState();
			}
		}

		this.prototype.connectTo = function (o) {
			if (o.OutputConn === undefined) {
				console.log("connectTo - not an input");
				return;
			}

			let conn = this.addPath();
			o.applyPath(conn);
		}

		/*Input Methods */

		//Applying a connection from an output
		this.prototype.applyPath = function (o) {
			//If a connection exists, disconnect it.
			// if (this.OutputConn != null) this.OutputConn.output.removePath(this.OutputConn);

			//If moving a connection to here, tell previous input to clear itself.
			// if (o.input != null) o.input.clearPath();

			o.input = this;			//Saving this connection as the input reference
			this.OutputConn = o;	//Saving the path reference to this object
			this.resetState();		//Update the state on both sides of the connection, TODO some kind of event handling scheme would work better maybe
			o.output.resetState();

			this.updateConnPath(o);
			this.setCurveColor(o.path, true);
		}

		//clearing the connection from an output
		this.prototype.clearPath = function () {
			if (this.OutputConn != null) {
				let tmp = this.OutputConn;
				tmp.input = null;

				this.OutputConn = null;
				this.resetState();
				return tmp;
			}
		}
	}
	Node (sTitle) {
		this.Title = sTitle;
		this.Inputs = [];
		this.Outputs = [];
	
		//.........................
		this.eRoot = document.createElement("div");
		document.body.appendChild(this.eRoot);
		this.eRoot.className = "NodeContainer";
		this.eRoot.ref = this;
	
		//.........................
		this.eHeader = document.createElement("header");
		this.eRoot.appendChild(this.eHeader);
		this.eHeader.innerHTML = this.Title;
		this.eHeader.addEventListener("mousedown", this.onHeaderDown);
	
		//.........................
		this.eList = document.createElement("ul");
		this.eRoot.appendChild(this.eList);

		//###########################################################################
		// Node Object Utilities
		//###########################################################################

		this.prototype.addInput = function (name) {
			let o = new this(this.eList, true, name);
			this.Inputs.push(o);
			return o;
		}

		this.prototype.addOutput = function (name) {
			let o = new this(this.eList, false, name);
			this.Outputs.push(o);
			return o;
		}

		this.prototype.getInputPos = function (i) { return this.getConnPos(this.Inputs[i].dot); }
		this.prototype.getOutputPos = function (i) { return this.getConnPos(this.Outputs[i].dot); }

		this.prototype.updatePaths = function () {
			let i;
			for (i = 0; i < this.Inputs.length; i++) this.Inputs[i].updatePaths();
			for (i = 0; i < this.Outputs.length; i++) this.Outputs[i].updatePaths();
		}

		//Handle the start node dragging functionality
		this.prototype.onHeaderDown = function (e) {
			e.stopPropagation();
			this.beginNodeDrag(e.target.parentNode, e.pageX, e.pageY);
		};

		this.prototype.setPosition = function (x, y) {
			this.eRoot.style.left = x + "px";
			this.eRoot.style.top = y + "px";
		};

		this.prototype.setWidth = function (w) { this.eRoot.style.width = w + "px"; }
	}
};




