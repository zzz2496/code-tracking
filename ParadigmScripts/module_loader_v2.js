let cr = false;
if (cr) console.log('>>> Module Loader');
// import { Utility } from "../Classes/Utility.mjs";
// import { GraphSurface } from "../Classes/GraphSurface.mjs";
// import { Connection} 	from "../Classes/GraphConnection.mjs";
// import { WorkerThread } from "../Classes/WorkerThread.mjs";
// import { Flow } 	from "../Classes/Flow.mjs";
// import { Surreal } from '../../node_modules/surrealdb.js/dist/index.bundled.mjs';
// import { surrealdbWasmEngines } from '../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js';
// import { Surreal } from '../../paradigm_modules/surrealdb.wasm/dist/full/index.js'; // SurrealDB.wasm v0.9
// import { Flow } from "../Classes/Flow.mjs";

let Utility, GraphSurface, Connection, WorkerThread, Flow, Surreal, surrealdbWasmEngines, mqtt;
// let Utility, GraphSurface, Connection, WorkerThread, Surreal, surrealdbWasmEngines, mqtt;

let ParadigmREVOLUTION = {
	"SystemCore": {
		"CoreStatus": {
			"UI": {
				"Status": "NOT LOADED",
				"Icon": "tv",
				"Label": "UI",
				"ShortLabel": "UI"
			},
			"FormGenerator": {
				"Status": "NOT LOADED",
				"Icon": "window-restore",
				"Label": "UI",
				"ShortLabel": "UI"
			},
			"Utility": {
				"Status": "NOT LOADED",
				"Icon": "screwdriver-wrench",
				"Label": "Utility",
				"ShortLabel": "UTL"
			},
			"GraphSurface": {
				"Status": "NOT LOADED",
				"Icon": "rectangle-xmark",
				"Label": "GraphSurface",
				"ShortLabel": "GFX"
			},
			"Connection": {
				"Status": "NOT LOADED",
				"Icon": "arrows-left-right-to-line",
				"Label": "Connection",
				"ShortLabel": "CON"
			},
			"WorkerThread": {
				"Status": "NOT LOADED",
				"Icon": "shuffle",
				"Label": "WorkerThread",
				"ShortLabel": "WT"
			},
			"Flow": {
				"Status": "NOT LOADED",
				"Icon": "diagram-project",
				"Label": "Flow",
				"ShortLabel": "FCH"
			},
			"Surreal": {
				"Status": "NOT LOADED",
				"Icon": "server",
				"Label": "Surreal",
				"ShortLabel": "SDBo"
			},
			"surrealdbWasmEngines": {
				"Status": "NOT LOADED",
				"Icon": "microchip",
				"Label": "surrealdbWasmEngines",
				"ShortLabel": "SDBe"
			},
			"Blueprints": {
				"Status": "NOT LOADED",
				"Icon": "receipt",
				"Label": "Blueprints",
				"ShortLabel": "BPL"
			},
			"SurrealDB": {
				"Status": "NOT LOADED",
				"Icon": "database",
				"Label": "SurrealDB Datastore",
				"ShortLabel": "SDB"
			},
			"FinderJS": {
				"Status": "NOT LOADED",
				"Icon": "table-columns",
				"Label": "FinderJS",
				"ShortLabel": "FJS"
			},
			"MQTT": {
				"Status": "NOT LOADED",
				"Icon": "link",
				"Label": "MQTT",
				"ShortLabel": "MQTT"
			},
		},
		"Modules": {
			"Utility": Utility,
			"GraphSurface": GraphSurface,
			"Connection": Connection,
			"WorkerThread": WorkerThread,
			"Flow": Flow,
			"Surreal": Surreal,
			"surrealdbWasmEngines": surrealdbWasmEngines,
			"mqtt": mqtt
		},
		"Blueprints": {
			"URL": {
				// "API_test": {
				// 	"URL": "http://localhost/testrequest.php",
				// 	"Method": 'GET',
				// 	"Params": { name: 'some name', number: 1234 },
				// 	"ContentType": 'application/json'
				// },
				"System": { "URL": "./SystemBlueprint/Blueprint__System.json" },
				"Datastore": { "URL": "./SystemBlueprint/Blueprint__Datastore.json" },
				"Node": { "URL": "./SystemBlueprint/Blueprint__Node.json" },
				"Template__Node__DataStatus": { "URL": "./SystemBlueprint/Blueprint__Template__Node__DataStatus.json" },
				"Edge": { "URL": "./SystemBlueprint/Blueprint__Edge.json" },
				"Schema": { "URL": "./SystemBlueprint/Validator__Schema.json" },
			},
			"Data": {}
		},
		"Schema": {
			"URL": {
				"FormInputTypes": { "URL": "./SystemBlueprint/Schema__FormInputTypes.json" },
				"FormInputTypeDefinition": { "URL": "./SystemBlueprint/Schema__FormInputTypeDefinition.json" },
				"Node__Datasets": { "URL": "./SystemBlueprint/Schema__Node__Datasets.json" }
			},
			"Data": {}
		},
		"Template": {
			"URL": {
				"MainAppLayout": { "URL": "./SystemBlueprint/Template__MainAppLayout.json" },
				"ComponentCanvas": { "URL": "./SystemBlueprint/Template__ComponentCanvas.json" },
				"GraphCanvas": { "URL": "./SystemBlueprint/Template__GraphCanvas.json" },
			},
			"Data": {}
		},
	},
	"Utility": null,
	"Application": {
		"State": [],
		"GraphNodes": [],
		"GraphEdges": [],
		"Collections":[]
	},
	"Datastores": {},
	"Initialization_Status": 0
};
window.ParadigmREVOLUTION = ParadigmREVOLUTION;
let loader = document.querySelector('#ParadigmREVOLUTION_Loader');
let loaderStatus = document.querySelector('#ParadigmREVOLUTION_LoaderStatus');
window.loader = loader;
window.loaderStatus = loaderStatus;
loader.max = Object.keys(ParadigmREVOLUTION.SystemCore.Modules).length + 1;

