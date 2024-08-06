//SECTION - Graph Surface Class
export class GraphSurface {
	//SECTION - GraphSurface Constructor
	constructor (GraphInfo, AppInfo, Utility, Datastores) {
		//NOTE - Graph Info metadata
		// console.log('arguments :>> ', arguments);
		// console.log('Utility :>> ', Utility);

		this.Utility = Utility;
		this.Datastores = Datastores;
		this.Metadata = {
			"DocumentName": GraphInfo.name,
			"DocumentLabel": GraphInfo.label,
			"DocumentHeader": GraphInfo.header,
			"DocumentFooter": GraphInfo.footer,
			"DocumentType": GraphInfo.type,
			"DocumentWorld": GraphInfo.world,
			"DocumentRealm": GraphInfo.realm,
			"DocumentUniverse": GraphInfo.universe
		};
			
		//NOTE - Initialization of SVG Section variables
		this.GraphElement = {
			"svg": null,
			"id_graph_surface": null,
			"div_graph_surface": null,
			"id_graph_control_palette": null,
			"control_palette_xpanel": null,
			"panel": null,

			"zoom_level": 1,
			"activeElements": [],
			"makingConnection": false,
			"controlPalette": null,
			"nodes": [],
			"connections": [],
			"startPosX": 0,
			"startPosY": 0,
			"startElement": null,
			"mousedown": false,
			"newConn": false,
			"tempConn": null,
			"centerPointOfDocumentRelativeToViewport": null,
			"graph_canvas_dimension": {
				width: 20000,
				height: 20000
			},
			"divs": null,
			"selectedDivs": null,
			"snapEvery": 10,
		};

		this.GraphElement.svg = this.initializeGraphSurface(this);
	};
	InitializeGraphSurfaceContainer = (function (GraphObject) {
		// console.log('GraphObject :>> ', GraphObject);
		let id_str = 'id_' + GraphObject.Utility.Strings.UnReadable(GraphObject.Metadata.DocumentName) + '-';
		let div = document.createElement('div');
		div.id = id_str + 'graph-surface';
		div.className = 'graph-surface grid2020-background'
		div.style.cssText = `width: ${GraphObject.GraphElement.graph_canvas_dimension.width}px; height: ${GraphObject.GraphElement.graph_canvas_dimension.height}px; z-index:100;`;
		div.innerHTML = `
			<div id="${id_str}graph"></div>
			<svg id="${id_str}connsvg" style="width:100%; height:100%;">
				<defs>
					<marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
						<path class="arrowhead-path" d="M 0 0 L 10 5 L 0 10 z" fill="#2f344cd2"/>
					</marker>
				</defs>
			</svg>`; 
		// console.log('>>> div :>> ', div);
		return div;
	});
	createControlPalette = (function (GraphObject, GraphElement) {
		//Creation and Initialization Graph Control Palette
		//ID of the Graph Control Palette
		GraphObject.GraphElement.id_graph_control_palette_container = GraphElement.id + '_control_palette_container';

		GraphObject.GraphElement.div_graph_control_palette = document.createElement('div');
		GraphObject.GraphElement.div_graph_control_palette.id = GraphObject.GraphElement.id_graph_control_palette_container;

		//Prepend Graph Control Palette into Graph Container
		// GraphObject.div_graph_surface.querySelector('#' + GraphObject. + '-graph-surface').appendChild(GraphObject.div_graph_control_palette);
		GraphElement.appendChild(GraphObject.GraphElement.div_graph_control_palette);
		
		
		//NOTE - Atatch GraphElement variable to GraphObject
		GraphObject.GraphElement.div_graph_surface = GraphElement;

		//Creation of Graph Surface in Graph Container
		GraphObject.GraphElement.zoom_level = 1;
		GraphObject.GraphElement.controlPalette = document.createElement('div');
		
		GraphObject.GraphElement.controlPalette.className = 'toolbar-kit';
		GraphObject.GraphElement.controlPalette.style = 'text-align: center';
		GraphObject.GraphElement.controlPalette.innerHTML = `
			<table border="0" align="center">
				<tr>
					<td colspan="3">RUNTIME CONTROLS</td>
				</tr>
				<tr>
					<td><button class="raised-element btn" id="${GraphObject.GraphElement.id_graph_control_palette_container}--runtime-control--reset"><label class="runtime-controls-button"><i class="fa-solid fa-refresh"></i></label></button></td>
					<td><button class="raised-element btn" id="${GraphObject.GraphElement.id_graph_control_palette_container}--runtime-control--play"><label class="runtime-controls-button"><i class="fa-solid fa-play"></i> <i class="fa-solid fa-pause"></i></label></button></td>
					<td><button class="raised-element btn" id="${GraphObject.GraphElement.id_graph_control_palette_container}--runtime-control--step"><label class="runtime-controls-button"><i class="fa-solid fa-step-forward"></i></label></button></td>
				</tr>
			</table>
			<table border="0" align="center">

				<tr>
					<td colspan="3">DATASTORE STATUS</td>
				</tr>
				<tr>
					<td colspan="3">
						<div id= "datastore_status">Loading...</div>
					</td>				
				</tr>
			</table>
			<table border="0" align="center">

				<tr>
					<td colspan="3">ZOOM Level (<label id='zoom-level'>${GraphObject.GraphElement.zoom_level}</label>)</td>
				</tr>
				<tr>
					<td><button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-zoom-out"><i class="p-2 fa-solid fa-minus"></i></button></td>
					<td><button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-zoom-reset">RESET</button></td>
					<td><button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-zoom-in"><i class="p-2 fa-solid fa-plus"></i></button></td>
				</tr>
			</table>
			<table border="0" align="center">
				<tr>
					<td colspan="3">NODE</td>
				</tr>
				<tr>
					<td><button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-node-remove"><i class="p-2 fa-solid fa-minus"></i></button></td>
					<td>
						<button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-node-savetoserver">SAVE</button>
						<br>
						<br>
						<select id="${GraphObject.GraphElement.id_graph_control_palette_container}-node-type">
							<option value="Node">Memory</option>
							<option value="Node">Local</option>
							<option value="Node">Server</option>
						</select>
						<br>
						<br>
						<button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-node-loadfromserver">LOAD</button>
					</td>
					<td><button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}-node-add"><i class="p-2 fa-solid fa-plus"></i></button></td>
				</tr>
			</table>
			<table border="0" align="center">
				<tr>
					<td colspan='3'>Switch Theme</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<button class="raised-element" id="${GraphObject.GraphElement.id_graph_control_palette_container}___theme-switch" style="color:red;"><i class="p-2 fa-solid fa-repeat"></i></button>
					</td>
					<td></td>
				</tr>
				<tr>
					<td colspan='3'>
						<label>Mouse X</label>: <span id="${GraphObject.GraphElement.id_graph_control_palette_container}___mouse-x"></span><br>
						<label>Mouse Y</label>: <span id="${GraphObject.GraphElement.id_graph_control_palette_container}___mouse-y"></span>
					</td>
				</tr>
			</table>
			`;

		GraphObject.GraphElement.panel = GraphObject.Utility.DOMElements.makeXpanel({
			id: '',
			class: '',
			// title: 'Control Palette',
			title: '',
			smalltitle: '',
			contentid: 'control_palette',
			content: GraphObject.GraphElement.controlPalette
		});

		GraphObject.GraphElement.id_graph_control_palette = GraphObject.GraphElement.id_graph_control_palette_container + '___control_palette';
		GraphObject.GraphElement.control_palette_xpanel = GraphObject.Utility.DOMElements.MakeDraggableDiv(GraphObject.GraphElement.id_graph_control_palette, 'Control Palette', GraphObject.GraphElement.panel, 10, 10, 'auto');
		GraphObject.GraphElement.div_graph_surface.querySelector('#' + GraphObject.GraphElement.id_graph_control_palette_container).appendChild(GraphObject.GraphElement.control_palette_xpanel)
		
		//NOTE - Make Control Palette Draggable
		// GraphObject.Utility.DOMElements.DragElement(GraphObject.GraphElement.div_graph_surface.querySelector('#' + GraphObject.GraphElement.id_graph_control_palette));

	})
	attachEvent_ControlSurfaceLightSwitch(GraphObject) {
		// LIGHT/DARK THEME SWITCHER
		console.log('#' + GraphObject.GraphElement.id_graph_control_palette_container + '___theme-switch');
		GraphObject.GraphElement.div_graph_surface.querySelector('#' + GraphObject.GraphElement.id_graph_control_palette_container + '___theme-switch').addEventOnce('click', function () {
			console.log('theme switch');
			let root = document.documentElement;
			this.dataset.count = this.dataset.count ? parseInt(this.dataset.count) : 0;
			// console.log('this.dataset.count', this.dataset.count);

			if (this.dataset.count < 2) {
				// console.log('masuk < 2');
				if (root.classList.contains('light-theme')) {
					// console.log('masuk dark');
					root.classList.replace('light-theme', 'dark-theme');
				} else if (root.classList.contains('dark-theme')) {
					// console.log('masuk light');
					root.classList.replace('dark-theme', 'light-theme');
				} else {
					// console.log('masuk default');
					let isCurrentThemeDark = GraphObject.Utility.DOMElements.detectLightDarkMode();
					root.classList.add(isCurrentThemeDark.matches ? 'light-theme' : 'dark-theme');
				}
				this.style.color = '';
				this.dataset.count++;
			} else {
				// console.log('masuk reset');
				root.classList.remove('dark-theme', 'light-theme');
				this.style.color = 'red';
				this.dataset.count = 0;
			}
		});
		//LIGHT/DARK THEME SWITCHER
	};
	initializeGraphSurface = function (GraphObject) {
		//SECTION - Initialize Graph Surface
		
		//NOTE - Create Graph Surface and set it's styles
		let GraphElement = document.createElement('div');
		GraphElement.id = 'id_' + GraphObject.Utility.Strings.UnReadable(GraphObject.Metadata.DocumentName);
		GraphElement.style.width = '100vw';
		GraphElement.style.height = '100vh';
		GraphElement.style.overflow = 'scroll';
		GraphElement.style.position = 'relative';
		
		//Creation of Graph Surface in Graph Container
		GraphElement.appendChild(GraphObject.InitializeGraphSurfaceContainer(GraphObject));

		//Initialization of Graph Surface SVG elements in Graph Container
		GraphObject.GraphElement.svg = GraphElement.querySelector('#' + GraphElement.id + '-connsvg');
		GraphObject.GraphElement.svg.ns = GraphObject.GraphElement.svg.namespaceURI;

		GraphObject.createControlPalette(GraphObject, GraphElement);
		GraphObject.attachEvent_ControlSurfaceLightSwitch(GraphObject);

		return GraphObject;
	}
}

