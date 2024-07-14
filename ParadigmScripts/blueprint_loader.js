let SysUtil;
document.addEventListener('modulesLoaded', () => {
	SysUtil = new window.ParadigmREVOLUTION.Modules.Utility();
	
	SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.Blueprints.URL, function (results) {
		window.ParadigmREVOLUTION.Blueprints.Data = results;
		console.log('All requests are done!');
		document.dispatchEvent(new Event('BlueprintsLoaded'));
	}, function(key, url, status){
		console.log('progress :>> ', status, key, url);
	});

	document.getElementById('btn1').addEventListener('click', function(){
		SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.Blueprints.URL, function(results){
			window.ParadigmREVOLUTION.Blueprints.Data = results;
			console.log('All requests are done!');
		}, function(key, url, status){
			console.log('progress :>> ', status, key, url);
		});
	});
	document.getElementById('btn2').addEventListener('click', () => {
		console.log('Checking Datasets');
		console.log('window.ParadigmREVOLUTION.Blueprints.URL :>> ', window.ParadigmREVOLUTION.Blueprints.URL);
		console.log('window.ParadigmREVOLUTION.Blueprints.Data :>> ', window.ParadigmREVOLUTION.Blueprints.Data);
	});
});