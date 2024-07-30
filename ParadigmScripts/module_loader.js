import { Utility } 		from "../Classes/Utility.mjs";
import { GraphSurface } from "../Classes/GraphSurface.mjs";
import { Connection} 	from "../Classes/GraphConnection.mjs";
import { WorkerThread } from "../Classes/WorkerThread.mjs";
import { Flowchart } 	from "../Classes/Flowchart.mjs";

// import { Surreal } from '../../paradigm_modules/surrealdb.wasm/dist/full/index.js';
import { Surreal } from '../../node_modules/surrealdb.js/dist/index.bundled.mjs';
import { surrealdbWasmEngines } from '../../node_modules/surrealdb.wasm/dist/embedded/esm.bundled.js';

let ParadigmREVOLUTION = {
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
	"Datastores": {},
	"Initialization_Status":0
};
// console.log('window.ParadigmREVOLUTION :>> ', window.ParadigmREVOLUTION);
window.ParadigmREVOLUTION = ParadigmREVOLUTION;
console.log('Modules LOADED >>>>');
document.dispatchEvent(new Event('modulesLoaded'));