export class GraphSurfaceOld {
	constructor(GraphInfo, App, Utility) {
		let self = this;
		self.svg = null;//SVG where the line paths are drawn
		// console.log('arguments', arguments);
		self.Utility = new Utility();
		// self.Storage = {
		// 	SurrealDB: {
		// 		Local: new Surreal(),
		// 		Server: new Surreal(),
		// 		Memory: new Surreal(),
		// 	},
		// }

		self.DocumentName = GraphInfo.name;
		self.DocumentLabel = GraphInfo.label;
		self.DocumentHeader = GraphInfo.header;
		self.DocumentFooter = GraphInfo.footer;
		self.DocumentType = GraphInfo.type;
		self.DocumentWorld = GraphInfo.world;;
		self.DocumentRealm = GraphInfo.realm;;
		self.DocumentUniverse = GraphInfo.universe;;

		self.zoom_level = 1;
		self.activeElement = null;
		self.makingConnection = false;
		self.ConnectionDirection = null;
		self.id_graph_surface = null;
		self.div_graph_surface = null;
		self.controlPalette = null;
		self.panel = null;
		self.id_graph_control_palette = null;
		self.control_palette_xpanel = null;
		self.nodes = [];
		self.connections = [];
		self.startPosX = 0;
		self.startPosY = 0;
		self.startElement = null;
		self.mousedown = false;
		self.newConn = false;
		self.tempConn = null;
		self.centerPointOfDocumentRelativeToViewport = null;
		self.graph_canvas_dimension = {
			width: 20000,
			height: 20000
		};
		self.divs = null;
		self.selectedDivs = null;
		self.snapEvery = 10;
	};
	initiateGraphSurfaceContainer = (function (id = '') {
			let id_str = (id.length > 0) ? id + '-' : '';
			let div = document.createElement('div');
			div.id = id_str + 'graph-surface';
			div.className = 'graph-surface grid2020-background'
			// console.log('this', this);
			div.style.cssText = `width: ${this.graph_canvas_dimension.width}px; height: ${this.graph_canvas_dimension.height}px; z-index:100;`;
			div.innerHTML = `
				<div id="${id_str}graph"></div>
				<svg id="${id_str}connsvg" style="width:100%; height:100%;">
					<defs>
						<marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
							<path class="arrowhead-path" d="M 0 0 L 10 5 L 0 10 z" fill="#2f344cd2"/>
						</marker>
					</defs>
				</svg>`;
			// console.log('>>>>', div.style.cssText);
			return div;
	});
	createGraphSurface = function (GraphObject, graphSurfaceID) {
		console.log('wooohooooo');

		let GraphElement = document.createElement('div');
		GraphElement.id = GraphObject;
		// GraphElement.className = 'graph-surface';
		GraphElement.style.width = '100vw';
		GraphElement.style.height = '100vh';
		GraphElement.style.overflow = 'scroll';
		GraphElement.style.position = 'relative';

		//Creation of Graph Surface in Graph Container
		GraphElement.appendChild(GraphObject.initiateGraphSurfaceContainer(GraphObject));

		//Initialization of Graph Surface in Graph Container
		GraphObject.svg = GraphElement.querySelector('#' + GraphObject + '-connsvg');
		GraphObject.svg.ns = GraphObject.svg.namespaceURI;

		//Creation and Initialization Graph Control Palette
		//ID of the Graph Control Palette
		GraphObject.id_graph_control_palette_container = GraphObject + '_control_palette_container';

		GraphObject.div_graph_control_palette = document.createElement('div');
		GraphObject.div_graph_control_palette.id = GraphObject.id_graph_control_palette_container;

		//Prepend Graph Control Palette into Graph Container
		// GraphObject.div_graph_surface.querySelector('#' + GraphObject. + '-graph-surface').appendChild(GraphObject.div_graph_control_palette);
		GraphObject.div_graph_surface.appendChild(GraphObject.div_graph_control_palette);

		//Creation of Graph Surface in Graph Container
		GraphObject.zoom_level = 1;
		GraphObject.controlPalette = document.createElement('table');
		GraphObject.controlPalette.className = 'toolbar-kit';
		GraphObject.controlPalette.style.width = '100%';
		GraphObject.controlPalette.innerHTML = `
			<tr>
				<td colspan="3">ZOOM Level (<label id='zoom-level'>${GraphObject.zoom_level}</label>)</td>
			</tr>
			<tr>
				<td><button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-zoom-out"><i class="fa-solid fa-minus"></i></button></td>
				<td><button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-zoom-reset">RESET</button></td>
				<td><button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-zoom-in"><i class="fa-solid fa-plus"></i></button></td>
			<tr>
				<td colspan="3">NODE</td>
			</tr>
			<tr>
				<td><button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-node-remove"><i class="fa-solid fa-minus"></i></button></td>
				<td>
					<button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-node-savetoserver">SAVE</button>
					<br>
					<br>
					<select id="${GraphObject.id_graph_control_palette_container}-node-type">
						<option value="Node">Memory</option>
						<option value="Node">Local</option>
						<option value="Node">Server</option>
					</select>
					<br>
					<br>
					<button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-node-loadfromserver">LOAD</button>
				</td>
				<td><button class="raised-element" id="${GraphObject.id_graph_control_palette_container}-node-add"><i class="fa-solid fa-plus"></i></button></td>
			</tr>
			<tr>
				<td colspan="2">Multi-node selection</td>
				<td><input type='checkbox' checked id='${GraphObject.id_graph_control_palette_container}-multinode-select'></td>
			</tr>
			<tr>
				<td></td>
				<td>Vertical Link</td>
				<td><input type='checkbox' id='${GraphObject.id_graph_control_palette_container}-vertical_link'></td>
			</tr>
			<tr>
				<td colspan='3'>Tilt Control</td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), '', 'up')">Up</button></td>
				<td></td>
			</tr>
			<tr>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), 'left')">Left</button></td>
				<td></td>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), 'right')">Right</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), '', 'down')">Down</button></td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>Slide Control</td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('top-panel'), 'top')">Up</button></td>
				<td></td>
			</tr>
			<tr>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('left-panel'), 'left')">Left</button></td>
				<td></td>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('right-panel'), 'right')">Right</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('bottom-panel'), 'bottom')">Down</button></td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>Switch Theme</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<button class="raised-element" id="${GraphObject.id_graph_control_palette_container}___theme-switch" style="color:red;"><i class="fa-solid fa-repeat"></i></button>
				</td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>
					<label>Mouse X</label>: <span id="${GraphObject.id_graph_control_palette_container}___mouse-x"></span><br>
					<label>Mouse Y</label>: <span id="${GraphObject.id_graph_control_palette_container}___mouse-y"></span>
				</td>
			</tr>
			`;

		GraphObject.panel = GraphObject.Utility.DOMElements.makeXpanel({
			id: '',
			class: '',
			// title: 'Control Palette',
			title: '',
			smalltitle: '',
			contentid: 'control_palette',
			content: GraphObject.controlPalette
		});

		GraphObject.id_graph_control_palette = GraphObject.id_graph_control_palette_container + '___control_palette';
		GraphObject.control_palette_xpanel = GraphObject.Utility.DOMElements.MakeDraggableDiv(GraphObject.id_graph_control_palette, 'Control Palette', GraphObject.panel, 10, 10, 'auto');
		GraphObject.div_graph_surface.querySelector('#' + GraphObject.id_graph_control_palette_container).appendChild(GraphObject.control_palette_xpanel);
	}

