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

let Utility, ulid, Connection, WorkerThread, Flow, Surreal, surrealdbWasmEngines, SurrealDBinterface, mqtt;
// let Utility, GraphSurface, Connection, WorkerThread, Surreal, surrealdbWasmEngines, mqtt;

let ParadigmREVOLUTION = {
	"SystemCore": {
		"CoreStatus": {
			"ULID": {
				"Status": "NOT LOADED",
				"Icon": "id-card",
				"Label": "ULID",
				"ShortLabel": "ULID"
			},
			"Utility": {
				"Status": "NOT LOADED",
				"Icon": "screwdriver-wrench",
				"Label": "Utility",
				"ShortLabel": "UTL"
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
			"SurrealDBinterface": {
				"Status": "NOT LOADED",
				"Icon": "microchip",
				"Label": "SurrealDBinterface",
				"ShortLabel": "SDBi"
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
			"ULID": ulid,
			"Flow": Flow,
			"Surreal": Surreal,
			"surrealdbWasmEngines": surrealdbWasmEngines,
			"SurrealDBinterface": SurrealDBinterface,
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
				"NodeMetadata": { "URL": "./SystemBlueprint/Blueprint__Node__Metadata.json" },
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
	"SurrealDBinterface": null,
	"Application": {
		"Cursor": [],
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
		const UIResult = await import("../node_modules/ulid/dist/index.esm.js");
		const { ulid } = UIResult;
		ParadigmREVOLUTION.SystemCore.CoreStatus.ULID.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.ULID = ulid;
		document.querySelector('#ulid').classList.add('has-text-success');
		document.querySelector('#ulid_status').innerHTML = "<li class='fa fa-check'></li>";
	} catch (error) {
		document.querySelector('#ulid').classList.add('has-text-danger');
		document.querySelector('#ulid_status').innerHTML = "<li class='fa fa-xmark'></li>";
		ParadigmREVOLUTION.SystemCore.CoreStatus.ULID.Status = "FAILED TO LOAD";
		console.error("Failed to import ULID.");
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
					const surrealdbWasmEnginesModule = await import('../../node_modules/@surrealdb/wasm/dist/surreal/index.bundled.js');
					const { surrealdbWasmEngines } = surrealdbWasmEnginesModule;
					if (cr) console.log(">>> ||| surrealdbWasmEngines imported successfully.");
					ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "LOADED";
					ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines = surrealdbWasmEngines;
					loader.value++;
					document.querySelector('#surrealdbwasmengines').classList.add('has-text-success');
					document.querySelector('#surrealdbwasmengines_status').innerHTML = "<li class='fa fa-check'></li>";
					
					try { 
						const result = await import('../Classes/SurrealDBinterface.mjs');
						const { SurrealDBinterface } = result;
						if (cr) console.log(">>> ||| SurrealDBinterface imported successfully.");
						ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDBinterface.Status = "LOADED";
						ParadigmREVOLUTION.SystemCore.Modules.SurrealDBinterface = SurrealDBinterface;
						loader.value++;
						document.querySelector('#surrealdbinterface').classList.add('has-text-success');
						document.querySelector('#surrealdbinterface_status').innerHTML = "<li class='fa fa-check'></li>";
						ParadigmREVOLUTION.SurrealDBinterface = new SurrealDBinterface();

						document.dispatchEvent(new Event('SurrealDBEnginesLoaded'));
						if (cr) console.log('>>> ||| Done Blueprint Loader >>>>');	
	
					} catch (error) {
						document.querySelector('#surrealdbinterface').classList.add('has-text-danger');
						document.querySelector('#surrealdbinterface_status').innerHTML = "<li class='fa fa-xmark'></li>";
						ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDBinterface.Status = "FAILED TO LOAD";
						console.error("Failed to import SurrealDBinterface.");
					}

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
