let SysUtil;
let Yggdrasil = [];
let BlueprintsDATA = {};
const BlueprintsURL = {
	"API_test": {
		"URL": "http://localhost/testrequest.php",
		"Method": 'GET',
		"Params": { name: 'some name', number: 1234 },
		"ContentType": 'application/json'
	},
	"System": {"URL": "./SystemBlueprint/Blueprint__System.json"},
	"Datastore": {"URL": "./SystemBlueprint/Blueprint__Datastore.json"},
	"Node": {"URL": "./SystemBlueprint/Blueprint__Node.json"},
	"Edge": {"URL": "./SystemBlueprint/Blueprint__Edge.json"},
	"Schema": {"URL": "./SystemBlueprint/Validator__Schema.json"},
};
document.addEventListener('modulesLoaded', () => {
	SysUtil = new window.ParadigmModules.Utility();
	
	SysUtil.Objects.fetchData(BlueprintsURL, function (results) {
		BlueprintsDATA = results;
		console.log('All requests are done!');
		document.dispatchEvent(new Event('BlueprintsLoaded'));
	}, function(key, url, status){
		console.log('progress :>> ', status, key, url);
	});

	document.getElementById('btn1').addEventListener('click', function(){
		SysUtil.Objects.fetchData(BlueprintsURL, function(results){
			BlueprintsDATA = results;
			console.log('All requests are done!');
		}, function(key, url, status){
			console.log('progress :>> ', status, key, url);
		});
	});
	document.getElementById('btn2').addEventListener('click', () => {
		console.log('Checking Datasets');
		console.log('BlueprintsURL :>> ', BlueprintsURL);
		console.log('BlueprintsDATA :>> ', BlueprintsDATA);
	});
});