	// SECTION - Initialize the Graph Surface
	initializeGraphSurface = function (graphSurfaceID) {
		//TEMPORARY VARIABLE TO HOLD "this"
		let self = this;
		this.createGraphSurface(this, graphSurfaceID);
		
		//Graph Container Initialization and Processing
		//Creation Graph Container
		//ID of the Graph Container
		
		// NEW EVENT METHODS TO ENABLE REMOVAL OF EVENT
		let EventMethods = {
			"div_graph_surface_wheel": function (event) {
				event.preventDefault();
				if (event.deltaY < 0) {
					if (self.zoom_level < 3) self.zoom_level += 0.1;
				} else {
					if (self.zoom_level > 0.2) self.zoom_level -= 0.1;
				}
				self.zoom_level = self.Utility.Numbers.Round1(self.zoom_level);
				animateZoom(self.div_graph_surface, event);
				console.log('masuk event wheel di new EventMethods');
			},
			"div_graph_surface_zoom_in": function (event) {
				if (self.zoom_level < 3) self.zoom_level += 0.1;
				animateZoom(self.div_graph_surface);
				console.log('masuk event zoom in di new EventMethods');
			},
			"div_graph_surface_zoom_out": function (event) {
				if (self.zoom_level > 0.2) self.zoom_level -= 0.1;
				animateZoom(self.div_graph_surface);
				console.log('masuk event zoom out di new EventMethods');
			},
			"div_graph_surface_zoom_reset": function (event) {
				self.zoom_level = 1;
				animateZoom(self.div_graph_surface);
				console.log('masuk event zoom reset di new EventMethods');
			}
		}
		// NEW EVENT METHODS TO ENABLE REMOVAL OF EVENT

		//HANDLE ON CANVAS NAVIGATION, CLICK TO SCROLL LEFT RIGHT UP DOWN, SCROLL TO ZOOM IN OR OUT
		//ZOOM EVENT HANDLER
		function animateZoom(el, event) {
			let element = el;
			let centers;
			if (typeof el == 'string') {
				element = self.div_graph_surface.querySelector('#' + el);
			}
			self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transform = `scale(${self.zoom_level}, ${self.zoom_level})`;
			self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transformOrigin = '0px 0px';
			self.zoom_level = self.Utility.Numbers.Round1(self.zoom_level);
			self.div_graph_surface.querySelector('#zoom-level').innerHTML = self.zoom_level;
		}

		self.div_graph_surface.addEventOnce('wheel', EventMethods.div_graph_surface_wheel);

		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-in').addEventOnce('click', EventMethods.div_graph_surface_zoom_in);
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-reset').addEventOnce('click', EventMethods.div_graph_surface_zoom_reset);
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-out').addEventOnce('click', EventMethods.div_graph_surface_zoom_out);;
		//ZOOM EVENT HANDLER

		// Initialize variables for selection
		let isSelecting = false;
		let BoxStart = { x: 0, y: 0 };
		let selectionStart = { x: 0, y: 0 };
		let BoxEnd = { x: 0, y: 0 };
		let selectionEnd = { x: 0, y: 0 };
		self.selectedDivs = new Set(); // Keep track of selected divs
		let selectionBox; // The visual selection area element

		self.divs = document.querySelectorAll('.graph-node'); // Replace 'your-div-class' with the class name of your divs

		function createSelectionBox() {
			selectionBox = document.createElement('div');
			selectionBox.classList.add('selection-box'); // Apply CSS styling for the selection box
			self.div_graph_surface.appendChild(selectionBox);
		}

		function updateSelection() {
			self.divs.forEach(div => {
				const rect = div.getBoundingClientRect();
				const divX = rect.left + window.scrollX;
				const divY = rect.top + window.scrollY;

				if (
					divX >= Math.min(selectionStart.x, selectionEnd.x) &&
					divX + rect.width <= Math.max(selectionStart.x, selectionEnd.x) &&
					divY >= Math.min(selectionStart.y, selectionEnd.y) &&
					divY + rect.height <= Math.max(selectionStart.y, selectionEnd.y)
				) {
					div.classList.add('onselect');
					self.selectedDivs.add(div);
				} else {
					div.classList.remove('onselect');
					self.selectedDivs.delete(div);
				}
			});
		}

		self.dragSelectedDivs = function (e, selectedDivs, callBackOnDrag, callBackOnDone) {
			e.preventDefault();
			console.log('start on drag, mousedown >>');

			// Store the initial mouse/touch position
			let initialX, initialY;
			if (e.type === "touchstart") {
				initialX = e.changedTouches[0].clientX;
				initialY = e.changedTouches[0].clientY;
			} else {
				initialX = e.clientX;
				initialY = e.clientY;
			}

			const dragHandler = function (event) {
				event.preventDefault();
				console.log('start on drag, mousemove >>');

				// Calculate the distance moved by the mouse/touch
				let deltaX;
				let deltaY;
				if (event.type === "touchmove") {
					deltaX = event.changedTouches[0].clientX - initialX;
					deltaY = event.changedTouches[0].clientY - initialY;
				} else {
					deltaX = event.clientX - initialX;
					deltaY = event.clientY - initialY;
				}

				console.log('delta', deltaX, deltaY);

				// Update the position of each selected div without snapping for smooth movement
				selectedDivs.forEach((div) => {
					const currentLeft = parseInt(div.style.left) || 0;
					const currentTop = parseInt(div.style.top) || 0;

					// Calculate new positions without snapping
					let divider = self.zoom_level;
					const newLeft = currentLeft + deltaX / divider;
					const newTop = currentTop + deltaY / divider;

					div.style.left = newLeft + "px";
					div.style.top = newTop + "px";
				});

				// Update the initial mouse/touch position
				if (event.type === "touchmove") {
					console.log('masuk touch move')
					initialX = event.changedTouches[0].clientX;
					initialY = event.changedTouches[0].clientY;
				} else {
					console.log('masuk mouse move')
					initialX = event.clientX;
					initialY = event.clientY;
				}
				if (typeof callBackOnDrag === 'function') callBackOnDrag();
			};

			const stopDragHandler = function () {
				console.log('start on drag, mouseup >>');
				document.removeEventListener("mousemove", dragHandler);
				document.removeEventListener("touchmove", dragHandler);
				document.removeEventListener("mouseup", stopDragHandler);
				document.removeEventListener("touchend", stopDragHandler);

				// Perform snapping after the drag is complete
				selectedDivs.forEach((div) => {
					const currentLeft = parseInt(div.style.left) || 0;
					const currentTop = parseInt(div.style.top) || 0;

					// Snap to the nearest grid position
					const snappedLeft = Math.round(currentLeft / self.snapEvery) * self.snapEvery;
					const snappedTop = Math.round(currentTop / self.snapEvery) * self.snapEvery;

					div.style.left = snappedLeft + "px";
					div.style.top = snappedTop + "px";

					let found = self.Utility.Array.findArrayElement(self.nodes, 'id', div.id, 0);
					// console.log('self.nodes[found.array_index]', self.nodes[found.array_index].node);
					if (found != undefined) {
						console.log('found.array_index', found.array_index);
						console.log('id', self.nodes[found.array_index].id, snappedLeft, snappedTop);
						self.nodes[found.array_index].node.Presentation.Perspectives.GraphNode.Position = { x: snappedLeft, y: snappedTop };
						console.log(found.array_index, self.nodes[found.array_index].id, self.nodes[found.array_index].node.Presentation.Perspectives.GraphNode.Position);
					}
				});
				if (typeof callBackOnDone === 'function') callBackOnDone();
			};
			// Add event listeners to handle dragging
			document.addEventListener("mousemove", dragHandler);
			document.addEventListener("touchmove", dragHandler, { passive: false });
			document.addEventListener("mouseup", stopDragHandler);
			document.addEventListener("touchend", stopDragHandler, { passive: false });
		}
		self.onMouseDownHandler = function (e) {
			console.log('>>> Start self.onMouseDownHandler');
			self.dragSelectedDivs(e, self.selectedDivs, function () {
				if (self.connections.length > 0) self.DOMElements.renderGraphConnections(self.connections, self);
			}, function () {
				if (self.connections.length > 0) self.DOMElements.renderGraphConnections(self.connections, self);
				// self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
				// self.Utility.DataStore.SurrealDB.Put(self, 'Local');

				let storeNodes = [];
				self.nodes.forEach((d, i) => {
					storeNodes.push(d.node);
				});
				console.log('storeNodes >> ', storeNodes);

				self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
				// self.Utility.DataStore.SurrealDB.Put(self, 'Server', 'Yggdrasil', storeNodes);
				// self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
			});
			console.log('<<< Done self.onMouseDownHandler');
		}
		function finalizeSelection() {
			// FINALIZE SELECTION FROM SHIFT CLICK DRAG
			self.selectedDivs.forEach((div) => {
				div.classList.replace("onselect", "active");
				div.dataset.isActive = true;
				div.addEventListener("mousedown", self.onMouseDownHandler);
				div.addEventListener("touchstart", self.onMouseDownHandler);
			});
		}

		// Reset selection when connsvg is clicked
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventOnce('click', function (e) {
			// Clear the previous selection
			if (e.shiftKey) return;
			self.divs = document.querySelectorAll('.graph-node');
			self.divs.forEach((div) => {
				div.removeEventListener("mousedown", self.onMouseDownHandler);
				div.removeEventListener("touchstart", self.onMouseDownHandler);
				div.removeEventListener("mousedown", self.onNodeClick);
			});
			self.resetSelection(self);
		});
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventOnce('touchstart', function (e) {
			// Clear the previous selection
			self.divs = document.querySelectorAll('.graph-node');
			self.divs.forEach((div) => {
				div.removeEventListener("mousedown", self.onMouseDownHandler);
				div.removeEventListener("touchstart", self.onMouseDownHandler);
				div.removeEventListener("mousedown", self.onNodeClick);
			});
			self.resetSelection(self);
		});

		let pos = { top: 0, left: 0, x: 0, y: 0 };
		const mouseDownHandler = function (e) {
			// Check if the event target is the div itself and not any other element within the div
			if (e.target !== self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg')) return;

			// Check if the shift key is held down
			if (e.shiftKey) {
				isSelecting = true;
				BoxStart = { x: e.clientX + self.div_graph_surface.scrollLeft, y: e.clientY + self.div_graph_surface.scrollTop };
				BoxEnd = { x: e.clientX + self.div_graph_surface.scrollLeft, y: e.clientY + self.div_graph_surface.scrollTop };
				selectionStart = { x: e.clientX, y: e.clientY };
				selectionEnd = { x: e.clientX, y: e.clientY };

				createSelectionBox();
			} else {
				// console.log('masuk moousedown handler biasa');
				self.div_graph_surface.style.cursor = 'grabbing';
				self.div_graph_surface.style.userSelect = 'none';

				pos = {
					left: self.div_graph_surface.scrollLeft,
					top: self.div_graph_surface.scrollTop,
					// Get the current mouse position
					x: e.clientX,
					y: e.clientY,
				};

			}
			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};

		const mouseMoveHandler = function (e) {
			e.preventDefault();
			if (isSelecting) {
				selectionEnd = { x: e.clientX, y: e.clientY };
				BoxEnd = { x: e.clientX + self.div_graph_surface.scrollLeft, y: e.clientY + self.div_graph_surface.scrollTop };

				// Update the visual selection box
				const left = Math.min(BoxStart.x, BoxEnd.x);
				const top = Math.min(BoxStart.y, BoxEnd.y);
				const width = Math.abs(BoxStart.x - BoxEnd.x);
				const height = Math.abs(BoxStart.y - BoxEnd.y);
				selectionBox.style.left = left + 'px';
				selectionBox.style.top = top + 'px';
				selectionBox.style.width = width + 'px';
				selectionBox.style.height = height + 'px';

				updateSelection();
			} else {
				// Calculate the distance moved by the mouse
				const dx = e.clientX - pos.x;
				const dy = e.clientY - pos.y;

				// Scroll the element only if the distance moved is significant
				if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
					self.div_graph_surface.scrollTop = pos.top - dy;
					self.div_graph_surface.scrollLeft = pos.left - dx;
				}
			}
		};

		const mouseUpHandler = function () {
			if (isSelecting) {
				isSelecting = false;
				updateSelection();
				finalizeSelection();
				// Remove the visual selection box
				self.div_graph_surface.removeChild(selectionBox);
				selectionBox = null;
			} else {
				self.div_graph_surface.style.cursor = 'grab';
				self.div_graph_surface.style.removeProperty('user-select');
			}
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};

		// Attach the handler
		self.div_graph_surface.addEventOnce('mousedown', mouseDownHandler);
		self.div_graph_surface.addEventOnce('touchstart', mouseDownHandler);
		self.div_graph_surface.addEventOnce('dblclick', function (e) {
			// console.log('doubleclick');
			self.Utility.DOMElements.scrollTo(self.div_graph_surface, e);
		});

		// Add mouseover and mouseout handlers to change cursor style
		// console.log(`self.div_graph_surface.querySelector('#' + self.id_graph_surface + ' - connsvg'`, self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg'));
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventOnce('mouseover', function (e) {
			self.div_graph_surface.style.cursor = 'grab';
		});
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventOnce('mouseout', function () {
			self.div_graph_surface.style.cursor = 'default';
		});


		//LIGHT/DARK THEME SWITCHER
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '___theme-switch').addEventOnce('click', function () {
			// console.log('theme switch');
			let root = document.documentElement;
			this.dataset.count = this.dataset.count ? parseInt(this.dataset.count) : 0;
			// console.log('this.dataset.count', this.dataset.count);

			if (this.dataset.count < 2) {
				// console.log('masuk < 2');
				if (root.classList.contains('light-theme')) {
					// console.log('masuk dark');
					root.classList.replace('light-theme', 'dark-theme');
				} else if (root.classList.contains('dark-theme')) {
					// console.log('masuk light');
					root.classList.replace('dark-theme', 'light-theme');
				} else {
					// console.log('masuk default');
					let isCurrentThemeDark = UtilityObject.DOMElements.detectLightDarkMode();
					root.classList.add(isCurrentThemeDark.matches ? 'light-theme' : 'dark-theme');
				}
				this.style.color = '';
				this.dataset.count++;
			} else {
				// console.log('masuk reset');
				root.classList.remove('dark-theme', 'light-theme');
				this.style.color = 'red';
				this.dataset.count = 0;
			}
		});
		//LIGHT/DARK THEME SWITCHER

