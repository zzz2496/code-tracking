document.addEventListener('BlueprintsLoaded', () => {
	console.log('Start Graph Loader >>>>')
	console.log(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data);
	let GraphSurfaceObject = new window.ParadigmREVOLUTION.SystemCore.Modules.GraphSurface({
		name: "Yggdrasil",
		label: "Yggdrasil The World Tree",
		header: "",
		footer: "",
		type: "World Graph",
		world: window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name,
		realm: window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name,
		universe: window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name
	}, window.ParadigmREVOLUTION.SystemCore.Blueprints.Data, new window.ParadigmREVOLUTION.SystemCore.Modules.Utility, window.ParadigmREVOLUTION.Datastores);
	console.log('GraphSurfaceObject :>>', GraphSurfaceObject);
	document.querySelector('#grph').appendChild(GraphSurfaceObject.GraphElement.div_graph_surface);

	window.ParadigmREVOLUTION.GraphSurface = GraphSurfaceObject;
	
	let corestatus_str = '';
	Object.entries(window.ParadigmREVOLUTION.SystemCore.CoreStatus).forEach(([idx, value]) => {
		console.log(idx, value);
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
	console.log('corestatus_str :>> ', corestatus_str);
	ParadigmREVOLUTION.Utility.DOMElements.hide(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status'), function () { 
		ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status').innerHTML = corestatus_str;
		ParadigmREVOLUTION.Utility.DOMElements.show(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status'), function () { 
			ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelectorAll('#core_status .datastore-status-light').forEach(element => {
				element.addEventListener('click', function () { 
					// console.log(this.value);
					// ParadigmREVOLUTION.
					// ParadigmREVOLUTION.Utility.DataStor.SurrealDB.initSurrealDB(this.value, entity.Metadata.Label, entity.Metadata.ShortLabel, entity.Metadata.Connect, entity.Metadata.Instance, window.ParadigmREVOLUTION.Blueprints.Data)
				});
			});	
		});
	});	


	
	console.log('Done Graph Loader >>>>');

});
document.addEventListener('SurrealDBLoaded', () => {
	console.log('>>>>>>>START SurrealDBLoaded!! >>>>>>>')
	
	let corestatus_str = '';
	Object.entries(window.ParadigmREVOLUTION.SystemCore.CoreStatus).forEach(([idx, value]) => {
		console.log(idx, value);
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
	console.log('corestatus_str :>> ', corestatus_str);
	ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#core_status').innerHTML = corestatus_str;

	let datastore_status = '';
	console.log('>>>>>', window.ParadigmREVOLUTION.Datastores.SurrealDB);
	Object.entries(window.ParadigmREVOLUTION.Datastores.SurrealDB).forEach(([idx, entry]) => {
		// console.log('>>>>>>', idx, window.ParadigmREVOLUTION.Datastores.SurrealDB[idx].Instance, entry);
		console.log('>>>>>>', idx, entry);
		if (entry.Instance == false) { 
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-outline-secondary" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>` ;
		} else if (typeof entry.Instance.connection != "undefined") {
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary" value="${idx}" title="${entry.Metadata.Label} CONNECTED">${entry.Metadata.ShortLabel}</button>` ;
		} else {
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-danger" value="${idx}" title="${entry.Metadata.Label} DISCONNECTED">${entry.Metadata.ShortLabel}</button>` ;
		}
	});
	console.log('datastore_status', datastore_status);
	ParadigmREVOLUTION.Utility.DOMElements.hide(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status'), function () { 
		ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status').innerHTML = datastore_status;
		ParadigmREVOLUTION.Utility.DOMElements.show(ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status'), function () { 
			ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelectorAll('#datastore_status .datastore-status-light').forEach(element => {
				element.addEventListener('click', function () { 
					// console.log(this.value);
					// ParadigmREVOLUTION.
					// ParadigmREVOLUTION.Utility.DataStor.SurrealDB.initSurrealDB(this.value, entity.Metadata.Label, entity.Metadata.ShortLabel, entity.Metadata.Connect, entity.Metadata.Instance, window.ParadigmREVOLUTION.Blueprints.Data)
				});
			});	
		});
	});	
});
