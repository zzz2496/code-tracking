document.addEventListener('BlueprintsLoaded', () => {
	let GraphSurfaceObject;
	console.log('Start Graph Loader >>>>')
	console.log(window.ParadigmREVOLUTION.Blueprints.Data);
	GraphSurfaceObject = new window.ParadigmREVOLUTION.Modules.GraphSurface({
		name: "Yggdrasil",
		label: "Yggdrasil The World Tree",
		header: "",
		footer: "",
		type: "World Graph",
		world: window.ParadigmREVOLUTION.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name,
		realm: window.ParadigmREVOLUTION.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name,
		universe: window.ParadigmREVOLUTION.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Name
	}, window.ParadigmREVOLUTION.Blueprints.Data, new window.ParadigmREVOLUTION.Modules.Utility, window.ParadigmREVOLUTION.Datastores);
	console.log('GraphSurfaceObject :>>', GraphSurfaceObject);
	document.querySelector('#grph').appendChild(GraphSurfaceObject.GraphElement.div_graph_surface);
	window.ParadigmREVOLUTION.GraphSurface = GraphSurfaceObject;
	console.log('Done Graph Loader >>>>');
});
document.addEventListener('SurrealDBLoaded', () => {
	console.log('>>>>>>>START SurrealDBLoaded!! >>>>>>>')
	let datastore_status = '';
	console.log('>>>>>', window.ParadigmREVOLUTION.Datastores.SurrealDB);
	Object.entries(window.ParadigmREVOLUTION.Datastores.SurrealDB).forEach(([idx, entry]) => {
		// console.log('>>>>>>', idx, window.ParadigmREVOLUTION.Datastores.SurrealDB[idx].Instance, entry);
		console.log('>>>>>>', idx, entry);
		if (entry.Instance == false) { 
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-outline-secondary" value="${idx}">${entry.Metadata.ShortLabel}</button>` ;
		} else if (typeof entry.Instance.connection != "undefined") {
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary" value="${idx}">${entry.Metadata.ShortLabel}</button>` ;
		} else {
			datastore_status += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-outline-danger" value="${idx}">${entry.Metadata.ShortLabel}</button>` ;
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
