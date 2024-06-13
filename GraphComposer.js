// import { Utility } from "./UtilityClass.mjs";
export class GraphSurface {
	constructor(inputs) {
		this.svg = null;//SVG where the line paths are drawn
		console.log('arguments', arguments);
		console.log('inputs', inputs);
		this.Utility = null;
		if (typeof inputs == 'object') if (typeof inputs.Utility != 'undefined') this.Utility = inputs.Utility;
		this.Storage = null;
		if (typeof inputs == 'object') if (typeof inputs.Storage != 'undefined') this.Storage = inputs.Storage;
		this.NodeProperties = null;
		if (typeof inputs == 'object') if (typeof inputs.NodeProperties != 'undefined') this.NodeProperties = inputs.NodeProperties;
		this.zoom_level = 1;
		this.activeElement = null;
		this.makingConnection = false;
		this.ConnectionDirection = null;
		this.id_graph_surface = null;
		this.div_graph_surface = null;
		this.controlPalette = null;
		this.panel = null;
		this.id_graph_control_palette = null;
		this.control_palette_xpanel = null;
		this.nodes = [];
		this.connections = [];
		this.startPosX = 0;
		this.startPosY = 0;
		this.startElement = null;
		this.mousedown = false;
		this.newConn = false;
		this.tempConn = null;
	}
	initializeGraphSurface = function(graphSurfaceID){
		// console.log(this);
		//Graph Container Initialization and Processing
		//Creation Graph Container
		//ID of the Graph Container
		this.id_graph_surface = graphSurfaceID;

		this.div_graph_surface = document.createElement('div');
		this.div_graph_surface.id = this.id_graph_surface;
		// this.div_graph_surface.className = 'graph-surface';
		this.div_graph_surface.style.width = '100vw';
		this.div_graph_surface.style.height = '100vh';
		this.div_graph_surface.style.overflow = 'scroll';
		this.div_graph_surface.style.position = 'relative';

		//Creation of Graph Surface in Graph Container
		this.div_graph_surface.appendChild(this.DOMElements.initiateGraphSurfaceContainer(this.id_graph_surface));

		//Initialization of Graph Surface in Graph Container
		this.svg = this.div_graph_surface.querySelector('#' + this.id_graph_surface + '-connsvg');
		this.svg.ns = this.svg.namespaceURI;

		//Creation and Initialization Graph Control Palette
		//ID of the Graph Control Palette
		this.id_graph_control_palette_container = this.id_graph_surface+'_control_palette_container';

		this.div_graph_control_palette = document.createElement('div');
		this.div_graph_control_palette.id = this.id_graph_control_palette_container;

		//Prepend Graph Control Palette into Graph Container
		// this.div_graph_surface.querySelector('#' + this.id_graph_surface + '-graph-surface').appendChild(this.div_graph_control_palette);
		this.div_graph_surface.appendChild(this.div_graph_control_palette);

		//Creation of Graph Surface in Graph Container
		this.zoom_level = 1;
		this.controlPalette = document.createElement('table');
		this.controlPalette.className = 'toolbar-kit';
		this.controlPalette.style.width = '100%';
		this.controlPalette.innerHTML = `
			<tr>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-zoom-out"><i class="fa-solid fa-minus"></i></button></td>
				<td>ZOOM (<label id='zoom-level'>${this.zoom_level}</label>)</td>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-zoom-in"><i class="fa-solid fa-plus"></i></button></td>
			</tr>
			<tr>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-node-reduce"><i class="fa-solid fa-minus"></i></button></td>
				<td>NODE</td>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-node-add"><i class="fa-solid fa-plus"></i></button></td>
			</tr>
			<tr>
				<td></td>
				<td>Vertical Link</td>
				<td><input type='checkbox' id='${this.id_graph_control_palette_container}-vertical_link'></td>
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
					<button class="raised-element" id="${this.id_graph_control_palette_container}___theme-switch" style="color:red;"><i class="fa-solid fa-repeat"></i></button>
				</td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>
					<label>Mouse X</label>: <span id="${this.id_graph_control_palette_container}___mouse-x"></span><br>
					<label>Mouse Y</label>: <span id="${this.id_graph_control_palette_container}___mouse-y"></span>
				</td>
			</tr>
			`;
		this.panel = UtilityObject.DOMElements.makeXpanel({
			id: '',
			class: '',
			// title: 'Control Palette',
			title: '',
			smalltitle: '',
			contentid: 'control_palette',
			content: this.controlPalette
		});

		this.id_graph_control_palette = this.id_graph_control_palette_container + '___control_palette';
		this.control_palette_xpanel = UtilityObject.DOMElements.MakeDraggableDiv(this.id_graph_control_palette, 'Control Palette', this.panel, 10, 10, 'auto');
		this.div_graph_surface.querySelector('#'+this.id_graph_control_palette_container).appendChild(this.control_palette_xpanel);

		//TEMPORARY VARIABLE TO HOLD "this"
		let self = this;

		//ZOOM BUTTONS HANDLER
		function animateZoom(el) {
			let element = el;
			let centers;
			if (typeof el == 'string') {
				element = self.div_graph_surface.querySelector('#'+el);
			}
			// console.log(self);
			// console.log(self.div_graph_surface);
			// console.log('#' + self.id_graph_surface + '-graph-surface');
			// console.log(self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface'));
			self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transform = `scale3D(${self.zoom_level}, ${self.zoom_level}, ${self.zoom_level})`;
			// centers = self.Storage.DOMElements.FindMousePosstoragevent);
			// console.log('centers in mouse move', centers);
			self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transformOrigin = '0px 0px';
			// self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transformOrigin = centers.element.x + 'px ' + centers.element.y + 'px';
			self.zoom_level = self.Utility.Numbers.Round1(self.zoom_level);
			self.div_graph_surface.querySelector('#zoom-level').innerHTML = self.zoom_level;
		}

		self.div_graph_surface.addEventListener('wheel', function (event) {
			if (event.deltaY < 0) {
				if (self.zoom_level < 3) self.zoom_level += 0.1;
				animateZoom(self.div_graph_surface, event);
			} else {
				if (self.zoom_level > 0.2) self.zoom_level -= 0.1;
				animateZoom(self.div_graph_surface, event);
			}
			event.preventDefault();
		});

		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container +'-zoom-in').addEventListener('click', function () {
			if (self.zoom_level < 3) self.zoom_level += 0.1;
			animateZoom(self.div_graph_surface);
		});
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-out').addEventListener('click', function () {
			if (self.zoom_level > 0.2) self.zoom_level -= 0.1;
			animateZoom(self.div_graph_surface);
		});
		//ZOOM BUTTONS HANDLER

		//HANDLE ON CANVAS NAVIGATION, CLICK TO SCROLL LEFT RIGHT UP DOWN, SCROLL TO ZOOM IN OR OUT
		let pos = { top: 0, left: 0, x: 0, y: 0 };
		const mouseDownHandler = function (e) {
			// Check if the event target is the div itself and not any other element within the div
			if (e.target !== self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg')) return;

			self.div_graph_surface.style.cursor = 'grabbing';
			self.div_graph_surface.style.userSelect = 'none';

			pos = {
				left: self.div_graph_surface.scrollLeft,
				top: self.div_graph_surface.scrollTop,
				// Get the current mouse position
				x: e.clientX,
				y: e.clientY,
			};

			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};

		const mouseMoveHandler = function (e) {
			// How far the mouse has been moved
			const dx = e.clientX - pos.x;
			const dy = e.clientY - pos.y;
			self.div_graph_surface.querySelector('#' + self.id_graph_control_palette_container + '___mouse-x').innerHTML = e.clientX;
			self.div_graph_surface.querySelector('#' + self.id_graph_control_palette_container + '___mouse-y').innerHTML = e.clientY;

			// Scroll the element
			self.div_graph_surface.scrollTop = pos.top - dy;
			self.div_graph_surface.scrollLeft = pos.left - dx;
		};

		const mouseUpHandler = function () {
			self.div_graph_surface.style.cursor = 'grab';
			self.div_graph_surface.style.removeProperty('user-select');

			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};

		// Attach the handler
		self.div_graph_surface.addEventListener('mousedown', mouseDownHandler);

		// Add mouseover and mouseout handlers to change cursor style
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventListener('mouseover', function () {
			self.div_graph_surface.style.cursor = 'grab';
		});
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventListener('mouseout', function () {
			self.div_graph_surface.style.cursor = 'default';
		});
		//HANDLE ON CANVAS NAVIGATION, CLICK TO SCROLL LEFT RIGHT UP DOWN, SCROLL TO ZOOM IN OR OUT

		//LIGHT/DARK THEME SWITCHER
		this.div_graph_surface.querySelector('#'+this.id_graph_control_palette_container + '___theme-switch').addEventListener('click', function () {
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
		this.DOMElements.DragElement(this.div_graph_surface.querySelector('#'+this.id_graph_control_palette));
		
		//ADD NODE
		this.div_graph_surface.querySelectorAll(`#${ self.id_graph_control_palette_container }-node-add`).forEach((d, i)=>{
			d.addEventListener('click', function(e){
				let id = "test" + (self.nodes.length + 1);
				let n = 20;
				let position = { x: 200 + (n * self.nodes.length - 1), y: 300 + (n * self.nodes.length - 1) };
				let temp = self.Utility.DOMElements.MakeDraggableNode(id, 'graph-node fade-in', 'Node TEST ' + id + ' DIV', '<p>Make</p><p>this</p><p>MOVE</p>', position.x, position.y, self.nodes.length);
				let newNode = new self.NodeProperties();
				self.nodes.push({ "id": id, "str": "", "position":position, element: temp });

				self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph').append(temp);
				self.nodes.forEach((segment, idx, array) => {
					self.DOMElements.DragElement(segment.element, 1, 10, function () {
						if (self.connections.length > 0) self.DOMElements.renderGraphConnections(self.connections, self);
						self.div_graph_surface.querySelectorAll('.graph-node').forEach(d=>{
							let found = self.Utility.Array.findArrayElement(self.nodes, 'id', d.id, 0);							
							self.nodes[found.array_index].position.x = d.style.left.replace('px', '');;
							self.nodes[found.array_index].position.y = d.style.top.replace('px', '');;
						});
						self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
					});
				});
				
				self.DOMElements.initConnectorEvents(self);
				self.div_graph_surface.querySelector('#' + id).querySelectorAll('.add-connection').forEach(function (d, i, arr) {
					d.click();
					d.click();
					d.click();
					d.click();
					d.click();
				});
				n = Math.ceil(document.getElementById(id).offsetWidth) + 100;
				self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
			});
		});
		//ADD NODE
		self.Storage.LocalStore.collection('graph_data').doc('Graph-Nodes').get().then(res=>{
			console.log(res);
			if (res == null) return;
			self.nodes = res.Nodes;
			self.DOMElements.renderGraph(self);
		});

		return this.div_graph_surface;
	}
	DOMElements = {
		"initiateGraphSurfaceContainer":(function(id=''){
			let id_str = (id.length > 0) ? id+'-' : '';
			let div = document.createElement('div');
			div.id = id_str+'graph-surface';
			div.className = 'graph-surface grid2020-background'
			div.style.cssText = 'width: 20000px; height: 20000px; z-index:100;';
			div.innerHTML = `
				<div id="${id_str}graph"></div>
				<svg id="${id_str}connsvg" style="width:100%; height:100%;">
					<defs>
						<marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
							<path class="arrowhead-path" d="M 0 0 L 10 5 L 0 10 z" fill="#2f344cd2"/>
						</marker>
					</defs>
				</svg>`;
			return div;
		}).bind(this),
		"renderGraph":(function(self){
			self.nodes.forEach((d, i)=>{
				let n = 20;
				let temp = self.Utility.DOMElements.MakeDraggableNode(d.id, 'graph-node fade-in', 'Node TEST ' + d.id + ' DIV', '<p>Make</p><p>this</p><p>MOVE</p>', d.position.x, d.position.y, self.nodes.length);
				self.nodes[i].element = temp;
				self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph').append(temp);
			});
			self.nodes.forEach((segment, idx, array) => {
				self.DOMElements.DragElement(segment.element, 1, 10, function () {
					if (self.connections.length > 0) self.DOMElements.renderGraphConnections(self.connections, self);
					self.div_graph_surface.querySelectorAll('.graph-node').forEach(d => {
						let found = self.Utility.Array.findArrayElement(self.nodes, 'id', d.id, 0);
						self.nodes[found.array_index].position.x = parseInt(d.style.left.replace('px', ''));
						self.nodes[found.array_index].position.y = parseInt(d.style.top.replace('px', ''));
					});
					self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
				});
			});
			self.DOMElements.initConnectorEvents(self);
			self.nodes.forEach((segment, idx, array) => {
				self.div_graph_surface.querySelector('#' + segment.id).querySelectorAll('.add-connection').forEach(function (d, i, arr) {
					d.click();
					d.click();
					d.click();
					d.click();
					d.click();
				});
			});
			// n = Math.ceil(document.getElementById(id).offsetWidth) + 100;
		}).bind(this),
		"initConnectorEvents": (function(self) {
			function inputEvents(d, i, arr) {
				d.addEventListener('click', function (e) {
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

					//Save to Storage

					// let storeNodes = [];
					// self.nodes.forEach((d, i) => {
					// 	storeNodes.push({ id: d.id, str: d.str });
					// });
					// self.Storage.LocalStore.collection('graph_data').doc('Graph-Nodes').set({
					// 	Revision: 0,
					// 	Nodes: storeNodes
					// });

					//Save to Storage

					self.div_graph_surface.querySelector('#' + self.tempConn.Source).dataset.Connected = 'true';
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
				d.addEventListener('click', function (e) {
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
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection top container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.children.length >= 10) return;
					this.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-down text-danger" style="--bs-text-opacity: .5;" id="in-${self.Utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="v"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.remove-connection").forEach(d => {
				d.addEventListener('click', () => {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.top-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection left container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-right text-warning" style="--bs-text-opacity: .8; display:block;" id="in-${self.Utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="h"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.remove-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.left-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection right container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-right text-success" style="--bs-text-opacity: .5; display:block;" id="out-${self.Utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="h"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.remove-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.right-output > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection bottom container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.children.length >= 100) return;
					this.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-down text-primary-emphasis" style="--bs-text-opacity: .5;" id="out-${self.Utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="v"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.remove-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					console.log('clicked remove conn bottom');
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.bottom-output> i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
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
						conns[idx].startPos = { x: ((src.x+12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x-18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
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
			// console.log('elmnt>', elmnt);
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0;
			function RoundToNearestBase(num, base) {
			  return Math.round(num / base) * base;
			}
			if (elmnt.querySelector('#'+elmnt.id + "-header")) {
				// If present, the header is where you move the DIV from:
				elmnt.querySelector('#'+elmnt.id + "-header").onmousedown = dragMouseDown.bind(this);
				elmnt.querySelector('#'+elmnt.id + "-header").addEventListener("touchstart", touchStart.bind(this), { passive: false });
			} else {
				// Otherwise, move the DIV from anywhere inside the DIV:
				elmnt.onmousedown = dragMouseDown.bind(this);
				elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			}
			
			function dragMouseDown(e) {
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
					document.getElementById('touchevent').innerHTML = 'Touch Move';
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

class Connection {
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
		this.startPos = { x: 0, y: 0 };
		this.endPos = { x: 0, y: 0 };
		this.Source = null;
		this.Destination = null;
		this.uuid = uuid;
		this.id = id;
		if (id == '') this.id = uuid;
		this.svg = null;         //SVG where the line paths are drawn
		this.graphSurface = graphSurface;

		this.pathColorHorizontal = {
			"Normal": "#999999",
			"Selected": "#86d530"
		};
		this.pathColorVertical = {
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
		// elm.setAttribute("stroke-dasharray", this.pathDashArray);
		switch (this.pathMode) {
			case 'h':
				elm.setAttribute("stroke", this.pathColorHorizontal.Normal);
				this.setQCurveD(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
				break;
			case 'v':
				elm.setAttribute("stroke", this.pathColorVertical.Normal);
				this.isVertical = true;
				this.setQCurveDV(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
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
			str = "M" + x1 + "," + (y1+15) + " C" +	//MoveTo
				(x1) + "," + (y1 + dif) + " " +	//First Control Point
				(x2) + "," + (y2 - dif) + " " +	//Second Control Point
				(x2) + "," + (y2-18);				//End Point
		// console.log('str in setQCurveD', str);
		// console.log('elm in setQCurveD', elm);
		elm.setAttribute('d', str);
	}

	setCurveColor = function (elm, isActive) {
		elm.setAttribute('stroke', (isActive) ? pathColorSelectedHorizontal : pathColorHorizontal);
	}
}

let gs = new GraphSurface();