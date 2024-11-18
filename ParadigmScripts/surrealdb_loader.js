let cr = false;
if (cr) console.log('>>> >>> SurrealDB Loader');
document.addEventListener('SurrealDBEnginesLoaded', async () => {
	if (cr) console.log('Start SurrealDB Initialization!');

	if (ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status != 'LOADED') {
		console.error('SurrealDB Module failed to load. Aborting. (SurrealDB Status : ' + ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status + ')');
		document.querySelector('#debugging').innerHTML += "SurrealDB Module failed to load. Aborting. (SurrealDB Status : " + ParadigmREVOLUTION.SystemCore.CoreStatus.Surreal.Status + ")<br>";
		return;
	}
	if (ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status != 'LOADED') {
		console.error('suuraldbWasmEngines Module failed to load. Aborting. (surrealdbWasmEngines Status : ' + ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status + ')');
		document.querySelector('#debugging').innerHTML += "suuraldbWasmEngines Module failed to load. Aborting. (surrealdbWasmEngines Status : " + ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status + ")<br>";
		return;
	}

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
			"Instance": new window.ParadigmREVOLUTION.SystemCore.Modules.Surreal({
				engines: window.ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines()
			})
		},
		"IndexedDB": {
			"Metadata": {},
			"Instance": new window.ParadigmREVOLUTION.SystemCore.Modules.Surreal({
				engines: window.ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines()
			})
		}
	};

	 // NOTE: SURREALDB SUBSECTION - MEMORY INITIALIZATION
	 const initConfigs = [
        { name: 'Memory', label:'Memory Datastore', shortlabel:'MEMD', connect:1, instance: SurrealDB },
        { name: 'IndexedDB', label:'IndexedDB Datastore', shortlabel:'IDXD', connect:1, instance: SurrealDB },
        { name: 'TestServer', label:'TestServer Datastore', shortlabel:'TEST', connect:1, instance: SurrealDB },
        // { name: 'BackupServer', label:'BackupServer Datastore', shortlabel:'BCKP', connect:0, instance: SurrealDB },
        // { name: 'ProductionServer', label:'ProductionServer Datastore', shortlabel:'PROD', connect:0, instance: SurrealDB }
	];
	window.ParadigmREVOLUTION.Datastores = {
		Tokens: Tokens,
		Parameters: initConfigs,
		SurrealDB: SurrealDB
	};	

	// window.ParadigmREVOLUTION.GraphSurface.GraphElement.controlPalette.querySelector('#datastore_status').innerHTML = 'Loading...';

	// function detectDatastoreStatus() { 
	// 	let datastore_status = '';
	// 	Object.entries(window.ParadigmREVOLUTION.Datastores.SurrealDB).forEach(([idx, entry]) => {
	// 		if (entry.Instance == false) { 
	// 			datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-disabled" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>` ;
	// 		} else if (typeof entry.Instance.connection != "undefined") {
	// 			datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-success" value="${idx}" title="${entry.Metadata.Label} CONNECTED">${entry.Metadata.ShortLabel}</button>` ;
	// 		} else {
	// 			datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-danger" value="${idx}" title="${entry.Metadata.Label} DISCONNECTED">${entry.Metadata.ShortLabel}</button>` ;
	// 		}
	// 	});
	// 	return datastore_status;
	// }

    const promises = initConfigs.map(config => 
		ParadigmREVOLUTION.Utility.DataStore.SurrealDB.initSurrealDB(
			config.name,
			config.label,
			config.shortlabel,
			config.connect,
			config.instance,
			window.ParadigmREVOLUTION.SystemCore.Blueprints.Data,
			window.ParadigmREVOLUTION.SystemCore.Modules,
			() => {},
			(error_message) => { },
			cr
		)
    );

    const results = await Promise.all(promises);

    initConfigs.forEach((config, index) => {
        Tokens[config.name] = results[index];
    });
	window.ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDB.Status = "LOADED";
    document.dispatchEvent(new Event('SurrealDBLoaded'));
    if (cr) console.log('Done SurrealDB Initialization!');
});
if (cr) console.log('<<< <<< SurrealDB Loader');
