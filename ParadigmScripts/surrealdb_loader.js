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
		console.error('surrealdbWasmEngines Module failed to load. Aborting. (surrealdbWasmEngines Status : ' + ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status + ')');
		document.querySelector('#debugging').innerHTML += "suuraldbWasmEngines Module failed to load. Aborting. (surrealdbWasmEngines Status : " + ParadigmREVOLUTION.SystemCore.CoreStatus.surrealdbWasmEngines.Status + ")<br>";
		return;
	}
	if (ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDBinterface.Status != 'LOADED') {
		console.error('SurrealDBinterface Module failed to load. Aborting. (SurrealDBinterface Status : ' + ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDBinterface.Status + ')');
		document.querySelector('#debugging').innerHTML += "SurrealDBinterface Module failed to load. Aborting. (surrealdbWasmEngines Status : " + ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDBinterface.Status + ")<br>";
		return;
	}

	let SurrealDB = {
		"Memory": {
			"Metadata":{},
			"Instance": null
		},
		"LocalSystemStorage": {
			"Metadata":{},
			"Instance": null
		},
		"LocalDataStorage": {
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
		"LocalSystemStorage": {
			"Metadata": {},
			"Instance": new window.ParadigmREVOLUTION.SystemCore.Modules.Surreal({
				engines: window.ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines()
			})
		},
		"LocalDataStorage": {
			"Metadata": {},
			"Instance": new window.ParadigmREVOLUTION.SystemCore.Modules.Surreal({
				engines: window.ParadigmREVOLUTION.SystemCore.Modules.surrealdbWasmEngines()
			})
		}
	};

	 // NOTE: SURREALDB SUBSECTION - MEMORY INITIALIZATION
	 const initConfigs = [
        { name: 'Memory', label:'Memory Datastore', shortlabel:'MEMD', connect:1, instance: SurrealDB },
        { name: 'LocalSystemStorage', label:'Local System IndexedDB Datastore', shortlabel:'LSD', connect:1, instance: SurrealDB },
        { name: 'LocalDataStorage', label:'Local Data IndexedDB Datastore', shortlabel:'LDD', connect:1, instance: SurrealDB },
        { name: 'TestServer', label:'TestServer Datastore', shortlabel:'TEST', connect:1, instance: SurrealDB },
        // { name: 'BackupServer', label:'BackupServer Datastore', shortlabel:'BCKP', connect:0, instance: SurrealDB },
        // { name: 'ProductionServer', label:'ProductionServer Datastore', shortlabel:'PROD', connect:0, instance: SurrealDB }
	];
	window.ParadigmREVOLUTION.Datastores = {
		Tokens: Tokens,
		Parameters: initConfigs,
		SurrealDB: SurrealDB
	};	

	const promises = initConfigs.map(config => 
		// ParadigmREVOLUTION.Utility.DataStore.SurrealDB.initSurrealDB(
		ParadigmREVOLUTION.SurrealDBinterface.initSurrealDB(
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
