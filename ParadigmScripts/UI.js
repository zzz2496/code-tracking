export class UI { 
	constructor (container, schema, data, methods, cr) {
		this.container = container;
		this.schema = schema;
		this.data = data;
		this.element = null;

		this.dataShown = data;
		this.cr = cr;
		
		this.cr = true;
	}

	render() {
		
	}

	update() { 

	}

	refresh() { 

	}
	destroy() { 

	}
}

export class FormGenerator { 
	constructor() { 

	}
	GenerateForm = function ($id, $schema) { 
		var str = '';
		str += '<form id="' + $id + '" class="" onsubmit="return false;">';
		// // // // console.log$id);
		// // // // console.log$schema);
		Object.entries($schema).forEach(([i, d]) => {
			if (d['form'] == 1) {
				if ((d['type'] != 'button') && (d['type'] != 'separator')) {
					str += '<div class="" ';
					if (typeof d['label'] != 'undefined') {
						str += 'paradigm-data="'+d['label']+'" '+'paradigm-data-unreadable="'+ParadigmREVOLUTION.Utility.Strings.UnReadable(d['label'])+'"';
					}
					str += '>';
					str += '    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + i + '" id="id_label___' +$id+'___'+ i + '">';
					if (typeof d['label'] != 'undefined') {
						str += '        ' + d['label'] + ' ';
					}else{
						str += '        ' + ParadigmREVOLUTION.Utility.Strings.UCwords(i.replace(/\_/gi, ' ')) + ' ';
					}
					if (typeof d['string_not_empty'] != 'undefined') {
						str += '<span class="required">*</span>';
					}
					str += '    </label>';
					str += '    <div class="col-md-6 col-sm-6 col-xs-12 input-group checkbox">';
				}
				var valz = '';
				if (typeof d['value'] != 'undefined') {
					valz = d['value'];
				}
				var d_class = '';
				if (typeof d['class'] != 'undefined') {
					d_class = d['class'];
				}
				// // console.log('masuk check d type');
				// // console.log($id+'> '+i+': '+d['type']);
				switch (d['type']) {
					case 'text':
						if (typeof d['subtype'] != 'undefined') {
							switch (d['subtype']) {
								case 'select':
									str += `<div class="select">
												<select style="width: 100%" id="' + $id + '___' + i + '" name="' + i + '" class="text_input '+d_class+'">
									`;
									if (typeof d['select_values'] != 'undefined') {
										var el = d['select_values'];
										// // // // console.logel);
										el.forEach((dd, ii) => {
											if (dd.length == 0) { 
												str += '<option value="%">' + dd + '</option>';
											} else {
												str += '<option value="' + dd + '">' + dd + '</option>';
											}
										});
											}
									str += '</select></div>';
									break;
								case 'textarea':
									str += '<textarea '
									if (d.readonly) str += ' readonly ';
									str += 'id="' + $id + '___' + i + '"name="' + i + '" class="textarea text_input '+d_class+'" rows="5"></textarea>';
									break;
								case 'hierarki_input':
									str += '        <input ';
									if (d.readonly) str += ' readonly ';
									str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="input hierarki_input '+d_class+'"/>';
									break;
								case 'chart_of_accounts_input':
									str += '        <input ';
									if (d.readonly) str += ' readonly ';
									str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="input chart_of_accounts_input '+d_class+'" value="' + valz + '"/>';
									break;
								case 'list':
									str += '        <textarea '
									if (d.readonly) str += ' readonly ';
									str += 'id="' + $id + '___' + i + '"name="' + i + '" class="input list_input '+d_class+'" rows="5"></textarea>';
									break;
							}
						} else {
							str += '<input ';
							if (d.readonly) str += ' readonly ';
							str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="input '+d_class+'" value="' + valz + '"/>';
						}
						break;
					case 'array':
							str += '<div class="select"><select style="width: 100%" id="' + $id + '___' + i + '" name="' + i + '" class="text_input '+d_class+'">';
							if (typeof d['select_values'] != 'undefined') {
								var el = d['select_values'];
								el.forEach((dd, ii) => {
									if (dd.length == 0) { 
										str += '<option value="%">' + dd + '</option>';
									} else {
										str += '<option value="' + dd + '">' + dd + '</option>';
									}
								});
							}
							str += '</select></div>';
						break;
					case 'numeric':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 numeric_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'numeric_comma':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 numeric_comma_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'plat_nomor_input':
						// console.log('masuk plat nomor input');
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 plat_nomor_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'password':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="password" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 '+d_class+'"/>';
						break;
					case 'timestamp without time zone':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						var valx = '';
						switch(valz) {
							case 'sekarang':
								valx = $('#date_today').val();
								break;
							case 'kemarin':
								valx = $('#date_yesterday').val();
								break;
							case '7_hari_lalu':
								valx = $('#date_last_7_days').val();
								break;
							case '30_hari_lalu':
								valx = $('#date_last_30_days').val();
								break;
							case 'awal_bulan':
								valx = $('#date_this_month_start').val();
								break;
							case 'akhir_bulan':
								valx = $('#date_this_month_end').val();
								break;
							case 'awal_bulan_lalu':
								valx = $('#date_last_month_start').val();
								break;
							case 'akhir_bulan_lalu':
								valx = $('#date_last_month_end').val();
								break;
							case 'awal_bulan_depan':
								valx = $('#date_next_month_start').val();
								break;
							case 'akhir_bulan_depan':
								valx = $('#date_next_month_end').val();
								break;
						}
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 datetime_input '+d_class+'" value="' + valx + '"/>';
						break;
					case 'time':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 time_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'boolean':
						var valc = true;
						if (valz != '') valc = valz;
						// if (d.value)
						str += '<div class="checkbox"><label><input type="checkbox" id="' + $id + '___' + i + '" name="' + i + '" value="'+valc+'" class="'+d_class+'"';
						if (d.checked) str += ' checked ';
						str += ' /></label></div>';
						break;
					case 'button':
						str += '        <div align="center"><input type="button" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="btn btn-success '+d_class+'" value="' + ParadigmREVOLUTION.Utility.Strings.UCwords(i.replace(/\_/gi, ' ')) + '"/></div>';
						break;
					case 'separator':
						str += '        <hr>';
						break;
					case 'object':
						str += '        <div align="center" id="' + $id + '___' + i + '" class="'+d_class+'"></div>';
						break;
				}
				if (typeof d['tail'] != 'undefined') {
					str += '<span class="form-control-feedback right" aria-hidden="true">' + d['tail'] + '</span>';
				}
				if ((d['type'] != 'button') && (d['type'] != 'separator')) {
					str += '    </div>';
					str += '</div>';
				}
			}
		});
		str += '</form>';
		return str;
	}
	GenerateFormN = function($id, $schema) {
		var str = '';
		str += '<form class="form" id="' + $id + '" onsubmit="return false;">';
		Object.entries($schema).forEach(([i, d]) => {
			// console.log(i, d);
			if (d['form'] == 1) {
				if ((d['type'] != 'button') && (d['type'] != 'separator')) {
					str += '<div class="" ';
					if (typeof d['label'] != 'undefined') {
						str += 'paradigm-data="'+d['label']+'" '+'paradigm-data-unreadable="'+ParadigmREVOLUTION.Utility.Strings.UnReadable(d['label'])+'"';
					}
					str += '>';
					str += '    <label class="uk-form-label" for="' + i + '" id="id_label___' +$id+'___'+ i + '">';
					if (typeof d['label'] != 'undefined') {
						str += '        ' + d['label'] + ' ';
					}else{
						str += '        ' + ParadigmREVOLUTION.Utility.Strings.UCwords(i.replace(/\_/gi, ' ')) + ' ';
					}
					if (typeof d['string_not_empty'] != 'undefined') {
						str += '<span class="required">*</span>';
					}
					str += '    </label>';
					str += '    <div class="">';
				}
				var valz = '';
				if (typeof d['value'] != 'undefined') {
					valz = d['value'];
				}
				var d_class = '';
				if (typeof d['class'] != 'undefined') {
					d_class = d['class'];
				}
				switch (d['type']) {
					case 'text':
						if (typeof d['subtype'] != 'undefined') {
							switch (d['subtype']) {
								case 'textarea':
									str += '        <textarea '
									if (d.readonly) str += ' readonly ';
									str += 'id="' + $id + '___' + i + '"name="' + i + '" class="uk-textarea text_input '+d_class+'" rows="5"></textarea>';
									break;
								case 'chart_of_accounts_input':
									str += '        <input ';
									if (d.readonly) str += ' readonly ';
									str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-input chart_of_accounts_input '+d_class+'" value="' + valz + '"/>';
									break;
								case 'list':
									str += '        <textarea '
									if (d.readonly) str += ' readonly ';
									str += 'id="' + $id + '___' + i + '"name="' + i + '" class="uk-textarea list_input '+d_class+'" rows="5"></textarea>';
									break;
							}
						} else {
							str += '        <input ';
							if (d.readonly) str += ' readonly ';
							str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-input text_input '+d_class+'" value="' + valz + '"/>';
						}
						break;
					case 'array':
						if (typeof d['subtype'] != 'undefined') {
							str += '        <select style="width: 100%" id="' + $id + '___' + i + '" name="' + i + '" class="uk-select text_input '+d_class+'">';
							if (typeof d['select_values'] != 'undefined') {
								var el = d['select_values'];
								console.log("el", el);
								el.forEach((dd, ii) => {
									if (dd.length == 0) { 
										str += '<option value="%">' + dd + '</option>';
									} else {
										str += '<option value="' + dd + '">' + dd + '</option>';
									}
								});
								// $.each(el, function(ii, dd) {
								// 	if (dd.length == 0) { 
								// 		str += '<option value="%">' + dd + '</option>';
								// 	} else {
								// 		str += '<option value="' + dd + '">' + dd + '</option>';
								// 	}
								// });
							}
							str += '</select>';
						} else {
							str += '        <input ';
							if (d.readonly) str += ' readonly ';
							str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-input text_input '+d_class+'" value="' + valz + '"/>';
						}
						break;
					case 'numeric':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-text numeric_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'numeric_comma':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-text numeric_comma_input '+d_class+'" value="' + valz + '"/>';
						break;
					 case 'plat_nomor_input':
						// console.log('masuk plat nomor input');
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-text plat_nomor_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'password':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="password" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-text '+d_class+'"/>';
						break;
					case 'timestamp without time zone':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						var valx = '';
						switch(valz) {
							case 'sekarang':
								valx = $('#date_today').val();
								break;
							case 'kemarin':
								valx = $('#date_yesterday').val();
								break;
							case '7_hari_lalu':
								valx = $('#date_last_7_days').val();
								break;
							case '30_hari_lalu':
								valx = $('#date_last_30_days').val();
								break;
							case 'awal_bulan':
								valx = $('#date_this_month_start').val();
								break;
							case 'akhir_bulan':
								valx = $('#date_this_month_end').val();
								break;
							case 'awal_bulan_lalu':
								valx = $('#date_last_month_start').val();
								break;
							case 'akhir_bulan_lalu':
								valx = $('#date_last_month_end').val();
								break;
							case 'awal_bulan_depan':
								valx = $('#date_next_month_start').val();
								break;
							case 'akhir_bulan_depan':
								valx = $('#date_next_month_end').val();
								break;
						}
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-input datetime_input '+d_class+'" value="' + valx + '"/>';
						break;
					case 'time':
						str += '        <input ';
						if (d.readonly) str += ' readonly ';
						str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-input time_input '+d_class+'" value="' + valz + '"/>';
						break;
					case 'boolean':
						var valc = true;
						if (valz != '') valc = valz;
						// if (d.value)
						str += '<div class="checkbox"><label><input type="checkbox" id="' + $id + '___' + i + '" name="' + i + '" value="'+valc+'" class="uk-checkbox '+d_class+'"';
						if (d.checked) str += ' checked ';
						str += ' /></label></div>';
						break;
					case 'button':
						str += '        <div align="center"><input type="button" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="uk-button uk-button-primary '+d_class+'" value="' + ucwords(i.replace(/\_/gi, ' ')) + '"/></div>';
						break;
					case 'separator':
						str += '        <hr>';
						break;
					case 'object':
						str += '        <div align="center" id="' + $id + '___' + i + '" class="'+d_class+'"></div>';
						break;
				}
				if (typeof d['tail'] != 'undefined') {
					str += '<span class="form-control-feedback right" aria-hidden="true">' + d['tail'] + '</span>';
				}
				if ((d['type'] != 'button') && (d['type'] != 'separator')) {
					str += '    </div>';
					str += '</div>';
				}
			}
		});
		str += '</form>';
		return str;
	}
}