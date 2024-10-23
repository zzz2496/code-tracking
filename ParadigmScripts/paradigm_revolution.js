; let cr = true;
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
			"type": "array",
			"form": 1,
			"subtype": "select",
			"select_values": ["text", "number", "boolean", "select", "textarea", "button", "separator"]
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
			"select_values": ['Voluptates','dolores','qui','eum','adipisci','non','ut','occaecati','Et','expedita','autem','distinctio','commodi','sapiente','Harum','et','facere','non', 'Ipsum','laudantium','eius','dicta','consequatur','quaerat'],
		},
		"add_element": {
			"label":"Add Element",
			"type": "button",
			"form":1
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
		PropertyOrder: ['informasi_faktur', 'identitas_pemilik', 'identitas_kendaraan', 'data_pendukung', 'keterangan'],
		FormLayout: [
			[
				'informasi_faktur',
			],
			[
				'identitas_kendaraan',
				'identitas_pemilik',
			],
			[
				'data_pendukung'
			],
			[
				'keterangan'
			]
		]
	}
	form.Dataset.Schema.informasi_faktur.Properties.Chain.Head = true;
	form.Dataset.Schema.informasi_faktur.Dataset.Layout = {
		"Form": {
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
	
	form.Dataset.Schema.informasi_faktur.Dataset.Schema = {
		"nomor_purchase_order": {
			"label": "Nomor PO",
			"type": "text",
			"form": 1,
			"subtype": "select",
			"select_values": ['Voluptates','dolores','qui','eum','adipisci','non','ut','occaecati','Et','expedita','autem','distinctio','commodi','sapiente','Harum','et','facere','non', 'Ipsum','laudantium','eius','dicta','consequatur','quaerat']
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
			"label": "ID Dealer",
			"type": "text",
			"form": 1,
			"readonly": 1,
			"not_empty": 1

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

	form.Dataset.Schema.identitas_pemilik.Dataset.Layout = {
		"Form": {
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
	form.Dataset.Schema.identitas_pemilik.Dataset.Schema = {
		"atas_nama": {
			"type": "text",
			"form": 1
		},
		"alamat": {
			"type": "text",
			"form": 1,
			"subtype": "textarea"
		},
		"rt": {
			"label": "RT",
			"type": "text",
			"form": 0
		},
		"rw": {
			"label": "RW",
			"type": "text",
			"form": 0
		},
		"desa": {
			"type": "text",
			"form": 0
		},
		"kelurahan": {
			"type": "text",
			"form": 0
		},
		"kecamatan": {
			"type": "text",
			"form": 0
		},
		"kabupaten_kota": {
			"label": "Kabupaten/Kota",
			"type": "text",
			"form": 1,
			"subtype": "select"
		},
		"SAMSAT": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"provinsi": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"kebangsaan": {
			"type": "text",
			"form": 1,
			"value": "INDONESIA"
		},
		"nomor_ktp_tdp": {
			"label": "Nomor KTP/TDP",
			"type": "text",
			"form": 1
		},
		"pekerjaan": {
			"type": "text",
			"form": 1
		},
		"hp": {
			"type": "text",
			"class": "cellphone_input_test",
			"form": 1,
			"string_not_empty": 1
		}

	}

	form.Dataset.Schema.identitas_kendaraan.Dataset.Layout = {
		"Form": {
			"Show": 1,
			"Label": "Identitas Kendaraan",
			"ShowLabel": 1,
		},
		"Preview": {
			"Show": 1,
			"Label": "Identitas Kendaraan",
			"ShowLabel": 1,
		}
	}
	form.Dataset.Schema.identitas_kendaraan.Dataset.Schema = {
		"id_type": {
			"label": "ID Type",
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"type": {
			"type": "text",
			"form": 1,
			"subtype": "select",
			"select_values": ['Voluptates','dolores','qui','eum','adipisci','non','ut','occaecati','Et','expedita','autem','distinctio','commodi','sapiente','Harum','et','facere','non', 'Ipsum','laudantium','eius','dicta','consequatur','quaerat']
		},
		"kode_atpm": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"merk": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"jenis": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"model": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"tahun_pembuatan": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"isi_silinder": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"warna": {
			"type": "text",
			"form": 1
		},
		"no_rangka_nik_vin": {
			"label": "No. Rangka/NIK/VIN",
			"type": "text",
			"form": 1
		},
		"pib": {
			"label": "PIB",
			"type": "text",
			"form": 1
		},
		"srut": {
			"label": "SRUT",
			"type": "text",
			"form": 1,
			"value": "SRUT/AJ"
		},
		"nomor_mesin": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"bahan_bakar": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"harga": {
			"type": "numeric",
			"form": 0,
			"tail": "IDR"
		}

	}

	form.Dataset.Schema.data_pendukung.Dataset.Layout = {
		"Form": {
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
	form.Dataset.Schema.data_pendukung.Dataset.Schema = {
		"formulir_ab": {
			"label": "Formulir A/B",
			"type": "text",
			"form": 1
		},
		"pib": {
			"label": "PIB",
			"type": "text",
			"form": 1
		},
		"tpt": {
			"label": "TPT",
			"type": "text",
			"form": 1
		},
		"sut": {
			"label": "SUT",
			"type": "text",
			"form": 1
		},
		"srut": {
			"label": "SRUT",
			"type": "text",
			"form": 1,
			"value": "SRUT/AJ"
		}
	}

	form.Dataset.Schema.keterangan.Dataset.Layout = {
		"Form": {
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
	form.Dataset.Schema.keterangan.Dataset.Schema = {
		"keterangan": {
			"type": "text",
			"form": 1,
			"subtype": "textarea"
		},
		"keterangan2": {
			"type": "text",
			"form": 1,
			"subtype": "textarea"
		},
		"keterangan3": {
			"type": "text",
			"form": 1,
			"subtype": "textarea"
		}
	}

	window.form = form;

	console.log('form :>> ', form);
	let ram_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.Memory;
	let local_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.IndexedDB;
	let test_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.TestServer;

	window.ram_db = ram_db;
	window.local_db = local_db;
	window.test_db = test_db;

	let suql = ParadigmREVOLUTION.Utility.DataStore.SurrealDB.SurrealQL;
	window.suql = suql;


	let qstr = {
		"string": "begin transaction;\n\n",
		"array":['begin transaction']
	};
	for (let index = 1; index <= 5; index++) {
		let q = `create test:{ "DocumentType": "TFKB", "Version": 1, "DocumentID":${index}} content ${JSON.stringify(form)};`;
		qstr.string += q+"\n\n";
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

	(async () => {
		await ram_db.Instance.connect('mem://');
		let formgen = ParadigmREVOLUTION.Utility.Forms;
		let formdata = await ram_db.Instance.query(`select * from test where id.DocumentType contains 'TFKB' order by id`);
		let str = {};
		formdata = formdata[0][0];
		console.log('formdata :>> ', formdata);
		formdata.Dataset.Layout.PropertyOrder.forEach((d, i) => {			
			str[d] = formgen.GenerateForm(d, formdata.Dataset.Schema[d].Dataset.Schema);
		});
		console.log('form string str :>> ', str);
		Object.keys(str).forEach((d, i) => {
			console.log('keys:>', d);
		})
		let gridstr = ''; 
		formdata.Dataset.Layout.FormLayout.forEach((d, i) => {
			// gridstr += `<div uk-grid class='uk-grid-match uk-height-match="target: > div > .uk-card" uk-child-width-expand@m uk-child-width-expand@l'>`; // Start a new row for each inner array
			gridstr += `<div class="columns is-1 is-multiline is-centered">`; 
			d.forEach((dd, ii) => {
				gridstr += `
					<div class="column ${d.length == 1 ? 'is-10 is-variable ':''} is-flex">
						<div class="card is-flex-grow-1">
							<div class="card-header">
								<div class="card-header-icon">
									<i class="fa fa-tv"></i>
								</div>
								<div class="card-header-title">
									<h3 class="has-text-weight-bold">${ParadigmREVOLUTION.Utility.Strings.ReadableUCWords(dd)}</h3>
								</div>
							</div>
							<div class="card-content">
								<div class="content">
									${str[dd]}
									
								</div>
							</div>
						</div>
					</div>
				`;
			});
			gridstr += '</div>'; // Close the row
		});
		// console.log(gridstr);
		document.querySelector('#testform').innerHTML = gridstr;	
	})();
	
	let formgen = new ParadigmREVOLUTION.SystemCore.Modules.FormGenerator();
	let str = {};
	let gridstr = ''; 

	str = {};
	let formdata = makeForm;
	console.log('formdata :>> ', formdata);
	formdata.Dataset.Layout.PropertyOrder.forEach((d, i) => {			
		str[d] = formgen.GenerateForm(d, formdata.Dataset.Schema[d].Dataset.Schema);
	});
	console.log('form string str :>> ', str);
	Object.keys(str).forEach((d, i) => {
		console.log('keys:>', d);
	})
	gridstr = ''; 
	formdata.Dataset.Layout.FormLayout.forEach((d, i) => {
		// gridstr += `<div uk-grid class='uk-grid-match uk-height-match="target: > div > .uk-card" uk-child-width-expand@m uk-child-width-expand@l'>`; // Start a new row for each inner array
		gridstr += `<div class="">`; 
		d.forEach((dd, ii) => {
			gridstr += `
				<div class="section p-1">
					<div class="card">
						<div class="card-header">
							<div class="card-header-icon">
								<i class="fa fa-tv"></i>
							</div>
							<div class="card-header-title">
								<h3 class="has-text-weight-bold">${ParadigmREVOLUTION.Utility.Strings.ReadableUCWords(dd)}</h3>
							</div>
						</div>
						<div class="card-content">
							<div class="content">
								${str[dd]}
								
							</div>
						</div>
					</div>
				</div>
			`;
		});
		gridstr += '</div>'; // Close the row
});
	gridstr += ''; // Close the row
	// document.querySelector('#formGenerator').innerHTML = gridstr;
	document.querySelector('#app_helper').innerHTML = `
		<div class="columns is-mobile is-gapless" id="test_helper_form">
			<div class="column" style="min-width:400px; width:400px; padding:1rem;>${gridstr}</div>
		</div>`;
	let t_str = `<div class="column is-1" style="min-width:400px; width:400px; padding:1rem;">${gridstr}</div>`;
	document.querySelector('#add_form_button').addEventListener('click', () => {
		document.querySelector('#test_helper_form').innerHTML += t_str;
	});
	ParadigmREVOLUTION.Utility.Forms.initSearchDropdown(document.querySelector('#Element___name'), 'https://rickandmortyapi.com/api/character')
	// ParadigmREVOLUTION.Utility.Forms.initSearchDropdown(document.querySelector('#Element___name'), ['Jaylen', 'Effie', 'Gudrun', 'Bennett', 'Chester']);
});

function makeCol(rows, color) { 
	let str = `<div class="column" style="margin-bottom: 0;min-width: 400px;">`;
	for (let i = 1; i <=rows; i++) {
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
let zstr = `<div id="test_graph_content" class="columns is-gapless is-mobile grid2020-background" style="width:20000px; height:20000px;">Test graph content</div>`;
// document.querySelector('#app_helper').innerHTML = zstr;
document.querySelector('#graph_container').innerHTML = zstr;
// document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'success');
// document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'default');
document.querySelector('#add_graph_button').addEventListener('click', () => {
	document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'default');
});