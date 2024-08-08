console.log('Start Module Loader');

// import { Utility } from "../Classes/Utility.mjs";

// console.log('Utility :>> ', Utility);
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
		"CoreStatus":{
			"Utility": {
				"Status":"NOT LOADED",
				"Icon": "screwdriver-wrench",
				"Label":"Utility",
				"ShortLabel": "UTL"
			},
			"GraphSurface": {
				"Status":"NOT LOADED",
				"Icon": "rectangle-xmark",
				"Label":"GraphSurface",
				"ShortLabel": "GFX"
			},
			"Connection": {
				"Status":"NOT LOADED",
				"Icon": "arrows-left-right-to-line",
				"Label":"Connection",
				"ShortLabel": "CON"
			},
			"WorkerThread": {
				"Status":"NOT LOADED",
				"Icon": "shuffle",
				"Label":"WorkerThread",
				"ShortLabel": "WT"
			},
			"Flowchart": {
				"Status":"NOT LOADED",
				"Icon": "diagram-project",
				"Label":"Flowchart",
				"ShortLabel": "FCH"
			},
			"Surreal": {
				"Status":"NOT LOADED",
				"Icon": "server",
				"Label":"Surreal",
				"ShortLabel": "SDBo"
			},
			"surrealdbWasmEngines": {
				"Status":"NOT LOADED",
				"Icon": "microchip",
				"Label":"surrealdbWasmEngines",
				"ShortLabel": "SDBe"
			},
			"Blueprints": {
				"Status":"NOT LOADED",
				"Icon": "receipt",
				"Label":"Blueprints",
				"ShortLabel": "BPL"
			},
			"SurrealDB": {
				"Status":"NOT LOADED",
				"Icon": "database",
				"Label":"SurrealDB",
				"ShortLabel": "SDB"
			},
		},
		"Modules": {
			"Utility": Utility,
			"GraphSurface": GraphSurface,
			"Connection": Connection,
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
	"Initialization_Status":0
};
// console.log('window.ParadigmREVOLUTION :>> ', window.ParadigmREVOLUTION);
window.ParadigmREVOLUTION = ParadigmREVOLUTION;

(async () => {
    const importPromises = [
        import("../Classes/Utility.mjs"),
        import("../Classes/GraphSurface.mjs"),
        import("../Classes/GraphConnection.mjs"),
        import("../Classes/WorkerThread.mjs"),
        import("../Classes/Flowchart.mjs"),
        import('../../node_modules/surrealdb.js/dist/index.bundled.mjs'),
        import('../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js')
    ];

    const results = await Promise.allSettled(importPromises);

    const [
        UtilityResult,
        GraphSurfaceResult,
        ConnectionResult,
        WorkerThreadResult,
        FlowchartResult,
        SurrealResult,
        SurrealdbWasmEnginesResult
    ] = results;

    const UtilityModule = UtilityResult.status === "fulfilled" ? UtilityResult.value : null;
    const GraphSurfaceModule = GraphSurfaceResult.status === "fulfilled" ? GraphSurfaceResult.value : null;
    const ConnectionModule = ConnectionResult.status === "fulfilled" ? ConnectionResult.value : null;
    const WorkerThreadModule = WorkerThreadResult.status === "fulfilled" ? WorkerThreadResult.value : null;
    const FlowchartModule = FlowchartResult.status === "fulfilled" ? FlowchartResult.value : null;
    const SurrealModule = SurrealResult.status === "fulfilled" ? SurrealResult.value : null;
    const SurrealdbWasmEnginesModule = SurrealdbWasmEnginesResult.status === "fulfilled" ? SurrealdbWasmEnginesResult.value : null;

    if (UtilityModule) {
        const { Utility } = UtilityModule;
        console.log("Utility imported successfully.");
		// Use Utility class
        ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status = "LOADED";
        ParadigmREVOLUTION.SystemCore.Modules.Utility = Utility;
        ParadigmREVOLUTION.Utility = new Utility();
        // Do something with utilityInstance
    } else {
        console.error("Failed to import Utility.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.Utility.Status = "FAILED TO LOAD";
    }

    if (GraphSurfaceModule) {
        const { GraphSurface } = GraphSurfaceModule;
        console.log("GraphSurface imported successfully.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status = "LOADED";
        ParadigmREVOLUTION.SystemCore.Modules.GraphSurface = GraphSurface;
        // Use GraphSurface module
    } else {
        console.error("Failed to import GraphSurface.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.GraphSurface.Status = "FAILED TO LOAD";
    }

    if (ConnectionModule) {
        const { Connection } = ConnectionModule;
        console.log("Connection imported successfully.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.Connection.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.Connection = Connection;
        // Use Connection module
    } else {
        console.error("Failed to import Connection.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.Connection.Status = "FAILED TO LOAD";
    }

    if (WorkerThreadModule) {
        const { WorkerThread } = WorkerThreadModule;
		ParadigmREVOLUTION.SystemCore.CoreStatus.WorkerThread.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.WorkerThread = WorkerThread;
        console.log("WorkerThread imported successfully.");
        // Use WorkerThread module
    } else {
        console.error("Failed to import WorkerThread.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.WorkerThread.Status = "FAILED TO LOAD";
    }

    if (FlowchartModule) {
        const { Flowchart } = FlowchartModule;
        console.log("Flowchart imported successfully.");
		ParadigmREVOLUTION.SystemCore.CoreStatus.Flowchart.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.Flowchart = Flowchart;
        // Use Flowchart module
    } else {
        console.error("Failed to import Flowchart.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.Flowchart.Status = "FAILED TO LOAD";
    }

    if (SurrealModule) {
        const { Surreal } = SurrealModule;
        console.log("Surreal imported successfully.");
		ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.Surreal = Surreal;
        // Use Surreal module
    } else {
        console.error("Failed to import Surreal.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status = "FAILED TO LOAD";
    }

    if (SurrealdbWasmEnginesModule) {
        const { surrealdbWasmEngines } = SurrealdbWasmEnginesModule;
        console.log("surrealdbWasmEngines imported successfully.");
		ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "LOADED";
		ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines = surrealdbWasmEngines;
        // Use surrealdbWasmEngines module
    } else {
        console.error("Failed to import surrealdbWasmEngines.");
        ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status = "FAILED TO LOAD";
    }

    // Execute something else after checking all imports
	console.log('Done Module Loader >>>>');
	document.dispatchEvent(new Event('modulesLoaded'));
})();


