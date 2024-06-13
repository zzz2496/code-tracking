export class NodeProperties {
	constructor() {
		//Start on Properties
		this.id = "";
		this.Identification = {
			"UID": "",
			"BatchProcessingID": "",
			"Name": "",
			"Label": "",
			"Header": "",
			"Footer": "",
			"Table": "",
			"Database": "",
			"Namespace": "",
		};
		this.NodeInfo = {
			"Type": "", //Function Node, Document Node, Container Node, Other Node
			"isNew": true,
			"isChanged": false,
			"Document": {
				"isReadonly":false,
			},
			"Execution": {
				"Status": "Run", //Run/Pause/Stop/Debug
				"RunOrder": null, // to make it automatically according to the path, or numeric to set the order to a specific order of execution.
			}
		};
		this.Timestamp = null;
		this.History = {
			"Past": {
				"UUID": [] //Array of UUIDs of Self
			},
			"Future": {
				"UUID": [] //Array of UUIDs of Self
			},
		};
		this.Connections = {
			"Pins": []
		};

		this.Form = {

		};
		this.Parameters = {
			
		};
		this.Dataset = { //this.Dataset.Data this.Dataset.Signage[0].Contact
			"Query": "",
			"Schema":{},
			"Data": {},
			"EnableNextProcessLocking": {
				"Enable": false, //or True
				"MinimumSigns": 1, // or whatever signs needed to continume
				"Signage": [{ //array of contacts that signed the document.
					"Contact": "", // UUID contact
					"Sign": "", // Cryptographic sign
				}],
			},
			"Checksum": "", //checksum of Dataset.Data
			"BlockChain": "", //checksum calculated from last dataset checksum concatted with current Dataset.data then checksummed.
			"DataType": "",//Data Type: Transaksi Penjualan, Transaksi Pembelian, Transaksi Terima Barang
			"DataStatus": [/*{
				"Status": "isActive",
				"Reason": "Some reason",
				"UpdateTimestamp": "",
				"User": {},
				"Age": {
					"AgeToDie": 0, // in seconds
					"TimeToLive": 0, // in seconds
					"TimestampToLive": false, //datetime
					"TimeToDie": 0, // in seconds
					"TimestampToDie": false //datetime
				},
			}, {
				"Status": "isLive",
				"Reason": "Some other reason",
				"UpdateTimestamp": "",
				"User": {},
				"Age": {
					"AgeToDie": 0, // in seconds
					"TimeToLive": 0, // in seconds
					"TimestampToLive": false, //datetime
					"TimeToDie": 0, // in seconds
					"TimestampToDie": false //datetime
				},
			}*/], // 1 = isLive, 2 = isActive, 3 = isLocked, 4 = isDead
			"ExternalResource": [{
				"Document": {
					"Type": "", //Image/JPG, Image/TIFF, Image/GIF, Image/BMP, Document/PDF, Document/DOCX, Document/XLSX, etc
					"Path": "", //path/to/file.jpg
				}
			}] // NameOfExternalData : PathToExternalData
		};
		this.Presentation = {
			"Perspectives": {
				"GraphNode": {					
					"HeaderLabel": "",
					"Header":"",
					"ContentLabel": "",
					"Content":"",
					"Position":{
						x:0,
						y:0,
						z:"auto"
					},
				},
				"List": {
					"DatasetSource": ""
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
					"ExtraExtraSmall": {},
					"ExtraSmall": {},
					"Small": {},
					"MediumSmall": {},
					"Medium": {},
					"MediumLarge": {},
					"Large": {},
					"ExtraLarge": {},
					"ExtraExtraLarge": {},
				},
				"Calendar": {

				},
				"Chart": {

				},
				"CSV": {

				},
				"Kanban": {

				},
				"Timeline": {

				},
				"JSON": {

				}
			},
			"DefaultContainer": {
				"element": null, //DOMelement
				"elementID": "", //ID string
				"elementClass": "" //Class string
			}, //element
			"Container": {
				"element": null, //DOMelement
				"elementID": "", //ID string
				"elementClass": "" //Class string
			},
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
		this.LatestVersion = true; // or false
		this.GarbageCollectionControl = false; // if true then this node will be pruned when ETA is up.
	}
};



export class NodePropertiesOld {
	constructor() {
		//Start on Properties
		this.UID = "";
		this.DocumentID = "";
		this.DocumentBatchProcessingID = "";
		this.DocumentName = "";
		this.DocumentLabel = "";
		this.DocumentHeader = "";
		this.DocumentFooter = "";
		this.DocumentType = ""; //Data Node, Processing Node, Document Node, Other node
		this.DocumentWorld = ""; //Table
		this.DocumentRealm = ""; //Database
		this.DocumentUniverse = ""; //Namespace
		this.NewNode = true;
		this.Changed = false;
		this.Timestamp = null;
		this.NodeExecution = {
			"Status": "Run", //Run/Pause/Stop/Debug
			"RunOrder": null, // to make it automatically according to the path, or numeric to set the order to a specific order of execution.
		};
		this.History = {
			"Past": {
				"UUID": [] //Array of UUIDs of Self
			},
			"Future": {
				"UUID": [] //Array of UUIDs of Self
			},
		};
		this.ConnectionPinTemplate = {
			"pinUID": "",
			"pinType": "", // Input or Output
			"Label": "",
			"PositionOnNode":"", // Top, Left, Right, Bottom
			"Trigger": false,
			"Source":[],
			"Destination":[],
			"TriggerUID": "",
			"Value": {
				// "DocumentID": null,
				// "UID": null,
				// "Dataset": null
			}
		}
		this.Connections = {
			"Pins": []
		};
		// Template Data pins
		// "Pins": {
		// 	"Inputs": [{
		// 		"pinUID": "F-36808713-4d13-4eb1-841c-f495f35bd2d2",
		// 		"Label": "Master Kontak",
		// 		"PinPosition":"Top", //Top, Left, Right, Bottom
		// 		"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"],
		// 		"triggerFunction": "functionName"
		// 	},{
		// 		"pinUID": "F-12743cd2-ded7-446f-8eb3-66905dfc1eff",
		// 		"Label": "Master Kontak",
		// 		"From": ["T-pinUID", "T-OtherpinUID", "T-SomeOtherpinUID"],
		// 		"triggerFunction": "functionName"
		// 	}],
		// 	"Outputs": {
		// 		"Triggers": [{ //This pin will not trigger the output
		// 			"pinUID": "T-0a2b204d-5216-48ad-b1c6-5b66330425b6",
		// 			"Label": "Dataset",
		// 			"Value": {
		// 				"DocumentID": this.UID,
		// 				"UID": this.DocumentID,
		// 				"Dataset": this.Dataset
		// 			},
		// 			"To": [{
		// 					"pinUID":"F-pinUID",
		// 					"triggerFunction":"" //Some method on the receiving end.
		// 				},{
		// 					"pinUID": "F-OtherpinUID",
		// 					"triggerFunction": "" //Some method on the receiving end.
		// 				}, {
		// 					"pinUID": "F-SomeOtherpinUID",
		// 					"triggerFunction": "" //Some method on the receiving end.
		// 				}
		// 			],
		// 		}],
		// 		"Provides": [{ //This pin will not trigger the output
		// 			"pinUID": "T-6e0dae77-d522-41e5-9af0-a47edd5bb1c0",
		// 			"Label": "Dataset",
		// 			"Value": { //Data object that is provided to other objects for quick access
		// 				"DocumentID": this.UID,
		// 				"UID": this.DocumentID,
		// 				"Dataset": this.Dataset
		// 			},
		// 			"To": [{
		// 					"pinUID": "F-pinUID",
		// 				}, {
		// 					"pinUID": "F-OtherpinUID",
		// 				}, {
		// 					"pinUID": "F-SomeOtherpinUID",
		// 				}
		// 			],
		// 		}],
		// 	},
		// }
		this.Dataset = { //this.Dataset.Data this.Dataset.Signage[0].Contact
			"Query": "",
			"Schema":{},
			"Data": {},
			"EnableNextProcessLocking": {
				"Enable": false, //or True
				"MinimumSigns": 1, // or whatever signs needed to continume
				"Signage": [{ //array of contacts that signed the document.
					"Contact": "", // UUID contact
					"Sign": "", // Cryptographic sign
				}],
			},
			"Checksum": "", //checksum of Dataset.Data
			"BlockChain": "", //checksum calculated from last dataset checksum concatted with current Dataset.data then checksummed.
			"DataType": "",//Data Type: Transaksi Penjualan, Transaksi Pembelian, Transaksi Terima Barang
			"DataStatus": [/*{
				"Status": "isActive",
				"Reason": "Some reason",
				"UpdateTimestamp": "",
				"User": {},
				"Age": {
					"AgeToDie": 0, // in seconds
					"TimeToLive": 0, // in seconds
					"TimestampToLive": false, //datetime
					"TimeToDie": 0, // in seconds
					"TimestampToDie": false //datetime
				},
			}, {
				"Status": "isLive",
				"Reason": "Some other reason",
				"UpdateTimestamp": "",
				"User": {},
				"Age": {
					"AgeToDie": 0, // in seconds
					"TimeToLive": 0, // in seconds
					"TimestampToLive": false, //datetime
					"TimeToDie": 0, // in seconds
					"TimestampToDie": false //datetime
				},
			}*/], // 1 = isLive, 2 = isActive, 3 = isLocked, 4 = isDead
			
			"ExternalResource": [{
				"Document": {
					"Type": "", //Image/JPG, Image/TIFF, Image/GIF, Image/BMP, Document/PDF, Document/DOCX, Document/XLSX, etc
					"Path": "", //path/to/file.jpg
				}
			}] // NameOfExternalData : PathToExternalData
		};
		this.Presentation = {
			"Perspectives": {
				"GraphNode": {					
					"HeaderLabel": "",
					"Header":"",
					"ContentLabel": "",
					"Content":"",
					"Position":{
						x:0,
						y:0,
						z:"auto"
					},
				},
				"List": {
					"DatasetSource": ""
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
					"ExtraExtraSmall": {},
					"ExtraSmall": {},
					"Small": {},
					"MediumSmall": {},
					"Medium": {},
					"MediumLarge": {},
					"Large": {},
					"ExtraLarge": {},
					"ExtraExtraLarge": {},
				},
				"Calendar": {

				},
				"Chart": {

				},
				"CSV": {

				},
				"Kanban": {

				},
				"Timeline": {

				},
				"JSON": {

				}
			},
			"DefaultContainer": {
				"element": null, //DOMelement
				"elementID": "", //ID string
				"elementClass": "" //Class string
			}, //element
			"Container": {
				"element": null, //DOMelement
				"elementID": "", //ID string
				"elementClass": "" //Class string
			},
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
		this.LatestVersion = true; // or false
		this.GarbageCollectionControl = false; // if true then this node will be pruned when ETA is up.
	}
};
