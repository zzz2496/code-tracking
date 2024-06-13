/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
	const newYear = new Date(this.getFullYear(), 0, 1);
	let day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	const daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
	let weeknum;
	//if the year starts before the middle of a week
	if (day < 4) {
		weeknum = Math.floor((daynum + day - 1) / 7) + 1;
		if (weeknum > 52) {
			let nYear = new Date(this.getFullYear() + 1, 0, 1);
			let nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum + day - 1) / 7);
	}
	return weeknum;
};
function init_x_panel() {
	$('.collapse-link').unbind('click');
	$('.collapse-link').on('click', function () {
		let $BOX_PANEL = $(this).closest('.x_panel'),
			$ICON = $(this).find('i'),
			$BOX_CONTENT = $BOX_PANEL.find('.x_content');

		// fix for some div with hardcoded fix class
		if ($BOX_PANEL.attr('style')) {
			$BOX_CONTENT.slideToggle(200, function () {
				$BOX_PANEL.removeAttr('style');
			});
		} else {
			$BOX_CONTENT.slideToggle(200);
			$BOX_PANEL.css('height', 'auto');
		}
		$ICON.toggleClass('fa-chevron-up fa-chevron-down');
	});
	$('.close-link').unbind('click');
	$('.close-link').click(function () {
		let $BOX_PANEL = $(this).closest('.x_panel');
		$BOX_PANEL.remove();
	});
}
function get_data(url, data, keterangan, callback, cr) {
    if (arguments.length > 4) {
        if (cr == 1) {
            // // // // console.log  'masuk debug post data sync');
            let str = 'http://' + $('#server_name').val() + $('#app_self').val() + url;
            if (str.indexOf('?') == -1) {
                str += '?';
            } else {
                str += '&';
            }
            $.each(data, function(i, d) {
                str += i + '=' + encodeURI(d) + '&';
            });
            str += 'cr=1';
            // // // // console.log  str);
        }
    }
    let msg_number = '';
    let permanotice;
    $.ajax({
        beforeSend: function() {
            msg = keterangan + ' sedang <b style="color:green">diproses</b>...' + '<img src="images/indicator.gif"></img>';
        },
        success: function(data_x) {
            msg = keterangan + ' <b style="color:blue">berhasi</b> diproses...';
            callback(data_x);
        },
        complete: function() {},
        type: "get",
        async: true,
        url: url,
        data: data,
        dataType: "text",
        error: function(data, status, exceptionobj) {
            msg = keterangan + ' <b style="color:red">GAGAL</b> diproses dengan error:<br><br><u><b>Error Status:</b></u> <div>' + data.status + '</div><br><u><b>Error Data:</b></u> <div>' + data.responseText + '</div><br><u><b>Error State:</b></u> <div>' + status + '</div><br><u><b>Error Message:</b></u> <div>' + exceptionobj + '</div>';
            error(msg);
        },
        timeout: 700000,
        cache: false
    });
}

function post_data(url, data, keterangan, callback, cr) {
    if (arguments.length > 4) {
        if (cr == 1) {
            // // // // console.log  'masuk debug post data sync');
            let str = 'http://' + $('#server_name').val() + $('#app_self').val() + url;
            if (str.indexOf('?') == -1) {
                str += '?';
            } else {
                str += '&';
            }
            $.each(data, function(i, d) {
                str += i + '=' + encodeURI(d) + '&';
            });
            str += 'cr=1';
            // // // // console.log  str);
        }
    }
    let msg_number = '';
    let permanotice;
    $.ajax({
        beforeSend: function() {
            msg = keterangan + ' sedang <b style="color:green">diproses</b>...' + '<img src="images/indicator.gif"></img>';
        },
        success: function(data_x) {
            msg = keterangan + ' <b style="color:blue">berhasi</b> diproses...';
            callback(data_x);
        },
        complete: function() {},
        type: "post",
        async: true,
        url: url,
        data: data,
        dataType: "text",
        error: function(data, status, exceptionobj) {
            msg = keterangan + ' <b style="color:red">GAGAL</b> diproses dengan error:<br><br><u><b>Error Status:</b></u> <div>' + data.status + '</div><br><u><b>Error Data:</b></u> <div>' + data.responseText + '</div><br><u><b>Error State:</b></u> <div>' + status + '</div><br><u><b>Error Message:</b></u> <div>' + exceptionobj + '</div>';
            error(msg);
        },
        timeout: 70000,
        cache: false
    });
}

function get_data_sync(url, data, keterangan, callback, cr) {
    if (arguments.length > 4) {
        if (cr == 1) {
            // // // // console.log  'masuk debug post data sync');
            var str = 'http://' + $('#server_name').val() + $('#app_self').val() + url;
            if (str.indexOf('?') == -1) {
                str += '?';
            } else {
                str += '&';
            }
            $.each(data, function(i, d) {
                str += i + '=' + encodeURI(d) + '&';
            });
            str += 'cr=1';
            // // // // console.log  str);
        }
    }
    var msg_number = '';
    var permanotice;
    $.ajax({
        beforeSend: function() {
            var msg = keterangan + ' sedang <b style="color:green">diproses</b>...' + '<img src="images/indicator.gif"></img>';
        },
        success: function(data_x) {
            var msg = keterangan + ' <b style="color:blue">berhasi</b> diproses...';
            callback(data_x);
        },
        complete: function() {},
        type: "get",
        async: false,
        url: url,
        data: data,
        dataType: "text",
        error: function(data, status, exceptionobj) {
            var msg = keterangan + ' <b style="color:red">GAGAL</b> diproses dengan error:<br><br><u><b>Error Status:</b></u> <div>' + data.status + '</div><br><u><b>Error Data:</b></u> <div>' + data.responseText + '</div><br><u><b>Error State:</b></u> <div>' + status + '</div><br><u><b>Error Message:</b></u> <div>' + exceptionobj + '</div>';
            error(msg);
        },
        timeout: 700000,
        cache: false
    });
}

