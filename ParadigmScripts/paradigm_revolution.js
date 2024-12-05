let cr = true;
if (cr) console.log('>>> >>> >>> >>> ParadigmREVOLUTION');

document.addEventListener('UtilitiesLoaded', () => {
	console.log('>>>>>> check for UtilitiesLoaded in paradigm_revolution.js');
});
document.addEventListener('BlueprintsLoaded', () => {
	console.log('>>>>>> check for BlueprintsLoaded  in paradigm_revolution.js');
});
document.addEventListener('SurrealDBEnginesLoaded', () => {




	let OK = true;
	Object.keys(ParadigmREVOLUTION.SystemCore.CoreStatus).forEach((key) => {
		if (ParadigmREVOLUTION.SystemCore.CoreStatus[key].Status == 'FAILED TO LOAD') OK = false;
	});
	if (!OK) return;

	document.querySelector('#Loader_container').classList.add('hide');
	document.querySelector('#Loader_container').remove();
	console.log('>>> >>> >>> >>> ||| STARTING YGGDRASIL INITIALIZATION');

	let CurrentDocument = JSON.parse(JSON.stringify(ParadigmREVOLUTION.SystemCore.Blueprints.Data.Node));
	// form.Dataset.Schema = {
	// 	informasi_faktur: JSON.parse(JSON.stringify(template__node)),
	// 	identitas_pemilik: JSON.parse(JSON.stringify(template__node)),
	// 	identitas_kendaraan: JSON.parse(JSON.stringify(template__node)),
	// 	data_pendukung: JSON.parse(JSON.stringify(template__node)),
	// 	keterangan: JSON.parse(JSON.stringify(template__node))
	// };
	window.CurrentDocument = CurrentDocument;
	// NOTE - Initialize Main Form (App_menu, App_Container, App_Helper, App_console)
	CurrentDocument.Dataset.Layout = ParadigmREVOLUTION.SystemCore.Template.Data.MainAppLayout;

	let chain = [
		{
			"id": "P1",
			"input": {
				"a": [1, 2, 3],
			},
			"process": "add",
			"output": null,
			"next_process": "P2"
		},
		{
			"id": "P2",
			"input": {
				"a": ["P1.output", 3],
			},
			"process": "subtract",
			"output": null,
			"next_process": "P3"
		},
		{
			"id": "P3",
			"input": {
				"a": ["P2.output", 5],  // Dynamic reference as a string for later evaluation
			},
			"process": "multiply",
			"output": null,
			"next_process": "P4"
		},
		{
			"id": "P4",
			"input": {
				"a": "P3.output"
			},
			"process": "store",
			"output": null,
			"next_process": null
		}
	];
	window.chain = chain;

	let Flow = new ParadigmREVOLUTION.SystemCore.Modules.Flow(document.querySelector('#ParadigmREVOLUTION'), ParadigmREVOLUTION.Utility, ParadigmREVOLUTION.Utility.BasicMath, chain);
	// NOTE - Render Main Form, get something on the screen
	Flow.FormContainer.innerHTML = Flow.Form.Render.traverseDOMProxyOBJ(CurrentDocument.Dataset.Layout);

	if (cr) console.log('>>> >>> >>> >>> >>> ||| Detecting Datastore Status in paradigm_revolution.js');
	let datastore_status = '';
	Object.entries(ParadigmREVOLUTION.Datastores.SurrealDB).forEach(([idx, entry]) => {
 		datastore_status += `<button class="datastore-status-indicator button is-small p-2 m-0 mr-1" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>` ;
	});
	document.querySelector('#datastore_status').innerHTML = datastore_status;
	if (cr) console.log('<<< <<< <<< <<< <<< ||| Detecting Datastore Status in paradigm_revolution.js');
	// console.log('datastore_status', datastore_status, document.querySelector('#datastore_status'));


	Flow.FormContainer.classList.remove('hide');
	Flow.FormContainer.classList.add('show');

	CurrentDocument.Dataset.Forms = [ParadigmREVOLUTION.SystemCore.Schema.Data.FormInputTypes, ParadigmREVOLUTION.SystemCore.Schema.Data.FormInputTypeDefinition];
	Flow.Forms = CurrentDocument.Dataset.Forms;

	Flow.Form.Events.InitializeFormControls();
	window.Flow = Flow;

	let ram_db = ParadigmREVOLUTION.Datastores.SurrealDB.Memory;
	let local_db = ParadigmREVOLUTION.Datastores.SurrealDB.IndexedDB;
	let test_db = ParadigmREVOLUTION.Datastores.SurrealDB.TestServer;

	window.ram_db = ram_db;
	window.local_db = local_db;
	window.test_db = test_db;

	Flow.Form.Run.executeChain();
});