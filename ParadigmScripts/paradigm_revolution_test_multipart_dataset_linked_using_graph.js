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

	let form = {
		form_schema: {
			informasi_faktur: JSON.parse(JSON.stringify(template__node)),
			identitas_pemilik: JSON.parse(JSON.stringify(template__node)),
			identitas_kendaraan: JSON.parse(JSON.stringify(template__node)),
			data_pendukung: JSON.parse(JSON.stringify(template__node)),
			keterangan: JSON.parse(JSON.stringify(template__node))
		},
		form_data: {
			informasi_faktur: {},
			identitas_pemilik: {},
			identitas_kendaraan: {},
			data_pendukung: {},
			keterangan: {}
		}
	};

	form.form_schema.informasi_faktur.Properties.Chain.Head = true;
	form.form_schema.informasi_faktur.Dataset.Layout = {
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
	form.form_schema.informasi_faktur.Dataset.Schema = {
		"nomor_purchase_order": {
			"label": "Nomor PO",
			"type": "text",
			"form": 1,
			"subtype": "select",
			"select_values": ['Lorem', 'Ipsum', 'Dolor', 'Amet']
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

	form.form_schema.identitas_pemilik.Dataset.Layout = {
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
	form.form_schema.identitas_pemilik.Dataset.Schema = {
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

	form.form_schema.identitas_kendaraan.Dataset.Layout = {
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
	form.form_schema.identitas_kendaraan.Dataset.Schema = {
		"id_type": {
			"label": "ID Type",
			"type": "text",
			"form": 1,
			"readonly": 1
		},
		"type": {
			"type": "text",
			"form": 1,
			"subtype": "select"
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

	form.form_schema.data_pendukung.Dataset.Layout = {
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
	form.form_schema.data_pendukung.Dataset.Schema = {
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

	form.form_schema.keterangan.Dataset.Layout = {
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
	form.form_schema.keterangan.Dataset.Schema = {
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
	let form_layout = [
		[
			form.form_schema.informasi_faktur
		],
		[
			form.form_schema.identitas_pemilik,
			form.form_schema.identitas_kendaraan
		],
		[
			form.form_schema.data_pendukung
		],
		[
			form.form_schema.keterangan
		]
	];

	console.log('form :>> ', form);
	let ram_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.Memory;
	let local_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.IndexedDB;
	let test_db = ParadigmREVOLUTION.Yggdrasil.Datastores.SurrealDB.TestServer;

	window.ram_db = ram_db;
	window.local_db = local_db;
	window.test_db = test_db;


	let form_schema_keys = Object.keys(form.form_schema);
	// console.log('form_schema_keys :>> ', form_schema_keys);

	let qstr = "";

	for (let index = 1; index <= 5; index++) {
		Object.keys(form.form_schema).forEach((d, i) => {
			let pid = `TFKB/V${ParadigmREVOLUTION.Utility.Numbers.Pad(index, 4)}`;

			form.form_schema[d].Properties.PID = pid;
			form.form_schema[d].Properties.Chain.ID = `CHAIN/${pid}`;
			form.form_schema[d].Properties.Chain.Segment = d;
			form.form_schema[d].Properties.Chain.SegmentOrder = i;

			let q = `create test:\`${pid}/${i}-${d}\` content ${JSON.stringify(form.form_schema[d])};`;
			qstr += q;
			if (i > 0) {
				let q_relate = `relate test:\`${pid}/${i - 1}-${form_schema_keys[i - 1]}\`->edge->test:\`${pid}/${i}-${d}\` content ${JSON.stringify(template__edge)};`;
				qstr += q_relate;
			}
		});
	}
	(async () => {
		if (qstr != "") {
			console.log('query :>> ', qstr);

			console.log('Insert into RAM DB');
			await ram_db.Instance.connect('mem://');
			await ram_db.Instance.query(qstr);

			// console.log('Insert into TEST DB');
			// await test_db.Instance.connect(test_db.Metadata.ConnectionInfo[0]);
			// await test_db.Instance.signin(test_db.Metadata.ConnectionInfo[1].user);

			// await test_db.Instance.use(test_db.Metadata.NSDB);
			// await test_db.Instance.query(qstr);
		}

	})();

	let formgen = new ParadigmREVOLUTION.SystemCore.Modules.FormGenerator();
	let str = {};
	ram_db.Instance.connect('mem://')
		.then(() => ram_db.Instance.query(`select * from test where Properties.PID contains 'TFKB/V0001' order by id`))
		.then(data => {
			form.form_schema = data[0];
			console.log('form.form_schema :>> ', form.form_schema);
			form.form_schema.forEach((d, i) => {
				// console.log('d :>> ', d.Properties.Chain.Segment);
				// str[d.Properties.Chain.Segment] = formgen.GenerateForm('informasi_faktur', d.Dataset.Schema);
				let tstr = formgen.GenerateForm(d.Properties.Chain.Segment, d.Dataset.Schema);
				// console.log('d.Dataset.Schema :>> ', d.Dataset.Schema);
				// console.log('tstr :>> ', tstr);
				str[d.Properties.Chain.Segment] = '';
			});
			console.log('str :>> ', str);
			// select id, Properties, Dataset, (fn::traverse_v4($this.id, |$el| SELECT VALUE (->edge->test) FROM $el LIMIT 1, 0, 99)).{id, Properties, Dataset} as next  from test where Properties.PID contains 'TFKB/V0001' and Properties.Chain.Head = true order by id;
			// document.querySelector('#app_container').style = `width:80%;`;
			// document.querySelector('#app_container').classList = ``;
			// document.querySelector('#app_container').innerHTML = `
			// 	<div uk-grid class="uk-child-width-expand@s">
			// 		<div class="uk-card uk-card-default uk-card-small"><h4 class="uk-card-header uk-margin-remove">${informasi_faktur.Dataset.Layout.Form.Label}</h4><div class="uk-card-body ">${str.informasi_faktur}</div></div>
			// 	</div>
			// 	<div uk-grid class="uk-child-width-expand@s">
			// 		<div class="uk-card uk-card-default uk-card-small"><h4 class="uk-card-header uk-margin-remove">${informasi_faktur.Dataset.Layout.Form.Label}</h4><div class="uk-card-body ">${str}</div></div>
			// 		<div class="uk-card uk-card-default uk-card-small"><h4 class="uk-card-header uk-margin-remove">${informasi_faktur.Dataset.Layout.Form.Label}</h4><div class="uk-card-body ">${str}</div></div>
			// 		<div class="uk-card uk-card-default uk-card-small"><h4 class="uk-card-header uk-margin-remove">${informasi_faktur.Dataset.Layout.Form.Label}</h4><div class="uk-card-body ">${str}</div></div>
			// 	</div>
			// 	<div uk-grid class="uk-child-width-expand@s">
			// 		<div class="uk-card uk-card-default uk-card-small"><h4 class="uk-card-header uk-margin-remove">${informasi_faktur.Dataset.Layout.Form.Label}</h4><div class="uk-card-body ">${str}</div></div>
			// 		<div class="uk-card uk-card-default uk-card-small"><h4 class="uk-card-header uk-margin-remove">${informasi_faktur.Dataset.Layout.Form.Label}</h4><div class="uk-card-body ">${str}</div></div>
			// 	</div>
			// `;
			// console.log(str);
	});
});

if (cr) console.log('<<< <<< <<< <<< ParadigmREVOLUTION');
