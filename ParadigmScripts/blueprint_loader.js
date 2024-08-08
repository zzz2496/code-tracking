document.addEventListener('modulesLoaded', () => {
	console.log('Start Blueprint Loader >>>>');
	let SysUtil = window.ParadigmREVOLUTION.Utility;
	let initBlueprints = function(){
		SysUtil.Objects.fetchData(window.ParadigmREVOLUTION.SystemCore.Blueprints.URL, function (results) {
			window.ParadigmREVOLUTION.SystemCore.Blueprints.Data = results;
			window.ParadigmREVOLUTION.SystemCore.CoreStatus.Blueprints = "LOADED";
			document.dispatchEvent(new Event('BlueprintsLoaded'));
			console.log('Done Blueprint Loader >>>>');
		}, function(key, url, status){
			console.log('progress :>> ', status, key, url);
		});
	}
	initBlueprints();
});