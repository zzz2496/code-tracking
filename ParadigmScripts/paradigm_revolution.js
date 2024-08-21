document.addEventListener('SurrealDBMonitorLoaded', () => {
	console.log('STARTING YGGDRASIL INITIALIZATION');
	let Yggdrasil = {
		"ApplicationStorage": {
			"Realtime": []
		},
		"UserActionLog": [],
		"FormActionLog": []
	};

	ParadigmREVOLUTION.Datastores.Parameters.forEach((param) => {
		Yggdrasil[param.name] = [];
	});

	window.ParadigmREVOLUTION.Yggdrasil = Yggdrasil;

	console.log('Yggdrasil :>> ', Yggdrasil);
	console.log('DONE YGGDRASIL INITIALIZATION');

});
