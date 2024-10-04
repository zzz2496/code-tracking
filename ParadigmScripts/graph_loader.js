let cr = false;
if (cr) console.log('>>> >>> >>> >>> Graph Loader');
// document.addEventListener('BlueprintsLoaded', () => {
// 	if (cr) console.log('>>> >>> >>> >>> >>> Start Blurprints Loaded')

// 	if (ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status != 'LOADED') { 
// 		console.error('Utility Module failed to load. Aborting. (Utility Status : ' + ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status + ')');
// 		return;
// 	}
// 	if (ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status != 'LOADED') {
// 		console.error('GraphSurface Module failed to load. Aborting. (GraphSurface Status : ' + ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status + ')');
// 		return;
// 	}

// 	if (cr) console.log(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data);
// 	let GraphSurfaceObject = new window.ParadigmREVOLUTION.SystemCore.Modules.GraphSurface({
// 		name: "Yggdrasil",
// 		label: "Yggdrasil The World Tree",
// 		header: "",
// 		footer: "",
// 		type: "World Graph",
// 		world: window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name,
// 		realm: window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name,
// 		universe: window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name
// 	}, window.ParadigmREVOLUTION.SystemCore.Blueprints.Data, new window.ParadigmREVOLUTION.SystemCore.Modules.Utility, window.ParadigmREVOLUTION.Datastores);
// 	if (cr) console.log('GraphSurfaceObject :>>', GraphSurfaceObject);
// 	document.querySelector('#grph').appendChild(GraphSurfaceObject.GraphElement.div_graph_surface);

// 	window.ParadigmREVOLUTION.GraphSurface = GraphSurfaceObject;
	
// 	ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status').innerHTML = 'Loading...';
// 	let corestatus_str = '';
// 	Object.entries(window.ParadigmREVOLUTION.SystemCore.CoreStatus).forEach(([idx, value]) => {
// 		switch (value.Status) {
// 			case 'NOT LOADED':
// 				corestatus_str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-outline-secondary runtime-controls-button" id="${value}__${idx}__notLoaded" title="${idx.Label}"><i class="fa-solid fa-${value.Icon}"></i></button>`;
// 				break;
// 			case 'LOADED':
// 				corestatus_str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary runtime-controls-button" id="${value}__${idx}__Loaded" title="${idx.Label}"><i class="fa-solid fa-${value.Icon}"></i></button>`;
// 				break;
// 			case 'FAILED TO LOAD':
// 				corestatus_str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-danger runtime-controls-button" id="${value}__${idx}__failedtoLoad" title="${idx.Label}"><i class="fa-solid fa-${value.Icon}"></i></button>`;
// 				break;
// 		}
// 	});
// 	ParadigmREVOLUTION.Utility.DOMElements.hide(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status'), function () { 
// 		ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status').innerHTML = corestatus_str;
// 		ParadigmREVOLUTION.Utility.DOMElements.show(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status'), function () { 
// 			ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelectorAll('#core_status .datastore-status-light').forEach(element => {
// 				element.addEventListener('click', function () { 
// 					// console.log(this.value);
// 					// ParadigmREVOLUTION.
// 					// ParadigmREVOLUTION.Utility.DataStor.SurrealDB.initSurrealDB(this.value, entity.Metadata.Label, entity.Metadata.ShortLabel, entity.Metadata.Connect, entity.Metadata.Instance, window.ParadigmREVOLUTION.Blueprints.Data)
// 				});
// 			});	
// 		});
// 	});

// 	const dragAndSelect = ParadigmREVOLUTION.Utility.DOMElements.initializeDragAndSelect({
// 		snapSize: 25,
// 		containerSelector: '#id_yggdrasil-graph',
// 		itemSelector: '.graph-node'
// 	}, ParadigmREVOLUTION.GraphSurface.GraphElement.selectedNodes);

