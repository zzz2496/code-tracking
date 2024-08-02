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
		console.log(idx, window.ParadigmREVOLUTION.Datastores.SurrealDB[idx], entry);
		if (typeof entry.connection != "undefined") {
			datastore_status += `<button class="toolbar-kit btn btn-primary">${idx}</button><br>` ;
		} else {
			datastore_status += `<button class="toolbar-kit btn btn-secondary">${idx}</button><br>` ;
		}
	});
	console.log('datastore_status', datastore_status);
	ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status').innerHTML = datastore_status;
});
