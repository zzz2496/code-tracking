console.log('Start Module Loader');

// import { Utility } from "../Classes/Utility.mjs";
// import { GraphSurface } from "../Classes/GraphSurface.mjs";
// import { Connection} 	from "../Classes/GraphConnection.mjs";
// import { WorkerThread } from "../Classes/WorkerThread.mjs";
// import { Flowchart } 	from "../Classes/Flowchart.mjs";
// import { Surreal } from '../../node_modules/surrealdb.js/dist/index.bundled.mjs';
// import { surrealdbWasmEngines } from '../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js';
// import { Surreal } from '../../paradigm_modules/surrealdb.wasm/dist/full/index.js'; // SurrealDB.wasm v0.9

let Utility, GraphSurface, Connection, WorkerThread, Flowchart, Surreal, surrealdbWasmEngines;

let ParadigmREVOLUTION = {
	"SystemCore": {
		"CoreStatus": {
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
			"Flowchart": {
				"Status": "NOT LOADED",
				"Icon": "diagram-project",
				"Label": "Flowchart",
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
		},
		"Modules": {
			"Utility": Utility,
			"GraphSurface": GraphSurface,
			"Connection": Connection,
			"WorkerThread": WorkerThread,
			"Flowchart": Flowchart,
			"Surreal": Surreal,
			"surrealdbWasmEngines": surrealdbWasmEngines
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

// Assuming Finder attaches something to the global object, you can access it like this:
if (typeof finder !== 'undefined') {
    console.log("FinderJS module loaded successfully.");
	ParadigmREVOLUTION.SystemCore.CoreStatus.FinderJS.Status = "LOADED";
	ParadigmREVOLUTION.SystemCore.Modules.FinderJS = finder;
} else {
	document.querySelector('#debugging').innerHTML += "Failed to load FinderJS.<br>";
	ParadigmREVOLUTION.SystemCore.CoreStatus.FinderJS.Status = "FAILED TO LOAD";
	console.error("Failed to import FinderJS.");
}

(async () => {
	try {
		const UtilityResult = await import("../Classes/Utility.mjs");
		const { Utility } = UtilityResult;
		ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.Utility = Utility;
		ParadigmREVOLUTION.Utility = new Utility();

		console.log('Start Blueprint Loader >>>>');
		let SysUtil = window.ParadigmREVOLUTION.Utility;

		if (ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status == 'LOADED') {
			let initBlueprints = function () {
				SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.SystemCore.Blueprints.URL, function (results) {
					window.ParadigmREVOLUTION.SystemCore.Blueprints.Data = results;
					window.ParadigmREVOLUTION.SystemCore.CoreStatus.Blueprints = "LOADED";
					document.dispatchEvent(new Event('BlueprintsLoaded'));
					console.log('Done Blueprint Loader >>>>');
				}, function (key, url, status) {
					console.log('progress :>> ', status, key, url);
				});
			}
			initBlueprints();
		}
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
				console.log("GraphSurface imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.GraphSurface = GraphSurface;
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
				console.log("Connection imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.Connection.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.Connection = Connection;
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
				console.log("WorkerThread imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.WorkerThread.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.WorkerThread = WorkerThread;
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import WorkerThread.<br>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.WorkerThread.Status = "FAILED TO LOAD";
				console.error("Failed to import WorkerThread.");
			}
		},
		{
			importPromise: import("../Classes/Flowchart.mjs"),
			onSuccess: (module) => {
				const { Flowchart } = module;
				console.log("Flowchart imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.Flowchart.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.Flowchart = Flowchart;
			},
			onFailure: () => {
				document.querySelector('#debugging').innerHTML += "Failed to import Flowchart.<br>";
				ParadigmREVOLUTION.SystemCore.CoreStatus.Flowchart.Status = "FAILED TO LOAD";
				console.error("Failed to import Flowchart.");
			}
		},
		{
			importPromise: import('../../node_modules/surrealdb.js/dist/index.bundled.mjs'),
			onSuccess: async (module) => {
				const { Surreal } = module;
				console.log("Surreal imported successfully.");
				ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status = "LOADED";
				ParadigmREVOLUTION.SystemCore.Modules.Surreal = Surreal;

				try {
					const surrealdbWasmEnginesModule = await import('../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js');
					const { surrealdbWasmEngines } = surrealdbWasmEnginesModule;
					console.log("surrealdbWasmEngines imported successfully.");
					ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "LOADED";
					ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines = surrealdbWasmEngines;

					document.dispatchEvent(new Event('SurrealDBEnginesLoaded'));
					console.log('Done Blueprint Loader >>>>');

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
	];

	for (const handler of moduleHandlers) {
		try {
			const module = await handler.importPromise;
			handler.onSuccess(module);
		} catch (error) {
			handler.onFailure();
		}
	}

	console.log('Done Module Loader >>>>');
})();