// 	let rows = 1;
// 	document.querySelector('#id_yggdrasil_control_palette_container-node-add').addEventListener('click', () => {
// 		let y = ((rows - 1) * 100) + 50;
// 		let num = (rows - 1) * 10;
// 		document.querySelector('#id_yggdrasil-graph').innerHTML += `
// 			<div class="graph-node" style="left: 350px;  top: ${y}px;" id="item_${num+1}">Item ${num + 1}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 450px; top: ${y}px;" id="item_${num+2}">Item ${num + 2}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 550px; top: ${y}px;" id="item_${num+3}">Item ${num + 3}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 650px; top: ${y}px;" id="item_${num+4}">Item ${num + 4}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 750px; top: ${y}px;" id="item_${num+5}">Item ${num + 5}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 850px; top: ${y}px;" id="item_${num+6}">Item ${num + 6}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 950px; top: ${y}px;" id="item_${num+7}">Item ${num + 7}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 1050px; top: ${y}px;" id="item_${num+8}">Item ${num + 8}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 1150px; top: ${y}px;" id="item_${num+9}">Item ${num + 9}<br><div class="graph-node-content"></div></div>
// 			<div class="graph-node" style="left: 1250px; top: ${y}px;" id="item_${num+10}">Item ${num + 10}<br><div class="graph-node-content"></div></div>
// 		`;
// 		rows++;
// 		dragAndSelect.reinitialize();
// 	});
// 	document.querySelector('#id_yggdrasil_control_palette_container-node-remove').addEventListener('click', () => {
// 		ParadigmREVOLUTION.GraphSurface.GraphElement.selectedNodes.forEach(element => {
// 			element.remove();
// 		});
// 		dragAndSelect.reinitialize();
// 	});

// 	ParadigmREVOLUTION.Utility.DOMElements.enableDragAndDropGroup('.group-container');
// 	if (cr) console.log('>>> >>> >>> >>> >>> Done Blurprints Loaded')
// });
document.addEventListener('SurrealDBLoaded', () => {
	if (cr) console.log('>>> >>> >>> >>> >>> SurrealDB Loaded');
	if (cr) console.log('>>> >>> >>> >>> >>> ||| Detecting Core Status');

	// ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status').innerHTML = 'Loading...';
	let corestatus_str = '';
	Object.entries(window.ParadigmREVOLUTION.SystemCore.CoreStatus).forEach(([idx, value]) => {
		// if (cr) console.log(idx, value);
		switch (value.Status) {
			case 'NOT LOADED':
				corestatus_str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-outline-secondary runtime-controls-button" id="${value.Label}--${idx}Loaded" title="${idx}"><i class="fa-solid fa-${value.Icon}"></i></button>`;
				break;
			case 'LOADED':
				corestatus_str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary runtime-controls-button" id="${value.Label}--${idx}Loaded" title="${idx}"><i class="fa-solid fa-${value.Icon}"></i></button>`;
				break;
			case 'FAILED TO LOAD':
				corestatus_str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-danger runtime-controls-button" id="${value.Label}--${idx}Loaded" title="${idx}"><i class="fa-solid fa-${value.Icon}"></i></button>`;
				break;
		}
	});
	// ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status').innerHTML = corestatus_str;
	if (cr) console.log('<<< <<< <<< <<< <<< ||| Detecting Core Status');

	if (cr) console.log('>>> >>> >>> >>> >>> ||| Detecting Datastore Status');
	let datastore_status = '';
	Object.entries(window.ParadigmREVOLUTION.Datastores.SurrealDB).forEach(([idx, entry]) => {
		// console.log('>>>>>>', idx, window.ParadigmREVOLUTION.Datastores.SurrealDB[idx].Instance, entry);
		if (entry.Instance == false) { 
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-outline-secondary" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>` ;
		} else if (typeof entry.Instance.connection != "undefined") {
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary" value="${idx}" title="${entry.Metadata.Label} CONNECTED">${entry.Metadata.ShortLabel}</button>` ;
		} else {
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-danger" value="${idx}" title="${entry.Metadata.Label} DISCONNECTED">${entry.Metadata.ShortLabel}</button>` ;
		}
	});
	if (cr) console.log('<<< <<< <<< <<< <<< ||| Detecting Datastore Status');

	// ParadigmREVOLUTION.Utility.DOMElements.hide(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status'), function () { 
	// 	ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status').innerHTML = datastore_status;
	// 	ParadigmREVOLUTION.Utility.DOMElements.show(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status'), function () { 
	// 		ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelectorAll('#datastore_status .datastore-status-light').forEach(element => {
	// 			element.addEventListener('click', function () { 
	// 				// console.log(this.value);
	// 				// ParadigmREVOLUTION.
	// 				// ParadigmREVOLUTION.Utility.DataStor.SurrealDB.initSurrealDB(this.value, entity.Metadata.Label, entity.Metadata.ShortLabel, entity.Metadata.Connect, entity.Metadata.Instance, window.ParadigmREVOLUTION.Blueprints.Data)
	// 			});
	// 		});	
	// 	});
	// });
	document.dispatchEvent(new Event('SurrealDBMonitorLoaded'));
});
if (cr) console.log('<<< <<< <<< <<< Graph Loader');