function post_data_sync(url, data, keterangan, callback, cr) {
    if (arguments.length > 4) {
        if (cr == 1) {
            // // // // console.log  'masuk debug post data sync');
            var str = 'http://' + $('#server_name').val() + $('#app_self').val() + url;
            if (str.indexOf('?') == -1) {
                str += '?';
            } else {
                str += '&';
            }
            $.each(data, function(i, d) {
                str += i + '=' + encodeURI(d) + '&';
            });
            str += 'cr=1';
            // // // // console.log  str);
        }
    }
    var msg_number = '';
    var permanotice;
    $.ajax({
        beforeSend: function() {
            var msg = keterangan + ' sedang <b style="color:green">diproses</b>...' + '<img src="images/indicator.gif"></img>';
        },
        success: function(data_x) {
            var msg = keterangan + ' <b style="color:blue">berhasi</b> diproses...';
            callback(data_x);
        },
        complete: function() {},
        type: "post",
        async: false,
        url: url,
        data: data,
        dataType: "text",
        error: function(data, status, exceptionobj) {
            var msg = keterangan + ' <b style="color:red">GAGAL</b> diproses dengan error:<br><br><u><b>Error Status:</b></u> <div>' + data.status + '</div><br><u><b>Error Data:</b></u> <div>' + data.responseText + '</div><br><u><b>Error State:</b></u> <div>' + status + '</div><br><u><b>Error Message:</b></u> <div>' + exceptionobj + '</div>';
            error(msg);
        },
        timeout: 70000,
        cache: false
    });
}

/*
	Queue Types:
		Scheduled
			Available
			Unavailable
		On Process
			Process Succeeded
			Process Failed
		Resume







	[LEGENDS REALMS]

	REALMS>	= REALMS
	RR>		= ROOT node
	RP>		= Parent node
	RS>		= Sibling node
	RC>		= Children node
	<		= Link to Previous Sibling/Node
	>		= Link to Next Sibling/Node
	^	   	= Link to Previous Parent/Node

	REALMS ROOT> The World Tree Yggdrasil
		REALMS> Knowledge Index
			TABLE> Kontak
			TABLE> Jasa
			TABLE> Barang
			TABLE> Business Logic
				DOCUMENT> Business Logic ID
					Info {
						"ID": [ID Business Logic], example: "20230510-133824/TTPO"
						"Name": [Name of the Business Logic], example: "Transaksi Terima Purchase Order",
						"Process_Path": [Process Path], example: {
							"Path": "/Penerimaan Dokumen/TTPO",
							"Order_Number":"/1/1"
						}]
					}
				
		REALMS> Business Process
			TABLE> Stack Persediaan Barang
			TABLE> Queue Pekerjaan on-going

		REALMS> Application
			TABLE> 
				
		REALMS> Data

	REALMS> Business Logic
	
		^RP> Knowledge Index
		RR> Business Logic (Chains) RS> REALMS> Business Logic
		
			^RP> Business Logic 	<RS> REALMs> Queue
			RC> Application Forms RS> Application Forms Extended Data RS> REALMS> Application
			
				^RP> Application Forms
				RC> Dataset RS> Dataset Extended Data 

				
//ON PROGRESS
	REALMs> Queue
		RR>Queue Scheduled
			
			^RP>Queue of Items Scheduled
			RC> Items Available 	<RS> Items Unavailable
		
				^RP> Items Available
				RC> Queue Items On Process
					RC> Process Succeeded 		<RS> Process Failed
					
				Resume

	REALMS> Application 
		^RP> Business Logic 	<RS> Queue
		RRT> Application Forms RS> Application Forms Extended Data
			^RP> Application Forms
			RC> Dataset RS> Dataset Extended Data

	REALMS> Dataset

		^RP> Application Forms
		RC> Dataset 	<RS> Dataset Extended Data


	[LEGENDS CHAINS]

	CHAINS>	= CHAINS
	CR>		= ROOT node
	CP>		= Parent node
	CS>		= Sibling node
	CC>		= Children node
	<		= Link to Previous Sibling/Node
	>		= Link to Next Sibling/Node
	^	   	= Link to Previous Parent/Node

	Example of CHAINS
	CHAINS> PURCHASING

	^CP> Business Logic
	CR>	Memo Request		<CS>Quotation Request 		<CS> Purchase Order 		<CS> Goods Received 		<CS> Invoice Acceptance 		<CS Debt Account Amortization
		CC> Dataset 			CC> Dataset 				CC> Dataset 				CC> Dataset 					CC> Dataset 				CC> Dataset

*/
class node {
	constructor() {
		// TODO document why this constructor is empty
 
	};
	//Start on Properties
	UID = "";
	DocumentID = "";
	Query = "";
	Time = {
		"TimeLog": [],
		"History": [], //Filled by 
		"Age": {
			"isLive": {
				"AgeToDie": 0,
				"TimeToLive": 0,
				"TimestampToLive": false,
				"TimeToDie": 0,
				"TimestampToDie": false
			},
			"isActive": {
				"AgeToDie": 0,
				"TimeToLive": 0,
				"TimestampToLive": false,
				"TimeToDie": 0,
				"TimestampToDie": false
			},
			"isLocked": {
				"AgeToDie": 0,
				"TimeToLive": 0,
				"TimestampToLive": false,
				"TimeToDie": 0,
				"TimestampToDie": false
			}
		},
		"GarbageControll": ""
	};
	Schema = {};
	Dataset = {
		"Data": {
			"Dataset": {},
			"Signage": [{ //array of contacts that signed the document.
				"Contact": ["Dataset Kontak"],
				"Sign": "cryptography sign"
			}],
		},
		"EnableNextProcessLocking": {
			"Enable": true,
			"MinimumSigns": 1,
		},
		"Checksum": "", //checksum of Dataset.Data
		"BlockChain": "", //checksum calculated from last dataset checksum concatted with current Dataset.data then checksummed.
		"DataType": "Transaksi Faktur Kendaraan Bermotor",//Data Type: Transaksi Penjualan, Transaksi Pembelian, Transaksi Terima Barang
		"DataTypeHeader": "TFKB",//Data Type: Transaksi Penjualan, Transaksi Pembelian, Transaksi Terima Barang
		"DataStatus": [
			{
				"Status": "isActive",
				"Reason": "Some reason",
				"UpdateTimestamp": "",
				"User": {}
			},
			{
				"Status": "isLive",
				"Reason": "Some other reason",
				"UpdateTimestamp": "",
				"User": {}
			},
			
		], // 1 = isLive, 2 = isActive, 3 = isLocked, 4 = isDead
		"ExternalResource": [
			{
				"Image": {
					"Type": "JPG",
					"Path": "path/to/file.jpg"
				}
			}
		] // NameOfExternalData : PathToExternalData
	};
	Queue = {
		"State": {
			"Scheduled": true,
			"Available": false,
			"Unavailable": false,
			"OnProcess": false,
			"ProcessSucceeded": false,
			"ProcessFailed": false
		}
		//QUEUE TYPES
		// SCHEDULED
		// 	AVAILABLE 
		// 	UNAVAILABLE
		// ON PROCESS 
		//    PROCESS SUCCESS 
		//    PROCESS FAILED
		// RESUME
		//    COUNTS
		//    AVG	
	};