		//MAKE GRAPH CONTROL PALETTE DRAGABLE
		this.DOMElements.DragElement(this.div_graph_surface.querySelector('#' + this.id_graph_control_palette));

		//ADD NODE
		this.div_graph_surface.querySelectorAll(`#${self.id_graph_control_palette_container}-node-add`).forEach((d, i) => {
			d.addEventOnce('click', function (e) {
				let newNode = new NodeProperties();
				// newNode.id = 'Node/'+self.Utility.Numbers.generateUUID();
				newNode.UID = 'GraphNode__' + self.Utility.Numbers.generateUUID();
				// newNode.id = newNode.UID;

				newNode.DocumentID = newNode.UID;
				newNode.DocumentName = self.DocumentName;
				newNode.DocumentLabel = self.DocumentLabel;
				newNode.DocumentHeader = self.DocumentHeader;
				newNode.DocumentFooter = self.DocumentFooter;
				newNode.DocumentType = self.DocumentType; //REALM, World, Data Node, Processing Node
				newNode.DocumentWorld = self.DocumentWorld; //KnowledgeBase, BusinessLogic, ApplicationUserInterface, Data
				newNode.DocumentUniverse = self.DocumentUniverse; //KnowledgeBase, BusinessLogic, ApplicationUserInterface, Data
				newNode.Timestamp = self.Utility.Time.getNowDateTimeString('YMD');
				console.log('self.Utility.Time.initDate()', self.Utility.Time.getNowDateTimeString('YMD'));
				console.log('newNode >>>', newNode);

				let n = 20;
				newNode.Presentation.Perspectives.GraphNode.Position = { x: 350 + (n * self.nodes.length - 1), y: 300 + (n * self.nodes.length - 1) };
				let temp = self.Utility.DOMElements.MakeDraggableNode(newNode.UID, 'graph-node fade-in', 'Node TEST ' + newNode.UID + ' DIV', '<p>Make</p><p>this</p><p>MOVE</p>', newNode.Presentation.Perspectives.GraphNode.Position.x, newNode.Presentation.Perspectives.GraphNode.Position.y, self.nodes.length);
				self.nodes.push({ id: newNode.UID, node: newNode, element: temp });
				self.DOMElements.renderGraph(self);
				// self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
				// self.Utility.DataStore.SurrealDB.Put(self, 'Local');

				let storeNodes = [];
				self.nodes.forEach((d, i) => {
					storeNodes.push(d.node);
				});
				console.log('storeNodes >> ', storeNodes);

				self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
				// self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
				// self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
			});
		});
		//ADD NODE
		//SAVE NODE TO SERVER
		this.div_graph_surface.querySelectorAll(`#${self.id_graph_control_palette_container}-node-savetoserver`).forEach((d, i) => {
			d.addEventOnce('click', function (e) {
				let storeNodes = [];
				self.nodes.forEach((d, i) => {
					storeNodes.push(d.node);
				});
				console.log('storeNodes >> ', storeNodes);
				self.Utility.DataStore.SurrealDB.Put(self, 'Server', 'Yggdrasil', storeNodes);
			});
		});
		//SAVE NODE TO SERVER