let key = 'FinderJS';
let loadingstatus = `<p>Import module <span id='${key.toLowerCase()}' class=''><b>${key}</b> <span id='${key.toLowerCase()}_status' style='font-weight: bold;'>Loading...</span></span></p>\n`;;
key = 'UI';
loadingstatus += `<p>Import module <span id='${key.toLowerCase()}' class=''><b>${key}</b> <span id='${key.toLowerCase()}_status' style='font-weight: bold;'>Loading...</span></span></p>\n`;;
Object.keys(ParadigmREVOLUTION.SystemCore.Modules).forEach((key) => {
	loadingstatus += `<p>Import module <span id='${key.toLowerCase()}' class=''><b>${key == 'surrealdbWasmEngines' ?  'SurrealDB.wasm' : key}</b> <span id='${key.toLowerCase()}_status' style='font-weight: bold;'>Loading...</span></span></p>\n`;
});
// console.log(loadingstatus);
loaderStatus.innerHTML = loadingstatus;

if (typeof finder !== 'undefined') {
	if (cr) console.log(">>> ||| FinderJS module loaded successfully.");
	document.dispatchEvent(new Event('FinderJSLoaded'));
	ParadigmREVOLUTION.SystemCore.CoreStatus.FinderJS.Status = "LOADED";
	ParadigmREVOLUTION.SystemCore.Modules.FinderJS = finder;
	loader.value++;
	document.querySelector('#finderjs').classList.add('has-text-success');
	document.querySelector('#finderjs_status').innerHTML = "<li class='fa fa-check'></li>";
} else {
	document.querySelector('#finderjs').classList.add('has-text-danger');
	document.querySelector('#finderjs_status').innerHTML = "<li class='fa fa-xmark'></li>";
	ParadigmREVOLUTION.SystemCore.CoreStatus.FinderJS.Status = "FAILED TO LOAD";
	console.error("Failed to import FinderJS.");
}