	Relations = {
		"REALMSIndex": ["The World", "Business Logic", "Application", "Dataset"],
		"REALMS": ["The World"], //Means this node is at the "The World" realm, so it will have access to all of it's descendants. If it's in the "Application" realm, it can only access it's immediate parent, not all of it's ancestor.
		"World": "Business Logic", //What World is this node is a member of
		"LinkType": "", //Chain, Route, Form, Queue
		"Node": "", //ApplicationUserInterface, BusinessLogic, ApplicationData
		"IsRoot": true,
		"IndexOfParts": [
			{ "UID": "" }
		], // Array containing order of the Siblings -> UID of Siblings
		"BusinessProcessPath": "/Path/To/Process",
		"BusinessProcessPathOrderNumber": "/1/2/3",//In sync with BusinessProcessPath
		"References": {
			"Knowledge": {},
			"BusinessProcess": {},
			"Application": {},
			"Data": {
				"Parents": "", // UUID of parent,
				"Children": [], // Array of children
				"Siblings": {},
			},
		},
		"Self": {
			"Past": {},
			"Present": {},
			"Future": {},
		},
		"Chains": {
			"ChainArray": [],
			"RouteArray": [],
		}
	
	};
	Presentation = {
		"Layout": {
			"View": {
				"ExtraSmall": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"Small": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"Medium": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"Large": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"ExtraLarge": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
			},
			"Print": {
				"ExtraSmall": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"Small": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"Medium": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"Large": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
				"ExtraLarge": {
					"Position": 0, //From top to bottom, which order does this element belong to	
					"Visible": 1
				},
			},
		},
		"DefaultPerspective": "",
		"DefaultView": "",
		"DefaultContainer": {
			"div": ""
		},
		"PerspectiveSettings": {
			"Form": {
				"ColumnList": []
			},
			"DataGrid": {
				"ColumnList": []
			},
			"List": {
				"ColumnList": []
			},
			"Table": {
				"ColumnList": []
			},
			"Grid": {
				"ColumnList": []
			},
			"Card": {
				"ColumnList": []
			},
			"Calendar": {
				"ColumnList": []
			},
			"Graph": {
				"ColumnList": []
			},
			"GraphDB": {
				"ColumnList": []
			},
			"CSV": {
				"ColumnList": []
			},
			"Kanban": {
				"ColumnList": []
			},
			"Timeline": {
				"ColumnList": []
			}
		},
		"Theme": {
			"Class": "",
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
	TransactionLog = [];
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
	LatestVersion = true;
};






































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
		"Statistics": {
			"Average": function (Columns) { },
			"Min": function (Columns) { },
			"Max": function (Columns) { },
			"Count": function (Columns, Dataset) {
				if (!Array.isArray(Columns)) return { "status": false, "message": "Columns is not an Array" };
				if (Columns.length == 0) return { "status": false, "message": "Columns is expected to have at least 1 elements" };
				let TempDataset = [];
				let counter = [];
				Columns.forEach((elements, index, arr) => {
					counter.push(0);
				});
				Dataset.forEach((elements, index, arr) => {
					TempDataset.push(elements);
					ColumnNamesForTheResults.forEach((elementsC, indexC, arrC) => {
						if (typeof elements[elementsC] != 'undefined') counter[indexC]++;
					});
				});
				return counter;
			},
			"Sum": function (Columns, Dataset) {
				if (!Array.isArray(Columns)) return { "status": false, "message": "Columns is not an Array" };
				if (Columns.length == 0) return { "status": false, "message": "Columns is expected to have at least 1 elements" };
				let TempDataset = [];
				let result = [];
				Columns.forEach((elements, index, arr) => {
					result.push(0);
				});
				Dataset.forEach((elements, index, arr) => {
					TempDataset.push(elements);
					ColumnNamesForTheResults.forEach((elementsC, indexC, arrC) => {
						if (typeof elements[elementsC] != 'undefined') {
							if (!Number.isNaN(elements[elementsC])) result[indexC] += parseFloat(elements[elementsC]);
						}
					});
				});
				return result;
			},
			"Balance": function (Columns) { },
			"OperationsForColumns": function (Columns, Operator, Dataset, ColumnNamesForTheResults) {
				if (!Array.isArray(Columns)) return { "status": false, "message": "Columns is not an Array" };
				if ((Columns.length == 0) || (Columns.length > 2)) return { "status": false, "message": "Columns is expected to have at least 2 elements" };
				if (typeof Operator != 'undefined') return { "status": false, "message": "Operator is not defined" };
				if (typeof Operator != 'string') return { "status": false, "message": "Operator is not a string" };
				if ((Operator.length == 0) || (Operator.length > 2)) return { "status": false, "message": "Operator is not one or two characters long" };
				if (!Array.isArray(Dataset)) return { "status": false, "message": "Dataset is not an Array" };
				if (!typeof ColumnNamesForTheResults != 'string') return { "status": false, "message": "Column Names For The Results is not a string" };
				if (ColumnNamesForTheResults.length == 0) return { "status": false, "message": "Column Names For The Results is expected to have at least 1 character" };

				let TempDataset = [];
				switch (Operator) {
					case "+":
						//This can accept more than 2 columns
						Dataset.forEach((elements, index, arr) => {
							let TempData = JSON.parse(JSON.stringify(Dataset));
							let TempResultColumn = 0;
							Columns.forEach((elementsC, indexC, arrC) => {
								if (!Number.isNaN(elements[elementsC])) TempResultColumn += parseFloat(elements[elementsC]);
							});
							TempData[ColumnNamesForTheResults] = TempResultColumn;
							TempDataset.push(TempData);
						});
						break;
					case "-":
						//This can accept more than 2 columns
						Dataset.forEach((elements, index, arr) => {
							let TempData = JSON.parse(JSON.stringify(Dataset));
							let TempResultColumn = 0;
							Columns.forEach((elementsC, indexC, arrC) => {
								if (!Number.isNaN(elements[elementsC])) TempResultColumn -= parseFloat(elements[elementsC]);
							});
							TempData[ColumnNamesForTheResults] = TempResultColumn;
							TempDataset.push(TempData);
						});
						break;
					case "*":
						//This can accept more than 2 columns
						Dataset.forEach((elements, index, arr) => {
							let TempData = JSON.parse(JSON.stringify(Dataset));
							let TempResultColumn = 0;
							Columns.forEach((elementsC, indexC, arrC) => {
								if (!Number.isNaN(elements[elementsC])) TempResultColumn *= parseFloat(elements[elementsC]);
							});
							TempData[ColumnNamesForTheResults] = TempResultColumn;
							TempDataset.push(TempData);
						});
						break;
					case "/":
						//This can accept more than 2 columns
						Dataset.forEach((elements, index, arr) => {
							let TempData = JSON.parse(JSON.stringify(Dataset));
							let TempResultColumn = 0;
							Columns.forEach((elementsC, indexC, arrC) => {
								if (!Number.isNaN(elements[elementsC])) TempResultColumn /= parseFloat(elements[elementsC]);
							});
							TempData[ColumnNamesForTheResults] = TempResultColumn;
							TempDataset.push(TempData);
						});
						break;
					case "%":
						//This can accept more than 2 columns
						Dataset.forEach((elements, index, arr) => {
							let TempData = JSON.parse(JSON.stringify(Dataset));
							let TempResultColumn = 0;
							Columns.forEach((elementsC, indexC, arrC) => {
								if (!Number.isNaN(elements[elementsC])) TempResultColumn %= parseFloat(elements[elementsC]);
							});
							TempData[ColumnNamesForTheResults] = TempResultColumn;
							TempDataset.push(TempData);
						});
						break;
					case "%%":
						//This CANNOT accept more than 2 columns
						Dataset.forEach((elements, index, arr) => {
							let TempData = JSON.parse(JSON.stringify(Dataset));
							let ColOneValue = 0;
							let ColTwoValue = 0;
							if (!Number.isNaN(elements[Columns[0]])) ColOneValue = parseFloat(elements[Columns[0]]);
							if (!Number.isNaN(elements[Columns[1]])) ColTwoValue = parseFloat(elements[Columns[1]]);
							TempData[ColumnNamesForTheResults] = ((ColOneValue / ColTwoValue) * 100).toString() + '%';
							TempDataset.push(TempData);
						});
						break;
				}
				return TempDataset;
			},
		},
		"Filter": function () { },
		"Sort": function () { },
		"Refresh": function () { },
		"GarbageSweep": function () { }
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
			"GoToHead":function(){},
			"GoToTail":function(){},
			"GoToNode":function(TypeOfNode, WhatTypeOfNode){},
			"NextNode":function(){},
			"PrevNode":function(){},
		}
	};
	Render = {
		"Refresh" : function(){},
		"Update" : function(){},
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
			"List": function($fetch, tlegend, id = ''){},
			"Table": function($fetch, tlegend, id = ''){},
			"Grid": function($fetch, tlegend, id = ''){},
			"Card": function($fetch, tlegend, id = ''){},
			"Calendar": function($fetch, tlegend, id = ''){},
			"Graph": function($fetch, tlegend, id = ''){},
			"GraphDB": function($fetch, tlegend, id = ''){},
			"CSV": function($fetch, tlegend, id = ''){},
			"Kanban": function($fetch, tlegend, id = ''){},
			"Timeline": function($fetch, tlegend, id = ''){}
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
	TransactionLog = [];
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
			"Delete": function () { },
		},
		"DataOutput": {
			"PrintHTML": function (title, str, style, print, autoclose){
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
				if ((arguments.length>=4)&&(print)){
					// mywindow.document.write("setTimeout(function() {window.print();}, 2000);");
					mywindow.document.write("window.print();");
				}
				if ((arguments.length>=5)&&(autoclose)){
					mywindow.document.write("setTimeout(function() {parent = window.self;parent.opener = window.self;parent.close();}, 1000);");
					// mywindow.document.write('');
				}
				mywindow.document.write('})');
				mywindow.document.write('</script>');
				mywindow.document.write('</head>');
				mywindow.document.write('<body class="nav-md" style="background-color:white;color:black;>');
				mywindow.document.write('<div class="container body">');
				if (arguments.length >= 3){
					mywindow.document.write('<div class="main_container" id="container_faktur" style="style="width:21.5cm;">');
				}else{
					mywindow.document.write('<div class="main_container" id="container_faktur" style="style="'+style+'">');
				}
				mywindow.document.write('<div class="main_container" id="container_faktur" style="style="width:21.5cm;">');
				if (title.length>0) mywindow.document.write('<div align="center"><h3>' + title  + '</h3></div>');
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
			"AsCSV": function (data_laporan, cr=1) { 
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
							console.log("Error, typeof rowArray["+i+"] bukan object", (typeof rowArray), rowArray);
						};
		
					}
					csvContent += row + "\r\n";
					if ($cr) {
						console.log('Row '+i, row);
					};
				});
				var encodedUri = encodeURI(csvContent);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				var date = new Date;
				var date_str =  date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
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
		"Reset": function(){},
		"SaveState": function(){},
		"LoadState": function(){},
		"LoadDeadData": function(){},
		"Assign": function (SourceComponent, DestinationComponent){},
		"Append": function(){},
		"Splice": function(){},
		"Delete": function(){},
		"Commit": function(){},
	}
}

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

