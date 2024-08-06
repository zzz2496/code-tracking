document.addEventListener('BlueprintsLoaded', async () => {
	console.log('Start SurrealDB Initialization!');
	let SurrealDB = {
		"Memory": {
			"Metadata":{},
			"Instance": null
		},
		"IndexedDB": {
			"Metadata":{},
			"Instance": null
		}
	};
	let Tokens = {};
	
	window.SurrealDB = SurrealDB;
	
	SurrealDB = {
		"Memory": {
			"Metadata": {},
			"Instance": new window.ParadigmREVOLUTION.Modules.Surreal({
				engines: window.ParadigmREVOLUTION.Modules.surrealdbWasmEngines()
			})
		},
		"IndexedDB": {
			"Metadata": {},
			"Instance": new window.ParadigmREVOLUTION.Modules.Surreal({
				engines: window.ParadigmREVOLUTION.Modules.surrealdbWasmEngines()
			})
		}
		
	};

	 // NOTE: SURREALDB SUBSECTION - MEMORY INITIALIZATION
	 const initConfigs = [
        { name: 'Memory', label:'Memory', shortlabel:'MEMD', connect:1, instance: SurrealDB },
        { name: 'IndexedDB', label:'IndexedDB', shortlabel:'IDXD', connect:1, instance: SurrealDB },
        { name: 'TestServer', label:'TestServer', shortlabel:'TEST', connect:1, instance: SurrealDB },
        { name: 'BackupServer', label:'BackupServer', shortlabel:'BCKP', connect:0, instance: SurrealDB },
        { name: 'ProductionServer', label:'ProductionServer', shortlabel:'PROD', connect:0, instance: SurrealDB }
	];
	window.ParadigmREVOLUTION.Datastores = {
		Tokens: Tokens,
		Parameters: initConfigs,
		SurrealDB: SurrealDB
	};	

    const promises = initConfigs.map(config => 
        ParadigmREVOLUTION.Utility.DataStore.SurrealDB.initSurrealDB(config.name, config.label, config.shortlabel, config.connect, config.instance, window.ParadigmREVOLUTION.Blueprints.Data)
    );

    const results = await Promise.all(promises);

    initConfigs.forEach((config, index) => {
        Tokens[config.name] = results[index];
    });
	
    document.dispatchEvent(new Event('SurrealDBLoaded'));
    console.log('Done SurrealDB Initialization!');
});