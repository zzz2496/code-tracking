let SurrealDB = {
	"Memory": null,
	"IndexedDB": null,
	"TestServer": null,
	"ProductionServer": null,
	"BackupServer": null
};
window.SurrealDB = SurrealDB;
document.addEventListener('BlueprintsLoaded', () => {
	// NOTE: SURREALDB SUBSECTION
	(async () => {
		SurrealDB = {
			"Memory": new window.ParadigmModules.Surreal(),
			"IndexedDB": new window.ParadigmModules.Surreal(),
			"TestServer": new window.ParadigmModules.Surreal(),
			"ProductionServer": new window.ParadigmModules.Surreal(),
			"BackupServer": new window.ParadigmModules.Surreal()
		};
		console.log('SurrealDB :>> ', SurrealDB);
		try {
			//Initiate MEMORY
			console.info('Start SurrealDB.Memory connection...');
			// Connect to the database
			await SurrealDB.Memory.connect('mem://');
			await SurrealDB.Memory.use({ namespace: BlueprintsDATA.Datastore.data.Namespace, database: BlueprintsDATA.Datastore.data.Tables.SystemDB.Name });
	
			let tabletest = await SurrealDB.Memory.query('define table test;');
			console.log('tabletest', tabletest);
	
			let query;
			query = await SurrealDB.Memory.query('create test:data1 content {nama:"Damir"}');
			query = await SurrealDB.Memory.query('create test:data2 content {nama:"Putri"}');
			query = await SurrealDB.Memory.query('create test:data3 content {nama:"Olive"}');
			query = await SurrealDB.Memory.query('create test:data4 content {nama:"Puji"}');
			query = await SurrealDB.Memory.query('create test:data5 content {nama:"Listyono"}');
			query = await SurrealDB.Memory.query('select * from test');
			console.log('query', query);
	
			console.info('Done SurrealDB.Memory connection...');
	
			//Initiate INDEXEDDB
			console.info('Start SurrealDB.IndexedDB connection...');
			// Connect to the database
			await SurrealDB.IndexedDB.connect(`indxdb://${BlueprintsDATA.Datastore.data.Namespace}`, { user: { username: "root", password: "root" } });
			await SurrealDB.IndexedDB.use({ namespace: BlueprintsDATA.Datastore.data.Namespace, database: BlueprintsDATA.Datastore.data.Tables.SystemDB.Name });

			// tabletest = await SurrealDB.IndexedDB.query('define table test;');
			// console.log('tabletest', tabletest);
	
			query = await SurrealDB.IndexedDB.query('create test:data1 content {nama:"Damir"}');
			query = await SurrealDB.IndexedDB.query('create test:data2 content {nama:"Putri"}');
			query = await SurrealDB.IndexedDB.query('create test:data3 content {nama:"Olive"}');
			query = await SurrealDB.IndexedDB.query('create test:data4 content {nama:"Puji"}');
			query = await SurrealDB.IndexedDB.query('create test:data5 content {nama:"Listyono"}');
			query = await SurrealDB.IndexedDB.query('select * from test');
			console.log('query', query);
	
			console.info('Done SurrealDB.IndexedDB IndexedDB connection...');
		} catch (e) {
			console.error("ERROR SurrealDB on initialization, ", e);
		}
	})();

});