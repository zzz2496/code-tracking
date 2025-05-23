class node_properties {
	constructor() {
		//Start on Properties
		this.ID = {
			"UID": "",
			"DocumentID": "",
		};
		this.Defaults = {
			"Worlds": ["Knowledge Base", "Business Logic", "Application", "Data"],
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
				},
				"isDead": {
					"AgeToDie": 0,
					"TimeToLive": 0,
					"TimestampToLive": false,
					"TimeToDie": 0,
					"TimestampToDie": false
				},
				"isDone": {
					"AgeToDie": 0,
					"TimeToLive": 0,
					"TimestampToLive": false,
					"TimeToDie": 0,
					"TimestampToDie": false
				}
			},
			"Schema": {},
		}
		this.GarbageCollectionControl = false;
		this.TransactionLock = { //this.TransactionLock.Status.isLocked
			"Permission": {},
			"Status": {
				"isLocked": true,
				"LockContactID": "ContactID",
				"lockAge": 90, //seconds
				"LockedAt": '2023/05/24 10:10:01',
				"ReleasedAt": '2023/05/24 10:11:31',
			},
			"Log": []
		};
		this.Datastore = {
			// "IndexedDB": {
			// 	"DatabaseName": DatabaseName,
			// 	"StoreName": StoreName,
			// 	"db": null
			// },
			// "SurrealDB": {
			// 	"Namespace": DatabaseName,
			// 	"DatabaseName": SchemaName,
			// 	"TableName": StoreName,
			// },
			// "PostgreSQL": {
			// 	"DatabaseName": DatabaseName,
			// 	"SchemaName": SchemaName,
			// 	"TableName": StoreName,
			// 	"db": null
			// },
			
		}; 
		this.Dataset = { //this.Dataset.Data this.Dataset.Signage[0].Contact
			"Query": "",
			"Data": {},
			"Signage": [{ //array of contacts that signed the document.
				"Contact": "Dataset Kontak",
				"Sign": "cryptography sign"
			}],
			"EnableNextProcessLocking": {
				"Enable": true,
				"MinimumSigns": 1,
			},
			"Checksum": "", //checksum of Dataset.Data
			"BlockChain": "", //checksum calculated from last dataset checksum concatted with current Dataset.data then checksummed.
			"DataType": "Transaksi Faktur Kendaraan Bermotor",//Data Type: Transaksi Penjualan, Transaksi Pembelian, Transaksi Terima Barang
			"DataTypeHeader": "TFKB",//Data Type: Transaksi Penjualan, Transaksi Pembelian, Transaksi Terima Barang
			"DataStatus": [{
				"Status": "isActive",
				"Reason": "Some reason",
				"UpdateTimestamp": "",
				"User": {},
				"AgeToDie": 0,
				"TimeToLive": 0,
				"TimestampToLive": false,
				"TimeToDie": 0,
				"TimestampToDie": false
			}, {
				"Status": "isLive",
				"Reason": "Some other reason",
				"UpdateTimestamp": "",
				"User": {},
				"AgeToDie": 0,
				"TimeToLive": 0,
				"TimestampToLive": false,
				"TimeToDie": 0,
				"TimestampToDie": false
			}], // 1 = isLive, 2 = isActive, 3 = isLocked, 4 = isDead
			"ExternalResource": [{
				"Image": {
					"Type": "JPG",
					"Path": "path/to/file.jpg"
				}
			}, {
				"Document": {
					"Type": "PDF",
					"Path": "path/to/file.pdf"
				}
			}] // NameOfExternalData : PathToExternalData
		};
		this.Queue = {
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
		this.Connections = {
			"Node": "", //REALM, World, Data Node, Processing Node
			"World": {
				"Name": "Business Logic" //ApplicationUserInterface, BusinessLogic, ApplicationData
			} , //What World is this node is a member of
			"IsRoot": true,
			"LinkType": "", //Chain, Route, Form, Queue
			"IndexOfParts": [ // Array containing order of the Siblings -> UID of Siblings
				{ "UID": "" }
			], 
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
			},
			"DataPins": {
				"From": { //These are examples
					"Triggers": [
						{
							"pinUID": "F-36808713-4d13-4eb1-841c-f495f35bd2d2",
							"Label": "Master Kontak",
							"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"]
						},
						{
							"pinUID": "F-f5403398-0a2e-450a-91cf-b33ddc369603",
							"Label": "Master SAMSAT",
							"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"]
						},
						{
							"pinUID": "F-1fc36866-f4de-4dd7-ab83-60b6ed753d45",
							"Label": "Master Blah",
							"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"]
						}
					],
					"Provides": [
						{
							"pinUID": "F-12743cd2-ded7-446f-8eb3-66905dfc1eff",
							"Label": "Master Kontak",
							"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"]
						},
						{
							"pinUID": "F-eeb28e04-bf7b-4cd2-84ac-671159e0650b",
							"Label": "Master SAMSAT",
							"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"]
						},
						{
							"pinUID": "F-ab1cbfc3-cc9e-4207-85cb-01c147fed88c",
							"Label": "Master Blah",
							"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"]
						}
					]
				}, //this.DataPins.To.OtherREALMS.Provides;
				"To": {//These are examples
					"Provides": [
						{
							"pinUID": "T-6e0dae77-d522-41e5-9af0-a47edd5bb1c0",
							"Label": "Dataset",
							"Value": {
								"DocumentID": this.ID.DocumentID,
								"UID": this.ID.UID,
								"Dataset": this.Dataset
							},
							"To": ["F-pinUID", "F-OtherpinUID", "F-SomeOtherpinUID"]
						},
						{
							"pinUID": "T-af36ff58-592a-43aa-89f5-9c69c8a9cb7f",
							"Label": "UID",
							"Value": {
								"UID": this.ID.UID,
							},
							"To": ["F-pinUID", "F-OtherpinUID", "F-SomeOtherpinUID"]
						},
						{
							"pinUID": "T-e60b601c-8416-4b0d-a374-142762d24568",
							"Label": "DocumentID",
							"Value": {
								"DocumentID": this.ID.DocumentID,
							},
							"To": ["F-pinUID", "F-OtherpinUID", "F-SomeOtherpinUID"]
						}
					],
					"Triggers": [
						{
							"pinUID": "T-0a2b204d-5216-48ad-b1c6-5b66330425b6",
							"Label": "Dataset",
							"Value": {
								"DocumentID": this.ID.DocumentID,
								"UID": this.ID.UID,
								"Dataset": this.ID.Dataset
							},
							"To": ["F-pinUID", "F-OtherpinUID", "F-SomeOtherpinUID"]
						},
						{
							"pinUID": "T-990a7cd2-0649-4a1c-bc2c-f25564083907",
							"Label": "UID",
							"Value": {
								"UID": this.ID.UID,
							},
							"To": ["F-pinUID", "F-OtherpinUID", "F-SomeOtherpinUID"]
						},
						{
							"pinUID": "T-48c9cfe7-351d-41de-8081-2c384f9f5890",
							"Label": "DocumentID",
							"Value": {
								"DocumentID": this.ID.DocumentID,
							},
							"To": ["F-pinUID", "F-OtherpinUID", "F-SomeOtherpinUID"]
						}
					]
				}, //containing JSON object for output pin
			}
		};
		this.Presentation = {
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
			"Perspectives": ["GraphNode", "Table", "Form", "JSON", "Kanban", "CSV"],
			"DefaultPerspective": "Form",
			"DefaultContainer": {
				"div": ""
			},
			"PerspectiveSettings": {
				"List": {
					"DatasetSource": this.Defaults.Schema
				},
				"DataGrid": {
					"DatasetSource": this.Dataset.Data
				},
				"Table": {
					"DatasetSource": this.Dataset.Data
				},
				"Grid": {
					"ColumnList": []
				},
				"Card": {
					"ExtraExtraSmall":{},
					"ExtraSmall":{},
					"Small":{},
					"MediumSmall":{},
					"Medium":{},
					"MediumLarge":{},
					"Large":{},
					"ExtraLarge":{},
					"ExtraExtraLarge":{},
				},
				"Calendar": {
					"ColumnList": []
				},
				"Chart": {
					"ColumnList": []
				},
				"GraphNode": {
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
				},
				"JSON": {
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
		this.GeoSpatialInformation = {
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
		this.LatestVersion = true;
	};
};