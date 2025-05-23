function InitializeFormControls(oFlow) {
	oFlow.SnapScroll = true; // Flag to enable/disable snapping
	const scrollContainer = document.querySelector('#app_root_container');
	const snapRange = 90;
	const sensitivity = 0.1;
	let newTabCounter = 0;

	// NOTE - Initialize GraphCanvas tabs
	document.querySelectorAll('.app_configurator_containers').forEach(container => {
		oFlow.GraphCanvas[container.dataset.tabtype] = {
			ZoomScale: 1,
			ZoomStep: 0.05, // Zoom scale increment
			MinZoomScale: 0.1, // Prevents zooming out too far
			MaxZoomScale: 10, // Prevents zooming in too far
			Element: container,
			isElementInViewport: (element) => {
				const rect = element.getBoundingClientRect();
				return (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
					rect.right <= (window.innerWidth || document.documentElement.clientWidth)
				);
			}
		};
	});

	document.querySelectorAll('.scroll_content').forEach(scrollContainer => {
		scrollContainer.scrollLeft = 1000;
		scrollContainer.scrollTop = 1000;
		// scrollContainer.scrollLeft = 0;
		// scrollContainer.scrollTop = 0;
	});

	document.querySelectorAll('.app_project_controls').forEach(container => {
		function popModal(flow) {
			let schema = {
				"id": "form_new_poject",
				"label": "Form Select Connection Type",
				"type": "record",
				"typeSelection": ["record", "array"],
				"icon": "<i class=\"fa-brands fa-wpforms\"></i>",
				"order": 100,
				"Dataset": {
					"Layout": {
						"Form": {},
						"Properties": {
							"FormEntry": {
								"Show": 1,
								"Label": "Form Select Connection Type",
								"ShowLabel": 1
							},
							"Preview": {
								"Show": 1,
								"Label": "Form Select Connection Type",
								"ShowLabel": 1
							}
						}
					},
					"Schema": [
						{
							"id": "nodeKind",
							"label": "Node Kind",
							"type": "select",
							"value": ["A", "B", "C", "D"],
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "ulid",
							"label": "ULID",
							"type": "text",
							"value": ParadigmREVOLUTION.SystemCore.Modules.ULID(),
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "name",
							"label": "Name",
							"type": "text",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "label",
							"label": "Label",
							"type": "text",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isShown",
							"label": "Shown",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isLocked",
							"label": "Locked",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isExecutable",
							"label": "Executable",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isDisabled",
							"label": "Disabled",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						}
					]
				}
			}
			// console.log('flow :>> ', flow);
			oFlow.Graph.Events.showSchemaModal('New Project', schema, { flow: flow }, (data, passedData) => {
				function findKindObject(kindArray, targetKind) {
					for (const option of kindArray) {
						if (option.Kind === targetKind) {
							return option; // Return the entire object
						}
						if (option.Items) {
							const foundObject = findKindObject(option.Items, targetKind);
							if (foundObject) {
								return foundObject; // Return if found in nested structure
							}
						}
					}
					return null; // Return null if no match is found
				}
				console.log('data :>> ', data);
			});
		}

		const flow = this;

		const controlType = container.dataset.controltype;
		switch (controlType) {
			case 'closeProject':
				break;
			case 'loadProject':
				container.addEventListener('click', () => {
					popModal(flow);
				});
				break;
			case 'changeProject':
				break;
			case 'newProject':
				container.addEventListener('click', () => {
					popModal(flow);
				});
				break;
		};
	});

	const tabsStr = ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.TabsArray.map(tab => `<option data-tabtype="${tab.TabType}" value="${tab.TabType}">${tab.Label}</option>`).join('');
	// console.log('tabsStr :>> ', tabsStr);
	document.querySelector('#app_graph_container').querySelector('.page_change_selector').innerHTML = tabsStr;
	document.querySelector('#app_graph_container').querySelector('.page_change_selector').addEventListener('change', (e) => {
		const tabType = e.target.value;
		const element = document.querySelector(`a[data-tabtype="${tabType}"]`);
		element.click();
	});

	document.querySelectorAll('.graph_surfaces').forEach(surface => {
		const tabType = surface.closest(`.app_configurator_containers`).dataset.tabtype;
		const element = surface.closest(`.application_divisions`).querySelector(`a[data-tabtype="${tabType}"]`);
		const label = element.innerHTML;

		const graphCanvas = surface.closest(`.app_configurator_containers[data-tabType="${tabType}"]`);
		const graphCanvasID = surface.closest(`.app_configurator_containers[data-tabType="${tabType}"]`).id;
		const graphCanvasClasses = surface.closest(`.app_configurator_containers[data-tabType="${tabType}"]`).classList;

		const parentSet = {
			tab: {
				label: label,
				tabType: tabType,
				element: element,
			},
			graphCanvas: {
				id: graphCanvasID,
				classes: graphCanvasClasses,
				element: graphCanvas,
				graph_controls: graphCanvas.querySelector('.graph_controls'),
				graph_surface: graphCanvas.querySelector('.graph_surfaces'),
				graph_surface_id: graphCanvas.querySelector('.graph_surfaces').id,
				graph_node_surface: graphCanvas.querySelector('.graph_node_surface'),
				graph_connection_surface: graphCanvas.querySelector('.graph_connection_surface')
			},
			zoomProps: oFlow.GraphCanvas[tabType]
		};
		// console.log('parentSet :>> ', parentSet);
		// console.log('surface', surface);
		oFlow.Graph.Events.enableDragSelect(parentSet);
	});

	// Initialize the scroll snap functionality
	oFlow.Form.Events.initializeScrollSnap(scrollContainer, snapRange, sensitivity);

	document.querySelector('#object_collections_button').addEventListener('click', () => {
		document.querySelector('#object_collections').classList.toggle('show');
		setTimeout(() => {
			oFlow.Areas.object_collections.width = document.querySelector('#object_collections').offsetWidth;
		}, 650);
	});

	document.querySelector('#app_graph_button').addEventListener('click', () => {
		document.querySelector('#app_configurator_container').classList.toggle('show');
		document.querySelector('#app_graph_tabs_container').classList.toggle('show');
		document.querySelector('#app_menu_container').classList.toggle('show');
		document.querySelector('#app_center_container').classList.toggle('show');
		document.querySelector('#project_controls').classList.toggle('show');
	});

	document.querySelector('#app_data_preparation_area_button').addEventListener('click', () => {
		document.querySelector('#app_data_preparation_area').classList.toggle('show');
		oFlow.SnapScroll = false;
		setTimeout(() => {
			document.querySelector('#app_root_container').scrollTo({
				left: document.querySelector('#app_root_container').scrollWidth,
				behavior: 'smooth'
			});
		}, 300);
		setTimeout(() => {
			oFlow.SnapScroll = true;
		}, 500);
	});

	document.querySelector('#graph_adddatastore_button').addEventListener('click', () => {
		oFlow.Form.Events.addDataPreparationComponent('datastore_container_' + Date.now(), 'Datastore', (num, container_id) => {
			return oFlow.Form.Initialize.FormCard(`New_DATASTORE___${num}`, oFlow.Forms[0], 0, 1, 100, container_id);
		});
	});

	document.querySelector('#graph_adddatasource_button').addEventListener('click', () => {
		oFlow.Form.Events.addDataPreparationComponent('datasource_container_' + Date.now(), 'Datasource', (num, container_id) => {
			return oFlow.Form.Initialize.FormCard(`New_DATASOURCE___${num}`, oFlow.Forms[0], 0, 1, 100, container_id);
		});
	});

	document.querySelector('#graph_addlayout_button').addEventListener('click', () => {
		oFlow.Form.Events.addDataPreparationComponent('layout_container_' + Date.now(), 'Layout', (num, container_id) => {
			return oFlow.Form.Initialize.FormCard(`New_LAYOUT___${num}`, oFlow.Forms[0], 0, 1, 100, container_id);
		});
	});

	document.querySelector('#graph_addschema_button').addEventListener('click', () => {
		oFlow.Form.Events.addDataPreparationComponent('schema_container_' + Date.now(), 'Schema', (num, container_id) => {
			return oFlow.Form.Initialize.FormCard(`New_SCHEMA___${num}`, oFlow.Forms[0], 0, 1, 100, container_id);
		});
	});

	document.querySelector('#graph_addform_button').addEventListener('click', () => {
		oFlow.Form.Events.addDataPreparationComponent('form_container_' + Date.now(), 'Form', (num, container_id) => {
			return oFlow.Form.Initialize.FormCard(`New_FORM___${num}`, oFlow.Forms[0], 0, 1, 100, container_id);
		});
	});
	// document.querySelector('#graph_addnode_select').innerHTML = ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.KindArray.map(option => `<option value="${option.Kind}" data-nodetype="${option.Kind}Node" data-nodeicon="${option.Icon}">${option.Kind}</option>`).join('');

	//NOTE - addGlobalEventListener CLICK
	oFlow.Form.Events.addGlobalEventListener('click', [
		{
			selector: '.datastore-status-indicator',
			callback: async (e) => {
				let Tokens = {};
				
				let initConfigs = ParadigmREVOLUTION.Datastores.Parameters;
				window.SurrealDB = SurrealDB;
				window.ParadigmREVOLUTION.Datastores = {
					Tokens: Tokens,
					Parameters: ParadigmREVOLUTION.Datastores.Parameters,
					SurrealDB: ParadigmREVOLUTION.Datastores.SurrealDB,
				};

				const promises = initConfigs.map(config =>
					ParadigmREVOLUTION.SurrealDBinterface.initSurrealDB(config.name, config.label, config.shortlabel, config.connect, config.instance, window.ParadigmREVOLUTION.SystemCore.Blueprints.Data, window.ParadigmREVOLUTION.SystemCore.Modules, cr)
				);

				const results = await Promise.all(promises);

				initConfigs.forEach((config, index) => {
					Tokens[config.name] = results[index];
				});
				window.ParadigmREVOLUTION.SystemCore.CoreStatus.SurrealDB.Status = "LOADED";

				async function getDatastoreStatus() {
					let datastore_status = '';
					for (const [idx, entry] of Object.entries(window.ParadigmREVOLUTION.Datastores.SurrealDB)) {
						// Check if Instance is false
						if (!entry.Instance) {
							datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-disabled" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>`;
						} else {
							try {
								// Await the promise for connection status
								if (entry.Instance == false) {
									datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-disabled" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>`;
								} else if (entry.Instance.connection == undefined) {
									datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-danger" value="${idx}" title="${entry.Metadata.Label} NO CONNECTION">${entry.Metadata.ShortLabel}</button>`;
								} else {
									const status = await entry.Instance.connection.status;
									// Check connection status
									if (status === "connected") {
										datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-success" value="${idx}" title="${entry.Metadata.Label} CONNECTED">${entry.Metadata.ShortLabel}</button>`;
									} else if (status === "disconnected") {
										datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-warning" value="${idx}" title="${entry.Metadata.Label} DISCONNECTED">${entry.Metadata.ShortLabel}</button>`;
									} else {
										datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-danger" value="${idx}" title="${entry.Metadata.Label} NO CONNECTION">${entry.Metadata.ShortLabel}</button>`;
									}
								}
							} catch (error) {
								console.error(`Error fetching status for ${idx}:`, error);
								datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 is-danger" value="${idx}" title="${entry.Metadata.Label} ERROR">${entry.Metadata.ShortLabel}</button>`;
							}
						}
					}
					return datastore_status;
				};
				getDatastoreStatus().then(datastore_status => {
					document.querySelector('#datastore_status').innerHTML = datastore_status;
				});
			}
		}
	], document.querySelector('#app_top_menu_container'));

	oFlow.Form.Events.addGlobalEventListener('click', [{
		selector: '.graph-node .node-controls',
		callback: async (e) => {
			console.log(e.target.classList, e.target.dataset, 'CLICKED!!!');
			switch (e.target.dataset.actiontype) {
				case 'showNode':
					console.log('Show Node clicked!');
					break;
				case 'enableNodeExecute':
					console.log('Enable Node Execute clicked!');
					break;
				case 'disableNode':
					console.log('Disable Node clicked!');
					break;
			};
	
		}
	}, {
		selector: '.graph-node .node-footer',
		callback: async (e) => {
			console.log(e.target.classList, e.target.dataset, 'CLICKED!!!');
			switch (e.target.dataset.actiontype) {
				case 'openNode':
					console.log('Open Node clicked!');
					break;
				case 'configureNode':
					console.log('Configure Node clicked!');
					break;
				case 'copyNode':
					console.log('Copy Node clicked!');
					break;
				case 'deleteNode':
					const id = e.target.dataset.id;
					const table = "Graph";
					if (confirm(`Apakah anda ingin menghapus dokumen ${table}:${id}?`)) {
						let qstr = `SELECT id FROM ONLY ${table} where id:{ID:"${id}"}.. limit 1 ;`;
						console.log('qstr :>> ', qstr);
						ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr)
							.then(result => {
								console.log('result :>> ', result[0]);
								if (result[0]?.id?.id) result[0].id = result[0].id.id;
								console.log('result :>> ', result[0]);
								qstr = `DELETE FROM ${table} where id.ID = "${id}";`;
								console.log('DELETE qstr :>> ', qstr);
								ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr)
									.then(() => {
										console.log(`Node ID ${id} removal SUCCESS!`);
										e.target.closest(`.app_configurator_containers`).querySelector('.document_refreshrender_button').click();
									})
									.catch(error => {
										console.error(`Node ID ${id} removal ERROR!`, error);
									});
							})
							.catch(error => {
								console.error(`Node ID ${id} NOT FOUND! ERROR message:`, error);
							});
					}
					break;
			};
		}
	}, {
		selector: '.graph-edge',
		callback: (e) => {
			console.log('graph-edge CLICK >>>>>>>>');
			ooFlow.DragSelect = true;
			console.log('e target', e.target);
			const id = e.target.id;
			const table = e.target.dataset.table;
			e.target.closest('.scroll_content').querySelectorAll('.graph-edge').forEach(edge => {
				edge.classList.remove('focused');
			});
			ParadigmREVOLUTION.Application.Cursor.push({ table: table, id: id });
			e.target.classList.add('focused');
			console.log('graph-edge CLICK <<<<<<<<');
			setTimeout(() => {
				oFlow.DragSelect = false;
			}, 100);
		}
	}, {
		selector: '.graph_addnode_button', //NOTE - addnode-button
		callback: (e) => {
			//NOTE - Create new node!
			console.log('Create node! graph_addnode_button click!');
			const graphCanvas = e.target.closest('.app_configurator_containers');
			const tabtype = graphCanvas.dataset.tabtype;
			console.log('graphCanvas', graphCanvas);

			// Generate the HTML string for the select element
			let values = '';

			// Loop through KindArray to populate the select element
			ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.KindArray.forEach((element) => {
				if (element.Type === "Item") {
					// Create an option for Type: "Item"
					values += `<option value="${element.Kind}" class="has-tooltip-arrow has-tooltip-multiline" data-tooltip="Groups: ${element.Group.join(', ')}">${element.Kind}</option>`;
				} else if (element.Type === "Array") {
					// Create an optgroup for Type: "Array"
					values += `<optgroup label="${element.Kind}" class="has-tooltip-arrow has-tooltip-multiline" data-tooltip="Groups: ${element.Group.join(', ')}">`;
		
					// Add options for each item in the "Items" array
					element.Items.forEach((item) => {
						values += `<option value="${item.Kind}" class="has-tooltip-arrow has-tooltip-multiline" data-tooltip="Groups: ${item.Group.join(', ')}">${item.Kind}</option>`;
					});
		
					values += `</optgroup>`;
				}
			});
			let schema = {
				"id": "form_select_connection_type",
				"label": "Form Select Connection Type",
				"type": "record",
				"typeSelection": ["record", "array"],
				"icon": "<i class=\"fa-brands fa-wpforms\"></i>",
				"order": 100,
				"Dataset": {
					"Layout": {
						"Form": {},
						"Properties": {
							"FormEntry": {
								"Show": 1,
								"Label": "Form Select Connection Type",
								"ShowLabel": 1
							},
							"Preview": {
								"Show": 1,
								"Label": "Form Select Connection Type",
								"ShowLabel": 1
							}
						}
					},
					"Schema": [
						{
							"id": "nodeKind",
							"label": "Node Kind",
							"type": "select",
							"value": values,
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "ulid",
							"label": "ULID",
							"type": "text",
							"value": ParadigmREVOLUTION.SystemCore.Modules.ULID(),
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "name",
							"label": "Name",
							"type": "text",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "label",
							"label": "Label",
							"type": "text",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isShown",
							"label": "Shown",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isLocked",
							"label": "Locked",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isExecutable",
							"label": "Executable",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						},
						{
							"id": "isDisabled",
							"label": "Disabled",
							"type": "checkbox",
							"value": "",
							"field_class": "is-selectable-box",
							"form": 1
						}
					]
				}
			}
			let flow = this;
			oFlow.Graph.Events.showSchemaModal('New Node', schema, { graphCanvas: graphCanvas, flow: oFlow }, (data, passedData) => {
				function findKindObject(kindArray, targetKind) {
					for (const option of kindArray) {
						if (option.Kind === targetKind) {
							return option; // Return the entire object
						}
						if (option.Items) {
							const foundObject = findKindObject(option.Items, targetKind);
							if (foundObject) {
								return foundObject; // Return if found in nested structure
							}
						}
					}
					return null; // Return null if no match is found
				}
			
				const name = data.name;
				const label = data.label;
				const ulid = data.ulid;
				const nodeKind = data.nodeKind; // Value of the selected option
				const tObj = findKindObject(ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.KindArray, nodeKind);
				const icon = tObj.Icon;

				const parent = document.querySelector('#graph_scroll_content'); // NOTE - NOW
				const parentRect = parent.getBoundingClientRect();

				//CALCULATE COORDINATE
				const parentScrollLeft = parent.scrollLeft;
				const parentScrollTop = parent.scrollTop;
				// const parentLeft = parentRect.left;
				// const parentTop = parentRect.top;
		
				let dx = parentRect.left + parentScrollLeft; //+ parentScrollLeft;
				let dy = parentRect.top + parentScrollTop;

				//CALCULATE COORDINATE
				// Extract custom data attributes from the selected option
				const ULID = ParadigmREVOLUTION.Utility.Time.TStoYMDHISMS(Date.now());
				const Fdate = ParadigmREVOLUTION.Utility.Time.FTStoYMDHISMS(Date.now());

				const tULID = ParadigmREVOLUTION.SystemCore.Modules.ULID();
				const tstmp = Date.now();
				// console.log('tstmp', new Date(tstmp));
			
				const futureTimestamp = ParadigmREVOLUTION.Utility.Time.addDate(100, 'years', tstmp);
				// console.log('futureTimestamp', new Date(futureTimestamp));
				const tablestore = "Graph";
			
				console.log('flow', flow);
				const newNodeID = oFlow.Graph.Elements.newNodeIDGenerator(nodeKind, name, `Graph`, ULID, tULID, icon, 3);
				const newNode = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Blueprints.Data.Node));

				// newNode.id = newNodeID;
				newNode.Properties.Name = name;
				newNode.Properties.Label = label;
				newNode.Properties.isLocked = data.isLocked;
				newNode.Properties.isShown = data.isShown;
				newNode.Properties.isEnableExecute = data.isExecutable;
				newNode.Properties.isDisabled = data.isDisabled;

				if (newTabCounter > 20) newTabCounter = 0;
				let tx = 30 + (dx + (newTabCounter * 40));
				let ty = dy + 60;

				let coord = {
					x: tx > 0 ? tx : 0,
					y: ty > 0 ? ty : 0
				}
				Object.entries(passedData.flow.GraphCanvas).forEach((value, key) => {
					console.log('value of passedData.flow.GraphCanvas :>> ', value);
					newNode.Presentation.Perspectives.GraphNode.Position[value[0]] = coord;
				});
			
				newNode.Presentation.Perspectives.GraphNode.Position[tabtype] = coord;
				newTabCounter++;

				console.log('newNode :>> ', newNode);
				// ParadigmREVOLUTION.Application.GraphNodes.push(newNode);
				if (!oFlow.storage) {
					console.error('No storage found.');
					return;
				}
				// NOTE - SurrealDB create/insert/upsert
				// let qstr = `
				// 	upsert
				// 		${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(newNodeID)} 
				// 	content
				// 		${JSON.stringify(newNode)};`;
				let qstr = `
				upsert
					${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${newNodeID} 
				content
					${JSON.stringify(newNode)};`;
				console.log('qstr :>> ', qstr);
				ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr);

				// Refresh render
				passedData.graphCanvas.querySelector('.document_refreshrender_button').click();
			});
		}
	}, {
		selector: '.graph_removenodes_button', //NOTE - removenodes-button
		callback: (e) => {
			console.log('Remove nodes! graph_removenodes_button click!');
			// NOTE - Remove nodes!
			let graphCanvas = e.target.closest('.app_configurator_containers');
			if (ParadigmREVOLUTION.Application.Cursor.length == 0) return;
			console.log('ParadigmREVOLUTION.Application.Cursor :>> ', ParadigmREVOLUTION.Application.Cursor);
	
			const promises = ParadigmREVOLUTION.Application.Cursor.map(znode => {
				if (!confirm(`Apakah anda ingin menghapus dokumen ${znode.table}:${znode.id}?`)) {
					return Promise.resolve(); // Skip this node
				}
			
				let table = znode.table;
				let id = znode.id;
				console.log('table, id >>>>>>', table, id);
	
				let qstr = `SELECT id FROM ONLY ${table} where id:{ID:"${id}"}.. limit 1 ;`;
				return ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr)
					.then(result => {
						console.log('result :>> ', result[0]);
						if (result[0]?.id?.id) result[0].id = result[0].id.id;
						console.log('result :>> ', result[0]);
						qstr = `DELETE FROM ${table} where id.ID = "${id}";`;
						console.log('DELETE qstr :>> ', qstr);
						return ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr)
							.then(() => {
								console.log(`Node ID ${id} removal SUCCESS!`);
								znode = null;
							})
							.catch(error => {
								console.error(`Node ID ${id} removal ERROR!`, error);
							});
					})
					.catch(error => {
						console.error(`Node ID ${id} NOT FOUND! ERROR message:`, error);
					});
			});
			Promise.all(promises).then(() => {
				console.log("All nodes have been processed.");
				ParadigmREVOLUTION.Application.Cursor = [];
			
				// Refresh render
				graphCanvas.querySelector('.document_refreshrender_button').click();
			}).catch(err => {
				console.error("Error in processing nodes:", err);
			});
		}
	}, {
		selector: '.is-selectable',
		callback: (e) => {
			console.log('is-selectable CLICK');
		
			ParadigmREVOLUTION.Application.Cursor.length = 0;
			ParadigmREVOLUTION.Application.Cursor = [];
		
			oFlow.DragSelect = true;
			const selectableParent = e.target.closest('.is-selectable-parent');
			const selectableBox = e.target.closest('.is-selectable-box');

			if (!selectableParent || !selectableBox) return; // Guard clause

			const dataset = e.target.dataset;
			const datasetEntries = Object.entries(dataset);

			if (datasetEntries.length > 0) {
				if (dataset.template) {
					console.log('template: ', dataset.template);
				} else if (dataset.schema) {
					console.log('schema: ', dataset.schema);
					flow.Form.Events.addDataPreparationComponent('graphnode_container_' + Date.now(), 'Graph', (num, container_id) => {
						let schemacanvas = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Schema.Data[dataset.template]));
						return flow.Form.Render.traverseDOMProxyOBJ(schemacanvas);
					});
				}
				if (dataset.id) ParadigmREVOLUTION.Application.Cursor.push({ table: ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name, id: dataset.id });
				setTimeout(() => {
					oFlow.DragSelect = false;
				}, 300);
			}

			selectableParent.querySelectorAll('.is-selectable-box').forEach((item) => {
				item.style.removeProperty('width');
				item.classList.remove('box', 'focused', 'm-2');
				item.classList.remove('m-2');

				console.log(`item.closest('.node-top-container') :>> `, item.closest('.node-top-container'));
				item.closest('.node-top-container').querySelectorAll('.card-footer').forEach((item) => {
					console.log('item >>>>>>', item);
					if (item.classList.contains('show')) item.classList.remove('show');
				});

			});
			if (selectableBox.classList.contains('field')) {
				selectableBox.style.width = '100%;';
			} else {
				selectableBox.style.width = 'fit-content;';
			}
			selectableBox.classList.add('box', 'focused', 'mx-0');
		
			//NOTE - card footer for node controls
			selectableBox.closest('.node-top-container').querySelectorAll('.card-footer').forEach((item) => {
				item.classList.add('show');
			});
		}
	}, {
		selector: '.is-selectable-parent',
		callback: (e) => {
			if (e.target.classList.contains('is-selectable')) return;
			if (oFlow.DragSelect) return;
			console.log('is-selectable-parent CLICK');
			console.log('oFlow.DragSelect', oFlow.DragSelect);
			console.log('is-selectable-parent GOOOO');
			const selectableParent = e.target.closest('.is-selectable-parent');
			ParadigmREVOLUTION.Application.Cursor = [];
			const flow = this;

			let nodeIDs = [];
			selectableParent.querySelectorAll('.focused').forEach((item) => {
				console.log('item', item);
				if (item.tagName == 'path') {
					item.classList.remove('focused');
				} else {
					item.style.removeProperty('width');
					item.classList.remove('box', 'focused', 'm-2');
					item.classList.remove('m-2');
					item.querySelectorAll('.card-footer').forEach((item) => {
						if (item.classList.contains('show')) item.classList.remove('show');
					});
					nodeIDs.push(item.dataset.id.replace('node-', ''));
				}
			});
			console.log('nodeIDs', nodeIDs);

			if (nodeIDs.length > 0) {
				const qstr = `select *  from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')} where (in.id.ID in [${nodeIDs.map(nodeID => `"${nodeID}"`).join(', ')}] or out.id.ID in [${nodeIDs.map(nodeID => `"${nodeID}"`).join(', ')}])`;
				console.log('qstr sebelum unselect:>> ', qstr);
				ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then((edges) => {
					const dbedges = edges[0];
					const parentSet = oFlow.getActiveTab('tab-graph-selector-container');

					console.log('reflow edge connections', parentSet, dbedges);
					setTimeout(() => {
						dbedges.forEach((edge, edgeIndex) => {
							oFlow.Graph.Events.connectNodes(
								edge,
								parentSet.graphCanvas.graph_connection_surface,
								parentSet.graphCanvas.graph_surface.parentElement
							);
						});
					}, 400);
				}).catch((error) => {
					console.log('error', error);
				});
			}
		}
	}
	], document.querySelector('#app_graph_container'));

	oFlow.Form.Events.addGlobalEventListener('click', [{
		selector: '.is-selectable',
		callback: (e) => {
			console.log('is-selectable CLICK');
		
			ParadigmREVOLUTION.Application.Cursor = [];
		
			oFlow.DragSelect = true;
			// console.log('e target', e.target);
			// console.log('e currentTarget', e.currentTarget);
			const selectableParent = e.target.closest('.is-selectable-parent');
			const selectableBox = e.target.closest('.is-selectable-box');
			console.log('selectables', selectableParent, selectableBox);

			if (!selectableParent || !selectableBox) return; // Guard clause

			const dataset = e.target.dataset;
			const datasetEntries = Object.entries(dataset);

			if (datasetEntries.length > 0) {
				// console.log('dataset is not empty');
				// console.log('dataset :>> ', dataset);

				if (dataset.template) {
					// console.log('template: ', dataset.template);
					// if (e.target.classList.contains('graph_node_surface')) { 
					// 	flow.Form.Events.addDataPreparationComponent('graphnode_container_' + Date.now(), 'Graph', (num, container_id) => {
					// 		let graphcanvas = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Template.Data[dataset.template]));
					// 		return flow.Form.Render.traverseDOMProxyOBJ(graphcanvas);
					// 	});
					// }
				} else if (dataset.schema) {
					console.log('schema: ', dataset.schema);
					oFlow.Form.Events.addDataPreparationComponent('graphnode_container_' + Date.now(), 'Graph', (num, container_id) => {
						let schemacanvas = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Schema.Data[dataset.template]));
						return oFlow.Form.Render.traverseDOMProxyOBJ(schemacanvas);
					});
				}
				if (dataset.id) ParadigmREVOLUTION.Application.Cursor.push({ table: ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name, id: dataset.id });
				setTimeout(() => {
					oFlow.DragSelect = false;
				}, 300);
			}

			console.log('selectable box or selectable parent exists!');
			selectableParent.querySelectorAll('.is-selectable-box').forEach((item) => {
				item.style.removeProperty('width');
				item.classList.remove('box', 'focused', 'm-2');
				item.classList.remove('m-2');
			});
			if (selectableBox.classList.contains('field')) {
				selectableBox.style.width = '100%;';
			} else {
				selectableBox.style.width = 'fit-content;';
			}
			selectableBox.classList.add('box', 'focused', 'mx-0'); //NOTE - NOW
		}
	}, {
		selector: '.is-selectable-parent',
		callback: (e) => {
			console.log('is-selectable-parent CLICK');
			if (e.target.classList.contains('is-selectable')) return;
			console.log('oFlow.DragSelect', oFlow.DragSelect);
			if (oFlow.DragSelect) return;
			console.log('is-selectable-parent GOOOO');
			const selectableParent = e.target.closest('.is-selectable-parent');
			ParadigmREVOLUTION.Application.Cursor = [];
			selectableParent.querySelectorAll('.focused').forEach((item) => {
				console.log('item', item);
				if (item.tagName == 'path') {
					item.classList.remove('focused');
				} else {
					item.style.removeProperty('width');
					item.classList.remove('box', 'focused', 'm-2');
					item.classList.remove('m-2');
				
				}
			})
		}
	}, {
		selector: '.form-input-types',
		callback: (e) => {
			console.log('form-input-types CLICK');

			let num = Date.now();
			//ADD FORM COLUMN HERE
			
			let form_container = e.target.closest(`.${e.target.dataset.form_container}`);
			console.log('form_container >>>>>> ', form_container);
			console.log('e.target', e.target);
			console.log('e.target.dataset.form_container', e.target.dataset.form_container);
			// console.log('form_container >>>>', form_container);
			console.log('flow.Forms[1]', flow.Forms[1]);
			let newCol = flow.Form.Initialize.FormCard('form_components___' + num, flow.Forms[1], 1, 1, 100);
			// console.log('newCol :>> ', newCol);
			form_container.innerHTML += newCol;;

			let maxwidth = 0;
			document.querySelectorAll('.data_preparation_box').forEach(box => {
				maxwidth = box.offsetWidth > maxwidth ? box.offsetWidth : maxwidth;
			});
		
			document.querySelector('#app_data_preparation_area.show').style.flexBasis = maxwidth + 32 + 'px';

			flow.SnapScroll = false;
			setTimeout(() => {
				document.querySelector('#app_root_container').scrollTo({
					left: document.querySelector('#app_root_container').scrollWidth,
					behavior: 'smooth'
				});
			}, 600);
			setTimeout(() => {
				flow.SnapScroll = true;
			}, 610);
			setTimeout(() => {
				let selectedBox = document.querySelector(`.${e.target.dataset.form_container}`);
				if (selectedBox) {
					console.log('ada selected box');
					// Get the scrollable container
					let scrollContainer = document.querySelector('#app_data_preparation_area');
					
					// Get the offset of the selected box relative to the container
					let offsetLeft = selectedBox.offsetLeft;
					console.log('offsetLeft :>> ', offsetLeft);
					
					// Scroll to that position with smooth behavior
					scrollContainer.scrollTo({
						left: offsetLeft,
						behavior: 'smooth'
					});
				}
			}, 300);
		}
	}, {
		selector: '.form-close-button',
		callback: (e) => {
			let formid = e.target.dataset.formid;
			let isdataprepbox = false;
			// const formElement = document.querySelector(`#${formid}`).parentElement;
			let formElement = e.target.closest('.form-input-column-container');
			let dataPreparationBox = e.target.closest('.data_preparation_box');
			const dataPreparationBoxChildCount = e.target.closest('.data_preparation_box').querySelectorAll('.column').length;
			
			if (!formElement) {
				formElement = e.target.closest('.data_preparation_box');
				isdataprepbox = true;
			}
			if (!formElement) return; //Guard clause

			// Step 1: Add collapsing class to trigger CSS transition
			formElement.classList.add('collapsing');

			// Step 2: Use a timeout slightly longer than the CSS transition duration
			setTimeout(() => {
				// Remove the element from DOM after the transition
				const parentEl = formElement.parentElement;
				formElement.remove();
				
				if (!isdataprepbox) if (parentEl.childElementCount == 0) {
					const box = parentEl.closest('.box')
					if (!box) box.remove();
				}
				// console.log('dataPreparationBoxChildCount :>> ', dataPreparationBoxChildCount);
				if (dataPreparationBoxChildCount == 1) {
					dataPreparationBox.remove();
				}

				// Check child elements count to handle visibility
				if (document.querySelector('#app_data_preparation_area').childElementCount === 0) {
					const prepArea = document.querySelector('#app_data_preparation_area');
					prepArea.classList.remove('show');
					prepArea.style.flexBasis = '0rem';
				}

				// Calculate WIDTH
				let eleWidth = 0;
				const childContainers = document.querySelectorAll('.data_preparation_area_container');
				childContainers.forEach((container) => {
					if (eleWidth < container.offsetWidth) eleWidth = container.offsetWidth;
				});

				document.querySelector('#app_data_preparation_area').style.flexBasis = 28 + eleWidth + 'px';

				flow.SnapScroll = false;
				setTimeout(() => {
					document.querySelector('#app_root_container').scrollTo({
						left: document.querySelector('#app_root_container').scrollWidth,
						behavior: 'smooth'
					});
				}, 300);
				setTimeout(() => {
					flow.SnapScroll = true;
					flow.Areas.app_data_preparation_area.width = document.querySelector('#app_data_preparation_area').offsetWidth;
				}, 500);
			}, 350); // Timeout slightly longer than the CSS transition (0.3s)
		}
	}, {
		selector: ' .prev-box, .next-box', //NOTE - prev-box next-box
		callback: (e) => {
			console.log('prev-box, next-box');
			// Find the current .box container
			const currentBox = e.target.closest('.data_preparation_box');
			console.log('currentBox :>> ', currentBox);

			// Determine the direction (up or down)
			const isPrev = e.target.closest('.prev-box') !== null;
			console.log('isPrev :>> ', isPrev);
			const isUp = isPrev || e.target.classList.contains('fa-angle-up');

			// Find all boxes
			// const allBoxes = Array.from(document.querySelectorAll('.box.m-3'));
			const allBoxes = Array.from(e.target.closest('.data_preparation_box').parentElement.querySelectorAll('.data_preparation_box'));
			console.log('allBoxes :>> ', allBoxes);
			if (allBoxes.length == 0) return;
			console.log('allBox is not 0');

			allBoxes.forEach((box) => {
				console.log('box', box);
				box.classList.remove('focused');
			});
			// Get the current index of the active box
			const currentIndex = allBoxes.indexOf(currentBox);
			// Calculate the target index
			let targetIndex = isUp ? currentIndex - 1 : currentIndex + 1;
			// Ensure the target index is within bounds
			if (targetIndex >= 0 && targetIndex < allBoxes.length) {
				// Get the target box
				const targetBox = allBoxes[targetIndex];
				// Move focus to the target box
				targetBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
				console.log('targetBox', targetBox);
				
				// Optionally add a focus effect (e.g., add a CSS class)
				// currentBox.classList.remove('focused');
				setTimeout(() => {
					targetBox.click();
				}, 300);
			}
		}
	}, {
		selector: '.move-up-box, .move-down-box', //NOTE - move-up-box -box
		callback: (e) => {
			console.log('move-up-box, move-down-box');
			// Find the current .box container
			const currentBox = e.target.closest('.data_preparation_box');
			console.log('currentBox :>> ', currentBox);
	
			// Determine the direction (up or down)
			const isPrev = e.target.closest('.move-up-box') !== null;
			console.log('isPrev :>> ', isPrev);
			const isUp = isPrev || e.target.classList.contains('fa-arrows-up-to-line');
	
			// Find all sibling boxes in the parent container
			const allBoxes = Array.from(e.target.closest('.data_preparation_box').parentElement.querySelectorAll('.data_preparation_box'));
			console.log('allBoxes :>> ', allBoxes);
			if (allBoxes.length == 0) return;
			console.log('allBoxes is not 0');
	
			// Get the current index of the active box
			const currentIndex = allBoxes.indexOf(currentBox);
			console.log('currentIndex :>> ', currentIndex);
	
			// Calculate the target index
			let targetIndex = isUp ? currentIndex - 1 : currentIndex + 1;
	
			// Ensure the target index is within bounds
			if (targetIndex >= 0 && targetIndex < allBoxes.length) {
				// Get the target box
				const targetBox = allBoxes[targetIndex];
				console.log('targetBox :>> ', targetBox);
	
				// Temporarily set transform properties for animation
				const currentBoxRect = currentBox.getBoundingClientRect();
				const targetBoxRect = targetBox.getBoundingClientRect();
	
				// Calculate the translation distances
				const deltaY = targetBoxRect.top - currentBoxRect.top;
	
				// Apply transform to animate the movement
				currentBox.style.transform = `translateY(${deltaY}px)`;
				targetBox.style.transform = `translateY(${-deltaY}px)`;
	
				// Wait for the animation to complete
				setTimeout(() => {
					// Reset the transform immediately before DOM manipulation
					currentBox.style.transition = 'none';
					targetBox.style.transition = 'none';
					currentBox.style.transform = '';
					targetBox.style.transform = '';
	
					// Force reflow to apply the changes before resetting transition
					currentBox.offsetHeight; // This forces a reflow
					targetBox.offsetHeight; // This forces a reflow
	
					// Reorder the boxes in the DOM
					if (isUp) {
						targetBox.parentElement.insertBefore(currentBox, targetBox);
					} else {
						targetBox.parentElement.insertBefore(currentBox, targetBox.nextSibling);
					}
	
					// Restore transition after DOM manipulation
					setTimeout(() => {
						currentBox.style.transition = '';
						targetBox.style.transition = '';
					}, 0);
	
					console.log('Boxes reordered');
				}, 300); // Match this duration to the CSS transition time
			}
		}
	}], document.querySelector(`#app_data_preparation_area`));
	document.querySelector('#app_console_button').addEventListener('click', () => {
		document.querySelector('#app_console').classList.toggle('show');
	});
	oFlow.Form.Events.setupTabSwitcher({
		tabSelector: '.tab-graph-selector',
		contentContainerSelector: '.app_configurator_containers, .addremove-control-container'
	}, () => {
		// console.log('starts on callback!');
		// console.log('done on callback!');
	});

	// oFlow.Form.Events.setupTabSwitcher('.tab-graph-selector', '.app_configurator_containers');
	document.querySelector('.tab-graph-selector[data-tabtype="Graph"]').click();
	oFlow.Form.Events.setupTabSwitcher({
		tabSelector: '.tab-object-collections',
		contentContainerSelector: '.object-collections-containers'
	}, () => {
		// console.log('starts on callback!');
		// console.log('done on callback!');
	});
	document.querySelector('.tab-object-collections[data-tabtype="Collection"]').click();

	oFlow.Form.Events.setupTabSwitcher({
		tabSelector: '.tab-appcontent-controls',
		contentContainerSelector: '.tab-content-container'
	}, () => {
		// console.log('starts on callback on tab-appcontent-controls!');
		// console.log('starts on callback!');
		// console.log('done on callback!');
	});


	document.querySelector('#dark_light_selector').addEventListener('click', (e) => {
		let root = document.documentElement;
		let isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches; // Detect system theme
		let currentTheme = root.dataset.theme || 'system'; // Default to system if no theme is set

		// Cycle through themes: system -> dark -> light
		console.log('currentTheme', currentTheme);
		if (currentTheme === 'system') {
			console.log('setting currentTheme to :>> dark');
			root.dataset.theme = 'dark';
		} else if (currentTheme === 'dark') {
			console.log('setting currentTheme to :>> light');
			root.dataset.theme = 'light';
		} else if (currentTheme === 'light') {
			console.log('setting currentTheme to :>> system');
			root.dataset.theme = 'system';
		}

		// Update the icon based on the new theme
		// const icon = e.currentTarget.childNodes[0];
		const icon = document.querySelector('.dark_light_indicator');
		icon.classList.remove('fa-moon', 'fa-sun', 'fa-circle-half-stroke', 'has-text-link', 'has-text-warning', 'fa-regular', 'fa-solid');

		if (root.dataset.theme === 'dark') {
			// Set dark mode icon
			icon.classList.add('fa-moon', 'has-text-link', 'fa-regular');
		} else if (root.dataset.theme === 'light') {
			// Set light mode icon
			icon.classList.add('fa-sun', 'has-text-warning', 'fa-regular');
		} else if (root.dataset.theme === 'system') {
			// Set system mode icon
			icon.classList.add('fa-circle-half-stroke', 'fa-solid');
		}
	});
	// NOTE - REFRESH RENDER
	document.querySelectorAll('.document_refreshrender_button').forEach(button => {
		button.addEventListener('click', (e) => {
			let parentGraphID = e.target.closest('.app_configurator_containers ').id;
			console.log('parentGraphID :>> ', parentGraphID);
			let onlyContainers = e.target.closest('.buttons').querySelector('#graph_show_only_containers');
			let qstr = '';

			console.log('parentGraphID >>>>>>', parentGraphID);
			// console.log('Refresh render button clicked!');
			console.log('Refresh render button clicked!');

			switch (parentGraphID) {
				case 'app_datastorage_container':
					qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.Node.Kind = 'Datastore';`;
					break;
				case 'app_graph_container':
					if (onlyContainers.checked) {
						qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.Node.Kind = 'Container';`;
					} else {
						qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name};`;
					}
					break;
				case 'app_containers_container':
					qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.Node.Kind != 'Container';-- and id.Node.;`;
					break;
			}
			console.log('qstr Graph :>> ', qstr);
			ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(nodes => {
				// console.log('nodes :>> ', nodes);
				qstr = '';
				switch (parentGraphID) {
					case 'app_datastorage_container':
						qstr = ``;
						break;
					case 'app_graph_container':
						if (onlyContainers.checked) {
							qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')} where id.Table = 'Process'; --or id.Table = 'Version';`;
						} else {
							qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')};`;
						}
						break;
				}
				console.log('qstr edges :>> ', qstr);
				ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(edges => {
					oFlow.Graph.Events.renderNodes(nodes[0], edges[0], oFlow.getActiveTab('tab-graph-selector-container'), () => {
						// console.log('Nodes and Edges rendered, callback called');
					});
				}).catch(err => {
					console.error('Document refresh render error: Edges retreival error ', err);
				});
			}).catch(err => {
				console.error('Document refresh render error: Nodes retreival error ', err);
			});
		});
	});

	// console.log('Set default theme to SYSTEM');
	const root = document.documentElement;

	root.dataset.theme = 'system'; // Default theme
	const icon = document.querySelector('.dark_light_indicator');
	icon.classList.remove('fa-moon', 'fa-sun', 'fa-circle-half-stroke', 'has-text-link', 'has-text-warning', 'fa-regular', 'fa-solid');
	icon.classList.add('fa-circle-half-stroke', 'fa-solid');

	// NOTE - Listen for changes in system theme only if in system mode
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		const currentTheme = document.querySelector('.dark_light_indicator');
		if (currentTheme.classList.contains('fa-circle-half-stroke')) {
			console.log('System theme changed');
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (isDark) {
				console.log('System theme switched to Dark');
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				console.log('System theme switched to Light');
				document.documentElement.setAttribute('data-theme', 'light');
			}
		}
	});

	let graphcanvas = JSON.parse(JSON.stringify(window.ParadigmREVOLUTION.SystemCore.Template.Data['GraphCanvas']));
	// document.querySelector('#app_content').innerHTML += flow.Form.Render.traverseDOMProxyOBJ(graphcanvas);
	function findScrollableElements() {
		const scrollableElements = {
			vertical: [],
			horizontal: [],
			both: []
		};
	
		const allElements = document.querySelectorAll('*');

		allElements.forEach((el) => {
			const hasVerticalScrollbar = el.scrollHeight > el.clientHeight;
			const hasHorizontalScrollbar = el.scrollWidth > el.clientWidth;

			if (hasVerticalScrollbar && hasHorizontalScrollbar) {
				scrollableElements.both.push(el);
			} else if (hasVerticalScrollbar) {
				scrollableElements.vertical.push(el);
			} else if (hasHorizontalScrollbar) {
				scrollableElements.horizontal.push(el);
			}
		});
		return scrollableElements;
	}

	// Example usage:
	const scrollableElements = findScrollableElements();
	// console.log('Elements with vertical scrollbars:', scrollableElements.vertical);
	// console.log('Elements with horizontal scrollbars:', scrollableElements.horizontal);
	// console.log('Elements with both scrollbars:', scrollableElements.both);

	document.querySelector('#enable_tasks_sections_button').addEventListener('click', () => {
		document.querySelectorAll('.tabs-extended-functions').forEach((tab) => {
			if (tab.classList.contains('show')) {
				tab.style.transform = 'translateY(100%)';
				tab.style.opacity = 0;
				setTimeout(() => {
					tab.classList.remove('show');
				}, 500);
			} else {
				tab.style.transform = 'translateY(0)';
				tab.style.opacity = 1;
				tab.classList.add('show');
			}
		});
	});
	document.querySelector('#app_root_container').addEventListener('scroll', (e) => {
		const container = e.target;
		const scrollTop = container.scrollTop; // Vertical scroll position
		const scrollLeft = container.scrollLeft; // Horizontal scroll position

		// console.log('this', flow.ScrollPosition.app_root_container);
		flow.ScrollPosition.app_root_container.top = scrollTop;
		flow.ScrollPosition.app_root_container.left = scrollLeft;

		// console.log('flow.ScrollPosition.app_root_container :>> ', flow.ScrollPosition.app_root_container);
	});
	document.querySelectorAll('.graph_load_data_button').forEach(button => {
		button.addEventListener('click', (e) => {
			const TgraphCanvas = e.target.closest('.app_configurator_groups');
			const tabtype = TgraphCanvas.querySelector('.tabs .is-active').querySelector('a').dataset.tabtype;

			const graphCanvas = document.querySelector(`#app_container`).querySelector(`#app_${tabtype.toLowerCase()}_container`);
			const storage = e.target.closest('.graph_load_data_button').dataset.storage;

			if (confirm(`Anda akan melakukan sinkronisasi GRAPH DATA dari ${storage}. Apakah anda yakin?`)) {
				// GET NODES from server/storage
				ParadigmREVOLUTION.Datastores.SurrealDB[storage].Instance.query(`select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name};`).then(result => {
					// ParadigmREVOLUTION.Application.GraphNodes = result[0];
					let TGraphNodes = result[0];
					let qstr = "";
					TGraphNodes.forEach(node => {
						node.id = node.id.id;
						qstr += `upsert ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} content ${JSON.stringify(node)};`;
					});
					ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr);

					console.log(`Success fetching data from ${storage}`, TGraphNodes);

				}).catch(error => {
					console.error(`Error fetching data from ${storage}`, error);
				});
				// GET EDGES from server/storage
				ParadigmREVOLUTION.Datastores.SurrealDB[storage].Instance.query(`select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')};`).then(result => {
					console.log(`Success fetching edges from ${storage}`, result[0]);
					ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(`delete from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')};`).then(() => {
						let qstr = "";
						result[0].forEach(edge => {
							let edgeTable = edge.id.tb;
							let edgeID = JSON.stringify(edge.id.id)
							let edgeInTable = edge.in.tb;
							let edgeInID = JSON.stringify(edge.in.id);
							let edgeOutTable = edge.out.tb;
							let edgeOutID = JSON.stringify(edge.out.id);
							let tEdge = edge;
							delete tEdge.id;
							delete tEdge.in;
							delete tEdge.out;
							let tEdgestr = JSON.stringify(tEdge).slice(1, -1);
							console.log('tEdgestr :>> ', tEdgestr);
							qstr += `
						insert relation into
						${edgeTable} 
						{
							id:${edgeID}, 
							in:${edgeInTable}:${edgeInID}, 
							out:${edgeOutTable}:${edgeOutID}, 
							${tEdgestr}
						};\n`
						});
						ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr);
						console.log(`Success Deleting edges from ${storage}`);

						// Refresh render
						console.log('graphCanvas :>> ', graphCanvas);
						graphCanvas.querySelector('.document_refreshrender_button').click();
						// document.querySelector('#document_refreshrender_button').click();
					}).catch(error => {
						console.error(`Error deleting edges from ${storage} `, error);
					});
				}).catch(error => {
					console.error(`Error fetching edges from ${storage}`, error);
				});
			}
		});
	});
	document.querySelectorAll('.graph_save_data_button').forEach(button => {
		button.addEventListener('click', (e) => {
			const storage = e.target.closest('.graph_save_data_button').dataset.storage;
			let qstr = '';
			if (confirm(`Anda akan melakukan sinkronisasi GRAPH DATA dari CLIENT ke ${storage}. Apakah anda yakin?`)) {
				// Sync Nodes data
				qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name};`;
				console.log('qstr :>> ', qstr);
				ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(results => {
					// ParadigmREVOLUTION.Application.GraphNodes = result[0];
					console.log(`Success fetching nodes from Memory`, results);
					let TGraphNodes = results[0];
					let qstr = "";
					TGraphNodes.forEach(node => {
						node.id = node.id.id;
						qstr += `upsert ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(node.id)} content ${JSON.stringify(node)};`;
						qstr += `\n\n`;
					});
					console.log('qstr', qstr);
					ParadigmREVOLUTION.Datastores.SurrealDB[storage].Instance.query(qstr).then((results) => {
						console.log(`Success sending nodes to ${storage}`, results);
					}).catch(error => {
						console.error(`Error sending nodes to ${storage}`, error);
					});
				}).catch(error => {
					console.error('Error fetching nodes from Memory', error, qstr);
				});
				// Sync Edges data
				qstr = `select * from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(option => `${option.Type}`).join(', ')};`;
				ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(results => {
					console.log('Success fetching edges from Memory', results);
					let qstr = "";
					results[0].forEach(edge => {
						let edgeTable = edge.id.tb;
						let edgeID = JSON.stringify(edge.id.id)
						let edgeInTable = edge.in.tb;
						let edgeInID = JSON.stringify(edge.in.id);
						let edgeOutTable = edge.out.tb;
						let edgeOutID = JSON.stringify(edge.out.id);
						let tEdge = edge;
						delete tEdge.id;
						delete tEdge.in;
						delete tEdge.out;
						let tEdgestr = JSON.stringify(tEdge).slice(1, -1);
						console.log('tEdgestr :>> ', tEdgestr);
						qstr += `
					insert relation into
					${edgeTable} 
					{
						id:${edgeID}, 
						in:${edgeInTable}:${edgeInID}, 
						out:${edgeOutTable}:${edgeOutID}, 
						${tEdgestr}
					};\n`;
					});
					console.log('qstr :>> ', qstr);
					ParadigmREVOLUTION.Datastores.SurrealDB[storage].Instance.query(qstr).then((results) => {
						console.log(`Success sending edges to ${storage}`, results);
					}).catch(error => {
						console.error(`Error sending edges to ${storage}`, error);
					});
				}).catch(error => {
					console.error('Error fetching edges from Memory', error, qstr);
				});
			}
		});
	});
	document.querySelectorAll('.graph_clear_data_button').forEach(btn => {
		btn.addEventListener('click', (e) => {
			let storage = e.target.closest('.graph_clear_data_button').dataset.storage;
			const graphCanvas = e.target.closest('.app_configurator_containers');
			console.log('graphCanvas :>> ', graphCanvas);
		
			if (!storage) storage = 'Memory';
			let qstr = '';

			const confirmString = 'a';
			if (confirm(`Anda akan melakukan penghapusan GRAPH DATA di ${storage}. Apakah anda yakin?`))
				if (prompt(`DATA YANG DIHAPUS TIDAK BISA DIKEMBALIKAN. Apakah anda yakin? Ketik [${confirmString}] untuk melanjutkan`) == confirmString)
					ParadigmREVOLUTION.Datastores.SurrealDB[storage].Instance.query(`delete from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}`).then(result => {
						// ParadigmREVOLUTION.Application.GraphNodes = [];
						ParadigmREVOLUTION.Datastores.SurrealDB[storage].Instance.query(`delete from next_process;`);
			
						// Refresh render
						if (graphCanvas) graphCanvas.querySelector('.document_refreshrender_button').click();
						console.log('Success deleting data from LocalDB');
					}).catch(error => {
						console.error('Error deletinging data from LocalDB', error);
					});
		});
	});
	oFlow.Graph.Events.enableMiddleClickScroll(document.querySelector('#app_root_container'));
	document.querySelectorAll('.scroll_content').forEach(element => {
		oFlow.Graph.Events.enableMiddleClickScroll(element);
	});
	oFlow.Graph.Events.enableMiddleClickScroll(document.querySelector('#app_data_preparation_area'));

	// NOTE - CONNECT NODES!
	oFlow.Form.Events.addGlobalEventListener('mousedown', [
		{
			selector: '.graph-node .card-header-title', // Select .card-content within .graph-node
			callback: (e) => {
				console.log('For node move, e.button', e.button);
				if (e.button === 0) { // Left mouse button
					console.log('Mouse down on .card-content inside .graph-node');

					// Ensure you are in the correct .graph-node
					const graphNode = e.target.closest('.graph-node');
					if (graphNode) {
						// Disable text selection for the graph surface
						const graphSurface = graphNode.closest('.graph_surfaces');
						if (graphSurface) {
							graphSurface.style.userSelect = 'none';
						}
					
						// console.log('graphNode', graphNode);
						// Set the starting node
						oFlow.selectedNodesToConnect.Start = graphNode;
						oFlow.selectedNodesToConnect.StartParam = {
							id: graphNode.id,
							class: 'graph-node',
							name: graphNode.dataset.nodename,
							label: graphNode.dataset.nodelabel
						};
						console.log('oFlow.selectedNodesToConnect.Start :>> ', oFlow.selectedNodesToConnect.Start);

						// Add breathing to card-header-title
						document.querySelectorAll('.graph-node .card-header-title').forEach(node => {
							if (node !== oFlow.selectedNodesToConnect.Start) {
								node.classList.add('breathing-text');
							}
						})
					}
				}
			}
		}
	]);

	oFlow.Form.Events.addGlobalEventListener('mouseup', [
		{
			selector: '.graph_node_surface',
			callback: (e) => {
				// Reset breathing to card-header-title
				document.querySelectorAll('.graph-node .card-header-title').forEach(node => {
					if (node !== oFlow.selectedNodesToConnect.Start) {
						node.classList.remove('breathing-text');
					}
				});
			}
		},
		{
			selector: '.graph-node .card-header-title', // Mouse up can be on any .graph-node
			callback: (e) => {
				if (e.button === 0 && oFlow.selectedNodesToConnect.Start) { // Left mouse button
					console.log('Mouse up on .graph-node');

					let parentGraphID = e.target.closest('.app_configurator_containers').id;

					// Reset breathing to card-header-title
					document.querySelectorAll('.graph-node .card-header-title').forEach(node => {
						if (node !== oFlow.selectedNodesToConnect.Start) {
							node.classList.remove('breathing-text');
						}
					});

					// Re-enable text selection
					const graphSurface = e.target.closest('.graph_surfaces');
					if (graphSurface) {
						graphSurface.style.userSelect = '';
					}

					// Set the ending node
					const graphNode = e.target.closest('.graph-node');
					oFlow.selectedNodesToConnect.End = graphNode;
					oFlow.selectedNodesToConnect.EndParam = {
						id: graphNode.id,
						class: 'graph-node',
						name: graphNode.dataset.nodename,
						label: graphNode.dataset.nodelabel
					};

					let selectedNodes = oFlow.selectedNodesToConnect;

					if (oFlow.selectedNodesToConnect.Start !== oFlow.selectedNodesToConnect.End) {
					
						let qstr = `select * from Process, Version, Contains, Workflow, DataInput, DataOutput where OutputPin.nodeID = "${oFlow.selectedNodesToConnect.StartParam.id}" and InputPin.nodeID = "${oFlow.selectedNodesToConnect.EndParam.id}";`;
						// console.log(qstr);
						ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(result => {
							let edges = result[0];

							console.log('qstr :>> ', qstr);
							console.log('A PAIR OF NODES SELECTED');
							// NOTE - Create new Graph edge

							console.log('selectedNodes sebelum di pass:>> ', selectedNodes);
							let schema = {
								"id": "form_select_connection_type",
								"label": "Form Select Connection Type",
								"type": "record",
								"typeSelection": ["record", "array"],
								"icon": "<i class=\"fa-brands fa-wpforms\"></i>",
								"order": 100,
								"Dataset": {
									"Layout": {
										"Form": {},
										"Properties": {
											"FormEntry": {
												"Show": 1,
												"Label": "Form Select Connection Type",
												"ShowLabel": 1
											},
											"Preview": {
												"Show": 1,
												"Label": "Form Select Connection Type",
												"ShowLabel": 1
											}
										}
									},
									"Schema": [
										{
											"id": "connectionType",
											"label": "Connection Type",
											"type": "select",
											"value": [...(ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.map(elmt => elmt.Type))],
											"field_class": "is-selectable-box",
											"form": 1
										},
										{
											"id": "arrowBend",
											"label": "Arrow Bend",
											"type": "select",
											"value": ["convex", "concave"],
											"field_class": "is-selectable-box",
											"form": 1
						
										}
									]
								}
							}
							// const connectionMessage = 'Connection Type';
							const connectionMessage = `
							<div class="container has-text-centered">
								<p class="is-size-4 has-text-primary">
									${selectedNodes.StartParam.label} 
									<span class="is-size-6 has-text-grey">(${selectedNodes.StartParam.id})</span>
								</p>
								<p class="is-size-6 has-text-grey">to</p>
								<p class="is-size-4 has-text-primary">
									${selectedNodes.EndParam.label} 
									<span class="is-size-6 has-text-grey">(${selectedNodes.EndParam.id})</span>
								</p>
							</div>
						`;

							oFlow.Graph.Events.showSchemaModal(connectionMessage, schema, { selectedNodes: selectedNodes, FlowGraph: oFlow, edges: edges }, (data, passedData) => {
								console.log(edges.findIndex(item => item.Connection.Type === data.connectionType));

								let newEdge = JSON.parse(JSON.stringify(ParadigmREVOLUTION.SystemCore.Blueprints.Data.Edge));
								const selectedType = ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray[ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.ConnectionArray.findIndex(item => item.Type === data.connectionType)];
								const arrowBend = data.arrowBend;

								newEdge.id = {
									ID: selectedType.Type + '__' + ParadigmREVOLUTION.SystemCore.Modules.ULID(),
									Table: selectedType.Type
								}
								newEdge.OutputPin.nodeID = selectedNodes.StartParam.id;
								newEdge.InputPin.nodeID = selectedNodes.EndParam.id;
								newEdge.Connection.Type = data.connectionType;
								newEdge.Path.Color = selectedType.Color;
								newEdge.Path.PathThickness = 5;
								newEdge.Path.PathDecoration = selectedType.PathDecoration;
								newEdge.ArrowBend = arrowBend;

								// console.log('newEdge :>> ', newEdge);
								selectedNodes.Start = document.querySelector(`div[id="${selectedNodes.StartParam.id}"][class="${selectedNodes.StartParam.class}"]`);
								selectedNodes.End = document.querySelector(`div[id="${selectedNodes.EndParam.id}"][class="${selectedNodes.EndParam.class}"]`);

								console.log('passedData :>> ', passedData);
								const parentSet = passedData.FlowGraph.getActiveTab('tab-graph-selector-container');
							
								const [edge, pinOut, pinIn, direction] = oFlow.Graph.Events.createGutterDotsAndConnect(
									selectedNodes.Start,
									selectedNodes.End,
									newEdge,
									parentSet
								);
								if (!pinOut || !pinIn) {
									console.error(`Failed to create gutter dots and connect nodes, pinOut:${pinOut} or pinIn:${pinIn}`);
									return;
								}
								// console.log('parentGraphID :>> ', parentGraphID);

								passedData.FlowGraph.Graph.Events.connectNodes(
									edge,
									parentSet.graphCanvas.graph_connection_surface,
									parentSet.graphCanvas.graph_surface.parentElement
								);

								let qstr = `select id from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.ID = '${edge.OutputPin.nodeID}'`;
								// console.log(qstr);
								ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(result => {
									let outid = result[0][0].id.id;
									qstr = `select id from ${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name} where id.ID = '${edge.InputPin.nodeID}'`;
									console.log('qstr', qstr);
									ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then(result => {
										let inid = result[0][0].id.id;
										console.log('edge sebelum insert:>> ', edge);
										qstr = `relate \n${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(outid)}\n-> ${selectedType.Type} -> \n${ParadigmREVOLUTION.SystemCore.Blueprints.Data.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Tables.Graph.Name}:${JSON.stringify(inid)} \n content \n${JSON.stringify(edge)}`;
										console.log(qstr);
										ParadigmREVOLUTION.Datastores.SurrealDB.Memory.Instance.query(qstr).then((result) => {
											console.log('Edge creation SUCCESS', result);
										}).catch(err => console.error('Edge creation FAIL, ', err));
									}).catch(err => console.error('Input nodePin not found', err));
								}).catch(err => console.error('Output nodePin not found', err));
							}, (data, passedData) => {
								console.log('data :>> ', data);
								console.log('passedData :>> ', passedData);
								if (passedData.edges.findIndex(item => item.Connection.Type === data.connectionType) !== -1) {
									ParadigmREVOLUTION.Utility.Notification.showNotification(
										{
											title: 'ERROR',
											info: 'Edge already exists for this connection type'
										},
										'is-danger',
										3000
									);
									return false;
								} else {
									return true;
								}
							
							});
						}).catch(error => {
							console.error('Error fetching edges:', error);
						});
					}
					// Reset the selected nodes
					oFlow.selectedNodesToConnect.Start = null;
					oFlow.selectedNodesToConnect.End = null;
				}
			}
		}
	]);

	function enableZoomControl(flow) {
		let zoomTimeout = null; // Timeout variable for delayed scroll adjustment

		// Get the container and buttons
		const zoomInButton = document.querySelectorAll('.zoom_in_button');
		const zoomResetButton = document.querySelectorAll('.zoom_reset_button');
		const zoomOutButton = document.querySelectorAll('.zoom_out_button');

		// console.log('zoom controls', zoomInButton, zoomResetButton, zoomOutButton);
		let newScrollLeft;
		let newScrollTop;
		let clickCount = 0;
		let zoombtn = '';
		let prevzoombtn = '';

		// Zoom function to adjust the viewport position
		const applyZoom = (newScale, container, graphContent, flow) => {
			clickCount++;
			// Get the current scroll position and dimensions
			const containerRect = container.getBoundingClientRect();
			const graphContentRect = graphContent.getBoundingClientRect();
	
			// Get the viewport center relative to the content
			const viewportCenterX = container.scrollLeft + containerRect.width / 2;
			const viewportCenterY = container.scrollTop + containerRect.height / 2;
	
			// Calculate the relative position of the viewport center to the content
			const relativeCenterX = viewportCenterX / flow.ZoomScale;
			const relativeCenterY = viewportCenterY / flow.ZoomScale;
	
			// Update the scale
			flow.ZoomScale = newScale;
			graphContent.style.transform = `scale(${flow.ZoomScale})`;
	
			// Adjust the scroll position to maintain the same relative center
			if (clickCount == 1) {
				console.log('Masuk save scroll position');
				newScrollLeft = relativeCenterX * flow.ZoomScale - containerRect.width / 2;
				newScrollTop = relativeCenterY * flow.ZoomScale - containerRect.height / 2;
				console.log(newScrollLeft, newScrollTop);
			}
	

			if (zoomTimeout) {
				clearTimeout(zoomTimeout);
			}
			zoomTimeout = setTimeout(() => {
				// container.scrollLeft = newScrollLeft*flow.ZoomScale;
				// container.scrollTop = newScrollTop*flow.ZoomScale;
				if (zoombtn == 'in') {
					container.scrollTo({
						left: newScrollLeft * flow.ZoomScale,
						top: newScrollTop * flow.ZoomScale,
						behavior: 'smooth', // Enable smooth scrolling
					});
					prevzoombtn = 'in';
				} else if (zoombtn == 'out') {
					container.scrollTo({
						left: newScrollLeft / flow.ZoomScale,
						top: newScrollTop / flow.ZoomScale,
						behavior: 'smooth', // Enable smooth scrolling
					});
					prevzoombtn = 'out';
				} else if (zoombtn == 'reset') {
					if (prevzoombtn == 'in') {
						container.scrollTo({
							left: newScrollLeft * flow.ZoomScale,
							top: newScrollTop * flow.ZoomScale,
							behavior: 'smooth', // Enable smooth scrolling
						});
					} else if (prevzoombtn == 'out') {
						container.scrollTo({
							left: newScrollLeft * flow.ZoomScale,
							top: newScrollTop * flow.ZoomScale,
							behavior: 'smooth', // Enable smooth scrolling
						});
					}
					prevzoombtn = '';
				}
				clickCount = 0;
			}, 500);
	
			console.log('Zoom adjusted:', flow.ZoomScale);
		};
	
		// Zoom In action
		zoomInButton.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				console.log('zoom in clicked');
				const graphCanvas = e.target.closest('.app_configurator_containers').dataset.tabtype;
				const graphContent = e.target.closest('.app_configurator_containers').querySelector('.graph_surfaces');
				const container = graphContent.parentElement; // Assuming parent is the scrollable container
				console.log(graphCanvas, graphContent, container);

				if (oFlow.GraphCanvas[graphCanvas].ZoomScale < oFlow.GraphCanvas[graphCanvas].MaxZoomScale) {
					const zoomlv = ParadigmREVOLUTION.Utility.Numbers.Round2(oFlow.GraphCanvas[graphCanvas].ZoomScale + oFlow.GraphCanvas[graphCanvas].ZoomStep);
					applyZoom(zoomlv, container, graphContent, oFlow.GraphCanvas[graphCanvas]);
					zoomResetButton.forEach((btn) => {
						btn.parentElement.querySelector('.zoomLevel').innerHTML = zoomlv;
					});
					zoombtn = 'in';
				}
			});
		});
		
	
		// Zoom Reset action
		zoomResetButton.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				const graphCanvas = e.target.closest('.app_configurator_containers').dataset.tabtype;
				const graphContent = e.target.closest('.app_configurator_containers').querySelector('.graph_surfaces');
				const container = graphContent.parentElement; // Assuming parent is the scrollable container
				applyZoom(1, container, graphContent, oFlow.GraphCanvas[graphCanvas]);
				zoomResetButton.forEach((btn) => {
					btn.parentElement.querySelector('.zoomLevel').innerHTML = 1;
				});
				zoombtn = 'reset';
			});
		});
	
		// Zoom Out action
		zoomOutButton.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				console.log('zoom out clicked');
				const graphCanvas = e.target.closest('.app_configurator_containers').dataset.tabtype;
				const graphContent = e.target.closest('.app_configurator_containers').querySelector('.graph_surfaces');
				const container = graphContent.parentElement; // Assuming parent is the scrollable container


				if (oFlow.GraphCanvas[graphCanvas].ZoomScale < oFlow.GraphCanvas[graphCanvas].MaxZoomScale) {
					const zoomlv = ParadigmREVOLUTION.Utility.Numbers.Round2(oFlow.GraphCanvas[graphCanvas].ZoomScale - oFlow.GraphCanvas[graphCanvas].ZoomStep);
					applyZoom(zoomlv, container, graphContent, oFlow.GraphCanvas[graphCanvas]);
					zoomResetButton.forEach((btn) => {
						btn.parentElement.querySelector('.zoomLevel').innerHTML = zoomlv;
					});
					zoombtn = 'out';
				}
			});
		});
	}
	enableZoomControl(this);

	document.querySelectorAll('.graph_fullscreen_button').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			// console.log('graph_fullscreen_button clicked');
			const appConfiguratorContainer = document.querySelector('#app_configurator_container');
			const rectAppConfiguratorContainer = appConfiguratorContainer.getBoundingClientRect();
			// console.log('rectAppConfiguratorContainer :>> ', rectAppConfiguratorContainer);
			appConfiguratorContainer.classList.toggle('fullscreen');
			const fullscreen = appConfiguratorContainer.classList.contains('fullscreen') ? true : false;
			oFlow.toggleFullscreen();
			if (fullscreen) {
				document.querySelector('#app_top_menu_container').classList.toggle('hide');
				document.querySelector('#app_graph_tabs_container').classList.toggle('show');
				document.querySelector('.graph_fullscreen_button').querySelector('i').classList.remove('fa-expand');
				document.querySelector('.graph_fullscreen_button').querySelector('i').classList.add('fa-compress');
			} else {
				document.querySelector('.graph_fullscreen_button').querySelector('i').classList.remove('fa-compress');
				document.querySelector('.graph_fullscreen_button').querySelector('i').classList.add('fa-expand');

				document.querySelector('#app_top_menu_container').classList.toggle('hide');
				document.querySelector('#app_graph_tabs_container').classList.toggle('show');
			}
		});
	});
	// NOTE - TEST MONITOR OBJECT onchange on an object structure
	let testArr = {};
	const monitoredObject = ParadigmREVOLUTION.Utility.Objects.monitorObject(testArr, (changes) => {
		console.log("Changes detected:", changes);
	});
	window.testMonitoredObject = monitoredObject;

	function initializeSuQL() {
		const datastore_select = document.querySelector('#console_datastorage_select');
		const suql_input = document.querySelector('#console_suql_input');
		const suql_exec = document.querySelector('#console_suql_execute');
		suql_exec.addEventListener('click', (e) => {
			ParadigmREVOLUTION.Datastores.SurrealDB[datastore_select.value].Instance.query(suql_input.value).then(result => {
				console.log('SuQL Result :>> ', result);
			}).catch(error => {
				console.error('SuQL Error :>> ', error);
			});
		});
	}
	initializeSuQL();
}

let cr = true;
if (cr) console.log('>>> >>> >>> >>> ParadigmREVOLUTION');

document.addEventListener('UtilitiesLoaded', () => {
	console.log('>>>>>> check for UtilitiesLoaded in paradigm_revolution.js');
});
document.addEventListener('BlueprintsLoaded', () => {
	console.log('>>>>>> check for BlueprintsLoaded  in paradigm_revolution.js');
});

//NOTE - ParadigmREVOLUTION STARTUP
document.addEventListener('SurrealDBLoaded', async () => {
	let OK = true;
	Object.keys(ParadigmREVOLUTION.SystemCore.CoreStatus).forEach((key) => {
		if (ParadigmREVOLUTION.SystemCore.CoreStatus[key].Status == 'FAILED TO LOAD') OK = false;
	});
	if (!OK) return;

	//NOTE - Initialize Clear status loader
	document.querySelector('#Loader_container').classList.add('hide');
	document.querySelector('#Loader_container').remove();
	console.log('>>> >>> >>> >>> ||| STARTING YGGDRASIL INITIALIZATION');
			
	let CurrentDocument = JSON.parse(JSON.stringify(ParadigmREVOLUTION.SystemCore.Blueprints.Data.Node));
	window.CurrentDocument = CurrentDocument;
	// NOTE - Initialize Main Form (App_menu, App_Container, App_Helper, App_console)
	CurrentDocument.Dataset.Layout = ParadigmREVOLUTION.SystemCore.Template.Data.MainAppLayout;

	//NOTE - Chain test!
	//NOTE - Chain Initialization!
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
				"a": ["P2.output", 5],
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

	//NOTE - Datqastore Initialization
	// let ram_db = ParadigmREVOLUTION.Datastores.SurrealDB.Memory;
	// let local_systemdb = ParadigmREVOLUTION.Datastores.SurrealDB.LocalSystemDB;
	// let local_datadb = ParadigmREVOLUTION.Datastores.SurrealDB.LocalDataDB;
	// let test_db = ParadigmREVOLUTION.Datastores.SurrealDB.TestServer;

	// window.ram_db = ram_db;
	// window.local_systemdb = local_systemdb;
	// window.local_datadb = local_datadb;
	// window.test_db = test_db;

	// NOTE - START LOGIN SEQUENCE
	ParadigmREVOLUTION.Utility.DOMUtilities.showSchemaModal({
		"id": "paradigmrevolution_login",
		"label": `<span style="font-family: 'Rochester'; font-size:3rem;">Paradigm </span><span style="font-family: 'Bebas Neue'; font-weight: 100; font-style:italic; font-size:3.6rem;">REVOLUTION</span>`,
		
		"style": "",
		"type": "record",
		"typeSelection": ["record", "array"],
		"icon": "",
		"order": 100,
		"is_horizontal_form": false,
		"Dataset": {
			"Layout": {
				"Form": {},
				"Properties": {
					"FormEntry": {
						"Show": 1,
						"Label": "Login form",
						"ShowLabel": 1,
						"Style": "width: 40rem; margin-left:10rem; margin-right:10rem;",
						"Class": "mx-6 mb-4",
					},
					"Preview": {
						"Show": 1,
						"Label": "Login form",
						"ShowLabel": 1
					}
				}
			},
			"Schema": [
				// {
				// 	"id": "login",
				// 	"label": "Login",
				// 	"type": "label",
				// 	"style":"font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 1rem;",
				// 	"field_class": "is-justify-content-center",
				// 	"form": 1
				// },
				// {
				// 	"id": "separator",
				// 	"label": "separator",
				// 	"type": "separator-fullwidth",
				// 	"style": "",
				// 	"element_class": "has-background-primary-dark",
				// 	"field_class": "pb-6",
				// 	"form": 1
				// },
				{
					"id": "username",
					"label": "Nama",
					"type": "text",
					"field_class": "is-selectable-box",
					"form": 1
				},
				{
					"id": "password",
					"label": "Password",
					"type": "password",
					"value": "",
					"field_class": "is-selectable-box",
					"form": 1
				},
				{
					"id": "masuk",
					"label": "",
					"type": "button",
					"value": "Masuk",
					"element_class": "is-success",
					"field_class": "",
					"form": 1
				}
			]
		}
	}, {}, (modalContainer) => {
		modalContainer.querySelector('#paradigmrevolution_login___username').focus();
		modalContainer.querySelector('#paradigmrevolution_login___password').addEventListener('keyup', (e) => {
			if (e.key === 'Enter') { 
				modalContainer.querySelector('#paradigmrevolution_login___masuk').click();
			}
		});
	}, (dataset, modal) => {
		
		console.log('modal :>> ', modal.modalContainer);
		let buttonMasuk = modal.modalContainer.querySelector('#paradigmrevolution_login___masuk');
		console.log('buttonMasuk :>> ', buttonMasuk);
		buttonMasuk.addEventListener('click', (e) => {
			let data = {};
			modal.modalContainer.querySelector('.modal-form').querySelectorAll('input, button, select, textarea').forEach(input => {
				const key = input.id.split('___')[1];
				switch (input.type) {
					case 'checkbox':
						data[key] = input.checked;
						break;
					default:
						data[key] = input.value;
						break;
				}
			});

			// const data = dataset.data;
			console.log('data :>> ', data);
			const passedData = dataset.passedData;
			let login = false;

			// let testUser =
			let testUsers = [
				{ username: 'admin', password: 'admin' },
				{ username: 'user1', password: 'password1' },
				{ username: 'user2', password: 'password2' }
			];

			const currentUser = data;
			const authUser = testUsers.find(u => u.username === data.username && u.password === data.password);
			// if (data.username == testUser.username && data.password == testUser.password) {
			if (authUser) {
				// clean up
				// NOTE - LOGGED IN !! IF LOGIN SUCCESS, THEN Render Main Form, get something on the screen

				window.addEventListener("beforeunload", function (e) {
					e.preventDefault();
					e.returnValue = ''; // Required for Chrome		
				});

				modal.modal.classList.remove('fade-in');
				modal.modal.classList.add('fade-out');
				setTimeout(() => {
					modal.modalContainer.remove(); // Remove the modal
				}, 300); // Matches the animation duration
				// clean up
				login = true;
				// NOTE - IF LOGIN SUCCESS, THEN Render Main Form, get something on the screen
				let Flow = new ParadigmREVOLUTION.SystemCore.Modules.Flow(
					document.querySelector('#ParadigmREVOLUTION'),
					ParadigmREVOLUTION.Utility,
					ParadigmREVOLUTION.Utility.BasicMath,
					chain,
					{
						ram_db: ParadigmREVOLUTION.Datastores.SurrealDB.Memory,
						local_systemdb: ParadigmREVOLUTION.Datastores.SurrealDB.LocalSystemDB,
						local_datadb: ParadigmREVOLUTION.Datastores.SurrealDB.IndexedDB,
						test_db: ParadigmREVOLUTION.Datastores.SurrealDB.TestServer
					}
				);

				Flow.FormContainer.innerHTML = Flow.Form.Render.traverseDOMProxyOBJ(CurrentDocument.Dataset.Layout);
				if (Flow.FormContainer.innerHTML != '') {
					ParadigmREVOLUTION.SystemCore.Blueprints.Data.NodeMetadata.TabsArray.forEach((tab) => {
						// console.log('tab :>> ', tab);
						let temp = `
							<li class="${tab.LinkClass}">
								<a class="${tab.AnchorClass}" data-tabtype="${tab.TabType}">${tab.Label}</a>
							</li>
						`;
						Flow.FormContainer.querySelector('#tab-graph-selector-container').innerHTML += temp;
					});

					if (cr) console.log('>>> >>> >>> >>> >>> ||| Detecting Datastore Status in paradigm_revolution.js');
					let datastore_status = '';
					Object.entries(ParadigmREVOLUTION.Datastores.SurrealDB).forEach(([idx, entry]) => {
						datastore_status += `<button class="datastore-status-indicator button is-small p-2 m-0 mr-1" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>`;
					});
					document.querySelector('#datastore_status').innerHTML = datastore_status;
					if (cr) console.log('<<< <<< <<< <<< <<< ||| Detecting Datastore Status in paradigm_revolution.js');

					Flow.FormContainer.classList.remove('hide');
					Flow.FormContainer.classList.add('show');

					CurrentDocument.Dataset.Forms = [ParadigmREVOLUTION.SystemCore.Schema.Data.FormInputTypes, ParadigmREVOLUTION.SystemCore.Schema.Data.FormInputTypeDefinition];
					Flow.Forms = CurrentDocument.Dataset.Forms;

					//Flow.Form.Events.InitializeFormControls();
					
					InitializeFormControls(Flow);

					console.log("Publising into MQTT");
					ParadigmREVOLUTION.MQTTclients = {
						"System": {
							"Login": null
						}
					};
					ParadigmREVOLUTION.MQTTclients.System.Login = ParadigmREVOLUTION.Utility.MQTT.setupMQTT(
						ParadigmREVOLUTION.SystemCore.Modules.mqtt,
						'wss://localhost:8888', // ✅ WebSocket-compatible URL
						{
							subscribeTopic: 'System/Login',
							publishTopic: 'System/Login',
							messageToPublish: `${currentUser.username} has logged in`,
						},
						currentUser
					);
					console.log('ParadigmREVOLUTION.MQTTclients :>> ', ParadigmREVOLUTION.MQTTclients);
					document.dispatchEvent(new Event('ParadigmREVOLUTIONLoginSuccess'));
				}
				//NOTE - Chain execution!
				Flow.Form.Run.executeChain();
			} else {
				// NOTE  -IF LOGIN FAILED, THEN ...
				alert('Login Failed');
				console.log('Login Failed');
			}
		});

	}, {}
		// {
		// confirm: {
		// 	label: 'Masuk',
		// 	icon: 'fa-solid fa-right-to-bracket',
		// 	class: 'is-primary',
		// 	style: 'width: 100%;'
		// },
		// // cancel: {
		// 	label: 'Batal',
		// 	icon: 'fa-solid fa-xmark',
		// 	class: 'is-danger'
		// }
		// }
	);
});