class GraphComposer {
	constructor(element) {
		const self = this;
		self.dragMode = 0;
		self.dragItem = null;    //reference to the dragging ite,
		self.startPos = null;    //Used for starting position of dragging line,
		self.offsetX = 0;        //OffsetX for dragging node,
		self.offsetY = 0;        //OffsetY for dragging node,
		self.svg = null;         //SVG where the line paths are drawn,

		self.pathColor = "#999999";
		self.pathColorA = "#86d530";
		self.pathWidth = 2;
		self.pathDashArray = "20,5,5,5,5,5";
		console.log('element', element);
		self.svg = document.getElementById(element);
		self.svg.ns = self.svg.namespaceURI;

		//###########################################################################
		// Connector Object
		//###########################################################################
	
		self.Connector = function(pElm, isInput, name) {
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
	
			// Common Methods
	
			//Get the position of the connection ui element
			this.getPos = function () { return self.getConnPos(this.dot); }
	
			//Just updates the UI if the connection is currently active
			this.resetState = function () {
				let isActive = (this.paths && this.paths.length > 0) || (this.OutputConn != null);
	
				if (isActive) this.root.classList.add("Active");
				else this.root.classList.remove("Active");
			}
	
			//Used mostly for dragging nodes, so this allows the paths to be redrawn
			this.updatePaths = function () {
				if (this.paths && this.paths.length > 0) for (let i = 0; i < this.paths.length; i++) GraphComposer.updateConnPath(this.paths[i]);
				else if (this.OutputConn) this.updateConnPath(this.OutputConn);
			}
	
	
			// Output Methods 
			//This creates a new path between nodes
			this.addPath = function () {
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
			this.removePath = function (o) {
				let i = this.paths.indexOf(o);
	
				if (i > -1) {
					this.svg.removeChild(o.path);
					this.paths.splice(i, 1);
					this.resetState();
				}
			}
	
			this.connectTo = function (o) {
				if (o.OutputConn === undefined) {
					console.log("connectTo - not an input");
					return;
				}
	
				let conn = this.addPath();
				o.applyPath(conn);
			}
	
			// Input Methods 
	
			//Applying a connection from an output
			this.applyPath = function (o) {
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
			this.clearPath = function () {
				if (this.OutputConn != null) {
					let tmp = this.OutputConn;
					tmp.input = null;
	
					this.OutputConn = null;
					this.resetState();
					return tmp;
				}
			}
		}
		self.Node = function (sTitle) {
			self.Node.Title = sTitle;
			self.Node.Inputs = [];
			self.Node.Outputs = [];

			//.........................
			self.Node.eRoot = document.createElement("div");
			document.body.appendChild(self.Node.eRoot);
			self.Node.eRoot.className = "NodeContainer";
			self.Node.eRoot.ref = self.Node;
	
			//.........................
			self.Node.eHeader = document.createElement("header");
			self.Node.eRoot.appendChild(self.Node.eHeader);
			self.Node.eHeader.innerHTML = self.Node.Title;
			self.Node.eHeader.addEventListener("mousedown", self.Node.onHeaderDown);
	
			//.........................
			self.Node.eList = document.createElement("ul");
			self.Node.eRoot.appendChild(self.Node.eList);

			self.Node.dragMode = 0;
			self.Node.dragItem = null;    //reference to the dragging ite,
			self.Node.startPos = null;    //Used for starting position of dragging line,
			self.Node.offsetX = 0;        //OffsetX for dragging node,
			self.Node.offsetY = 0;        //OffsetY for dragging node,

			return self.Node;
		};
		//###########################################################################
		// Node Object Utilities
		//###########################################################################

		self.Node.addInput = function (name){
			let o = new self.Connector(self.Node.eList, true, name);
			self.Node.Inputs.push(o);
			return o;
		}

		self.Node.addOutput = function (name) {
			let o = new self.Connector(self.Node.eList, false, name);
			self.Node.Outputs.push(o);
			return o;
		}

		self.Node.getInputPos = function (i) { return self.Node.getConnPos(self.Node.Inputs[i].dot); }
		self.Node.getOutputPos = function (i) { return self.Node.getConnPos(self.Node.Outputs[i].dot); }

		self.Node.updatePaths = function () {
			let i;
			for (i = 0; i < self.Node.Inputs.length; i++) self.Node.Inputs[i].updatePaths();
			for (i = 0; i < self.Node.Outputs.length; i++) self.Node.Outputs[i].updatePaths();
		}

		//Handle the start node dragging functionality
		self.Node.onHeaderDown = function (e) {
			e.stopPropagation();
			self.Node.beginNodeDrag(e.target.parentNode, e.pageX, e.pageY);
		};

		self.Node.setPosition = function (x, y) {
			self.Node.eRoot.style.left = x + "px";
			self.Node.eRoot.style.top = y + "px";
		};

		self.Node.setWidth = function (w) { self.Node.eRoot.style.width = w + "px"; }
		// Dragging Nodes 
		self.Node.beginNodeDrag = function (n, x, y) {
			console.log(arguments);
			console.log(self.Node.dragMode);
			if (self.Node.dragMode != 0) return;

			self.Node.dragMode = 1;
			self.Node.dragItem = n;
			self.Node.offsetX = n.offsetLeft - x;
			self.Node.offsetY = n.offsetTop - y;

			window.addEventListener("mousemove", self.Node.onNodeDragMouseMove);
			window.addEventListener("mouseup", self.Node.onNodeDragMouseUp);
		}
		self.Node.onNodeDragMouseUp = function(e) {
			e.stopPropagation(); e.preventDefault();
			self.Node.dragItem = null;
			self.Node.dragMode = 0;

			window.removeEventListener("mousemove", self.Node.onNodeDragMouseMove);
			window.removeEventListener("mouseup", self.Node.onNodeDragMouseUp);
		}
		self.Node.onNodeDragMouseMove = function(e) {
			e.stopPropagation(); e.preventDefault();
			if (self.Node.dragItem) {
				self.Node.dragItem.style.left = e.pageX + self.Node.offsetX + "px";
				self.Node.dragItem.style.top = e.pageY + self.Node.offsetY + "px";
				console.log(self.Node.dragItem.style.top, self.Node.dragItem.style.left);
				self.Node.dragItem.ref.updatePaths();
			}
		}
		console.log(this);
	}
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
	// Creates a straight line
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
	
	// Dragging Paths 
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
	
	// Connection Event Handling 
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
}

class Node {
	constructor(sTitle) {
		const self = this;
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

		this.dragMode = 0;
		this.dragItem = null;    //reference to the dragging ite,
		this.startPos = null;    //Used for starting position of dragging line,
		this.offsetX = 0;        //OffsetX for dragging node,
		this.offsetY = 0;        //OffsetY for dragging node,

		

		
		return this;
	};

	//###########################################################################
	// Connector Object
	//###########################################################################
	Connector = function(pElm, isInput, name) {
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

		// Common Methods

		//Get the position of the connection ui element
		this.getPos = function () { return self.getConnPos(this.dot); }

		//Just updates the UI if the connection is currently active
		this.resetState = function () {
			let isActive = (this.paths && this.paths.length > 0) || (this.OutputConn != null);

			if (isActive) this.root.classList.add("Active");
			else this.root.classList.remove("Active");
		}

		//Used mostly for dragging nodes, so this allows the paths to be redrawn
		this.updatePaths = function () {
			if (this.paths && this.paths.length > 0) for (let i = 0; i < this.paths.length; i++) GraphComposer.updateConnPath(this.paths[i]);
			else if (this.OutputConn) this.updateConnPath(this.OutputConn);
		}


		// Output Methods 
		//This creates a new path between nodes
		this.addPath = function () {
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
		this.removePath = function (o) {
			let i = this.paths.indexOf(o);

			if (i > -1) {
				this.svg.removeChild(o.path);
				this.paths.splice(i, 1);
				this.resetState();
			}
		}

		this.connectTo = function (o) {
			if (o.OutputConn === undefined) {
				console.log("connectTo - not an input");
				return;
			}

			let conn = this.addPath();
			o.applyPath(conn);
		}

		// Input Methods 

		//Applying a connection from an output
		this.applyPath = function (o) {
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
		this.clearPath = function () {
			if (this.OutputConn != null) {
				let tmp = this.OutputConn;
				tmp.input = null;

				this.OutputConn = null;
				this.resetState();
				return tmp;
			}
		}
	}

	//###########################################################################
	// Node Object Utilities
	//###########################################################################

	addInput = function (name){
		let o = new Connector(this.eList, true, name);
		this.Inputs.push(o);
		return o;
	}

	addOutput = function (name) {
		let o = new self.Connector(this.eList, false, name);
		this.Outputs.push(o);
		return o;
	}

	getInputPos = function (i) { return this.getConnPos(this.Inputs[i].dot); }
	getOutputPos = function (i) { return this.getConnPos(this.Outputs[i].dot); }

	updatePaths = function () {
		let i;
		for (i = 0; i < this.Inputs.length; i++) this.Inputs[i].updatePaths();
		for (i = 0; i < this.Outputs.length; i++) this.Outputs[i].updatePaths();
	}

	//Handle the start node dragging functionality
	onHeaderDown = function (e) {
		e.stopPropagation();
		this.beginNodeDrag(e.target.parentNode, e.pageX, e.pageY);
	};

	setPosition = function (x, y) {
		this.eRoot.style.left = x + "px";
		this.eRoot.style.top = y + "px";
	};

	setWidth = function (w) { this.eRoot.style.width = w + "px"; }
	// Dragging Nodes 
	beginNodeDrag = function (n, x, y) {
		console.log(arguments);
		console.log(this.dragMode);
		if (this.dragMode != 0) return;

		this.dragMode = 1;
		this.dragItem = n;
		this.offsetX = n.offsetLeft - x;
		this.offsetY = n.offsetTop - y;

		window.addEventListener("mousemove", this.onNodeDragMouseMove);
		window.addEventListener("mouseup", this.onNodeDragMouseUp);
	}
	onNodeDragMouseUp = function(e) {
		e.stopPropagation(); e.preventDefault();
		this.dragItem = null;
		this.dragMode = 0;

		window.removeEventListener("mousemove", this.onNodeDragMouseMove);
		window.removeEventListener("mouseup", this.onNodeDragMouseUp);
	}
	onNodeDragMouseMove = function(e) {
		e.stopPropagation(); e.preventDefault();
		if (this.dragItem) {
			this.dragItem.style.left = e.pageX + this.offsetX + "px";
			this.dragItem.style.top = e.pageY + this.offsetY + "px";
			console.log(this.dragItem.style.top, this.dragItem.style.left);
			this.dragItem.ref.updatePaths();
		}
	}

	
}