class Utility {
	constructor() {
		console.log("Utility class initialized !");
	}
	Text = {
		"Trim": function (str) {
			return str.trim();
		},
		"UCwords": function (str) {
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		},
		"LCwords": function (str) {
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toLowerCase();
			});
		},
		"SafeString": function (str) {
			// console.log(typeof str);
			if (typeof str != "string") return { "status": false, "message": "input is not a string" };
			if (str.length == 0) return { "status": false, "message": "string length is 0" };

			var t = str;
			t = t.replace(/[^a-zA-Z0-9\/\s\-\_\,\.\+\(\)\@\$\=\%\:\&\<\>\']/gi, '');
			t = t.replace(/\s\s+/gmi, ' ');
			t = t.replace(/[\n\f\r]/gi, ' ');
			return t;
		},
		"ThousandSeparator": function (num, decpoint, sep) {
			if (num == null) num = 0;
			// check for missing parameters and use defaults if so
			if (arguments.length == 2) {
				sep = ",";
			}
			if (arguments.length == 1) {
				sep = ",";
				decpoint = ".";
			}
			// need a string for operations
			num = num.toString();
			// separate the whole number and the fraction if possible
			let a = num.split(decpoint);
			let x = a[0]; // decimal
			let y = a[1]; // fraction
			let z = "";

			if (typeof (x) != "undefined") {
				// reverse the digits. regexp works from left to right.
				for (let i = x.length - 1; i >= 0; i--) z += x.charAt(i);
				// add seperators. but undo the trailing one, if there
				z = z.replace(/(\d{3})/g, "$1" + sep);
				if (z.slice(-sep.length) == sep) z = z.slice(0, -sep.length);
				// // // // console.log z);
				x = "";
				// reverse again to get back the number
				for (let i = z.length - 1; i >= 0; i--) x += z.charAt(i);
				// add the fraction back in, if it was there
				if (typeof (y) != "undefined" && y.length > 0) x += decpoint + y;
			}
			x = x.replace('-,', '-');
			return x;
		},
		"ToRoman": function (N, s, b, a, o, t) {
			t = N / 1e3 | 0;
			N %= 1e3;
			for (s = b = '', a = 5; N; b++, a ^= 7)
				for (o = N % a, N = N / a ^ 0; o--;)
					s = 'IVXLCDM'.charAt(o > 2 ? b + N - (N &= ~1) + (o = 1) : b) + s;
			return Array(t + 1).join('M') + s;
		},
		"cr": function (json) {
			return '<pre>' + print_r(json) + '</pre>';
		},
		"Readable": function (str) {
			return this.ToUpperCase(str.replace(/\_/gi, ' '));
		},
		"UnReadable": function (str) {
			return str.replace(/[\s\.\-]/gi, '_').toLowerCase();
		},
		"Pad": function (number, length) {
			var str = '' + number;
			while (str.length < length) {
				str = '0' + str;
			}
			return str;
		}
	};
	Numbers = {
		"Round1": function (num) {
			return Math.round(parseFloat(num) * 10) / 10;
		},
		"Round2": function (num) {
			return Math.round(parseFloat(num) * 100) / 100;
		},
		"Round3": function (num) {
			return Math.round(parseFloat(num) * 1000) / 1000;
		},
		"Round4": function (num) {
			return Math.round(parseFloat(num) * 10000) / 10000;
		},
		"Round5": function (num) {
			return Math.round(parseFloat(num) * 100000) / 100000;
		}
	};
	Array = {
		"ArrayKeys": function (input, search_value, argStrict) {
			// http://kevin.vanzonneveld.net
			// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +      input by: Brett Zamir (http://brett-zamir.me)
			// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +   improved by: jd
			// +   improved by: Brett Zamir (http://brett-zamir.me)
			// +   input by: P
			// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
			// *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
			// *     returns 1: {0: 'firstname', 1: 'surname'}

			var search = typeof search_value !== 'undefined',
				tmp_arr = [],
				strict = !!argStrict,
				include = true,
				key = '';

			if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
				return input.keys(search_value, argStrict);
			}

			for (key in input) {
				if (input.hasOwnProperty(key)) {
					include = true;
					if (search) {
						if (strict && input[key] !== search_value) {
							include = false;
						} else if (input[key] != search_value) {
							include = false;
						}
					}

					if (include) {
						tmp_arr[tmp_arr.length] = key;
					}
				}
			}

			return tmp_arr;
		},
		"arrayDiff": function (arr1) {
			// Returns the entries of arr1 that have values which are not present in any of the others arguments.
			//
			// version: 1109.2015
			// discuss at: http://phpjs.org/functions/array_diff    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +   improved by: Sanjoy Roy
			// +    revised by: Brett Zamir (http://brett-zamir.me)
			// *     example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']);
			// *     returns 1: {0:'Kevin'}
			var retArr = {},
				argl = arguments.length,
				k1 = '',
				i = 1,
				k = '',
				arr = {};

			arr1keys: for (k1 in arr1) {
				for (i = 1; i < argl; i++) {
					arr = arguments[i];
					for (k in arr) {
						if (arr[k] === arr1[k1]) {
							// If it reaches here, it was found in at least one array, so try next value
							continue arr1keys;
						}
					}
					retArr[k1] = arr1[k1];
				}
			}
			return retArr;
		},
		"searchArray": function (colName, search_val, inputArray, ilike = 1) {
			var found = [];
			if (Array.isArray(inputArray)) {
				inputArray.forEach((elements, index, arr) => {
					// console.log(elements);
					for (const [i, d] of Object.entries(elements)) {
						console.log(i, d);
						if ((colName != '*') && (colName == '')) {
							if (i == colName) {
								if (ilike == 1) {
									if (d.indexOf(search_val) > -1) {
										found.push({
											idx: index,
											obj: JSON.parse(JSON.stringify(elements))
										});
									}
								} else {
									if (i === search_val) {
										found.push({
											idx: index,
											obj: JSON.parse(JSON.stringify(elements))
										});
									}
								}
							}
						} else {
							if (ilike == 1) {
								if (d.indexOf(search_val) > -1) {
									found.push({
										idx: index,
										obj: JSON.parse(JSON.stringify(elements))
									});
								}
							} else {
								if (i === search_val) {
									found.push({
										idx: index,
										obj: JSON.parse(JSON.stringify(elements))
									});
								}
							}
						}
					}
				});
			} else {
				for (const [i, d] of Object.entries(inputArray)) {
					console.log('sini');
					if ((colName != '*') && (colName == '')) {
						if (i == colName) {
							if (ilike == 1) {
								if (d.indexOf(search_val) > -1) {
									found.push({
										idx: i,
										obj: JSON.parse(JSON.stringify(d))
									});
								}
							} else {
								if (i === search_val) {
									found.push({
										idx: i,
										obj: JSON.parse(JSON.stringify(d))
									});
								}
							}
						}
					} else {
						if (ilike == 1) {
							if (d.indexOf(search_val) > -1) {
								found.push({
									idx: i,
									obj: JSON.parse(JSON.stringify(d))
								});
							}
						} else {
							if (i === search_val) {
								found.push({
									idx: i,
									obj: JSON.parse(JSON.stringify(d))
								});
							}
						}
					}
				}
			}
			console.log(found);
			if (found.length == 0) {
				return false;
			} else {
				return found;
			}
		},
		"dynamicSortMultiple": function () {
			var props = [];
			/*Let's separate property name from ascendant or descendant keyword*/
			for (var i = 0; i < arguments.length; i++) {
				var splittedArg = arguments[i].split(/ +/);
				props[props.length] = [splittedArg[0], (splittedArg[1] ? splittedArg[1].toUpperCase() : "ASC")];
			}
			return function (obj1, obj2) {
				var i = 0, result = 0, numberOfProperties = props.length;
				/*Cycle on values until find a difference!*/
				while (result === 0 && i < numberOfProperties) {
					result = this.dynamicSort(props[i][0], props[i][1])(obj1, obj2);
					i++;
				}
				return result;
			}
		},
		/*Base function returning -1,1,0 for custom sorting*/
		"dynamicSort": function (property, isAscDesc) {
			return function (obj1, obj2) {
				if (isAscDesc === "DESC") {
					return ((obj1[property] > obj2[property]) ? (-1) : ((obj1[property] < obj2[property]) ? (1) : (0)));
				}
				/*else, if isAscDesc==="ASC"*/
				return ((obj1[property] > obj2[property]) ? (1) : ((obj1[property] < obj2[property]) ? (-1) : (0)));
			}
		}
		// call the function by something like this:
		// arr.sort(dynamicSortMultiple("c DESC","b Asc","a"));
	}
	Password = {
		"MakeSalt": function () { },
		"sha256": function () { },
		"md5": function () { },
		"Encrypt": function () { }
	};
	Timestamp = {
		"mode": "dmy",
		"initDate": function (date, mode = this.mode) {
			switch (mode) {
				case "dmy":
					// console.log(typeof date);
					if (typeof date == 'string') {
						var arrayDate;
						var arrayTime;
						if (date.length > 10) {
							arrayDate = date.split(' ');
							arrayTime = arrayDate[1];

							arrayDate = arrayDate[0];
							arrayDate = arrayDate.split(arrayDate[2]);

							arrayTime = arrayTime.split(arrayTime[2]);
						} else {
							arrayDate = date.split(date[2]);

						}
						// console.log(arrayDate);
						// console.log(arrayTime);
						return new Date(Date.UTC(arrayDate[2], arrayDate[1] - 1, arrayDate[0], arrayTime[0], arrayTime[1], arrayTime[2]));
					} else if (typeof date == 'number') {
						return new Date(Date.UTC(date));
					}
					break;
				case "ymd":
					var arrayDate = date.split(date[4]);
					// console.log(arrayDate);
					return new Date(Date.UTC(arrayDate[0], arrayDate[1], arrayDate[2]));
					break;
				case "mdy":
					var arrayDate = date.split(date[2]);
					// console.log(arrayDate);
					return new Date(Date.UTC(arrayDate[2], arrayDate[0], arrayDate[1]));
					break;
			}
		},
		"addDays": function (date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		},
		"subDays": function (date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() - days);
			return result;
		},
		"formatDate": function (date, mode = this.mode) {
			switch (mode) {
				case "dmy":
					return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
					break;
				case "ymd":
					return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
					break;
				case "mdy":
					return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
					break;
			}
		},
		"getNow": function (mode = this.mode) {
			return new Date;
			// return this.formatDate(new Date, mode);
		},
		"getToday": function (mode = this.mode) {
			return this.formatDate(new Date, mode);
		},
		"getTodayDate": function (mode = this.mode) {
			return new Date().getDate();
		},
		"getTodayDayOfWeek": function (mode = this.mode) {
			return new Date().getDay();
		},
		"getTodayWeek": function (mode = this.mode) {
			return new Date().getWeek();
		},
		"getTodayMonth": function (datetime, mode = this.mode) {
			return new Date().getMonth() + 1;
		},
		"getTodayYear": function (datetime, mode = this.mode) {
			return new Date().getFullYear();
		},
		"getTomorrow": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.addDays(date, 1);
		},
		"getYesterday": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.addDays(date, -1);
		},
		"getNextWeek": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.addDays(date, 7);
		},
		"getNextWeekStart": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			var nextWeek = this.addDays(date, 7);
			var day = (nextWeek.getDay()) * -1;
			return this.addDays(nextWeek, day + 1);
		},
		"getNextWeekEnd": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			var nextWeek = this.addDays(date, 7);
			var day = (nextWeek.getDay() * -1) + 7;
			return this.addDays(nextWeek, day);
		},
		"getLastWeek": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.addDays(date, -7);
		},
		"getLastWeekStart": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			var nextWeek = this.addDays(date, -7);
			var day = (nextWeek.getDay()) * -1;
			return this.addDays(nextWeek, day + 1);
		},
		"getLastWeekEnd": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			var nextWeek = this.addDays(date, -7);
			var day = (nextWeek.getDay() * -1) + 7;
			return this.addDays(nextWeek, day);
		},
		"getNextMonthStart": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() + 1, 1);
		},
		"getNextMonthEnd": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() + 2, 0);
		},
		"getLastMonth": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() - 1, 1);
		},
		"getLastMonthStart": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() - 1, 1);
		},
		"getLastMonthEnd": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth(), 0);
		},
		"getLastYear": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear() - 1, date.getMonth() + 1, 0);
		},
		"getNextYear": function (datetime, mode = this.mode) {
			var date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear() + 1, date.getMonth() + 1, 0);
		},
		"getDiff": {
			inSeconds: function (d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseFloat((t2 - t1) / 1000);
			},
			inMinutes: function (d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseFloat((t2 - t1) / 60000);
			},
			inHours: function (d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseFloat((t2 - t1) / 3600000);
			},
			inDays: function (d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseFloat((t2 - t1) / (24 * 3600 * 1000));
			},
			inWeeks: function (d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();
				return parseFloat((t2 - t1) / (24 * 3600 * 1000 * 7));
			},
			inMonths: function (d1, d2) {
				var d1Y = d1.getFullYear();
				var d2Y = d2.getFullYear();
				var d1M = d1.getMonth();
				var d2M = d2.getMonth();
				return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
			},
			inYears: function (d1, d2) {
				return d2.getFullYear() - d1.getFullYear();
			}
		}
	};
	Window = {
		"popUp": function (URL) {
			var reUA = /MSIE/;
			if (reUA.test(navigator.userAgent)) {
				var $w = document.body.offsetWidth;
				var $h = document.body.offsetHeight;

			} else {
				var $w = window.outerWidth;
				var $h = window.outerHeight;
			}
			day = new Date();
			id = day.getTime();
			eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=" + $w + ",height=" + $h + ",left = 0,top = 0');");
		}
	}
}

