let cr = true;
if (cr) console.log('>>> >>> >>> >>> ParadigmREVOLUTION');

document.addEventListener('UtilitiesLoaded', () => { 
	console.log('>>>>>> check for UtilitiesLoaded in paradigm_revolution.js');
});
document.addEventListener('BlueprintsLoaded', () => { 
	console.log('>>>>>> check for BlueprintsLoaded  in paradigm_revolution.js');
});
document.addEventListener('SurrealDBEnginesLoaded', () => {
	console.log('>>> >>> >>> >>> ||| STARTING YGGDRASIL INITIALIZATION');
	let Yggdrasil = {
		"ApplicationStorage": {
			"ClientForm": []
		},
		"Datastores": ParadigmREVOLUTION.Datastores,
		"UserActionLog": [],
		"FormActionLog": []
	};

	// ParadigmREVOLUTION.Datastores.Parameters.forEach((param) => {
	// 	Yggdrasil.ApplicationStorage[param.name] = [];
	// });

	window.ParadigmREVOLUTION.Yggdrasil = Yggdrasil;

	console.log('Yggdrasil :>> ', Yggdrasil);
	console.log('DONE YGGDRASIL INITIALIZATION');

	let template__node = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Node));
	let template__node__datastatus = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Template__Node__DataStatus));
	window.template__node = template__node;
	window.template__node__datastatus = template__node__datastatus;
});

if (cr) console.log('<<< <<< <<< <<< ParadigmREVOLUTION');
