import { Utility, GraphSurface, Connection, FlowChart } from "../Classes/CoreClasses.mjs";
import { Surreal } from '../../paradigm_modules/surrealdb.wasm/dist/full/index.js';
// import { Surreal } from "https://unpkg.com/surrealdb.js";

window.ParadigmREVOLUTION = {
	"Modules": {
		"Utility": Utility,
		"GraphSurface": GraphSurface,
		"Connection": Connection,
		"FlowChart": FlowChart,
		"Surreal": Surreal
	},
	"Blueprints": {
		"URL": {
			"API_test": {
				"URL": "http://localhost/testrequest.php",
				"Method": 'GET',
				"Params": { name: 'some name', number: 1234 },
				"ContentType": 'application/json'
			},
			"System": { "URL": "./SystemBlueprint/Blueprint__System.json" },
			"Datastore": { "URL": "./SystemBlueprint/Blueprint__Datastore.json" },
			"Node": { "URL": "./SystemBlueprint/Blueprint__Node.json" },
			"Edge": { "URL": "./SystemBlueprint/Blueprint__Edge.json" },
			"Schema": { "URL": "./SystemBlueprint/Validator__Schema.json" }
		},
		"Data": {}
	}
	
};
console.log('window.ParadigmREVOLUTION :>> ', window.ParadigmREVOLUTION);

document.dispatchEvent(new Event('modulesLoaded'));
