let SurrealDB = {
	"Memory": null,
	"IndexedDB": null
};
let Tokens = {};

window.SurrealDB = SurrealDB;
document.addEventListener('BlueprintsLoaded', () => {
	console.log('Starting SurrealDB Initialization!');
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
	async function initSurrealDB(mode = 'Memory', SurrealDB, BlueprintsDATA) {
		let token = mode;
		switch (mode) { 
			case 'Memory':
				try {
					//Initiate MEMORY
					console.info('Start SurrealDB.Memory connection...');
	
					// Connect to the database
					await SurrealDB.Memory.connect('mem://');
					await SurrealDB.Memory.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name});

					//NOTE - CREATE DUMMY DATA 
					let query;
					query = await SurrealDB.Memory.query('create test:data1 content {nama:"Damir"}');
					query = await SurrealDB.Memory.query('create test:data2 content {nama:"Putri"}');
					query = await SurrealDB.Memory.query('create test:data3 content {nama:"Olive"}');
					query = await SurrealDB.Memory.query('create test:data4 content {nama:"Puji"}');
					query = await SurrealDB.Memory.query('create test:data5 content {nama:"Listyono"}');
					// query = await SurrealDB.Memory.query('select * from test');
					// console.log('query', query);
			
					console.info('Done SurrealDB.Memory connection...');
				} catch (e) {
					console.error("ERROR SurrealDB.Memory on initialization, ", e);
				}
				break;
			case 'IndexedDB':
				try {
					//Initiate INDEXEDDB
					console.info('Start SurrealDB.IndexedDB connection...');
					
					// Connect to the database
					await SurrealDB.IndexedDB.connect(`indxdb://${BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name}`, { user: { username: BlueprintsDATA.Datastore.DefaultUser.Username, password: BlueprintsDATA.Datastore.DefaultUser.Password } });
			
					// Select a specific namespace / database
					await SurrealDB.IndexedDB.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name});

					console.info('Done SurrealDB.IndexedDB connection...');
				} catch (e) {
					console.error("ERROR SurrealDB.IndexedDB on initialization, ", e);
				}
				break;
			default:
				try{
					//Initiate TESTSERVER
					console.info('Start SurrealDB.TestServer connection...');

					// Initialize SurrealDB Server Connection subsystem if UNDEFINED
					if (typeof SurrealDB[mode] == "undefined"){
						SurrealDB[mode] = new window.ParadigmREVOLUTION.Modules.Surreal({
							engines: window.ParadigmREVOLUTION.Modules.surrealdbWasmEngines()
						});
					}
					// Connect to the database
					await SurrealDB[mode].connect(BlueprintsDATA.Datastore[mode] , { user: { username: BlueprintsDATA.Datastore.DefaultUser.Username, password: BlueprintsDATA.Datastore.DefaultUser.Password } });
					
					// Select a specific namespace / database
					await SurrealDB[mode].use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name});
					
					// Signin as a namespace, database, or root user
					token = await SurrealDB[mode].signin({
						username: BlueprintsDATA.Datastore.DefaultUser.Username,
						password: BlueprintsDATA.Datastore.DefaultUser.Password,
					});
					
					console.info(`Done SurrealDB.${mode}. connection...`);
				} catch (e) {
					console.error(`ERROR SurrealDB.${mode} on initialization, `, e);
				}
				break;
		}
		return token;
	}

	// NOTE: SURREALDB SUBSECTION - MEMORY INITIALIZATION

	Tokens.Memory = initSurrealDB('Memory', SurrealDB, window.ParadigmREVOLUTION.Blueprints.Data);
	Tokens.IndexedDB = initSurrealDB('IndexedDB', SurrealDB, window.ParadigmREVOLUTION.Blueprints.Data);
	Tokens.TestServer = initSurrealDB('TestServer', SurrealDB, window.ParadigmREVOLUTION.Blueprints.Data);
	// Tokens.BackupServer = initSurrealDB(mode = 'BackupServer', SurrealDB, window.ParadigmREVOLUTION.Blueprints.Data);
	// Tokens.ProductionServer = initSurrealDB(mode = 'ProductionServer', SurrealDB, window.ParadigmREVOLUTION.Blueprints.Data);
	
	document.dispatchEvent(new Event('surrealdbLoaded'));
});