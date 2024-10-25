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
		"001::nomor_purchase_order": {
			"label": "Nomor PO",
			"type": "text",
			"form": 1,
			"subtype": "select",
			"select_values": ['Voluptates', 'dolores', 'qui', 'eum', 'adipisci', 'non', 'ut', 'occaecati', 'Et', 'expedita', 'autem', 'distinctio', 'commodi', 'sapiente', 'Harum', 'et', 'facere', 'non', 'Ipsum', 'laudantium', 'eius', 'dicta', 'consequatur', 'quaerat'],
			"head": "required",
			"tail": "required"
		},
		"002::nomor_mesin": {
			"type": "text",
			"form": 1
		},
		"003::aktif": {
			"type": "boolean",
			"form": 1,
			"value":1
		},
		"0031::hr": {
			"type": "separator",
			"form": 1,
		},
		"004::purchase_order": {
			"type": "text",
			"form": 1,
			"readonly": 0
		},
		"005::id_dealer": {
			"label": "ID Dealer",
			"type": "text",
			"form": 1,
			"readonly": 0,
			"not_empty": 1

		},
		"006::nama_dealer": {
			"type": "text",
			"form": 1,
			"readonly": 0
		},
		"007::nomor_faktur": {
			"type": "text",
			"form": 1,
			"value": "FH/CC"
		},
		"008::tanggal": {
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
		"001::atas_nama": {
			"type": "text",
			"form": 1
		},
		"002::alamat": {
			"type": "textarea",
			"form": 1,
		},
		"003::rt": {
			"label": "RT",
			"type": "text",
			"form": 0
		},
		"004::rw": {
			"label": "RW",
			"type": "text",
			"form": 0
		},
		"005::desa": {
			"type": "text",
			"form": 0
		},
		"006::kelurahan": {
			"type": "text",
			"form": 0
		},
		"007::kecamatan": {
			"type": "text",
			"form": 0
		},
		"008::kabupaten_kota": {
			"label": "Kabupaten / Kota",
			"type": "text",
			"form": 1,
			"subtype": "select"
		},
		"009::SAMSAT": {
			"type": "text",
			"form": 1,
			"readonly": 0
		},
		"010::provinsi": {
			"type": "text",
			"form": 1,
			"readonly": 0
		},
		"011::kebangsaan": {
			"type": "text",
			"form": 1,
			"value": "INDONESIA"
		},
		"012::nomor_ktp_tdp": {
			"label": "Nomor KTP/TDP",
			"type": "text",
			"form": 1
		},
		"013::pekerjaan": {
			"type": "text",
			"form": 1
		},
		"014::nomor_hp": {
			"type": "text",
			"class": "cellphone_input_test",
			"form": 1,
			"string_not_empty": 1
		},
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
		"001::id_type": {
			"label": "ID Type",
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"002::type": {
			"label": "Type",
			"type": "select",
			"form": 1,
			"value": ['Voluptates','dolores','qui','eum','adipisci','non','ut','occaecati','Et','expedita','autem','distinctio','commodi','sapiente','Harum','et','facere','non', 'Ipsum','laudantium','eius','dicta','consequatur','quaerat'],
			"head": "XOM-",
			"tail": "-ZZZ"
		},
		"003::kode_atpm": {
			"label": "Kode ATPM",
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"04::merk": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"005::jenis": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"006::model": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"007::tahun_pembuatan": {
			"type": "number",
			"form": 1,
			"readonly": 1
		},
		"008::isi_silinder": {
			"type": "number",
			"form": 1,
			"readonly": 0,
			"tail": "cc",
			"value": 0
		},
		"009::warna": {
			"type": "text",
			"form": 1
		},
		"010::no_rangka_nik_vin": {
			"label": "Nomor Rangka / NIK / VIN",
			"type": "text",
			"form": 1
		},
		"011::pib": {
			"label": "PIB",
			"type": "text",
			"form": 1
		},
		"012::srut": {
			"label": "SRUT",
			"type": "text",
			"form": 1,
			"value": "SRUT/AJ"
		},
		"013::nomor_mesin": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"014::bahan_bakar": {
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"015::harga": {
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
		"001::formulir_ab": {
			"label": "Formulir A/B",
			"type": "text",
			"form": 1
		},
		"002::pib": {
			"label": "PIB",
			"type": "text",
			"form": 1
		},
		"003::tpt": {
			"label": "TPT",
			"type": "text",
			"form": 1
		},
		"004::sut": {
			"label": "SUT",
			"type": "text",
			"form": 1
		},
		"005::srut": {
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
		"001::keterangan": {
			"type": "textarea",
			"form": 1,
		},
		"002::keterangan2": {
			"type": "textarea",
			"form": 1,
		},
		"003::keterangan3": {
			"type": "textarea",
			"form": 1,
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
		// console.log('form string str :>> ', str);
		// Object.keys(str).forEach((d, i) => {
			// console.log('keys:>', d);
		// })
		let gridstr = ` <section class="hero is-text mb-5">
							<div class="hero-body">
								<p class="title">Transaksi Faktur Kendaraan Bermotor</p>
								<p class="subtitle">Transaksi terima faktur dari Dealer</p>
							</div>
						</section>
						<div class="mb-6">
							<nav class="breadcrumb " aria-label="breadcrumbs">
								<ul>
									<li><a href="#">Bulma</a></li>
									<li><a href="#">Documentation</a></li>
									<li><a href="#">Components</a></li>
									<li class="is-active"><a href="#" aria-current="page">Breadcrumb</a></li>
								</ul>
							</nav>
						</div>
					`; 
		formdata.Dataset.Layout.FormLayout.forEach((d, i) => {
			// gridstr += `<div uk-grid class='uk-grid-match uk-height-match="target: > div > .uk-card" uk-child-width-expand@m uk-child-width-expand@l'>`; // Start a new row for each inner array
			gridstr += `<div class="columns is-1 is-multiline is-centered">`; 
			d.forEach((dd, ii) => {
				gridstr += `
					<div class="column is-flex">
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
		gridstr += `
		<div class="field is-grouped is-grouped-centered">
			<p class="control">
				<button class="button is-primary">
				Konfirmasi
				</button>
			</p>
			<p class="control">
				<a class="button is-light">
				Reset
				</a>
			</p>
		</div>
		`;
		let newElement = document.createElement('div');
		newElement.innerHTML = gridstr;
		
		// console.log(gridstr);
		document.querySelector('#testform').append(newElement);
	})();
	
	let formgen = ParadigmREVOLUTION.Utility.Forms;
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
			<div class="column" style="min-width:400px; max-width:400px; width:400px; padding:1rem;>${gridstr}</div>
		</div>`;
	let t_str = `<div class="column is-1" style="min-width:400px; max-width:400px; width:400px; padding:1rem;">${gridstr}</div>`;
	document.querySelector('#add_form_button').addEventListener('click', () => {
		document.querySelector('#test_helper_form').innerHTML += t_str;
	});
	// ParadigmREVOLUTION.Utility.Forms.initSearchDropdown(document.querySelector('#Element___name'), 'https://rickandmortyapi.com/api/character')
	// ParadigmREVOLUTION.Utility.Forms.initSearchDropdown(document.querySelector('#Element___name'), ['Jaylen', 'Effie', 'Gudrun', 'Bennett', 'Chester']);
});

function makeCol(rows, color) { 
	let str = `<div class="column" style="margin-bottom: 0;width: 400px; max-width: 400px;">`;
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
document.querySelector('#app_graph_container').innerHTML = zstr;
// document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'success');
// document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'default');
document.querySelector('#add_graph_button').addEventListener('click', () => {
	document.querySelector('#test_graph_content').innerHTML += makeCol(5, 'default');
});