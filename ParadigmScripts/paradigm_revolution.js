;let cr = true;
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

	window.ParadigmREVOLUTION.Yggdrasil = Yggdrasil;

	console.log('Yggdrasil :>> ', Yggdrasil);
	console.log('DONE YGGDRASIL INITIALIZATION');

	let template__node = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Node));
	window.template__node = template__node;
	let template__node__datastatus = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Template__Node__DataStatus));
	window.template__node__datastatus = template__node__datastatus;
	let template__edge = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Edge));
	window.template__edge = template__edge;

	let informasi_faktur = JSON.parse(JSON.stringify(template__node));
	console.log('informasi_faktur :>> ', informasi_faktur);

	informasi_faktur.Dataset.Schema = {
		"Layout": {
			"Show": 1,
			"Label": "Informasi Faktur",
			"FormLabel": 1,
			"PreviewLabel": 1
		},
		"Schema": {
			"nomor_purchase_order": {
				"label": "Nomor PO",
				"type": "text",
				"form": 1,
				"subtype": "select",
				"select_values":['Lorem','Ipsum','Dolor','Amet']
			},
			"nomor_mesin": {
				"type": "text",
				"form": 1
			},
			"purchase_order": {
				"type": "text",
				"form": 1,
				"readonly": 1
			},
			"id_dealer": {
				"type": "text",
				"form": 1,
				"readonly": 1
			},
			"nama_dealer": {
				"type": "text",
				"form": 1,
				"readonly": 1
			},
			"nomor_faktur": {
				"type": "text",
				"form": 1,
				"value": "FH/CC"
			},
			"tanggal": {
				"type": "timestamp without time zone",
				"form": 1
			}
		}
	}
	let formgen = new ParadigmREVOLUTION.SystemCore.Modules.FormGenerator();
	let str = formgen.GenerateForm('informasi_faktur', informasi_faktur.Dataset.Schema);
	let tstr = `<form>
    <fieldset class="uk-fieldset">

        <legend class="uk-legend">Legend</legend>

        <div class="uk-margin">
            <input class="uk-input" type="text" placeholder="Input" aria-label="Input">
        </div>

        <div class="uk-margin">
            <select class="uk-select" aria-label="Select">
                <option>Option 01</option>
                <option>Option 02</option>
            </select>
        </div>

        <div class="uk-margin">
            <textarea class="uk-textarea" rows="5" placeholder="Textarea" aria-label="Textarea"></textarea>
        </div>

        <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label><input class="uk-radio" type="radio" name="radio2" checked> A</label>
            <label><input class="uk-radio" type="radio" name="radio2"> B</label>
        </div>

        <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label><input class="uk-checkbox" type="checkbox" checked> A</label>
            <label><input class="uk-checkbox" type="checkbox"> B</label>
        </div>

        <div class="uk-margin">
            <input class="uk-range" type="range" value="2" min="0" max="10" step="0.1" aria-label="Range">
        </div>

    </fieldset>
</form>`;
	document.querySelector('#app_container').innerHTML = `<div class="uk-card uk-card-default uk-card-body">${str}</div>`;
	console.log(str);
});

if (cr) console.log('<<< <<< <<< <<< ParadigmREVOLUTION');
