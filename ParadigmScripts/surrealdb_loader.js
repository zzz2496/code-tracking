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
	
			//NOTE - CREATE TABLE
			let tabletest = await SurrealDB.Memory.query('define table test;');
			console.log('tabletest', tabletest);
	
			let query;
			//NOTE - CREATE DUMMY DATA 
			query = await SurrealDB.Memory.query('create test:data1 content {nama:"Damir"}');
			query = await SurrealDB.Memory.query('create test:data2 content {nama:"Putri"}');
			query = await SurrealDB.Memory.query('create test:data3 content {nama:"Olive"}');
			query = await SurrealDB.Memory.query('create test:data4 content {nama:"Puji"}');
			query = await SurrealDB.Memory.query('create test:data5 content {nama:"Listyono"}');
			query = await SurrealDB.Memory.query('select * from test');
			console.log('query', query);
	
			console.info('Done SurrealDB.Memory connection...');
	
			// ------------------------------------------------------------------------------
			//Initiate INDEXEDDB
			console.info('Start SurrealDB.IndexedDB connection...');
			// Connect to the database
			await SurrealDB.IndexedDB.connect(`indxdb://${BlueprintsDATA.Datastore.data.Namespace}`, { user: { username: BlueprintsDATA.DefaultUser.Username, password: BlueprintsDATA.DefaultUser.Username } });
			
			// Select a specific namespace / database
			await SurrealDB.IndexedDB.use({ namespace: BlueprintsDATA.Datastore.data.Namespace, database: BlueprintsDATA.Datastore.data.Tables.SystemDB.Name });
			
			// Signin as a namespace, database, or root user
			const tokenIndexedDB = await SurrealDB.IndexedDB.signin({
				username: BlueprintsDATA.DefaultUser.Username,
				password: BlueprintsDATA.DefaultUser.Password,
			});
			
			let infokv = await SurrealDB.IndexedDB.query('info for kv;');

			// tabletest = await SurrealDB.IndexedDB.query('define table test;');
			// console.log('tabletest', tabletest);
	
			// query = await SurrealDB.IndexedDB.query('create test:data1 content {nama:"Damir"}');
			// query = await SurrealDB.IndexedDB.query('create test:data2 content {nama:"Putri"}');
			// query = await SurrealDB.IndexedDB.query('create test:data3 content {nama:"Olive"}');
			// query = await SurrealDB.IndexedDB.query('create test:data4 content {nama:"Puji"}');
			// query = await SurrealDB.IndexedDB.query('create test:data5 content {nama:"Listyono"}');
			// query = await SurrealDB.IndexedDB.query('select * from test');
			// console.log('query', query);
	
			console.info('Done SurrealDB.IndexedDB IndexedDB connection...');

			// ------------------------------------------------------------------------------
			//Initiate TESTSERVER/*  */
			console.info('Start SurrealDB.TestServer connection...');
			// Connect to the database
			await SurrealDB.TestServer.connect(`ws://localhost:8080`, { user: { username: BlueprintsDATA.DefaultUser.Username, password: BlueprintsDATA.DefaultUser.Password } });
			
			// Select a specific namespace / database
			await SurrealDB.TestServer.use({ namespace: BlueprintsDATA.Datastore.data.Namespace, database: BlueprintsDATA.Datastore.data.Tables.SystemDB.Name });
			
			// Signin as a namespace, database, or root user
			tokenTestServer = await SurrealDB.TestServer.signin({
				username: BlueprintsDATA.DefaultUser.Username,
				password: BlueprintsDATA.DefaultUser.Password,
			});
			console.log('tokenTestServer :>> ', tokenTestServer);
			
			infokv = await SurrealDB.TestServer.query('info for kv;');

			// tabletest = await SurrealDB.TestServer.query('define table test;');
			// console.log('tabletest', tabletest);/*  */
	
			// query = await SurrealDB.TestServer.query('create test:data1 content {nama:BlueprintsDATA.DefaultUser.Username}');
			// query = await SurrealDB.TestServer.query('create test:data2 content {nama:"Putri"}');
			// query = await SurrealDB.TestServer.query('create test:data3 content {nama:"Olive"}');
			// query = await SurrealDB.TestServer.query('create test:data4 content {nama:"Puji"}');
			// query = await SurrealDB.TestServer.query('create test:data5 content {nama:"Listyono"}');
			// query = await SurrealDB.TestServer.query('select * from test');
			// console.log('query', query);
	
			console.info('Done SurrealDB.TestServer connection...');

		} catch (e) {
			console.error("ERROR SurrealDB on initialization, ", e);
		}
	})();

});