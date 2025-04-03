const OperatorTemplate = {
	"datetime": [">", ">=", "=", "!=", "<=", "<", "is", "is not"],
	"number": [">", ">=", "=", "!=", "<=", "<", "contains"],
	"string": ["starts with", "ends with", "contains", "is", "is not",],
	"boolean": ["is", "is not"],
	"array": ["starts with", "ends with", "contains", "in", "not in"]
};

export class Flow {
	constructor(container = null, utility = null, funcObject = null, chain = [], storage = null) {
		this.flow = this
		this.chain = chain;
		this.run_mode = ["run", "stop", "pause", "step", "debug"];
		this.run_mode_selected = "run"; // Default to "run"
		this.processFunctions = funcObject;
		this.Forms  = null;
		this.FormContainer = container;
		this.SnapScroll = null;
		this.Utility = utility;
		this.DragSelect = false;
		this.GraphCanvas = {};
		this.moveSnap = 10;

		this.CurrentActiveTab = {};
		this.selectedNodesToConnect = {
			Start: null,
			End: null,
			StartParam: {id:"", class:""},
			EndParam: {id:"", class:""}
		};
		this.Areas = {
			app_data_preparation_area: {
				width: 0
			},
			object_collections: {
				width: 0
			},
			app_graph_tabs_container: {
				width: 0,
				height: 0
			},
			app_configurator_container: {
				width: 0,
				height: 0
			}
		};
		this.ScrollPosition = {
			app_root_container: {
				top: 0,
				left: 0
			},
			object_collections: {
				top: 0,
				left: 0
			},
			app_container: {
				top: 0,
				left: 0
			},
			app_data_preparation_area: {
				top: 0,
				left: 0
			},
		};
		this.State = {
			"Interaction": [],
			"Flow":[]
		};
		this.storage = storage;

		window.debugflow = this;
	}
	isElementInViewport = (element) => {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
	getActiveTab = (id) => {
		const label = document.querySelector(`#${id}>li.is-active>a`).innerHTML;
		const tabType = document.querySelector(`#${id}>li.is-active>a`).dataset.tabtype;
		const element = document.querySelector(`#${id}>li.is-active>a`);
		const graphCanvas = document.querySelector(`.app_configurator_containers[data-tabType="${tabType}"]`);
		const graphCanvasID = document.querySelector(`.app_configurator_containers[data-tabType="${tabType}"]`).id;
		const graphCanvasClasses = document.querySelector(`.app_configurator_containers[data-tabType="${tabType}"]`).classList;
		return {
			tab: {
				label: label,
				tabType: tabType,
				element: element,
			},
			graphCanvas: {
				id: graphCanvasID,
				classes: graphCanvasClasses,
				element: graphCanvas,
				graph_controls: graphCanvas.querySelector('.graph_controls'),
				graph_surface: graphCanvas.querySelector('.graph_surfaces'),
				graph_surface_id: graphCanvas.querySelector('.graph_surfaces').id,
				graph_node_surface: graphCanvas.querySelector('.graph_node_surface'),
				graph_connection_surface: graphCanvas.querySelector('.graph_connection_surface')
			},
			zoomProps: this.GraphCanvas[tabType]
		};
	}
	toggleFullscreen = () => {
		if (!document.fullscreenElement) {
		  // If not in fullscreen, request fullscreen
		  const element = document.documentElement; // Fullscreen the entire document
		  if (element.requestFullscreen) {
			element.requestFullscreen();
		  } else if (element.mozRequestFullScreen) { // For Firefox
			element.mozRequestFullScreen();
		  } else if (element.webkitRequestFullscreen) { // For Safari/Chrome
			element.webkitRequestFullscreen();
		  } else if (element.msRequestFullscreen) { // For IE/Edge
			element.msRequestFullscreen();
		  }
		} else {
		  // If in fullscreen, exit fullscreen
		  if (document.exitFullscreen) {
			document.exitFullscreen();
		  } else if (document.mozCancelFullScreen) { // For Firefox
			document.mozCancelFullScreen();
		  } else if (document.webkitExitFullscreen) { // For Safari/Chrome
			document.webkitExitFullscreen();
		  } else if (document.msExitFullscreen) { // For IE/Edge
			document.msExitFullscreen();
		  }
		}
	}
	  
	checkType = function (variable) {
		if (variable instanceof Date) {
			return "DateTime";
		} else if (typeof variable === 'number') {
			return "Number";
		} else if (typeof variable === 'string') {
			// Allow flexible matching of numbers with optional commas
			if (/^-?[\d,]+(\.\d+)?$/.test(variable.replace(/,+/g, ''))) {
				return "Number";
			} else if (["true", "yes", "ya", "sudah"].includes(variable.toLowerCase())) {
				return "Boolean";
			} else if (["false", "no", "tidak", "belum"].includes(variable.toLowerCase())) {
				return "Boolean";
			} else {
				return "String";
			}
		} else if (typeof variable === 'boolean') {
			return "Boolean";
		} else if (Array.isArray(variable)) {
			return "Array";
		} else if (typeof variable === 'function') {
			return "Function";
		} else if (typeof variable === 'object') {
			if (variable instanceof Element || variable instanceof HTMLElement) {
				return "DOM Element";
			} else {
				return "Object";
			}
		} else if (variable === null) {
			return 'null';
		} else {
			return "Unknown";
		}
	}
	sanitizeInput = (function (zinput) {
		let input = zinput;
		// Check for datetime string
		const datetimeRegex224 = /^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}(\s\d{1,2}:\d{2}:\d{2})?$/;
		const datetimeRegex422 = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}(\s\d{1,2}:\d{2}:\d{2})?$/;
		if (datetimeRegex224.test(zinput)) {
			input = new Date(zinput);
		} else if (datetimeRegex422.test(zinput)) {
			input = new Date(zinput);
		}
		let varType = this.checkType(input);
		// const datetimeRegex = /^\d{1,2,4}\/\d{1,2}\/\d{1,2,4}(\s\d{1,2}:\d{2}:\d{2})?$/;

		switch (varType) {
			case 'DateTime':
				return this.Time.SafeDateTime(input);
				break;
			case 'Number':
				return this.Numbers.SafeNumber(input);
				break;
			case 'Boolean':
				return this.Booleans.SafeBoolean(input, true);
				break;
			case 'String':
				return this.Strings.SafeString(input);
				break;
			case 'Array':
				return this.Array.IsArrayOK(input);
				break;
			case 'Function':
				return input;
				break;
			case 'DOM Element':
				return input;
				break;
			case 'Object':
				return input;
				break;
			case 'null':
				return null;
				break;
			default:
				return undefined;
				break;
		}
	}).bind(this);
	sanitizeHTML = (html) => {
		// Use a basic sanitizer to strip out unsafe HTML
		const tempDiv = document.createElement('div');
		tempDiv.textContent = html;
		return tempDiv.innerHTML;
	};

	// Helper to validate hrefs
	isSafeHref = (href) => {
		// Only allow safe links; adjust regex based on what "safe" means in context
		return /^https?:\/\/|^\/\//i.test(href);
	};
	Graph = {
		Elements: {
			newNodeIDGenerator: (nodeKind, name, tablestore = `Graph`, ULID, tULID, icon, etdLead = 3) => { 
				return `{
					ID: "${nodeKind + '/' + ULID + '/' + name}",
					Table: "${tablestore}",
					ULID: "${tULID}",
					Node: {
						Realm: "Universe",
						Kind: "${nodeKind}",
						Type: "",
						Class: "",
						Group: "",
						Category: "",
						Icon: "${icon}"
					},
					Timestamp: time::now(),
					ETL: time::now(),
					ETD: time::now() + ${etdLead}d,
					Version: {
						Number: 1,
						VersionID: ULID,
						ULID: ULID
					}
				}`;
			},
			MakeDraggableNode: function (nodes, node, objclass, content, header, footer, graphCanvas) {
				console.log('================================== Start MakeDraggableNode');
				// console.log('node :>> ', node);

				let newElement = document.createElement('div');
				const nodeID = node.id.ID ? node.id.ID : node.id.id.ID;
				
				newElement.id = nodeID;
				newElement.className = objclass;
				console.log('graphCanvas', graphCanvas, node.Presentation.Perspectives.GraphNode.Position[graphCanvas]);
				newElement.style.top = `${node.Presentation.Perspectives.GraphNode.Position[graphCanvas]? node.Presentation.Perspectives.GraphNode.Position[graphCanvas].y : 30}px`;
				newElement.style.left = `${node.Presentation.Perspectives.GraphNode.Position[graphCanvas] ? node.Presentation.Perspectives.GraphNode.Position[graphCanvas].x : 30}px`;
				console.log(graphCanvas, node.Presentation.Perspectives.GraphNode.Position);
				newElement.dataset.nodetype = node.id.id.Node.Kind;
				newElement.dataset.nodename = node.Properties.Name;
				newElement.dataset.nodelabel = node.Properties.Label;

				newElement.style.position = `absolute`;
	
				newElement.tabIndex = 0;
				// console.log('node.id.id.Node.Icon :>> ', node.id.id.Node.Icon);
				newElement.innerHTML = `
					<div class="no-select no-outline node-top-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px;">
						<div class="top-gutter" style="display: flex; justify-content: space-evenly; width: fit-content; width:100%;"></div>
						<div style="display: flex;">
							<div class="left-gutter" style="display: flex; flex-direction: column; justify-content: space-evenly;"></div>
							${content}
							<div class="right-gutter" style="display: flex; flex-direction: column; justify-content: space-evenly;"></div>
						</div>
						<div class="bottom-gutter" style="display: flex; justify-content: space-evenly; width: 100%; width:100%;"></div>
						<div class="card m-0 p-0" style="width:94%;">
							${header}
							${footer}
						</div>
					</div>
				`;
				newElement.addEventListener('animationend', function () {
					this.classList.remove('fade-in');
				});
				console.log('================================== Done MakeDraggableNode');
				return newElement;
			},
		},
		Events: { //SECTION - Events
			makeNodesDraggable: (() => {
				let isInitialized = false;
				let eventCallbacks = [];
				let isDragging = false;
				// let offsetX, offsetY;
				let draggedElement;
				// let relatedElements = [];
				let dbedges = [];
				// let fx, fy = 0;
				let nodeID = [];
				let flow = this;
				let offsetMap = new Map();
				let parentSet;
				let coord = [];
				// let defaultCoord = [];
			
				function initialize(parent, tparentSet) {
					console.log('start initialize makeNodesDraggable');
					if (isInitialized) return; // Prevent multiple initializations
					isInitialized = true;

					parentSet = tparentSet;
					nodeID = [];
					coord = [];
					const parentRect = parent.getBoundingClientRect();
					const snapToGrid = (value, gridSize = 20) => Math.round(value / gridSize) * gridSize;
			
					const globalEventHandler = (type, selector, callback) => {
						const handler = (e) => {
							const target = e.target.closest(selector);
							if (target && parent.contains(target)) {
								callback(e, target);
							}
						};
						document.addEventListener(type, handler, true);
						eventCallbacks.push({ type, handler }); // Store for later removal
					};
			
					// Mousedown event
					globalEventHandler("mousedown", ".card-header-icon", (e, target) => {
						console.log("Node drag start");
						isDragging = true;
						draggedElement = target.closest(".graph-node");
						nodeID = [];
						coord = [];
						
						const { app_root_container, app_container } = flow.ScrollPosition;
			
						const parentScrollLeft = parent.scrollLeft;
						const parentScrollTop = parent.scrollTop;
			
						//----------------------------
						const focusedNodes = Array.from(parent.querySelectorAll(".card.focused"));
						offsetMap.clear();
						
						focusedNodes.forEach((node) => {
							const graphNode = node.closest(".graph-node");
							const rect = graphNode.getBoundingClientRect();

							offsetMap.set(graphNode, {
								offsetX: e.clientX - rect.left + parentScrollLeft + app_root_container.left,
								offsetY: e.clientY - rect.top + parentScrollTop + app_container.top
							});
							
							// Ensure absolute positioning
							graphNode.style.position = "absolute";
							graphNode.style.zIndex = 1000;

							nodeID.push(graphNode.id);
							coord.push({x: rect.left + parentScrollLeft + app_root_container.left, y: rect.top + parentScrollTop + app_container.top});
						});
						
						let qstr = ''; 
						if (document.querySelector('#graph_show_only_containers').checked) { 
							qstr = `select * from Process where (in.id.ID IN [${nodeID.map(option => `"${option}"`).join(', ')}] or out.id.ID IN [${nodeID.map(option => `"${option}"`).join(', ')}]) `;
						} else {
							qstr = `select *  from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')} where (in.id.ID = "${nodeID}" or out.id.ID = "${nodeID}")`;
						}
						console.log('qstr for dbedges on mousedown:>> ', qstr);
						ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then((edges) => {
							dbedges = edges[0];
							console.log('dbedges :>> ', dbedges);
							// if (edges[0]) if (Array.isArray(edges[0])) if (edges[0].length > 0) edges[0].forEach((edge, edgeIndex) => {
							// 	this.Graph.Events.createGutterDotsAndConnect(
							// 		parentSet.graphCanvas.element.querySelector(`div[id="${edge.OutputPin.nodeID}"]`),
							// 		parentSet.graphCanvas.element.querySelector(`div[id="${edge.InputPin.nodeID}"]`),
							// 		edge,
							// 		parentSet
							// 	);
							// });
							// if (edges[0]) if (Array.isArray(edges[0])) if (edges[0].length > 0) edges[0].forEach((edge, edgeIndex) => {
							// 	console.log('edge >>>>>>>>>>>>>>>>>>> :>> ', edge);
							// 	this.Graph.Events.connectNodes(
							// 		edge,
							// 		parentSet.graphCanvas.graph_connection_surface,
							// 		parentSet.graphCanvas.graph_surface.parentElement
							// 	);
							// });
						});
						console.log('defaultCoord :>>', coord);
					});
			
					// Mousemove event
					globalEventHandler("mousemove", ".graph_surfaces", (e) => {
						if (!isDragging || !draggedElement) return;
			
						// console.8log("Dragging node...");
						coord = [];
						const parentScrollLeft = parent.scrollLeft;
						const parentScrollTop = parent.scrollTop;
			
						const { app_root_container, app_container } = flow.ScrollPosition;

						offsetMap.forEach((offsets, node) => {
							const graphNode = node.closest(".graph-node");

							let tx = (e.clientX - offsets.offsetX - parentRect.left + (parentScrollLeft * 2) + (app_root_container.left * 2)) / parentSet.zoomProps.ZoomScale;
							let ty = (e.clientY - offsets.offsetY - parentRect.top + (parentScrollTop * 2) + (app_container.top * 2)) / parentSet.zoomProps.ZoomScale;

							let x = snapToGrid(tx, flow.moveSnap);
							let y = snapToGrid(ty, flow.moveSnap);
							
							graphNode.style.left = `${x}px`;
							graphNode.style.top = `${y}px`;
							
							coord.push({ x: x, y: y });
							dbedges.forEach((edge, edgeIndex) => {
								flow.Graph.Events.createGutterDotsAndConnect(
									parentSet.graphCanvas.element.querySelector(`div[id="${edge.OutputPin.nodeID}"]`),
									parentSet.graphCanvas.element.querySelector(`div[id="${edge.InputPin.nodeID}"]`),
									edge,
									parentSet
								);
							});
							dbedges.forEach((edge, edgeIndex) => {
								flow.Graph.Events.connectNodes(
									edge,
									parentSet.graphCanvas.graph_connection_surface,
									parentSet.graphCanvas.graph_surface.parentElement
								);
							});
						});
					});
			
					// Mouseup event
					globalEventHandler("mouseup", ".graph_surfaces", (e) => {
						if (isDragging) {
							console.log("Node drag end");

							// console.log('flow.DragSelect before set to true', flow.DragSelect);
							flow.DragSelect = true;
							// console.log('flow.DragSelect after set to true', flow.DragSelect);
							isDragging = false;
							const ArrOffsetMap = Array.from(offsetMap);

							let qstrUpdate = "";
							let promises = [];
							ArrOffsetMap.forEach((Tnode, idx) => {
								console.log(idx, Tnode);
								console.log('nodeID', nodeID[idx]);
								console.log('coord', coord[idx]);

								let qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.ID = '${nodeID[idx]}';`;
								console.log('qstr :>> ', qstr);
								let promise = ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(node => { 
									if (node[0].length == 0) return;
									node = node[0][0];
									console.log('node', node);
									node.Presentation.Perspectives.GraphNode.Position[parentSet.tab.tabType] = coord[idx];
									console.log('node.Presentation.Perspectives.GraphNode.Position[parentSet.tab.tabType]', parentSet.tab.tabType, node.Presentation.Perspectives.GraphNode.Position[parentSet.tab.tabType]);

									if (node.id.id) node.id = node.id.id;
									console.log('node.id :>> ', node.id);

									let tnode = JSON.parse(JSON.stringify(node));
									delete tnode.id;
									console.log('tnode :>> ', tnode);
									
									qstrUpdate += `update ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(node.id)} content ${JSON.stringify(tnode)};\n\n`;
									// qstrUpdate += `update ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} content ${JSON.stringify(tnode)} where id.ID = '${node.id.ID}';\n\n`;
									console.log('qstrUpdate --------------:>> ', qstrUpdate);
									// qstrUpdate += `upsert ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(node.id)} content ${JSON.stringify(tnode)};\n\n`;
								}).catch(error => {
									console.error('Coordinate update failed', error);
								});
								promises.push(promise);
							});
							Promise.all(promises).then(() => {
								console.log('completed qstrUpdate :>> ', qstrUpdate);
								ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstrUpdate)
								.then((result) => { 
									console.log(`Coordinate UPDATED!`, result);
									// console.log('flow.DragSelect on promise done', flow.DragSelect);
									// console.log('dbedges', dbedges);
									// setTimeout(() => { 
									// 	console.log('reflow edge connections');
									// 	dbedges.forEach((edge, edgeIndex) => {
									// 		flow.Graph.Events.connectNodes(
									// 			edge,
									// 			parentSet.graphCanvas.graph_connection_surface,
									// 			parentSet.graphCanvas.graph_surface.parentElement
									// 		);
									// 	});
									// 	// console.log('flow.DragSelect after 400ms', flow.DragSelect);
									// 	flow.DragSelect = false;
									// 	// console.log('flow.DragSelect after 400ms', flow.DragSelect);
									// }, 400);
								})
								.catch(error => { 
									console.error(`Coordinate update FAILED!`, error);
								});
							}).catch(error => {
								console.error('Promises FAILED', error);
							});
						}
					});
					console.log('done initialize makeNodesDraggable');
				}
			
				function destroy() {
					if (!isInitialized) return;
					isInitialized = false;
			
					// Remove all event listeners
					eventCallbacks.forEach(({ type, handler }) => {
						document.removeEventListener(type, handler, true);
					});
			
					eventCallbacks = []; // Clear stored callbacks
					console.log("makeNodesDraggable destroyed");
				}
			
				return { initialize, destroy };
			})(),
	
			makeNodeDraggable: (draggableSelector, parent, parentSet) => { //SECTION - makeNodeDraggable
				let isDragging = false;
				let offsetX, offsetY, draggedElement;
				let relatedElements = []; // To store related divs and their initial offsets
				

				// const parent = document.querySelector(parentSelector);
				const parentRect = parent.getBoundingClientRect();
			
				const snapToGrid = (value, gridSize = 20) => Math.round(value / gridSize) * gridSize;
				let fx, fy = 0;
				let nodeID = "";
				let dbedges = [];

				let aX, aY;
				parentSet.graphCanvas.element.addEventListener("mousedown", (e) => { //NOTE - makeNodeDraggable mousedown
					console.log('makeNodeDraggable mousedown');
					// Check if the clicked element is the .card-header
					const graphCanvasParent = e.target.closest('.scroll_content');
					// const graphCanvasParentId = graphCanvasParent.id;
					console.log('graphCanvasParent', graphCanvasParent);

					if (!e.target.closest('.card-header-icon')) return;
					console.log('================================================================================================ MakeNodeDraggable mousedown start');
					isDragging = true;

					this.DragSelect = true;

					draggedElement = e.target.closest(draggableSelector);
					nodeID = draggedElement.id;

					let qstr = ''; 
					if (document.querySelector('#graph_show_only_containers').checked) { 
						qstr = `select * from Process where (in.id.ID = "${nodeID}" or out.id.ID = "${nodeID}") `;
					} else {
						qstr = `select *  from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')} where (in.id.ID = "${nodeID}" or out.id.ID = "${nodeID}")`;
					}
					console.log('qstr for dbedges on mousedown:>> ', qstr);
					ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then((edges) => {
						dbedges = edges[0];
						// console.log('dbedges :>> ', dbedges);
						if (edges[0]) if (Array.isArray(edges[0])) if (edges[0].length > 0) edges[0].forEach((edge, edgeIndex) => {
							this.Graph.Events.createGutterDotsAndConnect(
								parentSet.graphCanvas.element.querySelector(`div[id="${edge.OutputPin.nodeID}"]`),
								parentSet.graphCanvas.element.querySelector(`div[id="${edge.InputPin.nodeID}"]`),
								edge,
								parentSet
							);
						});
						if (edges[0]) if (Array.isArray(edges[0])) if (edges[0].length > 0) edges[0].forEach((edge, edgeIndex) => {
							console.log('edge >>>>>>>>>>>>>>>>>>> :>> ', edge);
							this.Graph.Events.connectNodes(
								edge,
								parentSet.graphCanvas.graph_connection_surface,
								parentSet.graphCanvas.graph_surface.parentElement
							);
						});
					});

					// Fetch related elements based on Cursor
					relatedElements = ParadigmREVOLUTION.Application.Cursor
						.filter(cursor => cursor.id !== nodeID) // Exclude the currently dragged div
						.map(cursor => {
							const elem = document.getElementById(cursor.id);
							if (!elem) return null;
							const rect = elem.getBoundingClientRect();
							return {
								elem,
								offsetX: rect.left - draggedElement.getBoundingClientRect().left,
								offsetY: rect.top - draggedElement.getBoundingClientRect().top
							};
						})
						.filter(item => item); // Remove nulls for non-existent elements

					// console.log('relatedElements :>> ', relatedElements);
		
					const parentScrollLeft = parent.scrollLeft;
					const parentScrollTop = parent.scrollTop;
		
					// Access the live ScrollPosition dynamically
					console.log('what is THIS', this);
					const { app_root_container, app_container } = this.ScrollPosition;
		
					const rect = draggedElement.getBoundingClientRect();
					offsetX = e.clientX - rect.left + parentScrollLeft + app_root_container.left;
					offsetY = e.clientY - rect.top + parentScrollTop + app_container.top;
		
					draggedElement.style.position = "absolute";
					draggedElement.style.zIndex = 1000; // Bring to front

					aX = (e.clientX - offsetX - parentRect.left + (parentScrollLeft * 2) + (app_root_container.left * 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
					aY = (e.clientY - offsetY - parentRect.top + (parentScrollTop * 2) + (app_container.top * 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
					console.log('================================================================================================ MakeNodeDraggable mousedown done');
					
				});
			
				parentSet.graphCanvas.element.addEventListener("mousemove", (e) => { //NOTE - makeNodeDraggable mousemove
					if (!isDragging || !draggedElement) return;
					console.log('MakeNodeDraggable mousemove');
''			
					const parentScrollLeft = parent.scrollLeft;
					const parentScrollTop = parent.scrollTop;

					const graphCanvasParent = e.target.closest('.app_configurator_containers');
					const graphCanvasParentId = graphCanvasParent.id;

					// Access the live ScrollPosition dynamically
					const { app_root_container, app_container } = this.ScrollPosition;
			
					let tx = (e.clientX - offsetX - parentRect.left + (parentScrollLeft * 2) + (app_root_container.left * 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
					let ty = (e.clientY - offsetY - parentRect.top + (parentScrollTop * 2) + (app_container.top * 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;

					let x = tx > 0 ? 0 : tx;
					let y = ty > 0 ? 0 : ty;

					x = snapToGrid(x, 10);
					y = snapToGrid(y, 10);

					if ((aX !== x) || (aY !== y)) {
						// console.log('================================================================================================ mouse moved enough, start mousemove!')
						aX = x;
						aY = y;

						draggedElement.style.left = `${aX}px`;
						draggedElement.style.top = `${aY}px`;
							
						fx = aX;
						fy = aY;
						console.log('dbedges on mousemove before foreach', dbedges);
						dbedges.forEach((edge, edgeIndex) => {
							// console.log('dbedge each:>> ', edge.id, edge.OutputPin.nodeID, edge.InputPin.nodeID);
							this.Graph.Events.createGutterDotsAndConnect(
								parentSet.graphCanvas.element.querySelector(`div[id="${edge.OutputPin.nodeID}"]`),
								parentSet.graphCanvas.element.querySelector(`div[id="${edge.InputPin.nodeID}"]`),
								edge,
								parentSet
							);
						});
						console.log('dbedge on mouse move', dbedges);
						dbedges.forEach((edge, edgeIndex) => {
							// console.log('dbedge each:>> ', edge);
							this.Graph.Events.connectNodes(
								edge,
								parentSet.graphCanvas.graph_connection_surface,
								parentSet.graphCanvas.graph_surface.parentElement
							);
						});

						// Move related elements
						relatedElements.forEach(({ elem, offsetX, offsetY }) => {
							elem.style.left = `${(aX + offsetX) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale}px`;
							elem.style.top = `${(aY + offsetY) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale}px`;
						});

						// console.log('================================================================================================ mouse moved enough, DONE mousemove!')
					}
				});
			
				parentSet.graphCanvas.element.addEventListener("mouseup", (e) => { //NOTE - makeNodeDraggable mouseup
					if (isDragging) {
						console.log('================================================================================================ MakeNodeDraggable mouseup start');

						let graphCanvas = e.target.closest('.app_configurator_containers');
						let tabtype = graphCanvas.dataset.tabtype;

						isDragging = false;
						draggedElement.style.zIndex = ""; // Reset z-index
						draggedElement = null;
						const id = nodeID;

						const coord = {
							x: fx,
							y: fy
						};
						let qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.ID = '${id}';`;
						// console.log('qstr :>> ', qstr);
						ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(node => { 
							if (node[0].length == 0) return;
							node = node[0][0];
							node.Presentation.Perspectives.GraphNode.Position[tabtype] = coord;
							// console.log('node.id after update coord :>>', node.id);

							if (node.id.id) node.id = node.id.id;
							// console.log('node after update coord :>> ', node);

							qstr = `update ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(node.id)} content ${JSON.stringify(node)};`;
							// qstr = `upsert ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(node.id)} content ${JSON.stringify(node)};`;
							// console.log('qstr :>> ', qstr);
							
							ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr);
						}).catch(error => {
							console.error('Coordinate update failed', error);
						});

						// Update database positions for related elements
						relatedElements.forEach(({ elem }) => {
							const relatedId = elem.id;
							const relatedCoord = {
								x: parseInt(elem.style.left, 10),
								y: parseInt(elem.style.top, 10)
							};
							let qstr = `update Graph set Presentation.Perspectives.GraphNode.Position.${graphCanvas.dataset.tabtype} = ${JSON.stringify(relatedCoord)} where id.ID = '${relatedId}';`;
							// let qstr = `upsert Graph set Presentation.Perspectives.GraphNode.Position.${graphCanvas.dataset.tabtype} = ${JSON.stringify(relatedCoord)} where id.ID = '${relatedId}';`;
							// console.log('qstr :>> ', qstr);
							ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).catch(error => {
								console.error('Coordinate update failed for related element', error);
							});
						});
						dbedges.forEach((edge, edgeIndex) => {
							this.Graph.Events.createGutterDotsAndConnect(
								parentSet.graphCanvas.element.querySelector(`div[id="${edge.OutputPin.nodeID}"]`),
								parentSet.graphCanvas.element.querySelector(`div[id="${edge.InputPin.nodeID}"]`),
								edge,
								parentSet
							);
						});
					
						dbedges.forEach((edge, edgeIndex) => {
							this.Graph.Events.connectNodes(
								edge,
								parentSet.graphCanvas.graph_connection_surface,
								parentSet.graphCanvas.graph_surface.parentElement
							);
						});
						setTimeout(() => { 
							this.DragSelect = false;
						}, 200);

						console.log('================================================================================================ MakeNodeDraggable mouseup done');
					}
				});
			},
			renderNodes: ((nodes, edges, parentSet, callback, cr = 0) => { //SECTION - renderNodes
				console.log('================= Start Render Nodes');
				let temp;
				// Clear out the nodes and connections
				parentSet.graphCanvas.graph_node_surface.innerHTML = "";
				parentSet.graphCanvas.graph_connection_surface.innerHTML = "";

				// console.log('start foreach nodes ===========>');
				if (nodes) if (Array.isArray(nodes)) nodes.forEach((node, nodeIndex) => {
					const nodeID = node.id.ID ? node.id.ID : node.id.id.ID;
					const nodeKind = node.id.ID ? node.id.Node.Kind : node.id.id.Node.Kind;
					console.log('nodeKind :>> ', nodeKind);
					function findKindObject(kindArray, targetKind) {
						for (const option of kindArray) {
							if (option.Kind === targetKind) {
								return option; // Return the entire object
							}
							if (option.Items) {
								const foundObject = findKindObject(option.Items, targetKind);
								if (foundObject) {
									return foundObject; // Return if found in nested structure
								}
							}
						}
						return null; // Return null if no match is found
					}
					
					const kind = findKindObject(ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.KindArray, nodeKind);
					
					// console.log('start node'+nodeIndex, nodeID, nodeKind);
					let snodeControls = ``;
					if (kind.NodeControls) { 
						snodeControls += `<footer class="card-footer">`;
						kind.NodeControls.forEach((control, controlIndex) => {
							snodeControls += `<a href="#" class="card-footer-item ${control.Class}" title="${control.title}" data-actiontype="${control.ActionType}" data-id="${nodeID}"><i class="${control.Icon} ${control.Class}" data-actiontype="${control.ActionType}" data-id="${nodeID}"></i></a>`;
						});
						snodeControls += `</footer>`;
					}
					let sfooter = "";
					if (kind.Footer) { 
						sfooter += `<footer class="card-footer">`;
						kind.Footer.forEach((footer, footerIndex) => {
							console.log('footer :>> ', footer);
							sfooter += `<a href="#" class="card-footer-item ${footer.Class}" title="${footer.title}" data-actiontype="${footer.ActionType}" data-id="${nodeID}"><i class="${footer.Icon} ${footer.Class}" data-actiontype="${footer.ActionType}" data-id="${nodeID}"></i></a>`;
						});
						sfooter += `</footer>`;
					}

					let node_lock = `<i class="node-lock fa-solid fa-lock-open"></i>`;
					console.log('node :>> ', node);
					if (node.id.id.Node.isLocked) node_lock = `<i class="node-lock fa-solid fa-lock has-text-danger"></i>`;
					const nodeContent = `
					<div class="card is-selectable-box node-background-frosted" data-id="node-${nodeID}" style="margin: 5px; padding: 0px; width: fit-content;">
						<header class="card-header" style="cursor:pointer;" data-id="header-${nodeID}">
							<div class="card-header-icon m-0 pl-3 pr-0" data-id="${nodeID}"><i class="${node.id.id.Node.Icon}"></i></div>
							<div class="card-header-title pl-3 m-1 pr-3 py-1 is-selectable" data-id="${nodeID}" style="width: fit-content;align: center;">${node.Properties.Name}</div>
							<div class="card-header-icon m-0 pr-3 pr-0 node-lock" data-id="${nodeID}">${node_lock}</div>
						</header>
						<div class="card-content p-3">
							<div class="m-0 p-0 is-flex is-flex-direction-column is-align-items-center">
								<h class="m-0 px-3 pt-0 pb-3" style="font-size: 1rem; font-weight:600; text-align:center;">${node.Properties.Label}</h>
								<div class="content p-0 m-0 node-content" style="width:0px;height:0px;"></div>
								<h class="m-0 p-0" style="font-size: 0.65rem; text-align:center;">ID: ${node.id.id.ID}</h>
							</div>
						</div>
					</div>
					`;
					// ${snodeControls}
					// ${sfooter}
					let ctrls = snodeControls + sfooter;
					console.log('ctrls :>> ', ctrls);
					temp = this.Graph.Elements.MakeDraggableNode(nodes, node, 'graph-node fade-in', nodeContent, snodeControls, sfooter, parentSet.tab.tabType);
					parentSet.graphCanvas.graph_node_surface.append(temp);
				});
				// console.log('done foreach nodes ===========>');
				
				// this.Graph.Events.makeNodeDraggable(".graph-node", parentSet.graphCanvas.graph_surface.parentElement, parentSet);
				this.Graph.Events.makeNodesDraggable.initialize(parentSet.graphCanvas.element.querySelector('.scroll_content'), parentSet); //NOTE - makeNodeDraggable CALLEE

				console.log('================= Done Render Nodes');
				console.log('=================Start Render Edges');

				// document.querySelector('#app_graph_content>.graph_connection_surface').innerHTML = "";
				const container = document.querySelector('#app_graph_content > .graph_connection_surface');
				if (container) {
					Array.from(container.children).forEach(child => {
						if (child.tagName.toLowerCase() !== 'defs') {
							container.removeChild(child);
						}
					});
				}
				// console.log('edges :>> ', edges, edges.length);
				if (edges) if (Array.isArray(edges)) if (edges.length > 0) edges.forEach((rEdge, edgeIndex) => {
					this.Graph.Events.createGutterDotsAndConnect(
						parentSet.graphCanvas.element.querySelector(`div[id="${rEdge.OutputPin.nodeID}"]`),
						parentSet.graphCanvas.element.querySelector(`div[id="${rEdge.InputPin.nodeID}"]`),
						rEdge,
						parentSet
					);
				});
				
				if (edges) if (Array.isArray(edges)) if (edges.length > 0) edges.forEach((edge, edgeIndex) => {
					this.Graph.Events.connectNodes(
						edge,
						parentSet.graphCanvas.graph_connection_surface,
						parentSet.graphCanvas.graph_surface.parentElement
					);
				});

				if (callback) callback();
				console.log('================= Done Render Edges');
			}).bind(this),
			enableMiddleClickScroll: (rContainer) => { //SECTION - enableMiddleClickScroll
				const scrollContent = rContainer;
			
				if (!scrollContent) {
					console.error(`Element with query selector '${containerId}' not found.`);
					return;
				}
			
				let isMiddleClicking = false;
				let startX = 0;
				let startY = 0;
				let scrollLeft = 0;
				let scrollTop = 0;
			
				scrollContent.addEventListener('mousedown', (e) => { // NOTE - enableMiddleClickScroll mousedown
					if (e.button === 1) { // Middle mouse button
						e.preventDefault();
			
						isMiddleClicking = true;
						startX = e.clientX;
						startY = e.clientY;
						scrollLeft = scrollContent.scrollLeft;
						scrollTop = scrollContent.scrollTop;
			
						scrollContent.style.cursor = 'grabbing';
					}
				});
			
				scrollContent.addEventListener('mousemove', (e) => { // NOTE - enableMiddleClickScroll mousemove
					if (!isMiddleClicking) return;
			
					const deltaX = e.clientX - startX;
					const deltaY = e.clientY - startY;
			
					scrollContent.scrollLeft = scrollLeft - deltaX;
					scrollContent.scrollTop = scrollTop - deltaY;
				});
			
				const stopMiddleClick = () => { // NOTE - enableMiddleClickScroll stopMiddleClick
					if (isMiddleClicking) {
						isMiddleClicking = false;
						scrollContent.style.cursor = 'default';
					}
				};
			
				scrollContent.addEventListener('mouseup', (e) => {
					if (e.button === 1) stopMiddleClick();
				});
			
				document.addEventListener('mouseup', (e) => {
					if (e.button === 1) stopMiddleClick();
				});
			
				scrollContent.addEventListener('contextmenu', (e) => {
					if (isMiddleClicking) e.preventDefault();
				});
			},
			// Function to show a modal, handle user selection, and clean up afterwards
			showDropdownModal: (modal_title, label, options, selectedNodes, FlowGraph, callback) => {
				// Create modal HTML as a string with animation classes
				const modalHTML = `
					<div id="connectionModal" class="modal is-active fade-in">
						<div class="modal-background"></div>
						<div class="modal-card">
							<header class="modal-card-head">
								<p class="modal-card-title">${modal_title}</p>
								<button class="delete" aria-label="close" id="cancelButton"></button>
							</header>
							<section class="modal-card-body">
								<div class="field">
									<label class="label">${label}</label>
									<div class="control">
										<div class="select is-fullwidth">
											<select id="connectionTypeDropdown">
												${options.map(option => `<option value="${option.Type}" data-color="${option.Color}">${option.Type}</option>`).join('')}
											</select>
										</div>
									</div>
								</div>
							</section>
							<footer class="modal-card-foot" style="justify-content: center; gap: 20px;">
								<button class="button" id="cancelButtonFooter" style="margin-right: auto;">Cancel</button>
								<button class="button is-success" id="confirmButton" style="margin-left: auto;">Confirm</button>
							</footer>
						</div>
					</div>
				`;
			
				// Insert modal HTML into the document body
				const modalContainer = document.createElement('div');
				modalContainer.innerHTML = modalHTML;
				document.body.appendChild(modalContainer);
			
				// Get references to modal elements
				const modal = modalContainer.querySelector('#connectionModal');
				const dropdown = modalContainer.querySelector('#connectionTypeDropdown');
				const confirmButton = modalContainer.querySelector('#confirmButton');
				const cancelButton = modalContainer.querySelector('#cancelButton');
				const cancelButtonFooter = modalContainer.querySelector('#cancelButtonFooter');
			
				// Add CSS for animations
				const style = document.createElement('style');
				style.innerHTML = `
					.fade-in {
						animation: fadeIn 0.3s ease-in-out;
					}

					.fade-out {
						animation: fadeOut 0.3s ease-in-out;
					}

					@keyframes fadeIn {
						from {
							opacity: 0;
							filter: blur(5px);
						}
						to {
							opacity: 1;
							filter: blur(0);
						}
					}

					@keyframes fadeOut {
						from {
							opacity: 1;
							filter: blur(0);
						}
						to {
							opacity: 0;
							filter: blur(10px);
						}
					}
				`;
				document.head.appendChild(style);
			
				// Function to clean up modal
				function cleanUp() {
					modal.classList.remove('fade-in');
					modal.classList.add('fade-out');
					setTimeout(() => {
						modalContainer.remove(); // Remove the modal
						style.remove(); // Remove the style tag
					}, 300); // Matches the animation duration
				}
			
				// Handle confirm button click
				confirmButton.onclick = () => {
					const selectedOption = dropdown.options[dropdown.selectedIndex];
					const selectedType = selectedOption.value; // Value of the selected option
			
					// Extract custom data attributes from the selected option
					const customData = {
						color: selectedOption.dataset.color
					};
			
					cleanUp(); // Clean up modal
					callback(selectedType, customData, selectedNodes, FlowGraph); // Execute the callback with the selected type
				};
			
				// Handle cancel button clicks
				cancelButton.onclick = cleanUp;
				cancelButtonFooter.onclick = cleanUp;
			},
			showSchemaModal: (modal_title, schema, passedData, callback, callbackPreConfirm) => {
				// Create modal HTML as a string with animation classes
				let schemastr = this.Form.Render.traverseDOMProxyOBJ(this.Form.Events.GenerateSchemaToParadigmJSON('id_modal_connection_type', schema.Dataset.Schema, this.Utility, 1, ''));				
				const modalHTML = `
					<div id="connectionModal" class="modal is-active fade-in">
						<div class="modal-background"></div>
						<div class="modal-card" style="width: 60rem;">
							<header class="modal-card-head">
								<p class="modal-card-title">${modal_title}</p>
								<button class="delete" aria-label="close" id="cancelButton"></button>
							</header>
							<section class="modal-card-body modal-form">
								${schemastr}
							</section>
							<footer class="modal-card-foot" style="justify-content: center; gap: 20px;">
								<button class="button" id="cancelButtonFooter" style="margin-right: auto;">Cancel</button>
								<button class="button is-success" id="confirmButton" style="margin-left: auto;">Confirm</button>
							</footer>
						</div>
					</div>
				`;
			
				// Insert modal HTML into the document body
				const modalContainer = document.createElement('div');
				modalContainer.innerHTML = modalHTML;
				document.body.appendChild(modalContainer);
			
				// Get references to modal elements
				const modal = modalContainer.querySelector('#connectionModal');
				const dropdown = modalContainer.querySelector('#connectionTypeDropdown');
				const confirmButton = modalContainer.querySelector('#confirmButton');
				const cancelButton = modalContainer.querySelector('#cancelButton');
				const cancelButtonFooter = modalContainer.querySelector('#cancelButtonFooter');
			
				// Add CSS for animations
				const style = document.createElement('style');
				document.head.appendChild(style);
			
				// Function to clean up modal
				function cleanUp() {
					modal.classList.remove('fade-in');
					modal.classList.add('fade-out');
					setTimeout(() => {
						modalContainer.remove(); // Remove the modal
						style.remove(); // Remove the style tag
					}, 300); // Matches the animation duration
				}
			
				// Handle confirm button click
				confirmButton.onclick = () => {
					let data = {};
					document.querySelector('.modal-form').querySelectorAll('input, button, select, textarea').forEach(input => {
						const key = input.id.split('___')[1];
						console.log('input :>> ', input.type);
						switch (input.type) { 
							case 'checkbox':
								data[key] = input.checked;
								break;
							default:
								data[key] = input.value;
								break;
						}
					});
					if (callbackPreConfirm) {
						if (callbackPreConfirm(data, passedData)) { 
							cleanUp(); // Clean up modal
							callback(data, passedData); // Execute the callback with the selected type
						}
					} else {
						cleanUp(); // Clean up modal
						callback(data, passedData); // Execute the callback with the selected type
					}
				};
				// Handle cancel button clicks
				cancelButton.onclick = cleanUp;
				cancelButtonFooter.onclick = cleanUp;
			},
			connectNodes: (rEdge, svgcontainer, parentselector) => {
				// Get the elements by their selector
				// console.log('======================================= start connect nodes');
				// console.log('rEdge :>> ', rEdge);
				// console.log('svgcontainer :>> ', svgcontainer);
				// console.log('parentselector :>> ', parentselector);
				
				if (!rEdge) return;
				const edge = rEdge;
				const edgeID = edge.id.ID ? edge.id.ID : edge.id.id.ID;
				const edgeTable = edge.id.Table ? edge.id.Table : edge.id.id.Table;
				const arrowBend = edge.ArrowBend;
				
				// Get the SVG container
				const svgContainer = svgcontainer;
				// console.log('svgContainer :>> ', svgcontainer, svgContainer);	
				const existingPath = svgContainer.querySelector(`path[id="${edgeID}"]`);
				// console.log('existingPath :>> ', existingPath);

				// console.log('edge :>> ', edge, edge.OutputPin, edge.InputPin);
				const node1selector = '#' + edge.OutputPin.pinID;
				const node2selector = '#' + edge.InputPin.pinID;
				
				// console.log('nodeselectors', node1selector, node2selector);;

				// console.log('this.CurrentActiveTab.app_container :>> ', this.CurrentActiveTab.app_container);

				const node1 = document.querySelector(`div[data-tabType="${this.CurrentActiveTab.app_container}"]`).querySelector(
					node1selector.startsWith("#")
					  ? `div[id="${node1selector.slice(1)}"]`
					  : node1selector.startsWith(".")
					  ? `div[class="${node1selector.slice(1)}"]`
					  : `div${node1selector}`
				);
				
				const node2 = document.querySelector(`div[data-tabType="${this.CurrentActiveTab.app_container}"]`).querySelector(
				node2selector.startsWith("#")
					? `div[id="${node2selector.slice(1)}"]`
					: node2selector.startsWith(".")
					? `div[class="${node2selector.slice(1)}"]`
					: `div${node2selector}`
				);
				// console.log('nodes', node1, node2);;
			
				if (!node1 || !node2) {
					console.error("One or both nodes not found.", node1 ? `node1: ${node1selector} found` : `node1: ${node1selector} not found`, node2 ? `node2: ${node2selector} found` : `node2 ${node2selector} not found`);	
					return;
				}

				const GraphNode1selector = '#' + edge.OutputPin.nodeID;
				const GraphNode2selector = '#' + edge.InputPin.nodeID;

				const GraphNode1 = document.querySelector(
					GraphNode1selector.startsWith("#")
					  ? `div[id="${GraphNode1selector.slice(1)}"]`
					  : GraphNode1selector.startsWith(".")
					  ? `div[class="${GraphNode1selector.slice(1)}"]`
					  : `div${GraphNode1selector}`
				);
				
				const GraphNode2 = document.querySelector(
				GraphNode2selector.startsWith("#")
					? `div[id="${GraphNode2selector.slice(1)}"]`
					: GraphNode2selector.startsWith(".")
					? `div[class="${GraphNode2selector.slice(1)}"]`
					: `div${GraphNode2selector}`
				);
				
				const rectGraphNode1 = GraphNode1.getBoundingClientRect();
				const rectGraphNode2 = GraphNode2.getBoundingClientRect();

				const parent = parentselector;
				const parentRect = parent.getBoundingClientRect();

				const parentScrollLeft = parent.scrollLeft;
				const parentScrollTop = parent.scrollTop;
				const parentLeft = parentRect.left;
				const parentTop = parentRect.top;

				// Get bounding rectangles of the nodes
				const rect1 = node1.getBoundingClientRect();
				const rect2 = node2.getBoundingClientRect();
							
				// Calculate the center of each node
				const x1 = (rect1.left - parentLeft + parentScrollLeft + (rect1.width / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const y1 = (rect1.top  - parentTop  + parentScrollTop  + (rect1.height / 2))/ this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const x2 = (rect2.left - parentLeft + parentScrollLeft + (rect2.width / 2))/ this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const y2 = (rect2.top  - parentTop  + parentScrollTop  + (rect2.height / 2))/ this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;

				// Calculate the center of each GraphNode
				const Gx1 = (rectGraphNode1.left - parentLeft + parentScrollLeft + (rectGraphNode1.width / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const Gy1 = (rectGraphNode1.top  - parentTop  + parentScrollTop  + (rectGraphNode1.height / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const Gx2 = (rectGraphNode2.left - parentLeft + parentScrollLeft + (rectGraphNode2.width / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const Gy2 = (rectGraphNode2.top  - parentTop  + parentScrollTop  + (rectGraphNode2.height / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
						
				if (!svgContainer) {
					console.error("SVG container not found.");
					return;
				}
			
				// // Calculate the angle between gutter node1 and node2
				// const dx = x2 - x1;
				// const dy = y2 - y1;
				// let angle = Math.atan2(dy, dx) * (180 / Math.PI);

				// Calculate the angle between Graph node1 and node2
				const zx = Gx2 - Gx1;
				const zy = Gy2 - Gy1;
				let angle = Math.atan2(zy, zx) * (180 / Math.PI);

				// Normalize the angle to 0 - 360 degrees
				if (angle < 0) {
					angle += 360;
				}

				// Calculate control points for the curve
				let controlX1;
				let controlY1;
				let controlX2;
				let controlY2;

				// 8 SEGMENTS

				const a = 330, b = 360, c = 0, d = 30;
				const e = 60,  f = 120;
				const g = 150, h = 210;
				const i = 240, j = 300;
				let direction;
				// Determine gutter usage based on angle
				if ((angle >= a && angle <= b) || (angle >= c && angle < d)) {	
					direction = 'left';
					controlX1 = x1 + (x2 - x1) / 2;
					controlY1 = y1;
					controlX2 = x2 - (x2 - x1) / 2;
					controlY2 = y2;
				} else if (angle >= d && angle < e) {
					direction = 'left top';
					switch (arrowBend) {
						case 'convex':
							controlX1 = x1 + ((x2 - x1) / 2);
							controlY1 = y1 + ((y2 - y1) / 100);
							controlX2 = x2 - ((x2 - x1) / 100);
							controlY2 = y2 - ((y2 - y1) / 2);
						break;
						default:
							controlX1 = x1 + ((x2 - x1) / 100);
							controlY1 = y1 + ((y2 - y1) / 2);
							controlX2 = x2 - ((x2 - x1) / 2);
							controlY2 = y2 - ((y2 - y1) / 100);
							break;
					}
				} else if (angle >= e && angle < f) {
					direction = 'top';
					controlX1 = x1;
					controlY1 = y1 + (y2 - y1) / 2;
					controlX2 = x2;
					controlY2 = y2 - (y2 - y1) / 2;
				} else if (angle >= f && angle < g) {
					direction = 'right top';
					switch (arrowBend) {
						case 'convex':
							controlX1 = x1 + ((x2 - x1) / 2);
							controlY1 = y1 + ((y2 - y1) / 100);
							controlX2 = x2 - ((x2 - x1) / 100);
							controlY2 = y2 - ((y2 - y1) / 2);
							break;
						default:
							controlX1 = x1 + ((x2 - x1) / 100);
							controlY1 = y1 + ((y2 - y1) / 2);
							controlX2 = x2 - ((x2 - x1) / 2);
							controlY2 = y2 - ((y2 - y1) / 100);
							break;
					}
				} else if (angle >= g && angle < h) {
					direction = 'right';
					controlX1 = x1 + (x2 - x1) / 2;
					controlY1 = y1;
					controlX2 = x2 - (x2 - x1) / 2;
					controlY2 = y2;
				} else if (angle >= h && angle < i) {
					direction = 'right bottom';
					switch (arrowBend) {
						case 'convex':
							controlX1 = x1 + ((x2 - x1) / 2);
							controlY1 = y1 + ((y2 - y1) / 100);
							controlX2 = x2 - ((x2 - x1) / 100);
							controlY2 = y2 - ((y2 - y1) / 2);
							break;
						default:
							controlX1 = x1 + ((x2 - x1) / 100);
							controlY1 = y1 + ((y2 - y1) / 2);
							controlX2 = x2 - ((x2 - x1) / 2);
							controlY2 = y2 - ((y2 - y1) / 100);
						break;
					}
				} else if (angle >= i && angle < j) {
					direction = 'bottom';
					controlX1 = x1;
					controlY1 = y1 + (y2 - y1) / 2;
					controlX2 = x2;
					controlY2 = y2 - (y2 - y1) / 2;
				} else if (angle >= j && angle < a) {
					direction = 'left bottom';
					switch (arrowBend) {
						case 'convex':
							controlX1 = x1 + ((x2 - x1) / 2);
							controlY1 = y1 + ((y2 - y1) / 100);
							controlX2 = x2 - ((x2 - x1) / 100);
							controlY2 = y2 - ((y2 - y1) / 2);
							break;
						default:
							controlX1 = x1 + ((x2 - x1) / 100);
							controlY1 = y1 + ((y2 - y1) / 2);
							controlX2 = x2 - ((x2 - x1) / 2);
							controlY2 = y2 - ((y2 - y1) / 100);
							break;
					}
				}
				if (!existingPath) {
					// Create an SVG path
					// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> create SVG path');
					// console.log('edge', edge);	
					const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
					const d = `M ${x1},${y1} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
					// console.log('edgeID di create new path', edgeID);
					path.setAttribute("id", edgeID);
					path.setAttribute("class", "graph-edge");
					path.setAttribute("d", d);
					path.setAttribute("stroke", edge.Path.Color);
					path.style.setProperty("pointer-events", "stroke");
					path.style.setProperty("filter", `drop-shadow(0 0 8px ${edge.Path.Color}`); /* Add the glow effect */
					path.setAttribute("stroke-width", edge.Path.PathThickness+"px");
					path.setAttribute("stroke-linecap", "round");
					path.setAttribute("fill", "none");
					path.setAttribute("marker-end", "url(#arrowhead)");
					path.setAttribute("data-table", edgeTable);
					path.setAttribute("data-arrowBend", arrowBend);
					path.setAttribute("data-direction", direction);
					switch (edge.Path.PathDecoration) {
						case "Normal":
							break;
						case "Dotted":
							path.setAttribute("stroke-dasharray", "1, 8");
							break;
						case "Dashed":
							path.setAttribute("stroke-dasharray", "10, 25");
							break;
						default:
							path.setAttribute("stroke-dasharray", `${edge.Path.PathDecoration}, ${node.Path.PathDecoration}`);
							break;
					}
				
					// Append the path to the SVG container
					svgContainer.appendChild(path);
				} else {
					// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> modify SVG path');
					const d = `M ${x1},${y1} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
					// console.log('path.d', d);
					existingPath.setAttribute("d", d);
				}
				// console.log('======================================= done connectNodes');
			},
			createGutterDotsAndConnect: (node1, node2, rEdge, parentSet) => {
				console.log('======================================= start createGutterDotsAndConnect');
				// NOTE - This functions as connecting 2 nodes then assign those 2 nodes to the edge.
				if (!rEdge) return;

				let edge = rEdge;
				const edgeID = edge.id.ID ? edge.id.ID : edge.id.id.ID;
				const arrowBend = edge.ArrowBend;


				let gutters = parentSet.graphCanvas.element.querySelectorAll(`div[data-edge="${edgeID}"]`);
				// if (gutters.length > 0) { 
				// 	console.log('======================================= end createGutterDotsAndConnect: gutter already exists');
				// 	return;
				// }
			
				//get each node getBoundingClientRect
				const rect1 = node1.getBoundingClientRect();
				const rect2 = node2.getBoundingClientRect();
				
				// Calculate the angle between node1 and node2
				const dx = (rect2.left + rect2.width / 2 - (rect1.left + rect1.width / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const dy = (rect2.top + rect2.height / 2 - (rect1.top + rect1.height / 2)) / this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				let angle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI));
			
				// Normalize the angle to 0 - 360 degrees
				if (angle < 0) {
					angle += 360;
				}
				const a = 330, b = 360, c = 0, d = 30;
				const e = 60, f = 120;
				const g = 150, h = 210;
				const i = 240, j = 300;

				let direction = "";
				
				// Determine gutter usage based on angle
				if ((angle >= a && angle <= b) || (angle >= c && angle < d)) {
					direction = 'left';
				} else if (angle >= d && angle < e) {
					direction = 'top left';
				} else if (angle >= e && angle < f) {
					direction = 'top';
				} else if (angle >= f && angle < g) {
					direction = 'top right';
				} else if (angle >= g && angle < h) {
					direction = 'right';
				} else if (angle >= h && angle < i) {
					direction = 'bottom right';
				} else if (angle >= i && angle < j) {
					direction = 'bottom';
				} else if (angle >= j && angle < a) {
					direction = 'bottom left';
				}
				
				if (gutters.length > 0) {
					console.log('======================================= REMOVE GUTTERS');
					if (gutters[0].dataset.edgedirection == direction) {
						console.log('======================================= end createGutterDotsAndConnect: match direction');
						return;
					}else if (gutters[0].dataset.edgedirection != direction) {
						gutters.forEach(gutter => gutter.remove());
					}
				} else {
					const gutterDot1 = document.createElement('div');
					gutterDot1.className = 'gutter-dot';
					gutterDot1.style.width = '10px';
					gutterDot1.style.height = '10px';
					gutterDot1.style.backgroundColor = 'transparent';
					gutterDot1.style.borderRadius = '50%';
					gutterDot1.dataset.edge = edgeID;
					gutterDot1.dataset.edgeangle = angle;
					gutterDot1.dataset.edgedirection = direction;
					gutterDot1.dataset.nodeout = node1.id;
					gutterDot1.dataset.nodein = node2.id;

					
					if (edge.OutputPin.pinID === "") {
						gutterDot1.id = ParadigmREVOLUTION.SystemCore.Modules.ULID();
						edge.OutputPin.pinID = gutterDot1.id;
					} else {
						gutterDot1.id = edge.OutputPin.pinID;
					}
					
					const gutterDot2 = gutterDot1.cloneNode(true);
					gutterDot2.style.backgroundColor = 'transparent';
					
					if (edge.InputPin.pinID === "") {
						gutterDot2.id = ParadigmREVOLUTION.SystemCore.Modules.ULID();
						edge.InputPin.pinID = gutterDot2.id;
					} else {
						gutterDot2.id = edge.InputPin.pinID;
					}

					switch (arrowBend) {
						case 'convex':
							switch (direction) {
								case 'left':
									if (node1.querySelector('.right-gutter')) {
										node1.querySelector('.right-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.left-gutter')) {
										node2.querySelector('.left-gutter').appendChild(gutterDot2);
										// node1.dataset.direction = direction;
									}
									break;
								case 'top left':
									if (node1.querySelector('.right-gutter')) {
										node1.querySelector('.right-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.top-gutter')) {
										node2.querySelector('.top-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'top':
									if (node1.querySelector('.bottom-gutter')) {
										node1.querySelector('.bottom-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.top-gutter')) {
										node2.querySelector('.top-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'top right':
									if (node1.querySelector('.left-gutter')) {
										node1.querySelector('.left-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.top-gutter')) {
										node2.querySelector('.top-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'right':
									if (node1.querySelector('.left-gutter')) {
										node1.querySelector('.left-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.right-gutter')) {
										node2.querySelector('.right-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'bottom right':
									if (node1.querySelector('.left-gutter')) {
										node1.querySelector('.left-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.bottom-gutter')) {
										node2.querySelector('.bottom-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'bottom':
									if (node1.querySelector('.top-gutter')) {
										node1.querySelector('.top-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.bottom-gutter')) {
										node2.querySelector('.bottom-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'bottom left':
									if (node1.querySelector('.right-gutter')) {
										node1.querySelector('.right-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.bottom-gutter')) {
										node2.querySelector('.bottom-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
							}
							break;
						case 'concave':
							switch (direction) {
								case 'left':
									if (node1.querySelector('.right-gutter')) {
										node1.querySelector('.right-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.left-gutter')) {
										node2.querySelector('.left-gutter').appendChild(gutterDot2);
										// node1.dataset.direction = direction;
									}
									break;
								case 'top left':
									if (node1.querySelector('.bottom-gutter')) {
										node1.querySelector('.bottom-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.left-gutter')) {
										node2.querySelector('.left-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'top':
									if (node1.querySelector('.bottom-gutter')) {
										node1.querySelector('.bottom-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.top-gutter')) {
										node2.querySelector('.top-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'top right':
									if (node1.querySelector('.bottom-gutter')) {
										node1.querySelector('.bottom-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.right-gutter')) {
										node2.querySelector('.right-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'right':
									if (node1.querySelector('.left-gutter')) {
										node1.querySelector('.left-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.right-gutter')) {
										node2.querySelector('.right-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'bottom right':
									if (node1.querySelector('.top-gutter')) {
										node1.querySelector('.top-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.right-gutter')) {
										node2.querySelector('.right-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'bottom':
									if (node1.querySelector('.top-gutter')) {
										node1.querySelector('.top-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.bottom-gutter')) {
										node2.querySelector('.bottom-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
								case 'bottom left':
									if (node1.querySelector('.top-gutter')) {
										node1.querySelector('.top-gutter').appendChild(gutterDot1);
										// node1.dataset.direction = direction;
									}
									if (node2.querySelector('.left-gutter')) {
										node2.querySelector('.left-gutter').appendChild(gutterDot2);
										// node2.dataset.direction = direction;
									}
									break;
							}
							break;
					}
					console.log('======================================= end createGutterDotsAndConnect: new gutterDots');
					return [edge, gutterDot1, gutterDot2, direction];
				}
			},
			enableDragSelect: (parentSet) => {
				let isSelecting = false;
				let startX, startY, currentX, currentY;
				let selectionBox;
				const scrollContent = parentSet.graphCanvas.graph_surface.parentElement;
				const appGraphContent = parentSet.graphCanvas.graph_surface;
				let ZoomScale = this.GraphCanvas['Graph'].ZoomScale;
				const selectedElements = new Set();
				const self = this;
			
				function getEventCoordinates(e) {
					if (e.touches) {
						return { x: e.touches[0].clientX, y: e.touches[0].clientY };
					} else {
						return { x: e.clientX, y: e.clientY };
					}
				}
			
				function handleStart(e) {
					if (e.button !== undefined && e.button !== 0) return; // Left mouse button only
					if (e.target.closest('.graph-node')) return;
					e.preventDefault();
					
					isSelecting = true;
					const rect = scrollContent.getBoundingClientRect();
					const { x, y } = getEventCoordinates(e);
					
					startX = scrollContent.scrollLeft + (x - rect.left) / ZoomScale;
					startY = scrollContent.scrollTop + (y - rect.top) / ZoomScale;
					currentX = startX;
					currentY = startY;
					
					selectionBox = document.createElement('div');
					selectionBox.style.position = 'absolute';
					selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
					selectionBox.style.border = '1px dashed rgb(0, 123, 255)';
					selectionBox.style.borderRadius = '10px';
					selectionBox.style.pointerEvents = 'none';
					selectionBox.style.zIndex = '1000';
					scrollContent.appendChild(selectionBox);
					
					updateSelectionBox();
				}
			
				function handleMove(e) {
					if (!isSelecting) return;
					self.DragSelect = true;
					e.preventDefault();
					
					const rect = scrollContent.getBoundingClientRect();
					const { x, y } = getEventCoordinates(e);
					
					currentX = scrollContent.scrollLeft + (x - rect.left) / ZoomScale;
					currentY = scrollContent.scrollTop + (y - rect.top) / ZoomScale;
					
					updateSelectionBox();
					checkSelection();
				}
			
				function handleEnd() {
					if (!isSelecting) return;
					isSelecting = false;
					
					if (selectionBox) {
						selectionBox.remove();
						selectionBox = null;
					}
					
					ParadigmREVOLUTION.Application.Cursor.length = 0;
					for (const element of selectedElements) {
						if (element.tagName === 'path') {
							ParadigmREVOLUTION.Application.Cursor.push({ table: element.dataset.table, id: element.id });
						} else {
							ParadigmREVOLUTION.Application.Cursor.push({
								table: ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name,
								id: element.id,
							});
						}
					}
					
					console.log('ParadigmREVOLUTION.Application.Cursor', ParadigmREVOLUTION.Application.Cursor);
					setTimeout(() => { self.DragSelect = false; }, 300);
				}
			
				function updateSelectionBox() {
					const viewportLeft = (Math.min(startX, currentX) - scrollContent.scrollLeft) * ZoomScale;
					const viewportTop = (Math.min(startY, currentY) - scrollContent.scrollTop) * ZoomScale;
					const width = Math.abs(currentX - startX) * ZoomScale;
					const height = Math.abs(currentY - startY) * ZoomScale;
					
					selectionBox.style.left = `${viewportLeft}px`;
					selectionBox.style.top = `${viewportTop}px`;
					selectionBox.style.width = `${width}px`;
					selectionBox.style.height = `${height}px`;
				}
			
				function checkSelection() {
					const dragArea = {
						x1: Math.min(startX, currentX),
						y1: Math.min(startY, currentY),
						x2: Math.max(startX, currentX),
						y2: Math.max(startY, currentY),
					};
					
					scrollContent.querySelectorAll('.graph-node, svg path').forEach(element => {
						const elementRect = element.getBoundingClientRect();
						const scrollLeft = scrollContent.scrollLeft;
						const scrollTop = scrollContent.scrollTop;
						
						const elementX1 = (elementRect.left + scrollLeft) / ZoomScale;
						const elementY1 = (elementRect.top + scrollTop) / ZoomScale;
						const elementX2 = (elementRect.right + scrollLeft) / ZoomScale;
						const elementY2 = (elementRect.bottom + scrollTop) / ZoomScale;
						
						const isOverlapping = !(
							dragArea.x2 < elementX1 ||
							dragArea.x1 > elementX2 ||
							dragArea.y2 < elementY1 ||
							dragArea.y1 > elementY2
						);
						
						if (isOverlapping) {
							if (!selectedElements.has(element)) {
								element.classList.add('focused');
								selectedElements.add(element);
							}
						} else {
							if (selectedElements.has(element)) {
								element.classList.remove('focused');
								selectedElements.delete(element);
							}
						}
					});
				}
			
				scrollContent.addEventListener('mousedown', handleStart);
				document.addEventListener('mousemove', handleMove);
				document.addEventListener('mouseup', handleEnd);
				
				scrollContent.addEventListener('touchstart', handleStart, { passive: false });
				document.addEventListener('touchmove', handleMove, { passive: false });
				document.addEventListener('touchend', handleEnd);
			},
			enableDragSelectV1: (parentSet) => { 
				let isSelecting = false;
				let startX, startY, currentX, currentY;
				let selectionBox;
				const scrollContent = parentSet.graphCanvas.graph_surface.parentElement;
				const appGraphContent = parentSet.graphCanvas.graph_surface;
				let ZoomScale = this.GraphCanvas['Graph'].ZoomScale; // Make sure to update this variable when zoom changes
				const selectedElements = new Set(); // Using Set to prevent duplicates
				const self = this;

				function handleMouseDown(e) {
					if (e.target.closest('.graph-node')) return;
				
					isSelecting = true;
					const rect = scrollContent.getBoundingClientRect();
					
					// Corrected calculation (removed /2 division)
					startX = scrollContent.scrollLeft + (e.clientX - rect.left) / ZoomScale;
					startY = scrollContent.scrollTop + (e.clientY - rect.top) / ZoomScale;
					
					currentX = startX;
					currentY = startY;
				
					// Create selection box
					selectionBox = document.createElement('div');
					selectionBox.style.position = 'absolute';
					selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
					selectionBox.style.border = '1px dashed rgb(0, 123, 255)';
					selectionBox.style.borderRadius = '10px';
					selectionBox.style.pointerEvents = 'none';
					selectionBox.style.zIndex = '1000';
					scrollContent.appendChild(selectionBox);
				
					updateSelectionBox();
				}

				function handleMouseMove(e) {
					if (!isSelecting) return;
					self.DragSelect = true;
				
					const rect = scrollContent.getBoundingClientRect();
					
					// Update current coordinates
					currentX = scrollContent.scrollLeft + (e.clientX - rect.left) / ZoomScale;
					currentY = scrollContent.scrollTop + (e.clientY - rect.top) / ZoomScale;
				
					updateSelectionBox();
					checkSelection();
				}

				function handleMouseUp() {
					if (!isSelecting) return;
					
					console.log('handleMouseUp');
					isSelecting = false;
					selectionBox.remove();
					selectionBox = null;
					
					// Handle selected elements here
					// const selected = document.querySelectorAll('.graph-node.selected');
					// selected.forEach(node => node.classList.remove('selected'));
					ParadigmREVOLUTION.Application.Cursor.length = 0;
			
					for (const element of selectedElements) {
						if (element.tagName === 'path') {
							ParadigmREVOLUTION.Application.Cursor.push({ table: element.dataset.table, id: element.id });
						} else {
							ParadigmREVOLUTION.Application.Cursor.push({
								table: ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name,
								id: element.id,
							});
						}
					}
		
					console.log('ParadigmREVOLUTION.Application.Cursor', ParadigmREVOLUTION.Application.Cursor);
					setTimeout(() => {
						self.DragSelect = false;
					}, 300);
				}

				function updateSelectionBox() {
					// Convert to viewport coordinates
					const viewportLeft = (Math.min(startX, currentX) - scrollContent.scrollLeft) * ZoomScale;
					const viewportTop = (Math.min(startY, currentY) - scrollContent.scrollTop) * ZoomScale;
					const width = Math.abs(currentX - startX) * ZoomScale;
					const height = Math.abs(currentY - startY) * ZoomScale;
			
					selectionBox.style.left = `${viewportLeft}px`;
					selectionBox.style.top = `${viewportTop}px`;
					selectionBox.style.width = `${width}px`;
					selectionBox.style.height = `${height}px`;
				}

				function checkSelection() {
					const dragArea = {
						x1: Math.min(startX, currentX),
						y1: Math.min(startY, currentY),
						x2: Math.max(startX, currentX),
						y2: Math.max(startY, currentY),
					};
				
					scrollContent.querySelectorAll('.graph-node, svg path').forEach(element => {
						const elementRect = element.getBoundingClientRect();
						const scrollLeft = scrollContent.scrollLeft;
						const scrollTop = scrollContent.scrollTop;
						
						// Convert element position to original coordinate space
						const elementX1 = (elementRect.left + scrollLeft) / ZoomScale;
						const elementY1 = (elementRect.top + scrollTop) / ZoomScale;
						const elementX2 = (elementRect.right + scrollLeft) / ZoomScale;
						const elementY2 = (elementRect.bottom + scrollTop) / ZoomScale;
				
						// Check for any overlap (not just full containment)
						const isOverlapping = !(
							dragArea.x2 < elementX1 ||
							dragArea.x1 > elementX2 ||
							dragArea.y2 < elementY1 ||
							dragArea.y1 > elementY2
						);
				
						if (isOverlapping) {
							if (!selectedElements.has(element)) {
								if (element.tagName === 'path') {
									element.classList.add('focused');
									selectedElements.add(element);
								} else {
									const elmnt = element.querySelector('.is-selectable-box');
									if (elmnt) {
										elmnt.classList.add('focused');
										elmnt.querySelectorAll(`.card-footer`).forEach((footer) => {
											footer.classList.add('show')
										});
										selectedElements.add(element);
									}
								}
							}
						} else if (selectedElements.has(element)) {
							if (element.tagName === 'path') {
								element.classList.remove('focused');
								selectedElements.delete(element);
							} else {
								const elmnt = element.querySelector('.is-selectable-box');
								if (elmnt) {
									elmnt.classList.remove('focused');
									elmnt.querySelectorAll(`.card-footer`).forEach(footer => {
										if (footer.classList.contains('show')) footer.classList.remove('show')
									});
									selectedElements.delete(element);
								}
							}
						}
					});
				}
				function checkSelectionV0() {
					// console.log('checkSelection');
				
					const dragArea = {
						x1: Math.min(startX, currentX),
						y1: Math.min(startY, currentY),
						x2: Math.max(startX, currentX),
						y2: Math.max(startY, currentY),
					};

					scrollContent.querySelectorAll('.graph-node, svg path').forEach(element => {
						const elementRect = element.getBoundingClientRect();
						const isInside =
							elementRect.left / ZoomScale >= dragArea.x1 &&
							elementRect.top / ZoomScale >= dragArea.y1 &&
							elementRect.right / ZoomScale <= dragArea.x2 &&
							elementRect.bottom / ZoomScale <= dragArea.y2;
						console.log('isInside', isInside);
						if (isInside) {
							if (!selectedElements.has(element)) {
								if (element.tagName === 'path') {
									element.classList.add('focused');
									selectedElements.add(element);
								} else {
									const elmnt = element.querySelector('.is-selectable-box');
									if (elmnt) {
										elmnt.classList.add('focused');
										selectedElements.add(element);
									}
								}
							}
						} else if (selectedElements.has(element)) {
							if (element.tagName === 'path') {
								element.classList.remove('focused');
								selectedElements.delete(element);
							} else {
								const elmnt = element.querySelector('.is-selectable-box');
								if (elmnt) {
									elmnt.classList.remove('focused');
									selectedElements.delete(element);
								}
							}
						}
					});

				}

				// Event Listeners
				scrollContent.addEventListener('mousedown', handleMouseDown);
				document.addEventListener('mousemove', handleMouseMove);
				document.addEventListener('mouseup', handleMouseUp);
			},
			enableDragSelectV0: ((parentSet) => {
				console.log('Start enableDragSelect');
				const container = parentSet.graphCanvas.graph_surface.closest(`.graph_surfaces`);
				const containerRect = container.getBoundingClientRect();
				const graphContainer = parentSet.graphCanvas.graph_surface.closest(`.app_configurator_groups`);
				const graphContainerRect = graphContainer.getBoundingClientRect();
				const scrollContainer = parentSet.graphCanvas.graph_surface.parentElement;
				console.log('container', container);
				console.log('containerRect', containerRect);
	
				// console.log('Start enableDragSelect :>> ', typeof selector, selector);
				// let container;
				// if (typeof selector === 'string') {
				// 	container = document.querySelector(selector);
				// } else {
				// 	container = selector;
				// }
				
				let self = this;
				let isDragging = false;
				let startX, startY;
				// const ZoomScale = this.GraphCanvas[this.CurrentActiveTab.app_container].ZoomScale;
				const ZoomScale = this.GraphCanvas['Graph'].ZoomScale;
				console.log('ZoomScale', ZoomScale);
				
				const selectedElements = new Set(); // Using Set to prevent duplicates
				let highlightBox = null;
			
				// Function to create a highlight box
				function createHighlightBox() {
					highlightBox = document.createElement('div');
					highlightBox.style.position = 'absolute';
					highlightBox.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
					highlightBox.style.border = '1px dashed #007bff';
					highlightBox.style.borderRadius = '10px';
					highlightBox.style.pointerEvents = 'none'; // Prevent interference with mouse events
					highlightBox.style.zIndex = '1000';
					container.appendChild(highlightBox);
				}
			
				// Function to update the position and size of the highlight box
				function updateHighlightBox(x1, y1, x2, y2) {
					const rect = scrollContainer.getBoundingClientRect();
					const left = Math.min(x1, x2) - rect.left;
					const top = Math.min(y1, y2) - rect.top;
					const width = Math.abs(x2 - x1);
					const height = Math.abs(y2 - y1);
			
					highlightBox.style.left = `${left}px`;
					highlightBox.style.top = `${top}px`;
					highlightBox.style.width = `${width}px`;
					highlightBox.style.height = `${height}px`;
				}
			
				// Function to handle mouse down event
				function onMouseDown(e) {
					console.log('start mousedown on enableDragSelect')
					console.log('ZoomScale :>> ', ZoomScale);
					if (e.button !== 0) return;
					if (!e.target.closest('.graph-node') && !e.target.closest('svg path')) {
						isDragging = true;
						console.log('container', container.scrollLeft, container.scrollTop, container);

						startX = (e.clientX - scrollContainer.scrollLeft) / ZoomScale;
						startY = (e.clientY - scrollContainer.scrollTop) / ZoomScale;
						
						console.log('zoom scale', ZoomScale);
						console.log('mouse', e.clientX, e.clientY);
						console.log('coord', startX, startY);
						console.log('scroll', container.scrollLeft, container.scrollTop);

						selectedElements.clear(); // Reset selected elements
			
						if (!highlightBox) createHighlightBox();
						updateHighlightBox(startX , startY);
					}
					console.log('done mousedown on enableDragSelect')
				}
			
				// Function to handle mouse move event
				function onMouseMove(e) {
					if (!isDragging) return;
			
					self.DragSelect = true;
			
					// const rect = scrollContainer.getBoundingClientRect();
					
					const currentX = (e.clientX - scrollContainer.scrollLeft) / ZoomScale;
					const currentY = (e.clientY - scrollContainer.scrollTop ) / ZoomScale;
					// console.log('mousemove', currentX, currentY);
			
					updateHighlightBox(startX, startY, currentX, currentY);
			
					// const rect = container.getBoundingClientRect();
					const dragArea = {
						x1: Math.min(startX, currentX),
						y1: Math.min(startY, currentY),
						x2: Math.max(startX, currentX),
						y2: Math.max(startY, currentY),
					};
			
					// Highlight elements within the drag area
					container.querySelectorAll('.graph-node, svg path').forEach(element => {
						const elementRect = element.getBoundingClientRect();
						const isInside =
							elementRect.left / ZoomScale >= dragArea.x1 &&
							elementRect.top / ZoomScale >= dragArea.y1 &&
							elementRect.right / ZoomScale <= dragArea.x2 &&
							elementRect.bottom / ZoomScale <= dragArea.y2;
			
						if (isInside) {
							if (!selectedElements.has(element)) {
								if (element.tagName === 'path') {
									element.classList.add('focused');
									selectedElements.add(element);
								} else {
									const elmnt = element.querySelector('.is-selectable-box');
									if (elmnt) {
										elmnt.classList.add('focused');
										selectedElements.add(element);
									}
								}
							}
						} else if (selectedElements.has(element)) {
							if (element.tagName === 'path') {
								element.classList.remove('focused');
								selectedElements.delete(element);
							} else {
								const elmnt = element.querySelector('.is-selectable-box');
								if (elmnt) {
									elmnt.classList.remove('focused');
									selectedElements.delete(element);
								}
							}
						}
					});
				}
			
				// Function to handle mouse up event
				function onMouseUp() {
					if (isDragging) {
						isDragging = false;
			
						// if (highlightBox) {
						// 	container.removeChild(highlightBox);
						// 	highlightBox = null;
						// }
			
						// Update global variable
						ParadigmREVOLUTION.Application.Cursor.length = 0;
			
						for (const element of selectedElements) {
							if (element.tagName === 'path') {
								ParadigmREVOLUTION.Application.Cursor.push({ table: element.dataset.table, id: element.id });
							} else {
								ParadigmREVOLUTION.Application.Cursor.push({
									table: ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name,
									id: element.id,
								});
							}
						}
			
						console.log('ParadigmREVOLUTION.Application.Cursor', ParadigmREVOLUTION.Application.Cursor);
						setTimeout(() => {
							self.DragSelect = false;
						}, 300);
					}
				}
			
				// Attach event listeners to the container
				container.addEventListener('mousedown', onMouseDown);
				container.addEventListener('mousemove', onMouseMove);
				container.addEventListener('mouseup', onMouseUp);
				container.addEventListener('mouseleave', onMouseUp); // Ensure cleanup if mouse leaves the container
			}).bind(this),
		}
	};
	Form = { //!SECTION - Form
		Components: { //!SECTION - Components
			DOMElement: () => { //!SECTION - DOMElement	
				return {
					comment: comment,
					tag: tag,
					class: className,
					id: id,
					style: style,
					href: href,
					title: title,
					data: data,
					aria: aria,
					order: order,
					innerHTML: innerHTML,
					content: content
				}
			},
			BulmaCSS: {
				Elements: {
					Block: (({
						id = "",
						class: className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						innerHTML = "",
						content = []
					}) => {
						return {
							comment: "Block container",
							tag: "div",
							class: `block ${className}`,
							id,
							style,
							href: isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							innerHTML,
							content
						};
					}).bind(this),
					Box: (({
						id = "",
						class: className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						innerHTML = "",
						content = []
					}) => {
						const sanitize = (html) => {
							// Use a basic sanitizer to strip out unsafe HTML
							const tempDiv = document.createElement('div');
							tempDiv.textContent = html;
							return tempDiv.innerHTML;
						};

						// Helper to validate hrefs
						const isSafeHref = (href) => {
							// Only allow safe links; adjust regex based on what "safe" means in context
							return /^https?:\/\/|^\/\//i.test(href);
						};

						return {
							comment: "Box container",
							tag: "div",
							class: `box ${className}`,
							id,
							style,
							href: isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							innerHTML,
							content
						};
					}).bind(this),
					Button: (() => {

					}).bind(this),
					Content: (() => {

					}).bind(this),
					Delete: (() => {

					}).bind(this),
					Icon: (() => {

					}).bind(this),
					Image: (() => {

					}).bind(this),
					Notification: (() => {

					}).bind(this),
					ProgressBars: (() => {

					}).bind(this),
					Table: (() => {

					}).bind(this),
					Tag: (() => {

					}).bind(this),
					Title: (() => {

					}).bind(this),
				},
				Components: {
					Card: (({ //NOTE - Components: Card
						id = "",
						className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						headerIcon = "",
						header = "",
						headerControls = null,
						innerHTML = "",
						content = [],
						footer = ""
					}) => {
						// Basic card structure
						console.log('Components: Card', className);
						const card = {
							comment: "Card",
							tag: "div",
							class: `card ${className}`,
							id,
							style,
							href: this.isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							content: []
						};

						// Add header if provided
						if (header || headerIcon) {
							const headerContent = [
								(headerControls == null || headerControls === "") ? {
									comment: "card-header-icon",
									tag: "button",
									class: "card-header-icon form-close-button",
									data: {
										formid: id	
									},
									aria: {},
									content: [
										{
											tag: "span",
											class: "icon form-close-button",
											innerHTML: `<i class="fa-solid fa-xmark form-close-button has-text-danger" data-formid="${id}"></i>`
										}
									]
								} : headerIcon,
								headerIcon ? {
									comment: "card-header-icon",
									tag: "button",
									class: "card-header-icon",
									aria: { label: "more options" },
									content: [
										{
											tag: "span",
											class: "icon",
											innerHTML: headerIcon
										}
									]
								} : null,
								{
									comment: "card-header-title",
									tag: "p",
									class: "card-header-title title-2 mb-1",
									innerHTML: this.sanitizeHTML(header)
								}
							].filter(Boolean); // Remove null if headerIcon is empty

							card.content.push({
								comment: "card-header",
								tag: "header",
								class: "card-header",
								content: headerContent
							});
						}

						// Add main content
						card.content.push({
							comment: "card-content",
							tag: "div",
							class: "card-content",
							content: [
								{
									comment: "content",
									tag: "div",
									class: "content",
									innerHTML: innerHTML,
									content: content
								}
							]
						});

						// Add footer items if provided
						if (footer) {
							const footerContent = footer.map(item => ({
								tag: "a",
								class: "card-footer-item",
								href: isSafeHref(item.href) ? item.href : "",
								innerHTML: sanitize(item.label)
							}));

							card.content.push({
								comment: "Card Footer",
								tag: "footer",
								class: "card-footer",
								content: footerContent
							});
						}
						return card;
					}).bind(this),
					CardSlim: (({ //NOTE - Components: CardSlim
						id = "",
						className = "",
						classContent = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						headerContent = null,
						innerHTML = "",
						content = [],
						footer = ""
					}) => {
						// Basic card structure
						// console.log('Components: Card', className);
						const card = {
							comment: "Card",
							tag: "div",
							class: `card box p-1 ${className}`,
							id,
							style,
							href: this.isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							content: []
						};

						// Add header if provided
						let tHeaderContent = headerContent ? headerContent : [{
							comment: "card-header-title",
							tag: "p",
							class: "card-header-title title mb-1",
							innerHTML: this.sanitizeHTML('Container')
						}, {
							comment: "card-header-icon",
							tag: "button",
							class: "card-header-icon form-close-button",
							data: {
								formid: id
							},
							aria: {},
							content: [
								{
									tag: "span",
									class: "icon form-close-button",
									innerHTML: `<i class="fa-solid fa-xmark form-close-button has-text-danger" data-formid="${id}"></i>`
								}
							]
						}];
						// console.log('headerContent', headerContent);
						if (headerContent) {
							// console.log('headerContent is NOT null');
							tHeaderContent = headerContent;
						}
						// console.log('tHeaderContent', tHeaderContent);
						card.content.push({
							comment: "card-header",
							tag: "header",
							class: "is-flex m-0 p-0",
							content: tHeaderContent
						});

						// Add main content
						card.content.push({
							comment: "card-content",
							tag: "div",
							class: `card-content m-0 p-0 columns is-mobile ${classContent}`,
							innerHTML: innerHTML
						});

						// Add footer items if provided
						if (footer) {
							const footerContent = footer.map(item => ({
								tag: "a",
								class: "card-footer-item",
								href: isSafeHref(item.href) ? item.href : "",
								innerHTML: sanitize(item.label)
							}));

							card.content.push({
								comment: "Card Footer",
								tag: "footer",
								class: "card-footer",
								content: footerContent
							});
						}
						return card;
					}).bind(this),
				},
				Layout: {
					Hero: (({
						id = "",
						className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						title = "",
						subtitle = ""
					}) => {
						const heroContainer = {
							comment: "Header container",
							tag: "div",
							class: `hero ${className}`,
							id,
							style,
							href: this.isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							content: []
						};

						// Hero section with title and subtitle
						const heroSection = {
							comment: "Hero Container",
							tag: "section",
							class: "hero m-0 p-0",
							content: [
								{
									comment: "Hero Body",
									tag: "div",
									class: "hero-body",
									innerHTML: `<p class="title">${this.sanitizeHTML(title)}</p><p class="subtitle">${this.sanitizeHTML(subtitle)}</p>`,
									content: []
								}
							]
						};
						heroContainer.content.push(heroSection);
						return heroContainer;
					}).bind(this),
					Section: (({
						id = "",
						class: className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						innerHTML = "",
						content = []
					}) => {
						return {
							comment: "Section container",
							tag: "section",
							class: `section ${className}`,
							id,
							style,
							href: isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							innerHTML,
							content
						};
					}).bind(this),
				}
			}
		},
		Events: { //!SECTION - Events
			// NOTE - addGlobalEventListener
			addGlobalEventListener: function (type, selectors, parent = document) { //!SECTION - addGlobalEventListener
				parent.addEventListener(type, (e) => {
					// e.preventDefault();
					for (const { selector, callback } of selectors) {
						const targetElement = e.target.closest(selector);

						if (targetElement && parent.contains(targetElement)) {
							// Trigger callback for the matched selector
							callback(e);
							// break; // Stop checking other selectors once matched
						}
					}
				} ,true); //Capture phase
			},
			setupTabSwitcher: (({ 
				tabSelector,
				contentContainerSelector,
				activeClass = 'is-active',
				showClass = 'show'
			},
			callback) => { //!SECTION - setupTabSwitcher
				// console.log('setupTabSwitcher click!');
				const flowSelf = this;
				document.querySelectorAll(tabSelector).forEach((tab, index, tabs) => {
					tab.addEventListener('click', (e) => {
						console.log('CLICK!');
						const AppDivID = e.target.closest('.application_divisions').id;
						console.log('AppDivID :>> ', AppDivID);
						const tabType = tab.dataset.tabtype;
						console.log('tabType :>> ', tabType);
						flowSelf.CurrentActiveTab[AppDivID] = tabType; // NOTE - SET CurrentActiveTab

						// Remove 'is-active' class from all tabs
						tabs.forEach((t) => t.parentElement.classList.remove(activeClass));
						
						// Add 'is-active' to the clicked tab
						tab.parentElement.classList.add(activeClass);
			
						// Remove 'show' class and reset transforms on all content containers
						const arrSelector = contentContainerSelector.includes(',')
							? contentContainerSelector.split(',').map(s => s.trim())
							: [contentContainerSelector];

						console.log('arrSelector :>> ', arrSelector);
						arrSelector.forEach(selector => {
							document.querySelectorAll(selector).forEach((container, containerIndex) => {
								container.classList.remove(showClass);
								container.style.transform = ''; // Reset transform
				
								// Slide out non-selected containers
								if (container.dataset.tabtype !== tabType) {
									container.style.transform = containerIndex < index ? 'translateX(-100%)' : 'translateX(100%)';
								}
							});
						});

						// Show and slide in the selected container
						arrSelector.forEach(selector => {
							const selectedContainer = document.querySelector(`${selector}[data-tabtype="${tabType}"]`);
							if (selectedContainer) {
								selectedContainer.classList.add(showClass);
								selectedContainer.style.transform = 'translateX(0)';
								selectedContainer.style.opacity = '1'; // Fade in
							}
						});

						// Optionally show/hide additional controls (if applicable)
						const controlContainerSelector = `[data-controltype="${tabType}"]`;
						document.querySelectorAll('[data-controltype]').forEach((controlContainer) => {
							controlContainer.classList.remove(showClass);
						});
						const selectedControlContainer = document.querySelector(controlContainerSelector);
						if (selectedControlContainer) {
							selectedControlContainer.classList.add(showClass);
						}
						if (callback) setTimeout(() => { 
							 callback();
						}, 600);
					});
				});
			}),
			initializeScrollSnap: (scrollContainer, snapRange = 90, sensitivity = 0.1) => {
				// Variables to track scroll velocity
				let lastScrollLeft = 0;
				let lastTimestamp = 0;

				scrollContainer.addEventListener('scroll', (event) => {
					if (!this.SnapScroll) return; // Exit if snapping is temporarily disabled

					const snapPosition = document.querySelector('#object_collections').offsetWidth;
					const scrollLeft = scrollContainer.scrollLeft;
					const currentTime = Date.now();

					// Calculate scroll velocity
					const deltaTime = currentTime - lastTimestamp;
					const deltaScroll = Math.abs(scrollLeft - lastScrollLeft);
					const velocity = deltaScroll / deltaTime; // pixels per ms

					// Update last scroll position and time
					lastScrollLeft = scrollLeft;
					lastTimestamp = currentTime;

					// Only snap if within the snap range and velocity is below sensitivity threshold
					if (
						scrollLeft >= snapPosition - snapRange &&
						scrollLeft <= snapPosition + snapRange &&
						velocity < sensitivity
					) {
						scrollContainer.scrollTo({ left: snapPosition, behavior: 'smooth' });
					}
				});
			},
			addDataPreparationComponent: (id, componentType, generateContent) => { //NOTE - addDataPreparationComponent
				console.log(`add Data Preperation ${componentType} clicked`);
				const appArea = document.querySelector('#app_data_preparation_area');
				if (!appArea.classList.contains('show')) appArea.classList.add('show');
			
				let num = Date.now();
				let container_id = `container_${componentType.toLowerCase()}_${num}`;
				let content = generateContent(num, container_id);
				const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
				let testCard = this.Form.Components.BulmaCSS.Components.CardSlim({ //NOTE - testCard
					id: id,
					className: `box m-2 p-0 data_preparation_box is-selectable-box is-selectable is-selectable-parent`,
					classContent: `data_preparation_area_container ${container_id}`,
					order: 100,
					style: "width: fit-content;",//NOTE - testCardHeader
					headerContent: [{
						comment: "card-header-icon",
						tag: "button",
						class: "card-header-icon form-close-button m-0 p-2",
						style:"position:absolute; top:0; left:0; margin:0.5rem; z-index:10;",
						data: { formid: id },
						aria: {},
						content: [{
							tag: "span",
							class: "icon form-close-button",
							innerHTML: `<i class="fa-solid fa-xmark form-close-button has-text-danger" style="cursor:pointer;" data-formid="${id}"></i>`
						}]
					}, {
						tag: "div", style:"width:100%;",  class:"mt-4 p-0 label-container is-flex is-justify-content-center", content: [
							{
								comment: "card-header-title",
								tag: "div",
								
								class: "card-header-icon field has-addons m-0 p-0",
								content: [{
									tag: "p",
									class: "control",
									content: [{
										tag: "button",
										class: "button move-up-box",
										innerHTML: `<span class="icon is-small"><i class="fa-solid fa-arrows-up-to-line"></i></span>`,
										content: []
									},{
										tag: "button",
										class: "button prev-box",
										innerHTML: `<span class="icon is-small"><i class="fa-solid fa-angle-up"></i></span>`,
										content: []
									},{
										comment: "card-header-icon",
										tag: "div",
										class: "card-header-title title mb-1 is-justify-content-center",
										style: "min-width: 11rem;",
										innerHTML: componentType.toUpperCase()
									},{
										tag: "button",
										class: "button next-box",
										innerHTML: `<span class="icon is-small"><i class="fa-solid fa-angle-down"></i></span>`,
										content: []
									}, {
										tag: "button",
										class: "button move-down-box",
										innerHTML: `<span class="icon is-small"><i class="fa-solid fa-arrows-down-to-line"></i></span>`,
										content: []
									}]
								}]
							}
					]}],
					innerHTML: content
				});
				
				let str = this.Form.Render.traverseDOMProxyOBJ(testCard);
				appArea.innerHTML += str;

				//NOTE - CALCULATE WIDTH
				let maxwidth = 0;
				document.querySelectorAll('.data_preparation_box').forEach(box => {
					maxwidth = box.offsetWidth > maxwidth ? box.offsetWidth : maxwidth;
				});
				
				if (((appArea.style.flexBasis.replace('px', '')) * 1) < maxwidth) appArea.style.flexBasis = 28 + maxwidth + 'px';
			
				// Handle scrolling
				this.SnapScroll = false;
				setTimeout(() => {
					document.querySelector('#app_root_container').scrollTo({
						left: document.querySelector('#app_root_container').scrollWidth,
						behavior: 'smooth'
					});
				}, 600);
				setTimeout(() => {
					this.SnapScroll = true;
					this.Areas.app_data_preparation_area.width = appArea.offsetWidth;
				}, 1000);
				setTimeout(() => {
					let selectedBox = document.querySelector(`.${container_id}`)
					console.log('container_id :>> ', container_id);
					if (selectedBox) {
						let scrollContainer = document.querySelector('#app_data_preparation_area');
						let offsetLeft = selectedBox.offsetLeft + 24 + 'px';
						console.log('offsetLeft :>> ', offsetLeft);
						scrollContainer.scrollTo({
							left: offsetLeft,
							behavior: 'smooth'
						});
					} else { 
						console.error('SelectedBox not found! class:', container_id);
					}
				}, 600);
			},
			GenerateSchemaToParadigmJSON: (function ($id, $schema, $util, is_horizontal = false, form_container = "") {
				// console.log('generateSchemaToParadigmJSON', form_container);
				function makeFieldParadigmJSON($id, field, utilily, form_container) {
					// console.log('makeFieldParadigmJSON', form_container);
					const { id, type, label = '', form, readonly = false, value = '', class: d_class = '', head, tail } = field;
					let inputField = {};
					switch (type) {
						case 'action':
							inputField = { comment: "Button", tag: "button", id: `${$id}___${id}`, name: id, data: {form_container: form_container}, class: `button form-action-button ${d_class} `, value: value, readonly: readonly, type: 'button', innerHTML: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')) };
							break;
						case 'button':
							inputField = { comment: "Button", tag: "button", id: `${$id}___${id}`, name: id, data: {form_container: form_container}, class: `button paradigm-form-element in-form-button is-fullwidth ${d_class} `, value: value, readonly: readonly, type: 'button', innerHTML: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')) };
							break;
						case 'separator':
							inputField = { comment: "HR", tag: "hr" };
							break;
						case 'checkbox':
							inputField = {
								comment: "label", tag: "label", class: "checkbox  mt-2", content: [
									{
										comment: "Checkbox", tag: "input", id: `${$id}___${id}`, name: id, data: {form_container: form_container}, class: `paradigm-form-element ${d_class}`, value: value, readonly: readonly, type: 'checkbox', content: [
											{tag:"label", class:"m-1" } //innerHTML: label || utilily.Strings.UCwords(id.replace(/\_/g, ' '))
									] }
								]
							};
							break;
						case 'number':
							inputField = { comment: "Number inputbox", tag: "input", id: `${$id}___${id}`, name: id, data: {form_container: form_container}, class: `input paradigm-form-element ${d_class} `, value: value, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')), autocomplete: 'off'};
							break;
						case 'textarea':
							inputField = { comment: "Textarea box", tag: "textarea", id: `${$id}___${id}`, name: id, data: {form_container: form_container}, class: `textarea paradigm-form-element ${d_class} `, value: value, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')), autocomplete: 'off'};
							break;
						case 'select':
							inputField = {
								comment: "Select container", tag: "div", class: "select is-link is-fullwidth ", content: [
									{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, data: {form_container: form_container}, class: `select_input paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : value}` }
								]
							};
							break;
						case 'text_select':
							inputField = { comment: "Searchable textbox", tag: "input", id: `${$id}___${id}`, autocomplete:"off", name: id, data: {form_container: form_container}, class: `input paradigm-form-element text_select is-link ${d_class} `, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')), data: { selectValues: value, form_container: form_container } };
							break;
						default:
							inputField = { comment: "Textbox", tag: "input", id: `${$id}___${id}`, autocomplete:"off", name: id, class: `input text_input paradigm-form-element is-info ${d_class} `, value: value, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')), data: { selectValues: value, form_container: form_container }};
							break;
					}
					// Handle $head and $tail cases
					if (!head && !tail) {
						return { comment: "Container inputbox", tag: "div", class:`control ${field.type == 'action' ? '' : 'is-expanded'}   ${type == 'boolean' ? 'mt-2' : ''}`, content: [inputField] };
					}

					if (head && !tail) {
						switch (head.type) {
							case 'button':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{ comment: "Label button", tag: "button", class: "button in-head-button is-primary head-paradigm-form-element", innerHTML: Array.isArray(head.value) ? head.value[0] : head.value },
									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
							case 'label':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(head.value) ? head.value.join(', ') : head.value },

									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
							case 'input':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{ comment: "Head input", tag: "input", type: "text", class: "input head_input head-paradigm-form-element", placeholder: head.value, readonly: readonly }
									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
							case 'select':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{
											comment: "Container form", tag: "div", class: "select", content: [
												{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${head.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input head-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(head.value) ? head.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
											]
										}
									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
						}
					}
					if (!head && tail) {
						switch (tail.type) {
							case 'button':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
									comment: "Container form", tag: "p", class: "control ", content: [
											{ comment: "Label button", tag: "button", class: "button tail-paradigm-form-element in-tail-button is-link", data: {form_container: form_container}, innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value },
									]
								}];
								break
							case 'label':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
										comment: "Container form", tag: "p", class: "control ", content: [
											{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value }
										]
									}
								];
								break;
							case 'input':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
										comment: "Container form", tag: "p", class: "control ", content: [
											{ comment: "Tail input", tag: "input", type: "text", class: "input tail-paradigm-form-element tail_input", placeholder: Array.isArray(tail.value) ? tail.value[0] : tail.value, readonly: readonly }
										]
									}];
								break;
								break;
							case 'select':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
										comment: "Container form", tag: "p", class: "control ", content: [
											{
												comment: "Container form", tag: "div", class: "select", content: [
													{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${tail.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input tail-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(tail.value) ? tail.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
												]
											}
										]
									}];
								break;
						}
					}
					if (head && tail) {
						let tObj = [];
						switch (head.type) {
							case 'button':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Label button", tag: "button", class: "button in-head-button is-primary head-paradigm-form-element ", innerHTML: Array.isArray(head.value) ? head.value[0] : head.value },
									]
								});
								break;
							case 'label':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(head.value) ? head.value.join(', ') : head.value },
									]
								});
								break;
							case 'input':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Head input", tag: "input", type: "text", class: "input head_input head-paradigm-form-element ", placeholder: head.value, readonly: readonly }
									]
								});
								break;
							case 'select':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{
											comment: "Container form", tag: "div", class: "select", content: [
												{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${head.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input head-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(head.value) ? head.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
											]
										}
									]
								})
								break;
						}
						tObj.push({comment: "Container form", tag: "p", class: "control is-expanded", content: [inputField]});
						switch (tail.type) {
							case 'button':
								tObj.push(
									{
										comment: "Container form", tag: "p", class: "control", content: [
											{ comment: "Label button", tag: "button", class: "button in-tail-button is-link tail-paradigm-form-element ", data: {form_container: form_container}, innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value },
										]
									});
								break;
							case 'label':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value }
									]
								});
								break;
							case 'input':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Tail input", tag: "input", type: "text", class: "input tail_input tail-paradigm-form-element ", placeholder: Array.isArray(tail.value) ? tail.value[0] : tail.value, readonly: readonly }
									]
								});
								break;
							case 'select':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{
											comment: "Container form", tag: "div", class: "select", content: [
												{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${tail.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input tail-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(tail.value) ? tail.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
											]
										}
									]
								});
								break;
						}
						return tObj;
					}
				}
				let Obj = { comment: "Paradigm Form", tag: "div", class: "paradigm-form", style: "", content: [] };
				let tObj = {};
				let tfield = {};
				let Util = $util;
				$schema.forEach((field, index) => {
					const { id, label = '', form, field_class } = field;
		
					if (form === 1) {
						if (label || field.type !== 'separator') {
							tfield = {comment: "Field", tag: "div", class: `field ${field_class} ${is_horizontal ? 'is-horizontal' : ''}`, style: "", innerHTML: "", content: []};

							let tlabel = field.label || (field.type === 'action' ? '' : label || Util.Strings.UCwords(id.replace(/_/g, ' ')));
							if (is_horizontal) {
								tObj = {
									comment: "Field label", tag: "div", class: `field-label is-normal `, style: "", innerHTML: "", content: [
										{ comment: "Label", tag: "label", class: "label", id: `id_label___${$id}___${id}`, style: "", innerHTML: `${tlabel}`, content: [] }
									]
								};
							} else {
								tObj = { comment: "Label", tag: "label", class: "label", id: `id_label___${$id}___${id}`, style: "", innerHTML: `${tlabel}`, content: [] };
							}
							tfield.content.push(tObj);
						}
						let temp = makeFieldParadigmJSON($id, field, $util, form_container);
						if (Array.isArray(temp)) {
							temp = [...temp];
						} else {
							temp = [temp];
						}
						tObj = {
							comment: "Field body", tag: "div", class: `field-body`, style: "", innerHTML: "", content: [
								{ comment: "Field", tag: "div", class: `field has-addons has-addons-centered `, style: "", innerHTML: "", content: temp }
						] };
						tfield.content.push(tObj);
						Obj.content.push(tfield);
					}
				});
				// Obj.content.push(tObj);
				return Obj;
			}).bind(this),
			GenerateFormToHTML: (function ($id, $schema, $util, is_horizontal = 0) {
				function makeField($id, field, utilily) {
					const { id, type, label = '', form, readonly = false, value = '', class: d_class = '', head, tail } = field;
					let inputField = '';
					switch (type) {
						case 'button':
							inputField = `<button id="${$id}___${id}" name="${id}" class="button in-form-button ${d_class} " value="${value}" ${readonly ? 'disabled' : ''} autocomplete="off">${label || utilily.Strings.UCwords(id.replace(/\_/g, ' '))}</button>`;
							break;
						case 'separator':
							inputField = `<hr />`;
							break;
						case 'boolean':
							inputField = `
							<label class="checkbox">
								<input type="checkbox" id="${$id}___${id}" name="${id}" class="${d_class}" ${value ? 'checked' : ''} ${readonly ? 'disabled' : ''} autocomplete="off"/>
								${utilily.Strings.UCwords(id.replace(/\_/g, ' '))}
							</label>`;
							break;
						case 'number':
							inputField = `<input type="text" id="${$id}___${id}" name="${id}" class="input number_input is-success ${d_class}" value="${value}" ${readonly ? 'readonly' : ''} autocomplete="off"/>`;
							break;
						case 'textarea':

							inputField = `<textarea id="${$id}___${id}" name="${id}" class="textarea ${d_class}" ${readonly ? 'readonly' : ''} autocomplete="off">${value}</textarea>`;
							break;
						case 'select':
							inputField = `<div class="select is-link">
											<select id="${$id}___${id}" name="${id}" class="select_input ${d_class}">
												${Array.isArray(value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</div>`;
							break;
						case 'text_select':
							inputField = `<input type="text" id="${$id}___${id}" name="${id}" class="input text_select is-link ${d_class}" value="" ${readonly ? 'readonly' : ''} autocomplete="off" data-select-values='${JSON.stringify(value)}'/>`;
							break;
						default:
							inputField = `<input type="text" id="${$id}___${id}" name="${id}" class="input text_input is-info ${d_class}" value="${value}" ${readonly ? 'readonly' : ''} autocomplete="off"/>`;
							break;
					}

					// Handle $head and $tail cases
					if (!head && !tail) {
						return `<div class="control">${inputField}</div>`;
					}

					if (head && !tail) {
						switch (head.type) {
							case 'label':
								return `<p class="control"><a class="button is-static">${head.value}</a></p><p class="control">${inputField}</p>`;
								break;
							case 'input':
								return `<p class="control"><input type="text" id="" name="" class="input head_input" value="" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								return `<p class="control">
										<div class="select">
											<select id="" name="" class="select_input head_input ${d_class}">
												${Array.isArray(head.value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</div>
									</p>`;
								break;
						}
					}
					if (!head && tail) {
						switch (tail.type) {
							case 'label':
								return `<p class="control">${inputField}</p><p class="control"><a class="button is-static">${tail.value}</a></p>`;
								break;
							case 'input':
								return `<p class="control"><input type="text" id="" name="" class="input tail_input" value="" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								return `<p class="control">
										<div class="select">
											<select id="" name="" class="select_input tail_input ${d_class}">
												${Array.isArray(tail.value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</div>
									</p>`;
								break;
						}
					}
					if (head && tail) {
						let zstr = "";
						switch (head.type) {
							case 'label':
								zstr += `<p class="control"><a class="button is-static">${Array.isArray(head.value) ? head.value[0] : head.value}</a></p>`;
								break;
							case 'input':
								zstr += `<p class="control"><input type="text" id="" name="" class="input head_input" value="" placeholder="${Array.isArray(head.value) ? head.value[0] : head.value}" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								zstr += `<p class="control">
										<span class="select">
											<select id="" name="" class="select_input head_input ${d_class}">
												${Array.isArray(head.value) ? head.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</span>
									</p>`;
								break;
						}
						zstr += `<p class="control">${inputField}</p>`;
						switch (tail.type) {
							case 'label':
								zstr += `<p class="control"><a class="button is-static">${Array.isArray(tail.value) ? tail.value[0] : tail.value}</a></p>`;
								break;
							case 'input':
								zstr += `<p class="control"><input type="text" id="" name="" class="input tail_input" value="" placeholder="${Array.isArray(tail.value) ? tail.value[0] : tail.value}" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								zstr += `<p class="control">
										<span class="select">
											<select id="" name="" class="select_input tail_input ${d_class}">
												${Array.isArray(tail.value) ? tail.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</span>
									</p>`;
								break;
						}
						return zstr;
					}
				}
				let str = '<div class="paradigm-form">';

				$schema.forEach((field) => {
					const { id, label = '', form } = field;
					if (form === 1) {
					
						str += `<div class="field ${is_horizontal ? 'is-horizontal' : ''}">`;

						if (label || field.type !== 'separator') {
							let tlabel = field.label || (field.type === 'button' ? '' : label || Util.Strings.UCwords(id.replace(/_/g, ' ')));
							if (is_horizontal) {
								str += `<div class="field-label is-normal is-left">
										<label class="label" id="id_label___${$id}___${id}">
											${tlabel}
										</label>
									</div>`;
							} else {
								str += `<label class="label" id="id_label___${$id}___${id}">
											${tlabel}
										</label>`;
							}
						}

						str += `<div class="field-body">`;
						str += (field.head || field.tail) ? `<div class="field has-addons">` : `<div class="field">`;
						str += makeField($id, field, $util);
						str += `</div></div></div>`;
					}
				});
				str += '</div>';
			
				return str;
			}).bind(this),
			initSearchDropdown: (function (inputElement, source) {
				const parent = inputElement.parentElement;
				const wrapper = document.createElement('div');
				wrapper.classList.add('control', 'has-icons-left');

				const magnifierIcon = document.createElement('span');
				magnifierIcon.classList.add('icon', 'is-left');
				magnifierIcon.innerHTML = '<i class="fas fa-search"></i>';

				// Preserve the input's attributes and move it inside the wrapper
				wrapper.appendChild(inputElement);
				wrapper.appendChild(magnifierIcon);
				parent.innerHTML = '';
				parent.appendChild(wrapper, inputElement); // Insert wrapper in the same position as the original input

				// Set input styling (class, padding) if it's not already there
				inputElement.classList.add('input');
				inputElement.style.paddingLeft = '2.5em'; // Add padding to make room for the icon

				// Step 2: Create the dropdown container
				const dropdownMenu = document.createElement('div');
				dropdownMenu.classList.add('dropdown');
				dropdownMenu.style.cssText = `
					width: 100%;
					position: absolute; /* Make dropdown position absolute */
					top: 100%; /* Position it directly below the input */
					left: 0;
					z-index: 10; /* Ensure it appears on top of other content */
				`;

				// Create dropdown menu structure
				dropdownMenu.innerHTML = `
				<div class="dropdown-menu" style="width: 100%; left: 0; right: 0;">
					<div class="dropdown-content" style="max-height: 300px; overflow-y: auto; width: 100%; "></div>
				</div>
				`;

				const searchResults = dropdownMenu.querySelector('.dropdown-content');
				parent.appendChild(dropdownMenu); // Append the dropdown to the parent of the input


				let activeIndex = -1;  // Track the currently selected result
				let results = [];  // Store the current search results

				inputElement.addEventListener('input', async function () {
					const query = inputElement.value.trim();

					if (query.length > 0) {
						if (typeof source === 'string') {
							results = await fetchResults(query); // If source is an API string, use fetch
						} else if (Array.isArray(source)) {
							results = filterLocalResults(query); // If source is an array, search locally
						}
						displayResults(results);
					} else {
						dropdownMenu.classList.remove('is-active');
						results = [];
						activeIndex = -1;
					}
				});

				// Show all results when the input gains focus
				inputElement.addEventListener('focus', function () {
					if (Array.isArray(source)) {
						// Display all available options
						results = source;
						displayResults(results);
					}
				});
				inputElement.addEventListener('focusout', function () {
					setTimeout(() => {
						dropdownMenu.classList.remove('is-active');
						activeIndex = -1; // Reset the active index
					}, 100);
				});

				// Fetch results from API
				async function fetchResults(query) {
					try {
						const response = await fetch(`${source}?name=${query}`);
						const data = await response.json();
						return data.results || [];
					} catch (error) {
						console.error('Error fetching results:', error);
						return [];
					}
				}

				// Filter results from local array
				function filterLocalResults(query) {
					const lowerCaseQuery = query.toLowerCase();
					return source.filter(item => item.toLowerCase().includes(lowerCaseQuery));
				}

				function displayResults(results) {
					searchResults.innerHTML = '';
					activeIndex = -1; // Reset the active index

					if (results.length === 0) {
						searchResults.innerHTML = '<div class="dropdown-item">No results found</div>';
					} else {
						results.forEach((result, index) => {
							const item = document.createElement('a');
							item.classList.add('dropdown-item');
							item.textContent = typeof result === 'string' ? result : result.name; // Handle both string and object results
							item.addEventListener('click', () => selectResult(index));
							searchResults.appendChild(item);
						});
					}
					dropdownMenu.classList.add('is-active');
				}

				function selectResult(index) {
					if (results[index]) {
						const selectedValue = typeof results[index] === 'string' ? results[index] : results[index].name;
						inputElement.value = selectedValue; // Populate the input with selected result
						dropdownMenu.classList.remove('is-active');
						activeIndex = -1; // Reset the active index
					}
				}

				inputElement.addEventListener('keydown', function (e) {
					const items = searchResults.getElementsByClassName('dropdown-item');
					if (e.key === 'ArrowDown') {
						e.preventDefault();
						if (activeIndex < items.length - 1) {
							activeIndex++;
							updateActiveItem(items);
						}
					} else if (e.key === 'ArrowUp') {
						e.preventDefault();
						if (activeIndex > 0) {
							activeIndex--;
							updateActiveItem(items);
						}
					} else if (e.key === 'Enter') {
						e.preventDefault();
						if (activeIndex >= 0) {
							selectResult(activeIndex);
						}
					}
				});

				function updateActiveItem(items) {
					// Remove 'is-selected' class from all items
					for (let i = 0; i < items.length; i++) {
						items[i].classList.remove('is-selected');
					}

					// Add 'is-selected' class to the active item
					if (items[activeIndex]) {
						items[activeIndex].classList.add('is-selected');
					}
				}
			}),
		},
		Initialize: {
			FormCard: (id, form, is_horizontal, isHTML = false, order = 0, form_container) => { //NOTE - Initialize: FormCard
				let testcard = this.Form.Components.BulmaCSS.Components.Card({
					id: id,
					order: order,
					style: "width:100%;",
					headerIcon: form.icon,
					header: form.label,
					headerControls: null,
					content: [this.Form.Events.GenerateSchemaToParadigmJSON(id, form.Dataset.Schema, this.Utility, is_horizontal, form_container)]
				});
				let column = { comment: "Column", tag: "div", class: `column is-flex collapsible m-0 p-0 form-input-column-container`, style: "max-width:25.5rem;min-width:25.5rem;", order: 0, content: [testcard] }
				return isHTML ? this.Form.Render.traverseDOMProxyOBJ(column) : column;
			},
		},
		Render: {
			traverseDOMProxyOBJ: ((element, callback, cr=0) => {
				let html = `<${element.tag}`;
				if (element.class) html += ` class="${element.class}"`;
				if (element.id) html += ` id="${element.id}"`;
				if (element.style) html += ` style="${element.style}"`;
				if (element.href) html += ` href="${element.href}"`;
				if (element.type) html += ` type="${element.type}"`;
				if (element.value) html += ` value="${element.value}"`;
				if (element.title) html += ` title="${element.title}"`;
				if (element.readonly) html += ` readonly="${element.readonly}"`;
				if (element.placeholder) html += ` placeholder="${element.placeholder}"`;
				if (element.checked) html += ` checked`;
				if (element.autocomplete) html += ` autocomplete="${element.autocomplete}"`;

				if (element.data) {
					for (let [key, value] of Object.entries(element.data)) {
						html += ` data-${key}="${value}"`;
					}
				}
				if (element.aria) {
					for (let [key, value] of Object.entries(element.aria)) {
						html += ` aria-${key}="${value}"`;
					}
				}

				html += ">";
				if (element.innerHTML) html += element.innerHTML;
				if (element.content && Array.isArray(element.content)) {
					for (let child of element.content) {
						html += this.Form.Render.traverseDOMProxyOBJ(child); // Recursively generate HTML for child elements
					}
				}

				html += `</${element.tag}>`;

				if (callback) callback();
				return html;
			}),
		},
		Run: {
			setRunMode: (mode) => {
				if (this.run_mode.includes(mode)) {
					this.run_mode_selected = mode;
					if (mode === "stop") {
						this.cursor = null; // Reset to the start of the chain
					}
				} else {
					console.error(`Invalid run mode: ${mode}`);
				}
			},

			// Resolve input, handling dynamic references
			resolveInput: (input, chain) => {
				let resolvedInput = {};
				for (let key in input) {
					let value = input[key];

					if (Array.isArray(value)) {
						// Resolve each element in arrays
						resolvedInput[key] = value.map(item => {
							if (typeof item === "string" && item.includes(".output")) {
								let processId = item.split(".")[0];
								let processItem = chain.find(item => item.id === processId);
								return processItem ? processItem.output : null;
							}
							return item;
						});
					} else if (typeof value === "string" && value.includes(".output")) {
						let processId = value.split(".")[0];
						let processItem = chain.find(item => item.id === processId);
						resolvedInput[key] = processItem ? processItem.output : null;
					} else {
						resolvedInput[key] = value;
					}
				}
				return resolvedInput;
			},

			// Execute the chain with respect to the current run mode
			executeChain: () => {
				if (this.run_mode_selected === "stop") {
					this.cursor = this.chain.find(item => item.id === "P1"); // Reset cursor
					return;
				}

				// Initialize cursor to the first item if not set
				if (!this.cursor) {
					this.cursor = this.chain.find(item => item.id === "P1");
				}
				console.log('>>>>> START PROGRAMMING FLOW');
				console.log('Input Chain', chain);
				// Loop to execute processes until end of chain or as per run mode
				while (this.cursor) {
					console.log('Cursor ID:', this.cursor.id);
					console.log('Selected Method:', this.cursor.process);
					const resolvedInput = this.Form.Run.resolveInput(this.cursor.input, this.chain);
					const processFunc = this.processFunctions[this.cursor.process];

					// Execute if the function exists
					if (processFunc) {
						const output = processFunc(...Object.values(resolvedInput));
						this.cursor.output = output;

						// Debug mode output for step-by-step tracing
						if (this.run_mode_selected === "debug") {
						} else {
						}
					} else {
						console.error(`Process function ${this.cursor.process} not found`);
						break;
					}

					// Step mode stops after each process
					if (this.run_mode_selected === "step" || this.run_mode_selected === "debug") {
						this.cursor = this.cursor.next_process ?
							this.chain.find(item => item.id === this.cursor.next_process) : null;
						break; // Stop after one step in step mode
					}
					console.log('Done on Cursor ID:', this.cursor.id);

					// Move to the next process for run/debug modes
					if (this.cursor.next_process) {
						this.cursor = this.chain.find(item => item.id === this.cursor.next_process);
					} else {
						this.cursor = null; // End of chain
					}
				}
				console.log('<<<<< DONE PROGRAMMING FLOW');
			}
		},
	};
	Datastorage = {
		
	}; //Data storage where the Flow can store it's data.
	DataProvider = {}; // Data source to be used by the Form, to fill the Form.
	Datasource = {}; // Data source to be used by the Form, to fill the Form.
	Sequence = {

	};
	Decision = {
		if: {
			input_pin1: null,
			input_pin2: null,
			operator: null,
			output_pin1: null,
			output_pin2: null,
			operator_template: OperatorTemplate,
			do_if: function () {
				switch (operator) {
					case '<':

						break;
					case '<=':

						break;
					case '==':

						break;
					case '===':

						break;
					case '>':

						break;
					case '>=':

						break;

					case 'is':

						break;

					default:
						break;
				}
			}
		},
		switch: function (input_pin1, operator) {

		}
	};
	Repetition = {

	};
};