		//REMOVE NODE
		this.div_graph_surface.querySelectorAll(`#${self.id_graph_control_palette_container}-node-remove`).forEach((d, i) => {
			d.addEventOnce('click', function (e) {
				let found = [];
				let foundID = [];
				self.nodes.forEach((d, i) => {
					if (d.element.dataset.isActive === 'true') {
						found.push({ element: d.element, index: i });
						foundID.push(d.element.id);
					}
				});
				// console.log('found', found);
				// console.log('foundID', foundID);
				if (found.length > 0) {
					if (confirm(`Apakah anda yakin ingin menghapus ${found.length} node yang anda pilih?`)) {
						(async () => {
							console.log('masuk async');
							await self.Utility.DataStore.SurrealDB.Delete(self, 'Local', 'Yggdrasil', foundID);
							found = found.reverse();
							found.forEach(el => {
								el.element.classList.add('fade-out');
							});
							setTimeout(function () {
								found.forEach(el => {
									el.element.remove()
									self.nodes.splice(el.index, 1);

								});
								self.divs = document.querySelectorAll('.graph-node'); // Replace 'your-div-class' with the class name of your divs
								// self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');

								// let storeNodes = [];
								// self.nodes.forEach((d, i) => {
								// 	storeNodes.push(d.node);
								// });
								// console.log('storeNodes >> ', storeNodes);			
								// self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
							}, 200);
						})();
					}
				} else {
					console.error('Pilih node dulu!');
				}
				// self.DOMElements.renderGraph(self);
				// self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
			});
		});
		//REDUCE NODE

