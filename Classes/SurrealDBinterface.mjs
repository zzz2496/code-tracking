export class SurrealDBinterface {
	constructor(cr) {
	};
	initSurrealDB = async function (mode = 'Memory', Label, ShortLabel, Connect, SurrealDB, BlueprintsDATA, Modules, callback, callbackfailed, cr) {
		let token = mode;
		switch (mode) {
			case 'Memory':
				try {
					//Initiate MEMORY
					if (cr) console.info('Start SurrealDB.Memory connection...');
					if (Connect) {
						// Connect to the database
						SurrealDB.Memory.Metadata = {
							"Name": mode,
							"Label": Label,
							"ShortLabel": ShortLabel,
							"Connect": Connect,
						}
						await SurrealDB.Memory.Instance.connect('mem://');
						await SurrealDB.Memory.Instance.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name });
					} else {
						SurrealDB.Memory.Instance = false;
						if (callbackfailed) callbackfailed('Cannot connect to SurrealDB.Memory');
					}
					if (cr) console.info('Done SurrealDB.Memory connection...');
				} catch (e) {
					console.error("ERROR SurrealDB.Memory on initialization, ", e);
					if (callbackfailed) callbackfailed("ERROR SurrealDB.Memory on initialization, ", e);
				}
				break;
			case 'IndexedDB':
				try {
					//Initiate INDEXEDDB
					if (cr) console.info('Start SurrealDB.IndexedDB connection...');
					if (Connect) {
						// Connect to the database
						SurrealDB.IndexedDB.Metadata = {
							"Name": mode,
							"Label": Label,
							"ShortLabel": ShortLabel,
							"Connect": Connect
						}
						await SurrealDB.IndexedDB.Instance.connect(`indxdb://${BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name}`, { user: { username: BlueprintsDATA.Datastore.DefaultUser.Username, password: BlueprintsDATA.Datastore.DefaultUser.Password } });

						// Select a specific namespace / database
						await SurrealDB.IndexedDB.Instance.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name });
					} else {
						SurrealDB.IndexedDB.Instance = false;
						if (callbackfailed) callbackfailed('Cannot connect to SurrealDB.IndexedDB');

					}
					if (cr) console.info('Done SurrealDB.IndexedDB connection...');
				} catch (e) {
					console.error("ERROR SurrealDB.IndexedDB on initialization, ", e);
					if (callbackfailed) callbackfailed("ERROR SurrealDB.IndexedDB on initialization, ", e);
				}
				break;
			default:
				try {
					//Initiate TESTSERVER
					if (cr) console.info('Start SurrealDB.TestServer connection...');
					if (Connect) {
						// Initialize SurrealDB Server Connection subsystem if UNDEFINED
						if (typeof SurrealDB[mode] == "undefined") {

							SurrealDB[mode] = {
								"Metadata": {
									"Name": mode,
									"Label": Label,
									"ShortLabel": ShortLabel,
									"Connect": Connect,
									"ConnectionInfo": [
										BlueprintsDATA.Datastore[mode],
										{
											user: {
												username: BlueprintsDATA.Datastore.DefaultUser.Username,
												password: BlueprintsDATA.Datastore.DefaultUser.Password
											}
										}
									],
									"NSDB": {
										namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name,
										database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name
									}


								},
								"Instance": new Modules.Surreal({
									engines: Modules.surrealdbWasmEngines()
								})
							}
						}
						// Connect to the database
						await SurrealDB[mode].Instance.connect(...SurrealDB[mode].Metadata.ConnectionInfo);

						// Select a specific namespace / database
						await SurrealDB[mode].Instance.use(SurrealDB[mode].Metadata.NSDB);

						// Signin as a namespace, database, or root user
						token = await SurrealDB[mode].Instance.signin({
							username: BlueprintsDATA.Datastore.DefaultUser.Username,
							password: BlueprintsDATA.Datastore.DefaultUser.Password,
						});
					} else {
						SurrealDB[mode] = {
							"Metadata": {
								"Name": mode,
								"Label": Label,
								"ShortLabel": ShortLabel,
								"Connect": Connect
							},
							"Instance": false
						};
						if (callbackfailed) callbackfailed('Cannot connect to SurrealDB.' + mode);
					}
					if (cr) console.info(`Done SurrealDB.${mode}. connection...`);
				} catch (e) {
					console.error(`ERROR SurrealDB.${mode} on initialization, `, e);
					if (callbackfailed) callbackfailed(`ERROR SurrealDB.${mode} on initialization, `, e);
				}
				break;
		}
		return token;
	};
	InitializeLiveQuery = function (from, action, result, callback) {
		console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Start Live Query from ${from} <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
		console.log('Live Query action:', action);
		console.log('Live Query result:', result);
		console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Done Live Query from ${from} <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
		if (callback) callback();
	};
}