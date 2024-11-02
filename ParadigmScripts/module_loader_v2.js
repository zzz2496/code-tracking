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

let Utility, GraphSurface, Connection, WorkerThread, Flow, Surreal, surrealdbWasmEngines, mqtt;

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
				"Schema": { "URL": "./SystemBlueprint/Validator__Schema.json" }
			},
			"Data": {}
		},
	},
	"Utility": null,
	"Datastores": {},
	"Initialization_Status": 0
};
window.ParadigmREVOLUTION = ParadigmREVOLUTION;

if (typeof finder !== 'undefined') {
    if (cr) console.log(">>> ||| FinderJS module loaded successfully.");
	document.dispatchEvent(new Event('FinderJSLoaded'));
	ParadigmREVOLUTION.SystemCore.CoreStatus.FinderJS.Status = "LOADED";
	ParadigmREVOLUTION.SystemCore.Modules.FinderJS = finder;
} else {
	document.querySelector('#debugging').innerHTML += "Failed to load FinderJS.<br>";
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
	} catch (error) {
		document.querySelector('#debugging').innerHTML += "Failed to import UI.<br>";
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
		}
		if (cr) console.log('<<< Blueprint Loader');
	} catch (error) {
		document.querySelector('#debugging').innerHTML += "Failed to import Utility.<br>";
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
				document.dispatchEvent(new Event('GraphSurfaceLoaded'));
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import GraphSurface.<br>";
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
				document.dispatchEvent(new Event('GraphConnectionLoaded'));
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import Connection.<br>";
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
				document.dispatchEvent(new Event('WorkerThreadLoaded'));
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import WorkerThread.<br>";
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
				document.dispatchEvent(new Event('FlowLoaded'));
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import Flow.<br>";
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
				document.dispatchEvent(new Event('SurrealJSLoaded'));
				try {
					const surrealdbWasmEnginesModule = await import('../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js');
					const { surrealdbWasmEngines } = surrealdbWasmEnginesModule;
					if (cr) console.log(">>> ||| surrealdbWasmEngines imported successfully.");
					ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "LOADED";
					ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines = surrealdbWasmEngines;
					document.dispatchEvent(new Event('SurrealDBEnginesLoaded'));
					if (cr) console.log('>>> ||| Done Blueprint Loader >>>>');

				} catch (error) {
					document.querySelector('#debugging').innerHTML += "Failed to import SurrealDB.wasm.<br>";
					ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "FAILED TO LOAD";
					console.error("Failed to import surrealdbWasmEngines.");
				}
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import SurrealDB.js<br>";
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
		// 		document.querySelector('#debugging').innerHTML += "Failed to import MQTT.<br>";
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
