document.addEventListener('BlueprintsLoaded', async () => {
	console.log('Start SurrealDB Initialization!');
	let SurrealDB = {
		"Memory": null,
		"IndexedDB": null
	};
	let Tokens = {};
	
	window.SurrealDB = SurrealDB;
	
	SurrealDB = {
		"Memory": new window.ParadigmREVOLUTION.Modules.Surreal({
			engines: window.ParadigmREVOLUTION.Modules.surrealdbWasmEngines()
		}),
		"IndexedDB": new window.ParadigmREVOLUTION.Modules.Surreal({
			engines: window.ParadigmREVOLUTION.Modules.surrealdbWasmEngines()
		})
	};
	window.ParadigmREVOLUTION.Datastores = {
		Tokens: Tokens,
		SurrealDB: SurrealDB
	};	

	 // NOTE: SURREALDB SUBSECTION - MEMORY INITIALIZATION
	 const initConfigs = [
        { name: 'Memory', instance: SurrealDB },
        { name: 'IndexedDB', instance: SurrealDB },
        { name: 'TestServer', instance: SurrealDB },
        // { name: 'BackupServer', instance: SurrealDB },
        // { name: 'ProductionServer', instance: SurrealDB }
    ];

    const promises = initConfigs.map(config => 
        ParadigmREVOLUTION.Utility.DataStore.SurrealDB.initSurrealDB(config.name, config.instance, window.ParadigmREVOLUTION.Blueprints.Data)
    );

    const results = await Promise.all(promises);

    initConfigs.forEach((config, index) => {
        Tokens[config.name] = results[index];
    });

    document.dispatchEvent(new Event('SurrealDBLoaded'));
    console.log('Done SurrealDB Initialization!');
});