(async () => {
	try {
		const UIResult = await import("../ParadigmScripts/UI.js");
		const { UI, FormGenerator } = UIResult;
		ParadigmREVOLUTION.SystemCore.CoreStatus.UI.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.UI = UI;
		ParadigmREVOLUTION.SystemCore.Modules.FormGenerator = FormGenerator;
		loader.value++;
		document.querySelector('#ui').classList.add('has-text-success');
		document.querySelector('#ui_status').innerHTML = "<li class='fa fa-check'></li>";
	} catch (error) {
		document.querySelector('#ui').classList.add('has-text-danger');
		document.querySelector('#ui_status').innerHTML = "<li class='fa fa-xmark'></li>";
		ParadigmREVOLUTION.SystemCore.CoreStatus.UI.Status = "FAILED TO LOAD";
		console.error("Failed to import UI.");
	}
})();
(async () => {
	try {
		const UtilityResult = await import("../Classes/Utility.mjs");
		const { Utility } = UtilityResult;
		ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.Utility = Utility;
		loader.value++;
		document.querySelector('#utility').classList.add('has-text-success');
		document.querySelector('#utility_status').innerHTML = "<li class='fa fa-check'></li>";
		ParadigmREVOLUTION.Utility = new Utility();
		document.dispatchEvent(new Event('UtilitiesLoaded'));

		if (cr) console.log('>>> Blueprint Loader');
		let SysUtil = window.ParadigmREVOLUTION.Utility;

		if (ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status == 'LOADED') {
			let initBlueprints = function () {
				SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.SystemCore.Blueprints.URL, function (results) {
					window.ParadigmREVOLUTION.SystemCore.Blueprints.Data = results;
					window.ParadigmREVOLUTION.SystemCore.CoreStatus.Blueprints = "LOADED";

					//NOTE - Load the default blueprints to Window object
					// let template__Node = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Node));
					// window.template__Node = template__Node;
					// let template__Node__Datastatus = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Template__Node__DataStatus));
					// window.template__Node__Datastatus = template__Node__Datastatus;
					// let template__Edge = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Edge));
					// window.template__Edge = template__Edge;

					document.dispatchEvent(new Event('BlueprintsLoaded'));
					if (cr) console.log('>>> ||| Blueprint Loader | SUCCESS');
				}, function (key, url, status) {
					if (cr) console.log('>>> ||| progress :>> ', status, key, url);
				});
			}
			initBlueprints();
			let initSchema = function () {
				SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.SystemCore.Schema.URL, function (results) {
					window.ParadigmREVOLUTION.SystemCore.Schema.Data = results;
					window.ParadigmREVOLUTION.SystemCore.CoreStatus.Schema = "LOADED";
					console.log('window.ParadigmREVOLUTION.SystemCore.Schema.Data :>> ', window.ParadigmREVOLUTION.SystemCore.Schema.Data);

					// let template__FormInputTypes = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Schema.Data.FormInputTypes));
					// window.template__FormInputTypes = template__FormInputTypes;
					// let template__FormInputTypeDefinition = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Schema.Data.FormInputTypeDefinition));
					// window.template__FormInputTypeDefinition = template__FormInputTypeDefinition;

					// let node__datasets = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Schema.Data.Node__Datasets));
					// window.node__datasets = node__datasets;

					document.dispatchEvent(new Event('SchemaLoaded'));
					if (cr) console.log('>>> ||| Schema Loader | SUCCESS');
				}, function (key, url, status) {
					if (cr) console.log('>>> ||| progress :>> ', status, key, url);
				});
			}
			initSchema();
			let initTemplate = function () {
				SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.SystemCore.Template.URL, function (results) {
					window.ParadigmREVOLUTION.SystemCore.Template.Data = results;
					window.ParadigmREVOLUTION.SystemCore.CoreStatus.Template = "LOADED";
					console.log('window.ParadigmREVOLUTION.SystemCore.Template.Data :>> ', window.ParadigmREVOLUTION.SystemCore.Template.Data);

					// let template__ComponentCanvas = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Template.Data.ComponentCanvas));
					// window.template__ComponentCanvas = template__ComponentCanvas;

					// let template__MainAppLayout = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Template.Data.MainAppLayout));
					// window.template__MainAppLayout = template__MainAppLayout;

					document.dispatchEvent(new Event('SchemaLoaded'));
					if (cr) console.log('>>> ||| Template Loader | SUCCESS');
				}, function (key, url, status) {
					if (cr) console.log('>>> ||| progress :>> ', status, key, url);
				});
			}
			initTemplate();
		}
		if (cr) console.log('<<< Blueprint Loader');
	} catch (error) {
		document.querySelector('#utility').classList.add('has-text-danger');
		document.querySelector('#utility_status').innerHTML = "<li class='fa fa-xmark'></li>";
		ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status = "FAILED TO LOAD";
		console.error("Failed to import Utility.");
	}
})();
(async () => {
	const moduleHandlers = [
		{
			importPromise: import("../Classes/GraphSurface.mjs"),
			onSuccess: (module) => {
				const { GraphSurface } = module;
				if (cr) console.log(">>> ||| GraphSurface imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.GraphSurface = GraphSurface;
				loader.value++;
				document.querySelector('#graphsurface').classList.add('has-text-success');
				document.querySelector('#graphsurface_status').innerHTML = "<li class='fa fa-check'></li>";
				document.dispatchEvent(new Event('GraphSurfaceLoaded'));
			},
			onFailure: () => {
				document.querySelector('#graphsurface').classList.add('has-text-danger');
				Document.querySelector('#graphsurface_status').innerHTML = "<li class='fa fa-xmark'></li>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status = "FAILED TO LOAD";
				console.error("Failed to import GraphSurface.");
			}
		},
		{
			importPromise: import("../Classes/GraphConnection.mjs"),
			onSuccess: (module) => {
				const { Connection } = module;
				if (cr) console.log(">>> ||| Connection imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.Connection.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.Connection = Connection;
				loader.value++;
				document.querySelector('#connection').classList.add('has-text-success');
				document.querySelector('#connection_status').innerHTML = "<li class='fa fa-check'></li>";
				document.dispatchEvent(new Event('GraphConnectionLoaded'));
			},
			onFailure: () => {
				document.querySelector('#connection').classList.add('has-text-danger');
				document.querySelector('connection_status').innerHTML = "<li class='fa fa-xmark'></li>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.Connection.Status = "FAILED TO LOAD";
				console.error("Failed to import Connection.");
			}
		},
		{
			importPromise: import("../Classes/WorkerThread.mjs"),
			onSuccess: (module) => {
				const { WorkerThread } = module;
				if (cr) console.log(">>> ||| WorkerThread imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.WorkerThread.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.WorkerThread = WorkerThread;
				loader.value++;
				document.querySelector('#workerthread').classList.add('has-text-success');
				document.querySelector('#workerthread_status').innerHTML = "<li class='fa fa-check'></li>";
				document.dispatchEvent(new Event('WorkerThreadLoaded'));
			},
			onFailure: () => {
				document.querySelector('#workerthread').classList.add('has-text-danger');
				document.querySelector('#workerthread_status').innerHTML = "<li class='fa fa-xmark'></li>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.WorkerThread.Status = "FAILED TO LOAD";
				console.error("Failed to import WorkerThread.");
			}
		},
		{
			importPromise: import("../Classes/Flow.mjs"),
			onSuccess: (module) => {
				const { Flow } = module;
				if (cr) console.log(">>> ||| Flow imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.Flow.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.Flow = Flow;
				ParadigmREVOLUTION.Flow = new Flow();
				loader.value++;
				document.querySelector('#flow').classList.add('has-text-success');
				document.querySelector('#flow_status').innerHTML = "<li class='fa fa-check'></li>";
				document.dispatchEvent(new Event('FlowLoaded'));
			},
			onFailure: () => {
				document.querySelector('#flow').classList.add('has-text-danger');
				document.querySelector('#flow_status').innerHTML = "<li class='fa fa-xmark'></li>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.Flow.Status = "FAILED TO LOAD";
				console.error("Failed to import Flow.");
			}
		},
		{
			importPromise: import('../../node_modules/surrealdb/dist/index.bundled.mjs'),
			onSuccess: async (module) => {
				const { Surreal } = module;
				if (cr) console.log(">>> ||| Surreal imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.Surreal = Surreal;
				loader.value++;
				document.querySelector('#surreal').classList.add('has-text-success');
				document.querySelector('#surreal_status').innerHTML = "<li class='fa fa-check'></li>";
				document.dispatchEvent(new Event('SurrealJSLoaded'));
				try {
					// const surrealdbWasmEnginesModule = await import('../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js');
					const surrealdbWasmEnginesModule = await import('../../node_modules/@surrealdb/wasm/dist/surreal/index.bundled.js');
					const { surrealdbWasmEngines } = surrealdbWasmEnginesModule;
					if (cr) console.log(">>> ||| surrealdbWasmEngines imported successfully.");
					ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "LOADED";
					ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines = surrealdbWasmEngines;
					loader.value++;
					document.querySelector('#surrealdbwasmengines').classList.add('has-text-success');
					document.querySelector('#surrealdbwasmengines_status').innerHTML = "<li class='fa fa-check'></li>";

					document.dispatchEvent(new Event('SurrealDBEnginesLoaded'));
					if (cr) console.log('>>> ||| Done Blueprint Loader >>>>');

				} catch (error) {
					document.querySelector('#surrealdbwasmengines').classList.add('has-text-danger');
					document.querySelector('#surrealdbwasmengines_status').innerHTML = "<li class='fa fa-xmark'></li>";
					ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "FAILED TO LOAD";
					console.error("Failed to import surrealdbWasmEngines.");
				}
			},
			onFailure: () => {
				document.querySelector('#sureal').classList.add('has-text-danger');
				document.querySelector('#Sureal_status').innerHTML = "<li class='fa fa-xmark'></li>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status = "FAILED TO LOAD";
				console.error("Failed to import Surreal.");
			}
		},
		// {
		// 	importPromise: import("../../node_modules/mqtt/dist/mqtt.min.js"),
		// 	onSuccess: (module) => {
		// 		const { mqtt } = module;
		// 		if (cr) console.log(">>> ||| MQTT imported successfully.");
		// 		console.log('mqtt', mqtt);
		// 		ParadigmREVOLUTION.SystemCore.CoreStatus.MQTT.Status = "LOADED";
		// 		ParadigmREVOLUTION.SystemCore.Modules.MQTT = mqtt;
		// 		document.dispatchEvent(new Event('MQTTLoaded'));
		// 	},
		// 	onFailure: () => {
		// 		ParadigmREVOLUTION.SystemCore.CoreStatus.MQTT.Status = "FAILED TO LOAD";
		// 		console.error("Failed to import MQTT.");
		// 	}
		// },
	];
	for (const handler of moduleHandlers) {
		try {
			const module = await handler.importPromise;
			handler.onSuccess(module);
		} catch (error) {
			handler.onFailure();
		}
	}
})();
if (cr) console.log('<<< Module Loader');
