class node_methods {
	//start on methods
	Initialize = {
		"GenerateUID": function () {
			return Math.random();
		},
		"GenerateDocumentID": function () {
			return Math.random();
		}
	};

	QueueMethods = {
		"QueueState": {
			"OnScheduled": [],
			"OnAvailable": [],
			"OnUnavailable": [],
			"OnProcess": [],
			"OnProcessSucceeded": [],
			"OnProcessFailed": []
		},
		"QueueStatistics": {
			"Count": 0,
			"Average": 0,
			"Minimum": 0,
			"Maximum": 0
		}
	};

	DataProcessing = {
		// "Filter": function () { },
		// "Sort": function () { },
		// "Refresh": function () { },
		// "GarbageSweep": function () { }
	};
	// Query = function () { };
	Time = {
		"Log": function () { },
		"GetHistory": function () { },
		"Age": {
			"GetAge": function () { },
			"GetTimeToLive": function () { },
			"GetTimeToDie": function () { },
			"GetDataStatus": function () { },
			"SetAge": function () { },
			"SetTimeToLive": function () { },
			"SetTimeToDie": function () { },
			"SetDataStatus": function () { },
		},
	};
	// Schema = function () { };
	Relations = {
		"WhereAmI": function () { },
		"WhoAmI": function () { },
		"WhomAmI": function () { },
		"WhenAmI": function () { },
		"WhyAmI": function () { },
		"HowAmI": function () { },

		"GetParents": function () { },
		"GetChildren": function () { },
		"GetFamily": function () { },
		"GetSiblings": function () { },
		"GetHistory": function () { },
		"GetPast": function () { },
		"GetPresent": function () { },
		"GetFuture": function () { },

		"SetPath": function () { },
		"SetParents": function () { },
		"SetChildren": function () { },
		"SetFamily": function () { },
		"SetSiblings": function () { },
		"SetPast": function () { },
		"SetPresent": function () { },
		"SetFuture": function () { },

		"AppendPath": function () { },
		"AppendParents": function () { },
		"AppendChildren": function () { },
		"AppendFamily": function () { },
		"AppendSiblings": function () { },
		"AppendPast": function () { },
		"AppendPresent": function () { },
		"AppendFuture": function () { },

		"RemovePath": function () { },
		"RemoveParents": function () { },
		"RemoveChildren": function () { },
		"RemoveFamily": function () { },
		"RemoveSiblings": function () { },
		"RemovePast": function () { },
		"RemovePresent": function () { },
		"RemoveFuture": function () { },

		"Cursor": {},
		"Traversal": {
			"GoToHead": function () { },
			"GoToTail": function () { },
			"GoToNode": function (TypeOfNode, WhatTypeOfNode) { },
			"NextNode": function () { },
			"PrevNode": function () { },
		}
	};
	Render = {
		"Refresh": function () { },
		"Update": function () { },
		"Perspectives": {
			"Form": function (id, schema) {
				var str = '';
				str += '<div class="x_content" id="id_div_' + $id + '">';
				str += '<form id="' + $id + '" data-parsley-validate class="form-horizontal form-label-left" onsubmit="return false;">';
				$.each($schema['schema'], function (i, d) {
					if (d['form'] == 1) {
						if ((d['type'] != 'button') && (d['type'] != 'separator')) {
							str += '<div class="form-group" ';
							if (typeof d['label'] != 'undefined') {
								str += 'paradigm-data="' + d['label'] + '" ' + 'paradigm-data-unreadable="' + un_readable(d['label']) + '"';
							}
							str += '>';
							str += '    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="' + i + '" id="id_label___' + $id + '___' + i + '">';
							if (typeof d['label'] != 'undefined') {
								str += '        ' + d['label'] + ' ';
							} else {
								str += '        ' + ucwords(i.replace(/\_/gi, ' ')) + ' ';
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
						switch (d['type']) {
							case 'text':
								if (typeof d['subtype'] != 'undefined') {
									switch (d['subtype']) {
										case 'select':
											str += '        <select style="width: 100%" id="' + $id + '___' + i + '" name="' + i + '" class="js-example-responsive form-control col-md-7 col-xs-12 text_input ' + d_class + '">';
											if (typeof d['select_values'] != 'undefined') {
												var el = d['select_values'].split('::');
												// // // // console.logel);
												$.each(el, function (ii, dd) {
													str += '<option value="' + dd + '">' + dd + '</option>';
												});
											}
											str += '</select>';
											break;
										case 'textarea':
											str += '        <textarea '
											if (d.readonly) str += ' readonly ';
											str += 'id="' + $id + '___' + i + '"name="' + i + '" class="form-control col-md-7 col-xs-12 text_input ' + d_class + '" rows="5"></textarea>';
											break;
										case 'hierarki_input':
											str += '        <input ';
											if (d.readonly) str += ' readonly ';
											str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 hierarki_input ' + d_class + '"/>';
											break;
										case 'chart_of_accounts_input':
											str += '        <input ';
											if (d.readonly) str += ' readonly ';
											str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 chart_of_accounts_input ' + d_class + '" value="' + valz + '"/>';
											break;
										case 'list':
											str += '        <textarea '
											if (d.readonly) str += ' readonly ';
											str += 'id="' + $id + '___' + i + '"name="' + i + '" class="form-control col-md-7 col-xs-12 list_input ' + d_class + '" rows="5"></textarea>';
											break;
									}
								} else {
									str += '        <input ';
									if (d.readonly) str += ' readonly ';
									str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 text_input ' + d_class + '" value="' + valz + '"/>';
								}
								break;
							case 'numeric':
								str += '        <input ';
								if (d.readonly) str += ' readonly ';
								str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 numeric_input ' + d_class + '" value="' + valz + '"/>';
								break;
							case 'numeric_comma':
								str += '        <input ';
								if (d.readonly) str += ' readonly ';
								str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 numeric_comma_input ' + d_class + '" value="' + valz + '"/>';
								break;
							case 'plat_nomor_input':
								// console.log('masuk plat nomor input');
								str += '        <input ';
								if (d.readonly) str += ' readonly ';
								str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 plat_nomor_input ' + d_class + '" value="' + valz + '"/>';
								break;
							case 'password':
								str += '        <input ';
								if (d.readonly) str += ' readonly ';
								str += 'type="password" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 ' + d_class + '"/>';
								break;
							case 'timestamp without time zone':
								str += '        <input ';
								if (d.readonly) str += ' readonly ';
								var valx = '';
								switch (valz) {
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
								str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 datetime_input ' + d_class + '" value="' + valx + '"/>';
								break;
							case 'time':
								str += '        <input ';
								if (d.readonly) str += ' readonly ';
								str += 'type="text" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="form-control col-md-7 col-xs-12 time_input ' + d_class + '" value="' + valz + '"/>';
								break;
							case 'boolean':
								var valc = true;
								if (valz != '') valc = valz;
								// if (d.value)
								str += '<div class="checkbox"><label><input type="checkbox" id="' + $id + '___' + i + '" name="' + i + '" value="' + valc + '" class="' + d_class + '"';
								if (d.checked) str += ' checked ';
								str += ' /></label></div>';
								break;
							case 'button':
								str += '        <div align="center"><input type="button" id="' + $id + '___' + i + '" name="' + i + '" required="required" class="btn btn-success ' + d_class + '" value="' + ucwords(i.replace(/\_/gi, ' ')) + '"/></div>';
								break;
							case 'separator':
								str += '        <hr>';
								break;
							case 'object':
								str += '        <div align="center" id="' + $id + '___' + i + '" class="' + d_class + '"></div>';
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
				str += '</div>';
				return str;
			},
			"InfoStrip": function ($fetch, tlegend, id = '') {
				if ($fetch !== false) {
					legend = tlegend;
					//alert(arguments.length);
					if (arguments.length < 2) {
						legend = 'Data';
					}
					if (arguments.length < 3) {
						id = tlegend;
					}
					$str = '';
					$str += '<div><fieldset><legend>' + legend + '</legend>';
					$str += '<table style="font-size:100%" cellpadding="0" cellspacing="0" id="' + un_readable(id) + '_info_strip">';
					for (var $fe in $fetch) {
						for (var $fld in $fetch[$fe]) {
							$str += '<tr valign="top">';
							zstr = readable($fld);
							$str += "<td><label style='margin-right:10px;'>" + zstr.toUpperCase() + "</label></td>";
							$str += '<td style="font-weight:bold;">:&nbsp;&nbsp;&nbsp;</td>';
							var val = '';
							if (typeof $fetch[$fe][$fld] !== 'undefined') {
								val = $fetch[$fe][$fld];
							}
							switch (val) {
								case null:
									val = '';
									break;
								case true:
									val = 'Ya';
									break;
								case false:
									val = 'Tidak';
									break;
								default:
									break;
							}
							if (typeof val == 'object') {
								if (Array.isArray(val)) {
									var temp_str = val.join("\n");
									$str += "<td><label style='font-weight:regular;' column_name='" + $fld + "' style='margin-right:10px;'>" + temp_str + "</label>";
								} else {
									$str += "<td><label style='font-weight:regular;' column_name='" + $fld + "' style='margin-right:10px;'>" + "</label>";
								}

							} else if (typeof val == 'string') {
								$str += "<td><label style='font-weight:regular;' column_name='" + $fld + "' style='margin-right:10px;'>" + val + "</label>";
							} else if (typeof val == 'number') {
								$str += "<td align='right'><label style='font-weight:regular;' column_name='" + $fld + "' style='margin-right:10px;'>" + FormatNumberBy3(val) + "</label>";
							}
							$str += "</td>";
							$str += '</tr>';
						}
					}
					$str += '</table></fieldset>';
					$str += ("</div>");
					return $str;
				} else {
					return 'Uh oh, ada yang rusak...';
				}
			},
			"DataGrid": function ($fetch, tlegend, id = '') {
			},
			"List": function ($fetch, tlegend, id = '') { },
			"Table": function (id, dataset, with_action, no_wrap = 1, npage_num, npage_result_number, COMPLEMENTARY_DATA) { 
				// // // // console.log'[START DEBUG CORE BUAT TABLE]');
				// // // // console.logdataset);
				// console.log('no_wrap: '+no_wrap);
				var page_number = 0;
				var no_urut = 0;
				var ada_action = false;
				if (arguments.length > 4) {
					zpage_num = 0;
					zpage_result_number = 0;
					if (npage_num !== null) {
						zpage_num = npage_num;
					}
					if (npage_result_number !== null) {
						zpage_result_number = npage_result_number;
					}
					page_number = parseInt(zpage_num, 10) - 1;
					no_urut = page_number * parseInt(zpage_result_number, 10);
					//alert(page_number+' = '+page_result_number);
				}
				if ((arguments.length >= 3) && (typeof with_action == 'object') && (with_action !== null)) {
					ada_action = true;
				}

				var uid = '';
				var str = '';
				var aTotal = [];
				if (dataset !== false) {
					str += '<table border="0" width="100%" id="' + id + '" class="table table-hover table-striped table-condensed datatable" style="font-size:100%;">';
					str += '<thead>';
					str += '<tr>';
					str += '<th class="header"';
					/*if ((arguments.length == 3)&&(typeof with_action == 'object')) {
						str+=' onclick="remove_detail();"';
					}*/
					str += ' style="cursor:pointer;">No.</th>';
					var idx = 0;
					var col_header = [];
					var col_header_temp = [];
					var col_header_longest = 0;
					var idx_col_header_longest = 0;
					var count_cols = 0;
					// for (var i in dataset[0]) {
					// 	if (idx === 0) {
					// 		uid = i;
					// 	}
					// 	col_header.push(i);
					// 	str += '<th class="header" column_name="' + i.replace(/\W/gi, '') + '"';
					// 	str += ' style="cursor:pointer;"';
					// 	str += ' align="left">' + i.replace(/_/gi, ' ') + '</th>';
					// 	idx++;
					// }

					for (var countDS in dataset) {
						col_header_temp = [];
						for (var i in dataset[countDS]) {
							col_header_temp.push(i);
						}
						// console.log('col_header_temp ke ' + countDS, col_header_temp);
						if (col_header_longest < col_header_temp.length){
							col_header_longest = col_header_temp.length;
							idx_col_header_longest = countDS;
							col_header = col_header_temp;
						}
					}
					// console.log('col_header', col_header);
					// console.log('col_header_temp', col_header_temp);
					// console.log('col_header', col_header);
					// console.log('col_header_longest', col_header_longest);
					// console.log('idx_col_header_longest', idx_col_header_longest);
					var idx = 0;
					for (var i in dataset[idx_col_header_longest]) {
						if (idx === 0) {
							uid = i;
						}
						str += '<th class="header" column_name="' + i.replace(/\W/gi, '') + '"';
						str += ' style="cursor:pointer;"';
						str += ' align="left">' + i.replace(/_/gi, ' ') + '</th>';
						idx++;
					}
					// console.log("col_header", col_header);
					if ((arguments.length >= 3) && (typeof with_action == 'object') && (with_action !== null)) {
						// // // // console.log'label lama');
						var label = 'aksi';
						if (typeof with_action.label != 'undefined') {
							// // // // console.log'label baru');
							label = with_action.label;
						}
						str += '<th style="width:1%;white-space:nowrap;" class="header" align="left">'+label+'</th>';
					}
					str += '</tr>';
					str += '</thead>';
					str += '<tbody>';
					idx = 0;
					// for (var yyy in dataset) {
					$.each(dataset, function(yyy, d){
						// // // // console.log'yyy: ' + yyy);
						// // // // console.log"uid: " + uid);
						// // // // console.log"dataset[yyy][uid]: " + dataset[yyy][uid]);
						var zzstr = dataset[yyy][uid];
						if (zzstr == null) zzstr = '';
						str += '<tr class="data_row" id="' + ((yyy * 1) + 1 + no_urut) + '---' + zzstr.toString().replace(/\s/gi, '_') + '" valign="top">';
						str += '<td style="width:1%;white-space:nowrap;position: relative;" column_name="no">' + ((yyy * 1) + 1 + no_urut) + '</td>';
						var fc = 1;
						$style = '';
						// for (var xxx in dataset[yyy]) {
						// console.log("col_header", col_header);
						for (var index_col_header = 0; index_col_header < col_header.length; index_col_header++) {
							let xxx = col_header[index_col_header];
							// if (typeof col_header[index_col_header] === 'string') xxx = col_header[index_col_header];
							// console.log("col_header >", xxx);
							// reTestRp = /rp/i;
							// reTestPt = /pt/i;
							// if ((dataset[yyy] != '')||(dataset[yyy]!=null)){
							//     $style = "style='width:1%;white-space:nowrap;'";
							// }
							if (no_wrap == 1){
								$style = "style='width:1%;white-space:nowrap;position: relative;'";
							}
							if ((parseFloat(dataset[yyy][xxx]) == dataset[yyy][xxx]) && (xxx.search(/char/i) == (-1))) {
								// if ((xxx.search(/kode/i) == (-1)) && (xxx.search(/tanggal/i) == (-1)) && (xxx.search(/code/i) == (-1)) && (xxx.search(/update/i) == (-1) && (xxx.search(/jatuh/i) == (-1))) && (xxx.search(/number/i) == (-1)) && (xxx.search(/chart/i) == (-1)) && (xxx.search(/nomor/i) == (-1)) && (xxx.search(/chart/i) == (-1)) && (xxx.search(/telp/i) == (-1)) && (xxx.search(/telep/i) == (-1)) && (xxx.search(/char/i) == (-1))) {
									// str += '<td align="right" column_name="' + xxx.replace(/\W/, '') + '">' + FormatNumberBy3(round4(dataset[yyy][xxx]));
									str += '<td '+$style+' align="right" '+$style+' column_name="' + xxx.replace(/\W/, '') + '">' + FormatNumberBy3(dataset[yyy][xxx]);
									// str += '<td align="right" column_name="' + xxx.replace(/\W/, '') + '">' + dataset[yyy][xxx];
								// } else {
								//     str += '<td onmouseover="this.innerHTML = \'Some human readable message of this document ' + dataset[yyy][xxx] + '\'" onmouseout="this.innerHTML = \'Some human readable message of this document ' + dataset[yyy][xxx] + '\'" align="left" column_name="' + xxx.replace(/\W/, '') + '">' + dataset[yyy][xxx];
								// }
							} else {
								if (dataset[yyy][xxx] != null) {
									if (xxx == 'keterangan') {
										str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '" title="' + dataset[yyy][xxx] + '">';
										str += dataset[yyy][xxx];
									} else if (dataset[ yyy ][ xxx ].length > 80) {
										if ((dataset[ yyy ][ xxx ].indexOf('<') > 0) || (dataset[ yyy ][ xxx ].indexOf('>') > 0)) {
											// alert('aaaa');
											str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
											str += dataset[yyy][xxx];
										} else {
											str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '" title="' + dataset[yyy][xxx] + '">';
											// str += dataset[yyy][xxx].substr(0, 80) + '...';
											str += dataset[yyy][xxx];
										}
									} else if (typeof dataset[yyy][xxx] == 'object') {
										str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
										if (COMPLEMENTARY_DATA != null) {
											switch (COMPLEMENTARY_DATA.flag) {
												case 'grup_pegawai':
													var zstr = renderGrupPegawai({ dataTemplate: { header: { akses: dataset[yyy][xxx] } } });
													str += zstr;
													break;
												case 'user_data':
													var zstr = renderGrupPegawai({ dataTemplate: { header: { akses: dataset[yyy][xxx] } } });
													str += zstr;
													break;
												default:
													str += '<pre>' + syntaxHighlight(dataset[yyy][xxx]) + '</pre>';
													break;
											}
										}
									} else {
										if ((dataset[yyy][xxx] === 't')||(dataset[yyy][xxx] === true)||(dataset[yyy][xxx] === 'true')) {
											str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
											str += 'Ya';
										} else if ((dataset[yyy][xxx] === 'f')||(dataset[yyy][xxx] === false)||(dataset[yyy][xxx] === 'false')) {
											str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
											str += 'Tidak';
										} else {
											str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
											str += dataset[yyy][xxx];
										}
									}
								} else {
									str += '<td '+$style+' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
									str += '-';
								}
							}
							fc++;
							str += '</td>';
						}
						if (ada_action){
							if (typeof with_action.data != 'undefined') {
								// // // // console.log'with action baru !!!');
								str += '<td '+$style+' column_name="action" align="center">';
								// for (var counter_wa in with_action.data) {
								$.each(with_action.data, function(counter_wa, d){
									str += '<span id="id_action_trigger--' + with_action.data[counter_wa]['nama'] + '--' + ((yyy * 1) + 1 + no_urut) + '" style="cursor:pointer;color:#FF2F34;">' + with_action.data[counter_wa]['label'] + '</span> ';
								});
								str += '</td>';

							} else {
								// console.log'with action lama...');
								// console.logwith_action);
								str += '<td '+$style+' column_name="action" align="center">';
								$.each(with_action, function(counter_wa, d){
									// console.logcounter_wa);
									// console.logd);
									str += '<span id="id_action_trigger--' + with_action[counter_wa]['nama'] + '--' + ((yyy * 1) + 1 + no_urut) + '" style="cursor:pointer;color:#FF2F34;">' + with_action[counter_wa]['label'] + '</span> ';
								});
								// for (var counter_wa in with_action) {
								//  str += '<span id="id_action_trigger--' + with_action[counter_wa]['nama'] + '--' + ((yyy * 1) + 1 + no_urut) + '" style="cursor:pointer;color:#FF2F34;">' + with_action[counter_wa]['label'] + '</span> ';
								// }
								str += '</td>';
							}
						}
						str += '</tr>';
						idx++;
					// }
					});
					str += '</tbody>';
					str += '</table>';

					/*if (arguments.length == 2) {
						str+='<div align="right" style="margin: 0px 20px 20px 0px;">';
						str+='<table style="font-family:arial; font-size:11px;">';
						for (var ta in aTotal){
							str+='<tr><td align="left">'+ta+':</td><td align="right"><b>Rp.'+FormatNumberBy3(aTotal[ta])+',-</b></td></tr>';
						}
						str+='</table>';
						str+='</div>';
					}*/
					return str;
				} else {
					return "<span style='font-family:arial; font-weight:bold; font-size:18px; color: black; border-bottom: 1px solid silver;'>Tidak ada data yang cocok</span>";
				}
			},
			"Grid": function ($fetch, tlegend, id = '') { },
			"Card": function ($fetch, tlegend, id = '') { },
			"Calendar": function ($fetch, tlegend, id = '') { },
			"Graph": function ($fetch, tlegend, id = '') { },
			"GraphDB": function ($fetch, tlegend, id = '') { },
			"CSV": function ($fetch, tlegend, id = '') { },
			"Kanban": function ($fetch, tlegend, id = '') { },
			"Timeline": function ($fetch, tlegend, id = '') { }
		},
		"Theme": {
			"Class": [], //array of class names [strings]
			"Size": {
				"min-height": 0,
				"height": 0,
				"max-height": 0,
				"min-width": 0,
				"width": 0,
				"max-width": 0,
				"z-index": 0,
				"tab-index": 0,
				"top": 0,
				"left": 0,
				"padding": 0,
				"margin": 0
			},
			"Block": {
				"ColumnXS": 0,
				"ColumnS": 0,
				"ColumnM": 0,
				"ColumnL": 0,
				"ColumnXL": 0,
				"overflow": "",
				"overflow-x": "",
				"overflow-y": "",
				"overscroll-behavior": "",
				"overscroll-behavior-block": "",
				"overscroll-behavior-inline": "",
				"overscroll-behavior-x": "",
				"overscroll-behavior-y": "",
				"page-break-after": "",
				"page-break-before": "",
				"page-break-inside": "",
				"display": "",
				"position": "",
				"float": ""
			},
			"Text": {
				"text-color": "black",
				"text-align": "left",
				"text-align-last": "",
				"direction": "",
				"vertical-align": "",
				"unicode-bidi": "",
				"text-decoration-line": "",
				"text-decoration-color": "",
				"text-decoration-style": "",
				"text-decoration-thickness": "",
				"text-decoration": "",
				"text-transform": "", // [uppercase, lowercase, capitalize]
				"text-indent": "",
				"letter-spacing": "",
				"line-height": "",
				"word-spacing": "",
				"white-space": "",
				"text-shadow": "",
				"font-family": "",
				"font-variant": "",
				"font-weight": "",
				"font-size": 12,
				"line-height": 1,
				"font-style": "",
				"font-weight": "normal",
			},
			"Table": {
				"border": "",
				"border-top": "",
				"border-left": "",
				"border-bottom": "",
				"border-right": "",
				"border-collapse": "",
				"border-color": "",
				"border-spacing": 0,
				"width": "100%",
				"height": "",
				"text-align": "left",
				"vertical-align": "",
				"padding": 0,
				"margin": 0,
				"caption-side": "",
				"empty-cells": "",
				"table-layout": ""
			},
			"Flex": {
				"flex-basis": "",
				"flex-direction": "",
				"flex-flow": "",
				"flex-grow": "",
				"flex-shrink": "",
				"flex-wrap": "",
			},
			"Grid": {
				"grid-template-rows": "",
				"grid-template-columns": "",
				"grid-template-areas": "",
				"grid-auto-rows": "",
				"grid-auto-columns": "",
				"grid-auto-flow": "",
				"grid-area": "",
				"grid-row-start": "",
				"grid-column-start": "",
				"grid-row-end": "",
				"grid-column-end": "",
				"grid-auto-columns": "",
				"grid-auto-flow": "",
				"grid-auto-rows": "",
				"grid-column": "",
				"grid-column-start": "",
				"grid-column-end": "",
				"grid-gap": "",
				"grid-row": "",
				"grid-row-start": "",
				"grid-row-end": "",
				"grid-row-gap": "",
				"grid-template": ""
			},
			"Color": {
				"color": "",
				"background-color": "",
				"accent-color": "",
				"caret-color": "",
				"outline-color": "",
			}
		}
	};
	GeoSpatialInformation = {
		"Coordinate": {
			"Latitude": 0,
			"Longitude": 0,
			"Accuracy": 0,
			"Altitude": 0,
			"AltitudeAccuracy": 0,
			"Heading": 0,
			"Speed": 0,
			"Timestamp": 0,
		},
		"AddressInformation": {
			"Home-address": "",
			"Work-address": "",
			"Street-address": "",
			"Office-address": "",
			"Warehouse-address": "",
			"Headoffice-address": "",
			"Backup-address": "",
			"Default-address": "",
		}
	};
	DataPorts = {
		"DataStorage": {
			"Init": function () { },
			"Get": function () { },
			"GetLarge": function () { },
			"GetAsync": function () { },
			"GetLargeAsync": function () { },
			"Put": function () { },
			"PutLarge": function () { },
			"PutAsync": function () { },
			"PutLargeAsync": function () { },
			"Void": function () { },
			"Delete": function () { }
		},
		"DataOutput": {
			"PrintHTML": function (title, str, style, print, autoclose) {
				var mywindow = window.open('', 'PRINT', 'height=400,width=600');

				mywindow.document.write('<html><head>');
				mywindow.document.write('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
				mywindow.document.write('<meta charset="utf-8">');
				mywindow.document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
				mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');

				mywindow.document.write('<title>PARADIGM SHIFT Mk 3 Print</title>');

				mywindow.document.write('<link href="vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">');
				mywindow.document.write('<!-- Font Awesome -->');
				mywindow.document.write('<link href="vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">');
				mywindow.document.write('<link href="build/css/custom.min.css" rel="stylesheet">');
				mywindow.document.write('<!-- Custom Theme Style -->');
				mywindow.document.write('<link href="build/css/custom.min.css" rel="stylesheet">');
				mywindow.document.write('<link href="vendors/paradigm_system/paradigm.css" rel="stylesheet">');
				mywindow.document.write('<script src="vendors/jquery/dist/jquery.min.js"></script>');
				mywindow.document.write('<script type="text/javaScript">');
				mywindow.document.write('$(document).ready(function(){');
				if ((arguments.length >= 4) && (print)) {
					// mywindow.document.write("setTimeout(function() {window.print();}, 2000);");
					mywindow.document.write("window.print();");
				}
				if ((arguments.length >= 5) && (autoclose)) {
					mywindow.document.write("setTimeout(function() {parent = window.self;parent.opener = window.self;parent.close();}, 1000);");
					// mywindow.document.write('');
				}
				mywindow.document.write('})');
				mywindow.document.write('</script>');
				mywindow.document.write('</head>');
				mywindow.document.write('<body class="nav-md" style="background-color:white;color:black;>');
				mywindow.document.write('<div class="container body">');
				if (arguments.length >= 3) {
					mywindow.document.write('<div class="main_container" id="container_faktur" style="style="width:21.5cm;">');
				} else {
					mywindow.document.write('<div class="main_container" id="container_faktur" style="style="' + style + '">');
				}
				mywindow.document.write('<div class="main_container" id="container_faktur" style="style="width:21.5cm;">');
				if (title.length > 0) mywindow.document.write('<div align="center"><h3>' + title + '</h3></div>');
				mywindow.document.write(str);
				mywindow.document.write('</div></div></body></html>');

				mywindow.document.close(); // necessary for IE >= 10
				mywindow.focus(); // necessary for IE >= 10*/
				// mywindow.print();
				// mywindow.close();
				return true;
			},
			"AsJOSN": function () { },
			"AsHTML": function () { },
			"AsCSV": function (data_laporan, cr = 1) {
				if ($cr) {
					console.log('starting download process...');
				};
				let csvContent = "data:text/csv;charset=utf-8,";
				if ($cr) {
					console.log('data_laporan', data_laporan);
					console.log('Start each data_laporan[0] as "dd", getting the column names.');
				};
				let row = "";
				var count = 0;
				$.each(data_laporan.message[0], function (ii, dd) {
					if ($cr) {
						console.log('dd', dd);
					};
					if (count > 0) row += '; ';
					row += ii;
					count++;
				});
				if ($cr) {
					console.log('Row Column names: ', row);
					console.log('End each data_laporan[0] as "dd".');
					console.log('Start each data_laporan as "dd", getting the column names.');
				};
				csvContent += row + "\r\n";
				$.each(data_laporan.message, function (i, rowArray) {
					let row = "";
					var count = 0;
					if (typeof rowArray == 'object') {
						$.each(rowArray, function (ii, dd) {
							if (count > 0) row += '; ';
							if (dd.toString().length > 0) {
								row += dd.toString().replace(/\r?\n|\r/g, '').replace(/\<br\>/gmi, ' ').replace(/\<b\>|<\/b\>/gmi, ' ');//.replace(/\<i\>|<\/i\>/gmi, ' ');
							} else {
								row += '';
							}
							count++;
						});
					} else {
						if ($cr) {
							console.log("Error, typeof rowArray[" + i + "] bukan object", (typeof rowArray), rowArray);
						};

					}
					csvContent += row + "\r\n";
					if ($cr) {
						console.log('Row ' + i, row);
					};
				});
				var encodedUri = encodeURI(csvContent);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				var date = new Date;
				var date_str = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
				link.setAttribute("download", "data___" + active_tab + "__" + date_str + '.csv');
				document.body.appendChild(link); // Required for FF
				link.click();
			},
		}
	};
	TransactionControl = {
		"Init": {
			"New": function () { },
			"Confirm": function () { },
			"Addendum": function () { },
			"Approve": function () { },
			"InitInputs": function () {
				$.extend($.fn.dataTable.defaults, {
					"deferRender": true,
					"pageLength": 10,
					"lengthMenu": [10, 25, 50, 100, 200, 300, 500, 1000, 1500, 2000],
					language: {
						"thousands": ".",
						"decimal": ",",
						"sProcessing": "Sedang memproses...",
						"sLengthMenu": "Tampilkan _MENU_ baris",
						"sZeroRecords": "Tidak ditemukan data yang sesuai",
						"sInfo": "Menampilkan _START_ sampai _END_ dari _TOTAL_ baris",
						"sInfoEmpty": "Menampilkan 0 sampai 0 dari 0 baris",
						"sInfoFiltered": "(disaring dari _MAX_ baris keseluruhan)",
						"sInfoPostFix": "",
						"sSearch": "Cari:",
						"sUrl": "",
						"oPaginate": {
							"sFirst": "Pertama",
							"sPrevious": "Sebelumnya",
							"sNext": "Selanjutnya",
							"sLast": "Terakhir"
						}
					}
				});
				$('[data-toggle="tooltip"]').tooltip()
				$('select').select2({
					placeholder: 'Silahkan pilih'
				});
				$('select').on(
					'select2:select', (
					function () {
						$(this).focus();
					}
				)
				);
				$('.text_input').keyup(function (e) {
					$(this).val(convert_to_safe_string($(this).val()));
				});
				$('.list_input').keyup(function (e) {
					$(this).val(convert_to_safe_string_with_newline($(this).val()));
				});
				// $('.no_telepon_input').unbind('mask');
				if ($('.landline_phone_input').length > 0) {
					$('.landline_phone_input').mask("(999)999-99999999", { selectOnFocus: true });
				}
				// if ($('.cellphone_input').length > 0) {
				// 	$('.cellphone_input').mask("(9999)99-99999999", { selectOnFocus: true });
				// }
				if ($('.cellphone_input').length > 0) {
					$('.cellphone_input').mask('Z99-999-99999999', {
						translation: {
							'Z': {
								pattern: /[0]/
							}
						}
					});
				}

				if ($('.chart_of_accounts_input').length > 0) {
					$('.chart_of_accounts_input').mask("99999-99", { selectOnFocus: true });
				}

				// $('.numeric_input').mask('0,000,000,000', { reverse: true, selectOnFocus: true });
				// $('.numeric_input').css({ 'text-align': 'right' });
				// if ($(".numeric_input").next().hasClass('form-control-feedback')) {
				// 	$(".numeric_input").next().prev().css({ 'padding-right': '50px' });
				// }
				$('.numeric_input').mask('0,000,000,000', { reverse: true, selectOnFocus: true });
				$('.numeric_input').css({ 'text-align': 'right' });
				if ($(".numeric_input").next().hasClass('form-control-feedback')) {
					$(".numeric_input").next().prev().css({ 'padding-right': '50px' });
				}
				$('.numeric_input').keyup(function () {
					if ($(this).val().toString().length == 0) {
						$(this).val(0);
						$(this).focus();
						$(this).select();
					}
				});
				$('.plat_nomor_input').mask('0000', { reverse: true, selectOnFocus: true });
				$('.nopol_input').mask('SZ 0XXX ZZZ', {
					selectOnFocus: true, translation: {
						A: { pattern: /[A-Z0-9]/ },
						E: { pattern: /[A-Z0-9]/, optional: true },
						S: { pattern: /[A-Z]/ },
						Z: { pattern: /[A-Z]/, optional: true },
						Y: { pattern: /[0-9]/ },
						X: { pattern: /[0-9]/, optional: true }
					}
				});
				$('.plat_nomor_input').css({ 'text-align': 'right' });
				if ($(".plat_nomor_input").next().hasClass('form-control-feedback')) {
					$(".plat_nomor_input").next().prev().css({ 'padding-right': '50px' });
				}
				$('.plat_nomor_input').keyup(function () {
					if ($(this).val().toString().length == 0) {
						$(this).val(0);
						$(this).focus();
						$(this).select();
					}
				});

				$('.hierarki_input').mask('99-99-99-99-99-99');
				$('.numeric_comma_input').mask('0,000,000,000.00', { reverse: true, selectOnFocus: true });
				$('.numeric_comma_input').css({ 'text-align': 'right' });
				if ($(".numeric_comma_input").next().hasClass('form-control-feedback')) {
					$(".numeric_comma_input").next().prev().css({ 'padding-right': '50px' });
				}
				$('.numeric_comma_input').keyup(function () {
					if ($(this).val().toString().length == 0) $(this).val(0);
				});
				$('.numeric_comma4_input').mask('0,000,000,000.0000', { reverse: true, selectOnFocus: true });
				$('.numeric_comma4_input').css({ 'text-align': 'right' });
				if ($(".numeric_comma4_input").next().hasClass('form-control-feedback')) {
					$(".numeric_comma4_input").next().prev().css({ 'padding-right': '50px' });
				}
				$('.numeric_comma4_input').keyup(function () {
					if ($(this).val().toString().length == 0) $(this).val(0);
				});
				// $('.datetime_input').daterangepicker(initDatePicker());
				// $('.daterange_input').daterangepicker(initDateRangePicker());
				$('.datetime_input').each(function () {
					$(this)[0].readonly = true;
				})
				$('.datetime_input').datetimepicker({
					locale: 'id',
					showTodayButton: true,
					format: 'DD/MM/YYYY'
				});
				$('.time_input').datetimepicker({
					locale: 'id',
					// showTodayButton: true,
					format: 'LT'
				});
				$('.datetime_input').each(function () {
					$(this)[0].readonly = true;
				})
				$('.daterange_input').datetimepicker();
				$('[data-toggle="popover"]').popover({
					html: true
				});
				$('.bpkb_input').focusout(function () {
					console.log('masuk debug bpkb_input');
					var str = $(this).val();
					if ((str[1] == '-') && (str[3] == '-')) {
						str = $(this).val().replace(/\-/gmi, '');
						$(this).val(str.substr(1, str.length - 1));
					} else if ((str[1] == '-') && (str.indexOf(' ') !== -1)) {
						str = $(this).val().replace(/\-/gmi, '');
						$(this).val(str.split(' ')[0]);
					}//asdfasde
				});
			}
		},
		"Reset": function () { },
		"SaveState": function () { },
		"LoadState": function () { },
		"LoadDeadData": function () { },
		"Assign": function (SourceComponent, DestinationComponent) { },
		"Append": function () { },
		"Splice": function () { },
		"Delete": function () { },
		"Commit": function () { },
	}
	TransactionLog = [];
}
// "IndexedDBStorage": {
			// 	async init() {
			// 		if (!window.indexedDB) {
			// 			console.log("IndexedDB is not supported, falling back to localStorage");
			// 			return;
			// 		}
			// 		return new Promise((resolve, reject) => {
			// 			const request = window.indexedDB.open(this.dbName);
			
			// 			request.onerror = (event) => {
			// 				console.log("Error opening db", event);
			// 				reject("Error");
			// 			};
			
			// 			request.onsuccess = (event) => {
			// 				this.db = event.target.result;
			// 				resolve();
			// 			};
			
			// 			request.onupgradeneeded = (event) => {
			// 				this.db = event.target.result;
			// 				const objectStore = this.db.createObjectStore(this.storeName, { keyPath: "id" });
			// 			};
			// 		});
			// 	},
			// 	async createIndex(indexName, keyPath) {
			// 		if (!this.db) {
			// 			throw new Error("IndexedDB is not initialized. Call init() method first.");
			// 		}
			
			// 		const objectStore = this.db.transaction([this.storeName], "readwrite").objectStore(this.storeName);
			// 		objectStore.createIndex(indexName, keyPath);
			// 	},
				
			// 	async create(obj) {
			// 		const transaction = this.db.transaction([this.storeName], "readwrite");
			// 		const objectStore = transaction.objectStore(this.storeName);
			// 		return new Promise((resolve, reject) => {
			// 			const request = objectStore.add(obj);
			// 			request.onsuccess = () => resolve(request.result);
			// 			request.onerror = () => reject(request.error);
			// 		});
			// 	},
			
			// 	async read(id) {
			// 		const transaction = this.db.transaction([this.storeName]);
			// 		const objectStore = transaction.objectStore(this.storeName);
			// 		return new Promise((resolve, reject) => {
			// 			const request = objectStore.get(id);
			// 			request.onsuccess = () => resolve(request.result);
			// 			request.onerror = () => reject(request.error);
			// 		});
			// 	},
				
			// 	async readAll() {
			// 		const transaction = this.db.transaction([this.storeName]);
			// 		const objectStore = transaction.objectStore(this.storeName);
			// 		return new Promise((resolve, reject) => {
			// 			const request = objectStore.getAll();
			// 			request.onsuccess = () => resolve(request.result);
			// 			request.onerror = () => reject(request.error);
			// 		});
			// 	},
			// 	async readAllWhere(key, lower, upper, includeLower = true, includeUpper = true) {
			// 		const transaction = this.db.transaction([this.storeName]);
			// 		const objectStore = transaction.objectStore(this.storeName);
			// 		const range = IDBKeyRange.bound(lower, upper, !includeLower, !includeUpper);
			// 		const index = objectStore.index(key);
			// 		return new Promise((resolve, reject) => {
			// 			const request = index.getAll(range);
			// 			request.onsuccess = () => resolve(request.result);
			// 			request.onerror = () => reject(request.error);
			// 		});
			// 	},
				
			// 	async update(id, obj) {
			// 		const transaction = this.db.transaction([this.storeName], "readwrite");
			// 		const objectStore = transaction.objectStore(this.storeName);
			// 		return new Promise((resolve, reject) => {
			// 			const request = objectStore.put({ ...obj, id });
			// 			request.onsuccess = () => resolve(request.result);
			// 			request.onerror = () => reject(request.error);
			// 		});
			// 	},
			
			// 	async delete(id) {
			// 		const transaction = this.db.transaction([this.storeName], "readwrite");
			// 		const objectStore = transaction.objectStore(this.storeName);
			// 		return new Promise((resolve, reject) => {
			// 			const request = objectStore.delete(id);
			// 			request.onsuccess = () => resolve(request.result);
			// 			request.onerror = () => reject(request.error);
			// 		});
			// 	}

class templates {
	DataTemplate = {
		"Layout": {},
		"Data": {}
	};
	ColumnListTemplate = {
		"ColumnName": "",
		"ColumnLabel": "",
		"IsVisible": true,
		"DataType": [
			"text",
			"select",
			"textarea",
			"list",
			"numeric",
			"float",
			"boolean",
			"date",
			"time",
			"password",
			"button",
			"separator",
			"object"
		],
		"FieldHeader": "",
		"FieldTail": ""
	}
}
/*
	const storage = new IndexedDBStorage('myDatabase', 'myStore');
	await storage.init();
	await storage.create({ id: '1', name: 'Test', age: 20 });
	await storage.create({ id: '2', name: 'Test 2', age: 30 });
	await storage.create({ id: '3', name: 'Test 3', age: 40 });
	const item = await storage.read('1');
	console.log(item);
	const items = await storage.readAll();
	console.log(items); // Outputs: [{ id: '1', name: 'Test' }, { id: '2', name: 'Test 2' }]
	const items = await storage.readAllWhere('age', 25, 35);
	console.log(items); // Outputs: [{ id: '2', name: 'Test 2', age: 30 }]
	await storage.update('1', { name: 'Updated Test' });
	await storage.delete('1');


	const indexedDBStorage = new IndexedDBStorage("myDatabase", "myObjectStore");
	await indexedDBStorage.init();

	// Create an index for the "email" property
	indexedDBStorage.createIndex("emailIndex", "email");
*/
// Create index in 
