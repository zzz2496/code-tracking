; let cr = true;
if (cr) console.log('>>> >>> >>> >>> ParadigmREVOLUTION');

document.addEventListener('UtilitiesLoaded', () => {
	console.log('>>>>>> check for UtilitiesLoaded in paradigm_revolution.js');
	(() => {
		ParadigmREVOLUTION.Utility.DOMComponents.addGlobalEventListener('keyup', '.text_input', (e) => {
			e.target.value = ParadigmREVOLUTION.Utility.Strings.SafeString(e.target.value);
			e.target.dataset.textinput = 'initialized';
		}, document.querySelector('#testform'));
		ParadigmREVOLUTION.Utility.DOMComponents.addGlobalEventListener('keyup', '.number_input', (e) => {
			e.target.value = ParadigmREVOLUTION.Utility.Numbers.ThousandSeparator(e.target.value.replace(/[^0-9\.\-]/gmi, ''), '.');
			e.target.dataset.numberinput = 'initialized';
		}, document.querySelector('#testform'));
		ParadigmREVOLUTION.Utility.DOMComponents.addGlobalEventListener('keyup', '.number_input', (e) => {
			// Clear any previous timer
			clearTimeout(e.target.debounceTimeout);
	
			// Set a new timer for 0.5 seconds
			e.target.debounceTimeout = setTimeout(() => {
				e.target.value = ParadigmREVOLUTION.Utility.Numbers.ThousandSeparator(
					e.target.value.replace(/[^0-9\.\-]/g, ''), // Remove non-numeric characters except '.' and '-'
					'.'
				);
				e.target.dataset.numberinput = 'initialized';
			}, 500);
		}, document.querySelector('#testform'));
		ParadigmREVOLUTION.Utility.DOMComponents.addGlobalEventListener('focusin', '.text_select', (e) => {
			console.log('init text_select');
			if (e.target.dataset.textselectinput !== 'initialized') {
				console.log('id >>>>', e.target.id.split('___'));
				ParadigmREVOLUTION.Utility.Forms.initSearchDropdown(e.target, JSON.parse(e.target.dataset.selectValues));
				e.target.dataset.textselectinput = 'initialized';
			}
		});
	
	
// Process chain as provided
let chain = [
	{
		"id": "P1",
		"input": {
			"a": [1, 2, 3],
		},
		"process": "add",
		"output": null,
		"next_process": "P2"
	},
	{
		"id": "P2",
		"input": {
			"a": ["P1.output", 3],
		},
		"process": "subtract",
		"output": null,
		"next_process": "P3"
	},
	{
		"id": "P3",
		"input": {
			"a": ["P2.output", 5],  // Dynamic reference as a string for later evaluation
		},
		"process": "multiply",
		"output": null,
		"next_process": "P4"
	},
	{
		"id": "P4",
		"input": {
			"a": "P3.output"
		},
		"process": "store",
		"output": null,
		"next_process": null
	}
		];
		window.chain = chain;

		let flow = new ParadigmREVOLUTION.SystemCore.Modules.Flow(ParadigmREVOLUTION.Utility.BasicMath, chain);
		window.flow = flow;
		flow.executeChain();
// Process function lookup table
// const processFunctions = ParadigmREVOLUTION.Utility.BasicMath;

// // Helper to get input values, resolving dynamic references
// function resolveInput(input, chain) {
// 	let resolvedInput = {};
// 	for (let key in input) {
// 		let value = input[key];

// 		if (Array.isArray(value)) {
// 			// If the value is an array, resolve each element in it
// 			resolvedInput[key] = value.map(item => {
// 				if (typeof item === "string" && item.includes(".output")) {
// 					let processId = item.split(".")[0];
// 					let processItem = chain.find(item => item.id === processId);
// 					return processItem ? processItem.output : null;
// 				}
// 				return item;  // Return literal value if no resolution needed
// 			});
// 		} else if (typeof value === "string" && value.includes(".output")) {
// 			// If it's a string and references an output, resolve it
// 			let processId = value.split(".")[0];
// 			let processItem = chain.find(item => item.id === processId);
// 			resolvedInput[key] = processItem ? processItem.output : null;
// 		} else {
// 			// Otherwise, use the value as-is
// 			resolvedInput[key] = value;
// 		}
// 	}
// 	return resolvedInput;
// }

// // Function to execute the chain
// function executeChain(chain) {
// 	let currentProcess = chain.find(item => item.id === "P1");

// 	while (currentProcess) {
// 		// Resolve inputs
// 		const resolvedInput = resolveInput(currentProcess.input, chain);

// 		// Execute the process
// 		const processFunc = processFunctions[currentProcess.process];
// 		if (processFunc) {
// 			// Pass resolved inputs to the function using spread syntax
// 			const output = processFunc(...Object.values(resolvedInput));
// 			currentProcess.output = output;
// 			console.log(`Process ${currentProcess.id} executed. Output:`, output);
// 		} else {
// 			console.error(`Process function ${currentProcess.process} not found`);
// 			break;
// 		}

// 		// Move to the next process
// 		if (currentProcess.next_process) {
// 			currentProcess = chain.find(item => item.id === currentProcess.next_process);
// 		} else {
// 			currentProcess = null; // End of chain
// 		}
// 	}
// }

// // Run the execution chain
// executeChain(chain);

		// $('.text_input').keyup(function (e) {
		//     $(this).val(convert_to_safe_string($(this).val()));
		// });
		// $('.list_input').keyup(function (e) {
		//     $(this).val(convert_to_safe_string_with_newline($(this).val()));
		// });
		// // $('.no_telepon_input').unbind('mask');
		// if ($('.landline_phone_input').length > 0) {
		// 	$('.landline_phone_input').mask("(999)999-99999999", { selectOnFocus: true });
		// }
		// if ($('.cellphone_input').length > 0) {
		// 	$('.cellphone_input').mask("099-99999999999", { selectOnFocus: true });
		// }
		// if ($('.cellphone_input_test').length > 0) {
		// 	$('.cellphone_input_test').mask('Z9999999999999', {
		//         translation: {
		//         	'Z': {
		//             	pattern: /[0]/
		//     		}
		//         }
		//     });
		// }
		// if ($('.chart_of_accounts_input').length > 0) {
		// 	$('.chart_of_accounts_input').mask("99999-99", { selectOnFocus: true });
		// }
	
		// // $('.numeric_input').mask('0,000,000,000', { reverse: true, selectOnFocus: true });
		// // $('.numeric_input').css({ 'text-align': 'right' });
		// // if ($(".numeric_input").next().hasClass('form-control-feedback')) {
		// // 	$(".numeric_input").next().prev().css({ 'padding-right': '50px' });
		// // }
		// $('.numeric_input').mask('0,000,000,000', { reverse: true, selectOnFocus: true });
		// $('.numeric_input').css({ 'text-align': 'right' });
		// if ($(".numeric_input").next().hasClass('form-control-feedback')) {
		// 	$(".numeric_input").next().prev().css({ 'padding-right': '50px' });
		// }
		// $('.numeric_input').keyup(function(){
		//     if ($(this).val().toString().length == 0){
		//         $(this).val(0);
		//         $(this).focus();
		//         $(this).select();
		//     }
		// });
		// $('.plat_nomor_input').mask('0000', { reverse: true, selectOnFocus: true });
		// $('.nopol_input').mask('SZ 0XXX ZZZ', { selectOnFocus: true, translation: {
		//         A: {pattern: /[A-Z0-9]/},
		//         E: {pattern: /[A-Z0-9]/, optional: true},
		//         S: {pattern: /[A-Z]/},
		//         Z: {pattern: /[A-Z]/, optional: true},
		//         Y: {pattern: /[0-9]/},
		//         X: {pattern: /[0-9]/, optional: true}
		//     }
		// });
		// $('.plat_nomor_input').css({ 'text-align': 'right' });
		// if ($(".plat_nomor_input").next().hasClass('form-control-feedback')) {
		//     $(".plat_nomor_input").next().prev().css({ 'padding-right': '50px' });
		// }
		// $('.plat_nomor_input').keyup(function(){
		//     if ($(this).val().toString().length == 0){
		//         $(this).val(0);
		//         $(this).focus();
		//         $(this).select();
		//     }
		// });
	
		// $('.hierarki_input').mask('99-99-99-99-99-99');
		// $('.numeric_comma_input').mask('0,000,000,000.00', { reverse: true, selectOnFocus: true });
		// $('.numeric_comma_input').css({ 'text-align': 'right' });
		// if ($(".numeric_comma_input").next().hasClass('form-control-feedback')) {
		// 	$(".numeric_comma_input").next().prev().css({ 'padding-right': '50px' });
		// }
		// $('.numeric_comma_input').keyup(function(){
		//     if ($(this).val().toString().length == 0) $(this).val(0);
		// });
		// $('.numeric_comma4_input').mask('0,000,000,000.0000', { reverse: true, selectOnFocus: true });
		// $('.numeric_comma4_input').css({ 'text-align': 'right' });
		// if ($(".numeric_comma4_input").next().hasClass('form-control-feedback')) {
		// 	$(".numeric_comma4_input").next().prev().css({ 'padding-right': '50px' });
		// }
		// $('.numeric_comma4_input').keyup(function(){
		//     if ($(this).val().toString().length == 0) $(this).val(0);
		// });
		// // $('.datetime_input').daterangepicker(initDatePicker());
		// // $('.daterange_input').daterangepicker(initDateRangePicker());
		// $('.datetime_input').each(function () {
		// 	$(this)[ 0 ].readonly = true;
		// })
		// $('.datetime_input').datetimepicker({
		// 	locale: 'id',
		// 	showTodayButton: true,
		// 	format: 'DD/MM/YYYY'
		// });
		// $('.time_input').datetimepicker({
		//     locale: 'id',
		//     // showTodayButton: true,
		//     format: 'LT'
		// });
		// $('.datetime_input').each(function () {
		// 	$(this)[ 0 ].readonly = true;
		// })
		// $('.daterange_input').datetimepicker();
		// $('[data-toggle="popover"]').popover({
		// 	html: true
		// });
		// $('.bpkb_input').focusout(function(){
		//     console.log('masuk debug bpkb_input');
		//     var str = $(this).val();
		//     if ((str[1] == '-')&&(str[3] == '-')){
		//         str = $(this).val().replace(/\-/gmi, '');
		//         $(this).val(str.substr(1, str.length-1));
		//     }else if ((str[1] == '-')&&(str.indexOf(' ') !== -1)){
		//         str = $(this).val().replace(/\-/gmi, '');
		//         $(this).val(str.split(' ')[0]);
		//     }//asdfasde
		// });
	})();
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

	let ram_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.Memory;
	let local_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.IndexedDB;
	let test_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.TestServer;


	let makeForm = JSON.parse(JSON.stringify(template__node));

	makeForm.Dataset.Schema = {
		Dataset_Definition: JSON.parse(JSON.stringify(template__node)),
		Element: JSON.parse(JSON.stringify(template__node)),
		Layout: JSON.parse(JSON.stringify(template__node))
	}

	makeForm.Dataset.Layout = {
		PropertyOrder: ['Dataset_Definition', 'Element', 'Layout'],
		FormLayout: [
			[
				'Dataset_Definition',
				'Element',
				'Layout',
			],
		]
	}

	makeForm.Dataset.Schema.Dataset_Definition.Dataset.Layout = {
		"Form": {
			"Show": 1,
			"Label": "Dataset Definition",
			"ShowLabel": 1,
		},
		"Preview": {
			"Show": 1,
			"Label": "Dataset Definition",
			"ShowLabel": 1,
		}
	}

	makeForm.Dataset.Schema.Element.Dataset.Layout = {
		"Form": {
			"Show": 1,
			"Label": "Element",
			"ShowLabel": 1,
		},
		"Preview": {
			"Show": 1,
			"Label": "Element",
			"ShowLabel": 1,
		}
	}

	makeForm.Dataset.Schema.Layout.Dataset.Layout = {
		"Form": {
			"Show": 1,
			"Label": "Layout",
			"ShowLabel": 1,
		},
		"Preview": {
			"Show": 1,
			"Label": "Layout",
			"ShowLabel": 1,
		}
	}
	makeForm.Dataset.Schema.Dataset_Definition.Dataset.Schema = {
		"name": {
			"label": "Nama",
			"type": "text",
			"form": 1,
		},
		"label": {
			"label": "Label",
			"type": "text",
			"form": 1,
		},
		"form": {
			"label": "Form",
			"type": "boolean",
			"form": 1,
		}
	}
	makeForm.Dataset.Schema.Element.Dataset.Schema = {
		"name": {
			"label": "Nama",
			"type": "text",
			"form": 1,
		},
		"label": {
			"label": "Label",
			"type": "text",
			"form": 1,
		},
		"type": {
			"label": "Type",
			"type": "select",
			"form": 1,
			"value": ["text", "number", "boolean", "select", "textarea", "button", "separator"],
			"head": "XOM-",
			"tail": "-ZZZ"
		},
		"form": {
			"label": "Form",
			"type": "boolean",
			"form": 1,
		},
		"value": {
			"label": "Value",
			"type": "text",
			"form": 1,
		},
		"readonly": {
			"label": "Readonly",
			"type": "boolean",
			"form": 1,
		},
		"value": {
			"label": "Value",
			"type": "text",
			"form": 1,
		},
		"subtype": {
			"label": "Subtype",
			"type": "array",
			"form": 1,
			"subtype": "select",
			"select_values": ["select", "textarea"]
		},
		"select_values": {
			"label": "Select Values",
			"type": "array",
			"form": 1,
			"select_values": ['Voluptates', 'dolores', 'qui', 'eum', 'adipisci', 'non', 'ut', 'occaecati', 'Et', 'expedita', 'autem', 'distinctio', 'commodi', 'sapiente', 'Harum', 'et', 'facere', 'non', 'Ipsum', 'laudantium', 'eius', 'dicta', 'consequatur', 'quaerat'],
		},
		"add_element": {
			"label": "Add Element",
			"type": "button",
			"form": 1
		}
	}
	makeForm.Dataset.Schema.Layout.Dataset.Schema = {
		"add_new_line": {
			"label": "Add New Line",
			"type": "button",
			"form": 1,
		}
	}



	let form = JSON.parse(JSON.stringify(template__node));
	form.Dataset.Schema = {
		informasi_faktur: JSON.parse(JSON.stringify(template__node)),
		identitas_pemilik: JSON.parse(JSON.stringify(template__node)),
		identitas_kendaraan: JSON.parse(JSON.stringify(template__node)),
		data_pendukung: JSON.parse(JSON.stringify(template__node)),
		keterangan: JSON.parse(JSON.stringify(template__node))
	}

	form.Dataset.Layout = {
		Form: {"comment": "ROOT Form Container", "tag": "div", "class": "", "id": "form_root_container", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": []},
		Preview: {"comment": "ROOT Preview Container", "tag": "div", "class": "", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": []},
	}

	let testcard1 = ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Elements.Box({
		id: "Form Box", 
		className: "", 
		content: [ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Layout.Hero({
			id: "Form Hero",
			className: "is-link",
			title: "Transaksi Terima Faktur Kendaraan Bermotor",
			subtitle: "Terima faktur dari Dealer",
		})],
	});
	console.log('form.Dataset.Layout.Form :>> ', form.Dataset.Layout.Form);
	form.Dataset.Layout.Form.content = [testcard1];
	console.log('testcard1 :>> ', testcard1);
	testcard1 = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(testcard1);
	console.log('testcard1 :>> ', testcard1);
	
	
	form.Dataset.Schema = [
		{
			"id": "informasi_faktur",
			"type": "record", //record or array >>> array of records
			"icon": `<li class="fa fa-tv"></li>`,
			"order": 100,
			"Dataset": {
				"Layout": {
					"Form": {},
					"Properties": {
						"FormEntry": {
							"Show": 1,
							"Label": "Informasi Faktur",
							"ShowLabel": 1,
						},
						"Preview": {
							"Show": 1,
							"Label": "Informasi Faktur",
							"ShowLabel": 1,
						}
					}
				},
				"Schema": [{
					"id": "nomor_purchase_order",
					"label": "Nomor PO",
					"type": "text_select",
					"form": 1,
					"value": ['Voluptates', 'dolores', 'qui', 'eum', 'adipisci', 'non', 'ut', 'occaecati', 'Et', 'expedita', 'autem', 'distinctio', 'commodi', 'sapiente', 'Harum', 'et', 'facere', 'non', 'Ipsum', 'laudantium', 'eius', 'dicta', 'consequatur', 'quaerat'],
					"head": {
						"type": "select", //input/select/label
						"value": 'Mata Uang', //string or array
						"append_to_value": 1,
						"readonly":0
					},
					"tail": {
						"type": "label", //input/select/label
						"value": ['Waaa', 'Wiii', 'Wuuu', 'Weee', 'Wooo'], //string or array
						"append_to_value": 1,
						"readonly":0
					}
				},
				{
					"id": "nomor_mesin",
					"type": "number",
					"form": 1
				},
				{
					"id": "aktif",
					"type": "boolean",
					"form": 1,
					"value": 1
				},
				{
					"id": "hr",
					"type": "separator",
					"form": 1,
				},
				{
					"id": "purchase_order",
					"type": "select",
					"form": 1,
					"value": ["Sed", "atque", "suscipit", "Consequatur", "ipsum", "cum", "quia", "mollitia", "et", "rerum", "inventore", "occaecati", "molestias.", "Velit", "reprehenderit", "voluptatum", "ut", "hic", "rerum.", "Natus", "perferendis", "laboriosam", "omnis.", "Dolor", "voluptatem", "et", "eligendi", "ducimus.", "Omnis", "ratione", "enim", "et", "quis", "consequatur", "quia", "voluptatum", "ut."],
					"head": {
						"type": "label", //input/select/label
						"value": 'PO/', //string or array
						"append_to_value": 1,
						"readonly":0
					},
					"tail": {
						"type": "label", //input/select/label
						"value": ['XX', 'YY', 'ZZ'], //string or array
						"append_to_value": 1,
						"readonly":0
					},
					"readonly": 0
				},
				{
					"id": "id_dealer",
					"label": "ID Dealer",
					"type": "text",
					"form": 1,
					"readonly": 0,
					"not_empty": 1

				},
				{
					"id": "nama_dealer",
					"type": "text",
					"form": 1,
					"readonly": 0
				},
				{
					"id": "nomor_faktur",
					"type": "text",
					"form": 1,
					"value": "FH/CC"
				},
				{
					"id": "tanggal",
					"type": "timestamp without time zone",
					"form": 1
				},
				{
					"id": "add",
					"label":"",
					"class": "is-link",
					"type": "button",
					"form": 1
				}]
			}
		}, {
			"id": "identitas_pemilik",
			"type": "record",
			"icon": `<li class="fa fa-person"></li>`,
			"order": 200,
			"Dataset": {
				"Layout": {
					"Form": {},
					"Properties": {
						"FormEntry": {
							"Show": 1,
							"Label": "Identitas Pemilik",
							"ShowLabel": 1,
						},
						"Preview": {
							"Show": 1,
							"Label": "Identitas Pemilik",
							"ShowLabel": 1,
						}
					}
				},
				"Schema": [
					{
						"id": "atas_nama",
						"type": "text",
						"form": 1
					},
					{
						"id": "alamat",
						"type": "textarea",
						"form": 1,
					},
					{
						"id": "rt",
						"label": "RT",
						"type": "text",
						"form": 0
					},
					{
						"id": "rw",
						"label": "RW",
						"type": "text",
						"form": 0
					},
					{
						"id": "desa",
						"type": "text",
						"form": 0
					},
					{
						"id": "kelurahan",
						"type": "text",
						"form": 0
					},
					{
						"id": "kecamatan",
						"type": "text",
						"form": 0
					},
					{
						"id": "kabupaten_kota",
						"label": "Kabupaten / Kota",
						"type": "text",
						"form": 1,
						"subtype": "select"
					},
					{
						"id": "samsat",
						"label": "SAMSAT",
						"type": "text",
						"form": 1,
						"readonly": 0
					},
					{
						"id": "provinsi",
						"type": "text",
						"form": 1,
						"readonly": 0
					},
					{
						"id": "kebangsaan",
						"type": "text",
						"form": 1,
						"value": "INDONESIA"
					},
					{
						"id": "nomor_ktp_tdp",
						"label": "Nomor KTP/TDP",
						"type": "text",
						"form": 1
					},
					{
						"id": "pekerjaan",
						"type": "text",
						"form": 1
					},
					{
						"id": "nomor_hp",
						"type": "text",
						"class": "cellphone_input_test",
						"form": 1,
						"string_not_empty": 1
					}
				]
			}
		}, {
			"id": "identitas_kendaraan",
			"icon": `<li class="fa fa-motorcycle"></li>/<li class="fa fa-car"></li>`,
			"type": "record",
			"order": 300,
			"Dataset": {
				"Layout": {
					"Form": {},
					"Properties": {
						"FormEntry": {
							"Show": 1,
							"Label": "Indentitas Kendaraan",
							"ShowLabel": 1,
						},
						"Preview": {
							"Show": 1,
							"Label": "Indentitas Kendaraan",
							"ShowLabel": 1,
						}
					}
				},
				"Schema": [
					{
						"id": "id_type",
						"label": "ID Type",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "type",
						"label": "Type",
						"type": "select",
						"form": 1,
						"value": ['Voluptates', 'dolores', 'qui', 'eum', 'adipisci', 'non', 'ut', 'occaecati', 'Et', 'expedita', 'autem', 'distinctio', 'commodi', 'sapiente', 'Harum', 'et', 'facere', 'non', 'Ipsum', 'laudantium', 'eius', 'dicta', 'consequatur', 'quaerat'],
						"head": {
							"type": "label", //input/select/label
							"value": 'FH/CC', //string or array
							"append_to_value": 1,
							"readonly":0
						},
					},
					{
						"id": "kode_atpm",
						"label": "Kode ATPM",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "merk",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "jenis",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "model",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "tahun_pembuatan",
						"type": "number",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "isi_silinder",
						"type": "number",
						"form": 1,
						"readonly": 0,
						"tail": {
							"type": "label", //input/select/label
							"value": "cc", //string or array
							"append_to_value": 1,
							"readonly":0
						},
						"value": 0
					},
					{
						"id": "warna",
						"type": "text",
						"form": 1
					},
					{
						"id": "no_rangka_nik_vin",
						"label": "Nomor Rangka / NIK / VIN",
						"type": "text",
						"form": 1
					},
					{
						"id": "pib",
						"label": "PIB",
						"type": "text",
						"form": 1
					},
					{
						"id": "srut",
						"label": "SRUT",
						"type": "text",
						"form": 1,
						"value": "SRUT/AJ"
					},
					{
						"id": "nomor_mesin",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "bahan_bakar",
						"type": "text",
						"form": 1,
						"readonly": 1
					},
					{
						"id": "harga",
						"type": "numeric",
						"form": 0,
						"tail": "IDR"
					}
				]
			}
		}, {
			"id": "data_pendukung",
			"icon": `<li class="fa fa-headset"></li>`,
			"type": "record",
			"order": 400,
			"Dataset": {
				"Layout": {
					"Form": {},
					"Properties": {
						"FormEntry": {
							"Show": 1,
							"Label": "Data Pendukung",
							"ShowLabel": 1,
						},
						"Preview": {
							"Show": 1,
							"Label": "Data Pendukung",
							"ShowLabel": 1,
						}
					}
				},
				"Schema": [
					{
						"id": "formulir_ab",
						"label": "Formulir A/B",
						"type": "text",
						"form": 1
					},
					{
						"id": "pib",
						"label": "PIB",
						"type": "text",
						"form": 1
					},
					{
						"id": "tpt",
						"label": "TPT",
						"type": "text",
						"form": 1
					},
					{
						"id": "sut",
						"label": "SUT",
						"type": "text",
						"form": 1
					},
					{
						"id": "srut",
						"label": "SRUT",
						"type": "text",
						"form": 1,
						"value": "SRUT/AJ"
					}
				]
			}
		}, {
			"id": "keterangan",
			"type": "record",
			"icon": `<li class="fa fa-clipboard"></li>`,
			"order": 500,
			"Dataset": {
				"Layout": {
					"Form": {},
					"Properties": {
						"FormEntry": {
							"Show": 1,
							"Label": "Keterangan",
							"ShowLabel": 1,
						},
						"Preview": {
							"Show": 1,
							"Label": "Keterangan",
							"ShowLabel": 1,
						}
					}
				},
				"Schema": [
					{
						"id": "keterangan",
						"type": "textarea",
						"form": 1,
					},
					{
						"id": "keterangan2",
						"type": "textarea",
						"form": 1,
					},
					{
						"id": "keterangan3",
						"type": "textarea",
						"form": 1,
					}
				]
			}
		}
	]
	window.form = form;

	console.log('form :>> ', form);

	window.ram_db = ram_db;
	window.local_db = local_db;
	window.test_db = test_db;

	let suql = ParadigmREVOLUTION.Utility.DataStore.SurrealDB.SurrealQL;
	window.suql = suql;


	let qstr = {
		"string": "begin transaction;\n\n",
		"array": ['begin transaction']
	};
	for (let index = 1; index <= 5; index++) {
		let q = `create test:{ "DocumentType": "TFKB", "Version": 1, "DocumentID":${index}} content ${JSON.stringify(form)};`;
		qstr.string += q + "\n\n";
		qstr.array.push(q);
	};
	qstr.string += 'commit transaction;';
	qstr.array.push('commit transaction;');


	(async () => {
		if (qstr != "") {
			console.log('query :>> ', qstr);

			console.log('Insert into RAM DB');
			await ram_db.Instance.connect('mem://');
			await ram_db.Instance.query(qstr.string);

			// console.log('Insert into TEST DB');
			// await test_db.Instance.connect(test_db.Metadata.ConnectionInfo[0]);
			// await test_db.Instance.signin(test_db.Metadata.ConnectionInfo[1].user);

			// await test_db.Instance.use(test_db.Metadata.NSDB);
			// await test_db.Instance.query(qstr);
		}

	})();

	// (async () => {
	// 	await ram_db.Instance.connect('mem://');
	// 	let formgen = ParadigmREVOLUTION.Utility.Forms;
	// 	let formdata = await ram_db.Instance.query(`select * from test where id.DocumentType contains 'TFKB' order by id`);
	// 	let str = {};
	// 	formdata = formdata[0][0];
	// 	console.log('formdata :>> ', formdata);
	// 	formdata.Dataset.Layout.PropertyOrder.forEach((d, i) => {			
	// 		str[d] = formgen.GenerateFormArray(d, formdata.Dataset.Schema[d].Dataset.Schema);
	// 	});
	// 	console.log('form string str :>> ', str);
	// 	Object.keys(str).forEach((d, i) => {
	// 		console.log('keys:>', d);
	// 	})
	// 	let gridstr = ` 
	// 					<div class="box">
	// 						<section class="hero is-link m-0 p-0">
	// 							<div class="hero-body">
	// 								<p class="title">Transaksi Faktur Kendaraan Bermotor</p>
	// 								<p class="subtitle">Transaksi terima faktur dari Dealer</p>
	// 							</div>
	// 						</section>
	// 						<div class="mb-4 mt-2">
	// 							<nav class="breadcrumb is-pulled-right" aria-label="breadcrumbs">
	// 								<ul>
	// 									<li><a href="#">Bulma</a></li>
	// 									<li><a href="#">Documentation</a></li>
	// 									<li><a href="#">Components</a></li>
	// 									<li class="is-active"><a href="#" aria-current="page">Breadcrumb</a></li>
	// 								</ul>
	// 							</nav>
	// 						</div>
	// 					</div>
	// 				`;
	// 	// document.querySelector('#testform').innerHTML += gridstr;
	// 	formdata.Dataset.Layout.FormLayout.forEach((d, i) => {
	// 		// gridstr += `<div uk-grid class='uk-grid-match uk-height-match="target: > div > .uk-card" uk-child-width-expand@m uk-child-width-expand@l'>`; // Start a new row for each inner array
	// 		gridstr += `<div class="columns is-1 is-multiline is-centered">`;
	// 		d.forEach((dd, ii) => {
	// 			gridstr += `
	// 				<div class="column is-flex">
	// 					<div class="card is-flex-grow-1">
	// 						<div class="card-header">
	// 							<div class="card-header-icon">
	// 								<i class="fa fa-tv"></i>
	// 							</div>
	// 							<div class="card-header-title">
	// 								<h3 class="has-text-weight-bold">${ParadigmREVOLUTION.Utility.Strings.ReadableUCWords(dd)}</h3>
	// 							</div>
	// 						</div>
	// 						<div class="card-content">
	// 							<div class="content">
	// 								${str[dd]}

	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			`;
	// 		});
	// 		gridstr += '</div>'; // Close the row
	// 	});

	// 	gridstr += `
	// 	<div class="field is-grouped is-grouped-centered">
	// 		<p class="control">
	// 			<button class="button is-primary">
	// 			Konfirmasi
	// 			</button>
	// 		</p>
	// 		<p class="control">
	// 			<a class="button is-light">
	// 			Reset
	// 			</a>
	// 		</p>
	// 	</div>
	// 	`;
	// 	let newElement = document.createElement('div');
	// 	newElement.innerHTML = gridstr;

	// 	// console.log(gridstr);
	// 	// document.querySelector('#testform').append(newElement);
	// })();

	let formgen = ParadigmREVOLUTION.Utility.Forms;
	// let str = [];
	let gridstr = '';

	// form.Dataset.Schema.forEach((d, i) => {
	// 	str.push(formgen.GenerateFormArray(d.id, d.Dataset.Schema));
	// });
	// console.log('str :>> ', str);

	// let formstr = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(form.Dataset.Layout.Form);
	// document.querySelector('#testform').innerHTML = formstr;

	let row = {
		"comment": "Columns", "tag": "div", "class": "columns is-centered is-gapless is-mobile is-flesx", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [
			{ "comment": "Column", "tag": "div", "class": "column", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [] },
		]
	};
	let cardstr ;

	let testcard = ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Components.Card({
		id: "informasi_faktur", 
		order: 0,
		style: "width:100%;",
		headerIcon: form.Dataset.Schema[0].icon,
		header: form.Dataset.Schema[0].Dataset.Layout.Properties.Preview.Label, 
		content: formgen.GenerateFormArray(form.Dataset.Schema[0].id, form.Dataset.Schema[0].Dataset.Schema)
	});
	row.content[0].innerHTML = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(testcard);
	form.Dataset.Layout.Form.content.push(row);
	let formstr = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(form.Dataset.Layout.Form);


	row = {
		"comment": "Columns", "tag": "div", "class": "columns is-gapless is-flesx", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [
		{ "comment": "Column", "tag": "div", "class": "column is-flex", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [] },
		{ "comment": "Column", "tag": "div", "class": "column is-flex", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [] }
	] }

	testcard = ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Components.Card({
		id: "identitas_pemilik", 
		class: "is-flex-grow-1", 
		style: "width:100%;", 
		order: 0, 
		headerIcon: form.Dataset.Schema[1].icon, 
		header: form.Dataset.Schema[1].Dataset.Layout.Properties.Preview.Label, 
		content: formgen.GenerateFormArray(form.Dataset.Schema[1].id, form.Dataset.Schema[1].Dataset.Schema)
	});
	cardstr = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(testcard);
	row.content[0].innerHTML += cardstr;

	testcard = ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Components.Card({
		id: "identitas_kendaraan", 
		class: "is-flex-grow-1", 
		style: "width:100%;", 
		order: 1, 
		headerIcon: form.Dataset.Schema[2].icon, 
		header: form.Dataset.Schema[2].Dataset.Layout.Properties.Preview.Label, 
		content: formgen.GenerateFormArray(form.Dataset.Schema[2].id, form.Dataset.Schema[2].Dataset.Schema)
	});
	
	cardstr = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(testcard);
	row.content[1].innerHTML += cardstr;
	form.Dataset.Layout.Form.content.push(row);

	// document.querySelector('#testform').innerHTML += ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(row);

	row = {
		"comment": "Columns", "tag": "div", "class": "columns is-gapless is-mobile is-flex is-centered", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [
		{ "comment": "Column", "tag": "div", "class": "column is-flex", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [] },
	] }
	testcard = ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Components.Card({
		id: "data_pendukung", 
		class: "is-flex-grow-1", 
		style: "width:100%;", 
		order: 2, 
		headerIcon: form.Dataset.Schema[3].icon, 
		header: form.Dataset.Schema[3].Dataset.Layout.Properties.Preview.Label, 
		content: formgen.GenerateFormArray(form.Dataset.Schema[3].id, form.Dataset.Schema[3].Dataset.Schema)
	});
	cardstr = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(testcard);
	row.content[0].innerHTML += cardstr;
	form.Dataset.Layout.Form.content.push(row);

	row = {
		"comment": "Columns", "tag": "div", "class": "columns is-gapless is-mobile is-flex is-centered", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [
		{ "comment": "Column", "tag": "div", "class": "column is-flex", "id": "", "style": "", "href": "", "data": {}, "aria": {}, "order": 0, "innerHTML": "", "content": [] },
	] }
	testcard = ParadigmREVOLUTION.Utility.DOMComponents.BulmaCSS.Components.Card({
		id: "keterangan", 
		class: "is-flex-grow-1", 
		style: "width:100%;", 
		order: 2, 
		headerIcon: form.Dataset.Schema[4].icon, 
		header: form.Dataset.Schema[4].Dataset.Layout.Properties.Preview.Label, 
		content: formgen.GenerateFormArray(form.Dataset.Schema[4].id, form.Dataset.Schema[4].Dataset.Schema)
	});
	cardstr = ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(testcard);
	row.content[0].innerHTML += cardstr;
	form.Dataset.Layout.Form.content.push(row);
	// console.log('form.Dataset.Layout.Form :>> ', form.Dataset.Layout.Form);
	document.querySelector('#testform').innerHTML += ParadigmREVOLUTION.Utility.DOMComponents.traverseDOMProxyOBJ(form.Dataset.Layout.Form);
});

function makeCol(rows, color) {
	let str = `<div class="column" style="margin-bottom: 0;width: 400px; max-width: 400px;">`;
	for (let i = 1; i <= rows; i++) {
		str += `<div class="card has-background-${color}">
					<div class="card-header">
						Card header
					</div>
					<div class="card-content">
						This is a card &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</div>
				</div>`;
	}
	str += `</div>`;
	return str;
}

if (cr) console.log('<<< <<< <<< <<< ParadigmREVOLUTION');
// let zstr = `<div id="test_graph_content" class="columns is-gapless is-mobile has-background-primary" style="background: var(--has-background-primary-light);"></div>`;
// document.querySelector('#app_helper').innerHTML = zstr;
// document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'success');
// document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'default');
document.querySelector('#add_graph_button').addEventListener('click', () => {
	document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'default');
});
document.querySelector('#add_form_button').addEventListener('click', () => {
	document.querySelector('#app_helper').innerHTML += makeCol(5, 'default');
});