		return this.div_graph_surface;
	}
	resetSelection = function (self) {
		// console.log('Clear previously selected nodes');
		// console.log('self.selecteDivs', self.selecteDivs, typeof self.selecteDivs);
		// if (typeof self.selecteDivs != 'undefined')
		self.selectedDivs.clear();
		self.nodes.forEach((d, i) => {
			if (d.element.dataset.isActive = 'true') self.selectedDivs.add(d.element);
		});

		if (self.selectedDivs.size > 0) self.selectedDivs.forEach(div => {
			div.classList.remove('active');
			div.dataset.isActive = false;
		});
		self.selectedDivs.clear();
	}
	onNodeClick = (function (e, element, callback) {
		//GRAPH NODE CLICK EVENT
		this.resetSelection(this);

		if (element.dataset.isActive == undefined) element.dataset.isActive = 'false';
		if (element.dataset.isActive == 'false') {
			// console.log('masuk isActive kosong or false');
			element.classList.add('active');
			element.dataset.isActive = 'true';
			this.selectedDivs.add(element);
		}
		if (typeof callback != 'undefined') callback();
		//GRAPH NODE CLICK EVENT
	}).bind(this);

	DOMElements = {
		
		"renderGraph": (function (self) {
			self.nodes.forEach((d, i) => {
				let n = 20;
				if (!self.div_graph_surface.querySelector(`[id="${d.id}"]`)) {
					let temp = self.Utility.DOMElements.MakeDraggableNode(d.id, 'graph-node fade-in', 'Node TEST ' + d.id + ' DIV', '<p>Make</p><p>this</p><p>MOVE</p>', d.node.Presentation.Perspectives.GraphNode.Position.x, d.node.Presentation.Perspectives.GraphNode.Position.y, self.nodes.length);
					self.nodes[i].element = temp;
					self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph').append(temp);
				}
			});
			self.divs = document.querySelectorAll('.graph-node');
			self.DOMElements.initConnectorEvents(self);
			self.nodes.forEach((segment, idx, array) => {
				// console.log(segment);
				segment.node.Connections.Pins.forEach(d => {
					// console.log('d', d);
				});
				// var connectorContainer = this.closest(".connection-container").querySelector(".top-input");
				// if (connectorContainer.children.length >= 20) return;
				// let connectorUID = 'Connector-Input-' + self.Utility.Numbers.generateUUID();
				// connectorContainer.innerHTML += `<i class="fa-solid fa-circle-chevron-down text-danger" style="--bs-text-opacity: .5;" id="${connectorUID}" data--connected="false" data--connection-direction="v"></i>`;
				// self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);

				segment.element.querySelector('.graph-node-titlebar').addEventOnce('dblclick', function (e) {
					console.log('click executed in render graph');
					self.resetSelection(self);
					//GRAPH NODE CLICK EVENT
					if (segment.element.dataset.isActive == undefined) segment.element.dataset.isActive = 'false';
					console.log('segment.element', segment.element);
					if (segment.element.dataset.isActive == 'false') {
						// console.log('masuk isActive kosong or false');
						segment.element.classList.add('active');
						segment.element.dataset.isActive = 'true';
						self.selectedDivs.add(segment.element);
						self.selectedDivs.forEach((div) => {
							div.dataset.isActive = true;
							div.addEventListener("mousedown", self.onMouseDownHandler);
							div.addEventListener("touchstart", self.onMouseDownHandler);
						});
					}
					//GRAPH NODE CLICK EVENT
				});

				segment.element.querySelector('.graph-node-titlebar').addEventOnce('click', function (e) {
					console.log('click executed in render graph');
					let multinode_select = self.div_graph_surface.querySelector(`#${self.id_graph_control_palette_container}-multinode-select`).checked;
					if (!multinode_select) self.resetSelection(self);

					//GRAPH NODE CLICK EVENT
					if (segment.element.dataset.isActive == undefined) segment.element.dataset.isActive = 'false';
					console.log('segment.element', segment.element);
					if (segment.element.dataset.isActive == 'false') {
						// console.log('masuk isActive kosong or false');
						segment.element.classList.add('active');
						segment.element.dataset.isActive = 'true';
						self.selectedDivs.add(segment.element);
						self.selectedDivs.forEach((div) => {
							div.dataset.isActive = true;
							div.addEventListener("mousedown", self.onMouseDownHandler);
							div.addEventListener("touchstart", self.onMouseDownHandler);
						});
					}
					//GRAPH NODE CLICK EVENT
				});
				// Add touch event listener
				segment.element.querySelector('.graph-node-titlebar').addEventOnce('touchstart', function (e) {
					console.log('touch executed in render graph');
					// Check if the touch event target has an ID ending with "header"
					if (e.target.id && e.target.id.endsWith("header")) {
						// Prevent the default behavior to avoid issues with touch events
						console.log('touch di header e executed');
						e.preventDefault();

						let multinode_select = self.div_graph_surface.querySelector(`#${self.id_graph_control_palette_container}-multinode-select`).checked;
						if (!multinode_select) self.resetSelection(self);

						//GRAPH NODE CLICK EVENT
						if (segment.element.dataset.isActive == undefined) segment.element.dataset.isActive = 'false';
						if (segment.element.dataset.isActive == 'false') {
							// console.log('masuk isActive kosong or false');
							segment.element.classList.add('active');
							segment.element.dataset.isActive = 'true';
							self.selectedDivs.add(segment.element);
							self.selectedDivs.forEach((div) => {
								div.dataset.isActive = true;
								div.addEventListener("mousedown", self.onMouseDownHandler);
								div.addEventListener("touchstart", self.onMouseDownHandler);
							});
						}
						if (typeof callback != 'undefined') callback();
						//GRAPH NODE CLICK EVENT
					}
				}, { passive: false });
			});
			// });
		}).bind(this),
		"initConnectorEvents": (function (self) {
			function inputEvents(d, i, arr) {
				d.addEventOnce('click', function (e) {
					console.log('top input ' + i);
					if (!self.makingConnection) {
						// console.error('Not in Making Connection mode');
						return;
					}
					if (self.ConnectionDirection != d.dataset.ConnectionDirection) {
						console.error('Connection direction is ' + self.ConnectionDirection);
						// utility.ConnectionDirection = null;
						return;
					}
					let element = self.Utility.DOMElements.FindPosition(this, self.div_graph_surface);
					console.log('element', element);
					let endElement = element.element.id;
					// console.log('element', element, endElement);

					if (self.connections.length > 0) {
						// console.log('startElement', self.startElement, 'endElement', self.endElement);
						let sourceFound = false;
						let destinationFound = false;
						self.connections.forEach(elmt => {
							if ((elmt.Source == self.startElement) && (elmt.Destination == self.endElement)) {
								console.error(`Connection from ${self.startElement} to ${self.endElement} already exist!`);
								return;
							}
						});
					}

					if (self.activeElement == null) self.activeElement = element.element.id;
					if (self.activeElement != this.id) return;

					let endPosX = parseFloat(element.x);
					let endPosY = parseFloat(element.y);

					self.tempConn = new Connection(self.Utility.Numbers.generateUUID(), self);

					self.tempConn.Source = self.startElement;
					self.tempConn.pathMode = self.ConnectionDirection;

					self.tempConn.endPos = { x: (endPosX), y: (endPosY) };
					// console.log('startPos', self.tempConn.startPos);
					// console.log('endPos', self.tempConn.endPos);
					self.tempConn.Destination = element.element.id;
					if (self.tempConn !== null) self.connections.push(self.tempConn);

					self.div_graph_surface.querySelector('#' + self.tempConn.Source).dataset.Connected = 'false';
					self.div_graph_surface.querySelector('#' + self.tempConn.Destination).dataset.Connected = 'true';

					self.tempConn = null;
					self.startPosX = 0;
					self.startPosY = 0;
					self.DOMElements.renderGraphConnections(self.connections, self);
					self.makingConnection = false;
					self.ConnectionDirection = null;
					self.activeElement = null;
				});
			}
			function outputEvents(d, i, arr) {
				d.addEventOnce('click', function (e) {
					console.log('right output ' + i);
					self.makingConnection = true;
					self.ConnectionDirection = d.dataset.ConnectionDirection;

					let element = self.Utility.DOMElements.FindPosition(this, self.div_graph_surface);
					self.startPosX = parseFloat(element.x);
					self.startPosY = parseFloat(element.y);
					self.startElement = element.element.id;
					// console.log(`startX: ${self.startPosX}, startY: ${self.startPosY}`);
				});
			}
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(d => {
				d.addEventOnce('click', () => {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.top-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventOnce('click', function () {
					var connectorContainer = this.closest(".connection-container").querySelector(".top-input");
					if (connectorContainer.children.length >= 20) return;
					let connectorUID = 'Connector-Input-' + self.Utility.Numbers.generateUUID();
					connectorContainer.innerHTML += `<i class="fa-solid fa-circle-chevron-down text-danger" style="--bs-text-opacity: .5;" id="${connectorUID}" data--connected="false" data--connection-direction="v"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);

					var graphNode = this.closest(".graph-node");
					// console.log('graph-node', graphNode, graphNode.id);
					let found = self.nodes.find(el => el.id == graphNode.id);
					let foundIndex = null;
					if (found != undefined) foundIndex = self.nodes.findIndex(el => el.id == graphNode.id);
					// console.log('found', found, foundIndex);
					// console.log(JSON.parse(JSON.stringify(found.node.ConnectionPinTemplate)));
					let pin = self.Utility.Objects.copyObject(found.node.ConnectionPinTemplate);

					pin.pinUID = connectorUID;
					pin.PinPosition = 'top';

					// "Inputs": {
					// 	"pinUID": "",
					// 	"Label": "",
					// 	"PinPosition":"",
					// 	"From": [],
					// 	"triggerFunctionName": ""
					// },
					// "Outputs": {
					// 	"pinUID": "",
					// 	"Label": "",
					// 	"PinPosition": "",
					// 	"Trigger": false,
					// 	"Value": {
					// 		"DocumentID": null,
					// 		"UID": null,
					// 		"Dataset": null
					// 	},
					// 	"To": [], //OutputTriggerToFrom or OutputToFrom array
					// },
					// "OutputTriggerToFrom": {
					// 	"pinUID": "",
					// 	"triggerFunction": "" //Some method on the receiving end.
					// },
					// "OutputToFrom": {
					// 	"pinUID": "",
					// }

					found.node.Connections.Pins.push(pin);
					// self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');

					let storeNodes = [];
					self.nodes.forEach((d, i) => {
						storeNodes.push(d.node);
					});
					console.log('storeNodes >> ', storeNodes);

					self.Utility.DataStore.SurrealDB.Put(self, 'Local', 'Yggdrasil', storeNodes);
					// self.Utility.DataStore.SurrealDB.Put(self, 'Memory', 'Yggdrasil', storeNodes);
					// self.Utility.DataStore.SurrealDB.Put(self, 'Server', 'Yggdrasil', storeNodes);

				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventOnce('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.left-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventOnce('click', function () {
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					let connectorUID = 'Connector-Input-' + self.Utility.Numbers.generateUUID();
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-right text-warning" style="--bs-text-opacity: .8; display:block;" id="${connectorUID}" data--connected="false" data--connection-direction="h"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventOnce('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.right-output > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.dataset.clickEventInitialized = true;
				d.addEventOnce('click', function () {
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					let connectorUID = 'Connector-Output-' + self.Utility.Numbers.generateUUID();
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-right text-success" style="--bs-text-opacity: .5; display:block;" id="${connectorUID}" data--connected="false" data--connection-direction="h"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventOnce('click', function () {
					console.log('clicked remove conn bottom');
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.bottom-output> i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventOnce('click', function () {
					var connectorContainer = this.closest(".connection-container").querySelector(".bottom-output");
					if (connectorContainer.children.length >= 20) return;
					let connectorUID = 'Connector-Input-' + self.Utility.Numbers.generateUUID();
					connectorContainer.innerHTML += `<i class="fa-solid fa-circle-arrow-down text-primary-emphasis" style="--bs-text-opacity: .5;" id="${connectorUID}" data--connected="false" data--connection-direction="v"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
		}).bind(this),

		"renderGraphConnections": (function (conns, graphSurface, cr = true) {
			if (cr) console.log('Masuk renderGraphConnections');
			if (cr) console.log('graphSurface', graphSurface);
			// if (cr) console.log('this', this.DOMElements.FindPosition());
			if (arguments.length == 0) {
				console.error('Connections array needed!');
				return;
			}
			if (conns.length == 0) {
				console.error('Connections array is empty!');
				return;
			}
			if (!Array.isArray(conns)) {
				console.error('Connections array is not an array!');
				return;
			}

			// let svgChildren = graphSurface.svg.querySelectorAll('path').length;
			// console.log('this >>>>>', this);
			let svgChildren = this.div_graph_surface.querySelectorAll(`#${this.svg.id} > path`).length;

			let connArrayLength = conns.length;
			if (cr) console.log(`svgChildren: ${svgChildren}, connArrayLength:${connArrayLength}`);
			let utilClass = this.Utility;
			if (svgChildren == 0) {
				if (cr) console.log('svg children = 0');
				// graphSurface.svg.textContent = '';
				conns.forEach(function (conn, idx, arr) {
					let src = utilClass.DOMElements.FindPositionV1(conns[idx].Source, graphSurface.div_graph_surface);
					let dst = utilClass.DOMElements.FindPositionV1(conns[idx].Destination, graphSurface.div_graph_surface);

					// conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
					// conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					if (conns[idx].pathMode == 'h') {
						conns[idx].startPos = { x: ((src.x + 12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x - 18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					} else {
						conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: ((src.y) / graphSurface.zoom_level) };
						conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: ((dst.y) / graphSurface.zoom_level) };
					}

					conns[idx].path = conns[idx].createQCurve();
					graphSurface.svg.appendChild(conns[idx].path);
					graphSurface.div_graph_surface.querySelector(`i#${conns[idx].Source}`).dataset.Connected = true;
					graphSurface.div_graph_surface.querySelector(`i#${conns[idx].Destination}`).dataset.Connected = true;
				});
			} else if (svgChildren != connArrayLength) {
				if (cr) console.log('svgChildren != connArrayLength');
				conns.forEach(function (conn, idx, arr) {
					// console.log('conns foreach ke '+idx);
					let src = utilClass.DOMElements.FindPositionV1(conns[idx].Source, graphSurface.div_graph_surface);
					let dst = utilClass.DOMElements.FindPositionV1(conns[idx].Destination, graphSurface.div_graph_surface);

					// conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
					// conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					if (conns[idx].pathMode == 'h') {
						conns[idx].startPos = { x: ((src.x + 12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x - 18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					} else {
						conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: ((src.y) / graphSurface.zoom_level) };
						conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: ((dst.y) / graphSurface.zoom_level) };
					}

					if (idx < (svgChildren)) {
						console.log(conns[idx]);
						//IF Connection's current cursor array index is smaller or equal than svg children index, self.connections array and svg children are still hand on hand
						if (conns[idx].pathMode == 'h') {
							conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
						} else {
							conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
						}
					} else {
						console.log(conns[idx]);
						//IF Connection's current cursor array index is larger than svg children's index, need to create new svg children.
						conns[idx].startPos = { x: (src.x + 12) / graphSurface.zoom_level, y: (src.y) / graphSurface.zoom_level };
						conns[idx].endPos = { x: (dst.x - 18) / graphSurface.zoom_level, y: (dst.y) / graphSurface.zoom_level };
						conns[idx].path = conns[idx].createQCurve();
						graphSurface.svg.appendChild(conns[idx].path);
					}
				});
			} else if (svgChildren == connArrayLength) {
				if (cr) console.log('svgChildren == connArrayLength');
				conns.forEach(function (conn, idx, arr) {
					let src = utilClass.DOMElements.FindPosition(conns[idx].Source, graphSurface.div_graph_surface);
					let dst = utilClass.DOMElements.FindPosition(conns[idx].Destination, graphSurface.div_graph_surface);

					if (conns[idx].pathMode == 'h') {
						conns[idx].startPos = { x: ((src.x + 12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x - 18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					} else {
						conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: ((src.y) / graphSurface.zoom_level) };
						conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: ((dst.y) / graphSurface.zoom_level) };
					}
					if (conns[idx].pathMode == 'h') {
						conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
					} else {
						conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
					}
				});
			}
		}).bind(this),
		"DragElement": (function (elmnt, zoomed = false, snap_every = 1, callback) {
			//DragElement in GraphSurface

			// console.log('start drag element');
			// console.log('elmnt>', elmnt);
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0;
			function RoundToNearestBase(num, base) {
				return Math.round(num / base) * base;
			}
			if (elmnt.querySelector('[id="' + elmnt.id + '-header"]')) {
				// If present, the header is where you move the DIV from:
				// console.log('masuk drag via header');
				elmnt.querySelector('[id="' + elmnt.id + '-header"]').onmousedown = dragMouseDown.bind(this);
				elmnt.querySelector('[id="' + elmnt.id + '-header"]').addEventListener("touchstart", touchStart.bind(this), { passive: false });
			} else {
				// Otherwise, move the DIV from anywhere inside the DIV:
				// console.log('masuk drag via body');
				elmnt.onmousedown = dragMouseDown.bind(this);
				elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			}

			function dragMouseDown(e) {
				// console.log('start drag element >>');
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				this.activeElement = elmnt.id;
				e = e || window.event;
				e.preventDefault();
				// get the mouse cursor position at startup:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = RoundToNearestBase((e.clientX / divider), snap_every);
				pos4 = RoundToNearestBase((e.clientY / divider), snap_every);
				document.onmouseup = closeDragElement.bind(this);
				// call a function whenever the cursor moves:
				document.onmousemove = elementDrag.bind(this);
			}

			function touchStart(e) {
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				const touch = e.changedTouches[0];
				// Reset the initial touch position at the start of a new touch:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = RoundToNearestBase((touch.clientX / divider), snap_every);
				pos4 = RoundToNearestBase((touch.clientY / divider), snap_every);
				// Ensure previous touchend and touchmove event listeners are removed:
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				// Attach new event listeners:
				document.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
				document.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
			}

			function elementDrag(e) {
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				// calculate the new cursor/touch position:
				let clientX, clientY;
				let divider = (zoomed) ? this.zoom_level : 1;

				if (e.type === "touchmove") {
					// document.getElementById('touchevent').innerHTML = 'Touch Move';
					const touch = e.changedTouches[0];
					clientX = RoundToNearestBase((touch.clientX / divider), snap_every);
					clientY = RoundToNearestBase((touch.clientY / divider), snap_every);
				} else {
					clientX = RoundToNearestBase((e.clientX / divider), snap_every);
					clientY = RoundToNearestBase((e.clientY / divider), snap_every);
				}

				pos1 = pos3 - clientX;
				pos2 = pos4 - clientY;
				pos3 = clientX;
				pos4 = clientY;
				// set the element's new position:
				let cY = elmnt.offsetTop - pos2;
				let cX = elmnt.offsetLeft - pos1;
				if (cY >= 0) elmnt.style.top = cY + "px";
				if (cX >= 0) elmnt.style.left = cX + "px";
				if (typeof callback != 'undefined') callback();
			}

			function closeDragElement() {
				// Reset initial touch positions to avoid the jump behavior on subsequent touches:
				pos3 = 0;
				pos4 = 0;
				this.activeElement = null;

				// stop moving when the mouse/touch is released:
				document.onmouseup = null;
				document.onmousemove = null;
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				if (typeof callback != 'undefined') callback();
			}
		}).bind(this),
		"WorldNode": (function (id, dataset, parameters) {
		}).bind(this),
		"SystemObjectNode": (function () {
		}).bind(this),
		"InputNode": (function () {
		}).bind(this),
		"FunctionNode": (function () {
		}).bind(this),
		"DatastorageNode": (function () {
		}).bind(this),
	}
}