let testUtil = new Utility;
let test_object = new node;
test_object['Methods'] = {};
node_methods.bind(test_object['Methods']);
// test_object.DocumentID = test_object.Methods.Initialize.GenerateDocumentID();
// test_object.UID = test_object.Methods.Initialize.GenerateUID();
console.log('test_object', test_object);

// console.log(testUtil.Text.SafeString('Anjing  enak      banget    .    .        .'));
// console.log(testUtil.Text.UCwords('Anjing  enak      banget    .    .        .'));
// console.log(testUtil.Text.LCwords('Anjing  enak      banget    .    .        .'));
// console.log(testUtil.Text.ThousandSeparator('123456'));
// console.log(testUtil.Numbers.Round1(123.5556666));
// console.log(testUtil.Numbers.Round2(123.5556666));
// console.log(testUtil.Numbers.Round3(123.5556666));
// console.log(testUtil.Numbers.Round4(123.5556666));
// console.log(testUtil.Numbers.Round5(123.5556666));
// console.log(testUtil.Text.Pad(100.13, 10));
// console.log(testUtil.Timestamp.mode);
// console.log(testUtil.Timestamp.initDate('01-01-2023 12:31:02'));
console.log(testUtil.Timestamp.getNow());
console.log(testUtil.Timestamp.getToday());
console.log(testUtil.Timestamp.getTodayDate());
console.log(testUtil.Timestamp.getTodayDayOfWeek());
console.log(testUtil.Timestamp.getTodayWeek());
console.log(testUtil.Timestamp.getTodayMonth());
console.log(testUtil.Timestamp.getTodayYear());
console.log(testUtil.Timestamp.getTomorrow((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getYesterday((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getNextWeek((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getNextWeekStart((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getNextWeekEnd((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getLastWeek((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getLastWeekStart((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getNow().getDay());
console.log(testUtil.Timestamp.getNextMonthStart((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getNextMonthEnd((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getLastMonthStart((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getLastMonthEnd((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getLastYear((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getNextYear((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
console.log(testUtil.Timestamp.getDiff.inSeconds((testUtil.Timestamp.initDate('01-02-2023 12:31:02')), (testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
// console.log(testUtil.Timestamp.formatDate((testUtil.Timestamp.initDate('28-02-2023 12:31:02'))));
// var
// 	arr = {
// 		"Damir": 'waaa',
// 		"Damir1": 'wiiii',
// 		"Damir2": 'wuuuu',
// 		"Damir3": 'weee',
// 		"Damir4": 'woooo',
// 		"Putri": "weee"
// 	}
// arr = [
// 	{ "Damir": 'waaa', "Hendra": "1" },
// 	{ "Damir1": 'wiiii', "Hendra1": "2"  },
// 	{ "Damir2": 'wuuuu', "Hendra2": "w3"  },
// 	{ "Damir3": 'weee', "Hendra3": "4"  },
// 	{ "Damir4": 'woooo', "Hendra4": "5"  },
// 	{ "Putri": "weee", "Indra": "4"  }
// ];
// console.log(testUtil.Array.ArrayKeys(arr));
// console.log(testUtil.Array.searchArray('Da', '', arr));
// console.log(typeof arr);
// console.log(testUtil.Timestamp.getThisMonth());
// console.log(testUtil.Timestamp.getToday());
// console.log(testUtil.Timestamp.getToday());
// console.log(testUtil.Timestamp.getToday());
// console.log(testUtil.Timestamp.getToday());
// console.log(testUtil.Timestamp.getToday());
// console.log(testUtil.Timestamp.initDate(2023));
// var zzz = new Date;
// console.log(zzz.getWeek())
console.log(testUtil);

var variables = {
	"calendar": {
		"value": "value e calendar",
		"next_node": null
	},
	"data_view_options": {
		"value": "value e data_view_options",
		"next_node": null
	},
	"datatable_param": {
		"value": "value e datatable_param",
		"next_node": null
	},
	"datatable": {
		"value": "value e datatable"
	},
	"action": {
		"value": "ACTIONNNNN!!!"
	},
};

variables.calendar.next_node = variables.datatable_param;
variables.datatable_param.next_node = variables.data_view_options;
variables.data_view_options.next_node = variables.datatable;
variables.datatable['next_node'] = variables.action;
console.log(variables);
var cursor = {};
cursor = variables.calendar;
while ((cursor.next_node != null) && (typeof cursor.next_node != undefined)) {
	console.log('value: ', cursor.value);
	console.log('next node: ', cursor.next_node);
	// if ((cursor.next_node != null) && (typeof cursor.next_node != undefined))
		cursor = cursor.next_node;
}


