const OperatorTemplate = {
	"datetime": [">", ">=", "=", "!=", "<=", "<", "is", "is not"],
	"number": [">", ">=", "=", "!=", "<=", "<", "contains"],
	"string": ["starts with", "ends with", "contains", "is", "is not",],
	"boolean": ["is", "is not"],
	"array": ["starts with", "ends with", "contains", "in", "not in"]
};

export class Flow {
	constructor(container = null, utility = null, funcObject = null, chain = []) {
		this.cursor = null; // Track the current process
		this.chain = chain;
		this.run_mode = ["run", "stop", "pause", "step", "debug"];
		this.run_mode_selected = "run"; // Default to "run"
		this.processFunctions = funcObject;
		this.Forms  = null;
		this.FormContainer = container;
		this.SnapScroll = null;
		this.Utility = utility;
		this.State = {
			"Interaction": [],
			"Flow":[]
		};
	}
	checkType = function (variable) {
		if (variable instanceof Date) {
			return "DateTime";
		} else if (typeof variable === 'number') {
			return "Number";
		} else if (typeof variable === 'string') {
			// Allow flexible matching of numbers with optional commas
			if (/^-?[\d,]+(\.\d+)?$/.test(variable.replace(/,+/g, ''))) {
				return "Number";
			} else if (["true", "yes", "ya", "sudah"].includes(variable.toLowerCase())) {
				return "Boolean";
			} else if (["false", "no", "tidak", "belum"].includes(variable.toLowerCase())) {
				return "Boolean";
			} else {
				return "String";
			}
		} else if (typeof variable === 'boolean') {
			return "Boolean";
		} else if (Array.isArray(variable)) {
			return "Array";
		} else if (typeof variable === 'function') {
			return "Function";
		} else if (typeof variable === 'object') {
			if (variable instanceof Element || variable instanceof HTMLElement) {
				return "DOM Element";
			} else {
				return "Object";
			}
		} else if (variable === null) {
			return 'null';
		} else {
			return "Unknown";
		}
	}
	sanitizeInput = (function (zinput) {
		let input = zinput;
		// Check for datetime string
		const datetimeRegex224 = /^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}(\s\d{1,2}:\d{2}:\d{2})?$/;
		const datetimeRegex422 = /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}(\s\d{1,2}:\d{2}:\d{2})?$/;
		if (datetimeRegex224.test(zinput)) {
			input = new Date(zinput);
		} else if (datetimeRegex422.test(zinput)) {
			input = new Date(zinput);
		}
		let varType = this.checkType(input);
		// const datetimeRegex = /^\d{1,2,4}\/\d{1,2}\/\d{1,2,4}(\s\d{1,2}:\d{2}:\d{2})?$/;

		switch (varType) {
			case 'DateTime':
				return this.Time.SafeDateTime(input);
				break;
			case 'Number':
				return this.Numbers.SafeNumber(input);
				break;
			case 'Boolean':
				return this.Booleans.SafeBoolean(input, true);
				break;
			case 'String':
				return this.Strings.SafeString(input);
				break;
			case 'Array':
				return this.Array.IsArrayOK(input);
				break;
			case 'Function':
				return input;
				break;
			case 'DOM Element':
				return input;
				break;
			case 'Object':
				return input;
				break;
			case 'null':
				return null;
				break;
			default:
				return undefined;
				break;
		}
	}).bind(this);
	sanitizeHTML = (html) => {
		// Use a basic sanitizer to strip out unsafe HTML
		const tempDiv = document.createElement('div');
		tempDiv.textContent = html;
		return tempDiv.innerHTML;
	};

	// Helper to validate hrefs
	isSafeHref = (href) => {
		// Only allow safe links; adjust regex based on what "safe" means in context
		return /^https?:\/\/|^\/\//i.test(href);
	};
	Form = {
		Components: {
			DOMElement: () => {
				return {
					comment: comment,
					tag: tag,
					class: className,
					id: id,
					style: style,
					href: href,
					title: title,
					data: data,
					aria: aria,
					order: order,
					innerHTML: innerHTML,
					content: content
				}
			},
			BulmaCSS: {
				Elements: {
					Block: (({
						id = "",
						class: className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						innerHTML = "",
						content = []
					}) => {
						return {
							comment: "Block container",
							tag: "div",
							class: `block ${className}`,
							id,
							style,
							href: isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							innerHTML,
							content
						};
					}).bind(this),
					Box: (({
						id = "",
						class: className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						innerHTML = "",
						content = []
					}) => {
						const sanitize = (html) => {
							// Use a basic sanitizer to strip out unsafe HTML
							const tempDiv = document.createElement('div');
							tempDiv.textContent = html;
							return tempDiv.innerHTML;
						};

						// Helper to validate hrefs
						const isSafeHref = (href) => {
							// Only allow safe links; adjust regex based on what "safe" means in context
							return /^https?:\/\/|^\/\//i.test(href);
						};

						return {
							comment: "Box container",
							tag: "div",
							class: `box ${className}`,
							id,
							style,
							href: isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							innerHTML,
							content
						};
					}).bind(this),
					Button: (() => {

					}).bind(this),
					Content: (() => {

					}).bind(this),
					Delete: (() => {

					}).bind(this),
					Icon: (() => {

					}).bind(this),
					Image: (() => {

					}).bind(this),
					Notification: (() => {

					}).bind(this),
					ProgressBars: (() => {

					}).bind(this),
					Table: (() => {

					}).bind(this),
					Tag: (() => {

					}).bind(this),
					Title: (() => {

					}).bind(this),
				},
				Components: {
					Card: (({
						id = "",
						className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						headerIcon = "",
						header = "",
						innerHTML = "",
						content = [],
						footer = ""
					}) => {
						// Basic card structure
						const card = {
							comment: "Card",
							tag: "div",
							class: `card ${className}`,
							id,
							style,
							href: this.isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							content: []
						};

						// Add header if provided
						if (header || headerIcon) {
							const headerContent = [
								headerIcon ? {
									comment: "card-header-icon",
									tag: "button",
									class: "card-header-icon",
									aria: { label: "more options" },
									content: [
										{
											tag: "span",
											class: "icon",
											innerHTML: headerIcon
										}
									]
								} : null,
								{
									comment: "card-header-title",
									tag: "p",
									class: "card-header-title",
									innerHTML: this.sanitizeHTML(header)
								}, {
									comment: "card-header-icon",
									tag: "button",
									class: "card-header-icon",
									aria: { label: "more options" },
									content: [
										{
											tag: "span",
											class: "icon form-shade-button",
											data: {
												formid: id
											},
													innerHTML: `<i class="fas fa-angle-down"></i>`
										}
									]
								}, {
									comment: "card-header-icon",
									tag: "button",
									class: "card-header-icon form-close-button",
									data: {
										formid: id	
									},
									aria: {},
									content: [
										{
											tag: "span",
											class: "icon form-close-button", //NOTE - form-close-button
											innerHTML: `<i class="fa-solid fa-xmark form-close-button" data-formid="${id}"></i>`
										}
									]
								}
							].filter(Boolean); // Remove null if headerIcon is empty

							card.content.push({
								comment: "card-header",
								tag: "header",
								class: "card-header",
								content: headerContent
							});
						}

						// Add main content
						card.content.push({
							comment: "card-content",
							tag: "div",
							class: "card-content",
							content: [
								{
									comment: "content",
									tag: "div",
									class: "content",
									innerHTML: innerHTML,
									content: content
								}
							]
						});

						// Add footer items if provided
						if (footer) {
							const footerContent = footer.map(item => ({
								tag: "a",
								class: "card-footer-item",
								href: isSafeHref(item.href) ? item.href : "",
								innerHTML: sanitize(item.label)
							}));

							card.content.push({
								comment: "Card Footer",
								tag: "footer",
								class: "card-footer",
								content: footerContent
							});
						}
						return card;
					}).bind(this)
				},
				Layout: {
					Hero: (({
						id = "",
						className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						title = "",
						subtitle = ""
					}) => {
						const heroContainer = {
							comment: "Header container",
							tag: "div",
							class: `hero ${className}`,
							id,
							style,
							href: this.isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							content: []
						};

						// Hero section with title and subtitle
						const heroSection = {
							comment: "Hero Container",
							tag: "section",
							class: "hero m-0 p-0",
							content: [
								{
									comment: "Hero Body",
									tag: "div",
									class: "hero-body",
									innerHTML: `<p class="title">${this.sanitizeHTML(title)}</p><p class="subtitle">${this.sanitizeHTML(subtitle)}</p>`,
									content: []
								}
							]
						};
						heroContainer.content.push(heroSection);
						return heroContainer;
					}).bind(this),
					Section: (({
						id = "",
						class: className = "",
						style = "",
						href = "",
						data = {},
						aria = {},
						order = 0,
						innerHTML = "",
						content = []
					}) => {
						return {
							comment: "Section container",
							tag: "section",
							class: `section ${className}`,
							id,
							style,
							href: isSafeHref(href) ? href : "",
							data,
							aria,
							order,
							innerHTML,
							content
						};
					}).bind(this),
				}
			}
		},
		Events: {
			// NOTE - addGlobalEventListener
			addGlobalEventListener: function (type, selectors, parent = document) {
				const nonBubblingEvents = ['focus', 'blur', 'keyup'];
				const initiatedElements = new Set(); // Track selectors that have been handled

				// Add event listener on the parent (or global) scope
				parent.addEventListener(
					type,
					(e) => {

						// Loop through each selector-callback pair
						for (const { selector, callback } of selectors) {
							// Find the closest matching ancestor with the selector
							const targetElement = e.target.closest(selector);

							// Check if this element has already been initiated
							if (targetElement && !initiatedElements.has(targetElement)) {
								initiatedElements.add(targetElement); // Mark as initiated

								// Only trigger callback if the closest match is the element itself (not a child)
								if (targetElement === e.target) {
									if (!nonBubblingEvents.includes(type)) {
										callback(e); // Trigger the callback if the event bubbles
									} else {
										// For non-bubbling events, manually check ancestor chain
										let currentElement = e.target;
										while (currentElement && currentElement !== parent) {
											if (currentElement.matches(selector)) {
												callback(e);
												break;
											}
											currentElement = currentElement.parentElement;
										}
									}
									// Stop processing once a match is found and callback is triggered
									break;
								}
							}
						}
					},
					true // Using capture phase to catch events early, for non-bubbling events
				);
			},

			addGlobalEventListenerV2: function (type, selectors, parent = document) {
				const nonBubblingEvents = ['focus', 'blur', 'keyup'];

				// Add event listener on the parent (or global) scope
				parent.addEventListener(type, (e) => {

					// Loop through each selector-callback pair
					for (const { selector, callback } of selectors) {
						// Find the closest matching ancestor with the selector
						const targetElement = e.target.closest(selector);

						// Only trigger callback if the closest match is the element itself (not a child)
						if (targetElement && targetElement === e.target) {
							if (!nonBubblingEvents.includes(type)) {
								callback(e);  // Trigger the callback if the event bubbles
							} else {
								// For non-bubbling events, manually check ancestor chain
								let currentElement = e.target;
								while (currentElement && currentElement !== parent) {
									if (currentElement.matches(selector)) {
										callback(e);
										break;
									}
									currentElement = currentElement.parentElement;
								}
							}
							// Stop processing once a match is found and callback is triggered
							break;
						}
					}
				}, true); // Using capture phase to catch events early, for non-bubbling events
			},


			addGlobalEventListenerV1: function (type, selector, callback, parent = document) {
				const nonBubblingEvents = ['focus', 'blur', 'keyup'];

				// Add event listener on the parent (or global) scope
				parent.addEventListener(type, (e) => {
					// Check if the event target matches the selector
					if (e.target.matches(selector)) {
						// Directly call callback if the event bubbles
						if (!nonBubblingEvents.includes(type)) {
							callback(e);
						} else {
							// For non-bubbling events, manually trigger on ancestors
							let currentElement = e.CurrentTarget;
							while (currentElement && currentElement !== parent) {
								if (currentElement.matches(selector)) {
									callback(e);
								}
								currentElement = currentElement.parentElement;
							}
						}
					}
				}, true); // Using capture phase to catch events early, for non-bubbling events
			},
			initializeScrollSnap: (scrollContainer, snapRange = 90, sensitivity = 0.1) => {
				// Variables to track scroll velocity
				let lastScrollLeft = 0;
				let lastTimestamp = 0;

				scrollContainer.addEventListener('scroll', (event) => {
					if (!this.SnapScroll) return; // Exit if snapping is temporarily disabled

					const snapPosition = document.querySelector('#app_menu').clientWidth;
					const scrollLeft = scrollContainer.scrollLeft;
					const currentTime = Date.now();

					// Calculate scroll velocity
					const deltaTime = currentTime - lastTimestamp;
					const deltaScroll = Math.abs(scrollLeft - lastScrollLeft);
					const velocity = deltaScroll / deltaTime; // pixels per ms

					// Update last scroll position and time
					lastScrollLeft = scrollLeft;
					lastTimestamp = currentTime;

					// Only snap if within the snap range and velocity is below sensitivity threshold
					if (
						scrollLeft >= snapPosition - snapRange &&
						scrollLeft <= snapPosition + snapRange &&
						velocity < sensitivity
					) {
						scrollContainer.scrollTo({ left: snapPosition, behavior: 'smooth' });
					}
				});
			},
			InitializeFormControls: () => {
				this.SnapScroll = true; // Flag to enable/disable snapping
				const scrollContainer = document.querySelector('#app_root_container');
				const snapRange = 90;
				const sensitivity = 0.1;

				// Initialize the scroll snap functionality
				this.Form.Events.initializeScrollSnap(scrollContainer, snapRange, sensitivity);

				document.querySelector('#app_menu_button').addEventListener('click', () => {
					document.querySelector('#app_menu').classList.toggle('open');
				});

				document.querySelector('#app_graph_button').addEventListener('click', () => {
					document.querySelector('#app_configurator_container').classList.toggle('show');
					document.querySelector('#app_graph_tabs_container').classList.toggle('show');

				});

				document.querySelector('#app_data_preparation_area_button').addEventListener('click', () => {
					document.querySelector('#app_data_preparation_area').classList.toggle('show');
					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 500);
				});

				// NOTE - ADD NODE BUTTON
				document.querySelector('#graph_addnode_button').addEventListener('click', () => {
					console.log('add Node clicked');
					if (!document.querySelector('#app_data_preparation_area').classList.contains('show')) document.querySelector('#app_data_preparation_area').classList.add('show');
					
					let num = Date.now();
					let container_id = `container_node_${Date.now()}`;
					let str = ` <div class="box m-3">
									<div class="field has-addons">
										<p class="control">
											<span class="tag is-large is-info">NODE</span>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-up">&nbsp;</li>
											</span>
											</button>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-down">&nbsp;</li>
											</span>
											</button>
										</p>
									</div>
									<hr>

									
									<div class="columns is-gapless is-mobile data_preparation_area_container ${container_id}">
										${this.Form.Initialize.FormCard('New_NODE___' + num, this.Forms[0], 0, 1, 100, container_id)}
									</div>
								</div>`;

					document.querySelector('#app_data_preparation_area').innerHTML += str;
					
					// Calculate WIDTH
					let maxcount = 0;
					let childContainers = document.querySelectorAll('.data_preparation_area_container ');
					console.log('childContainers', childContainers);
					childContainers.forEach((container) => {
						if (maxcount < container.childElementCount) maxcount = container.childElementCount;
					});

					// Set the new width
					document.querySelector('#app_data_preparation_area.show').style.flexBasis = maxcount * (22+2) + 'rem';

					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 500);
					setTimeout(() => {
						document.querySelector('#app_data_preparation_area').scrollTo({
							left: document.querySelector('#app_data_preparation_area').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
				});

				// NOTE - ADD LAYOUT BUTTON
				document.querySelector('#graph_addlayout_button').addEventListener('click', () => {
					console.log('add Layout clicked');
					if (!document.querySelector('#app_data_preparation_area').classList.contains('show')) document.querySelector('#app_data_preparation_area').classList.add('show');

					let num = Date.now();
					let container_id = `container_layout_${Date.now()}`;
					let str = ` <div class="box m-3">
									<div class="field has-addons">
										<p class="control">
											<span class="tag is-large is-primary">LAYOUT</span>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-up">&nbsp;</li>
											</span>
											</button>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-down">&nbsp;</li>
											</span>
											</button>
										</p>
									</div>
									<hr>
									<div class="columns is-gapless is-mobile data_preparation_area_container ${container_id}">
										${this.Form.Initialize.FormCard('New_LAYOUT___' + num, this.Forms[0], 0, 1, 100, container_id)}
									</div>
								</div>`;

					document.querySelector('#app_data_preparation_area').innerHTML += str;

					// Calculate WIDTH
					let maxcount = 0;
					let childContainers = document.querySelectorAll('.data_preparation_area_container ');
					childContainers.forEach((container) => {
						if (maxcount < container.childElementCount) maxcount = container.childElementCount;
					});

					// Set the new width
					document.querySelector('#app_data_preparation_area.show').style.flexBasis = maxcount * (22+2) + 'rem';

					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 500);
					setTimeout(() => {
						document.querySelector('#app_data_preparation_area').scrollTo({
							left: document.querySelector('#app_data_preparation_area').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
				});

				// NOTE - ADD SCHEMA BUTTON
				document.querySelector('#graph_addschema_button').addEventListener('click', () => {
					console.log('add Schema clicked');
					if (!document.querySelector('#app_data_preparation_area').classList.contains('show')) document.querySelector('#app_data_preparation_area').classList.add('show');

					let num = Date.now();
					let container_id = `container_schema_${Date.now()}`;
					let str = ` <div class="box m-3">
									<div class="field has-addons">
										<p class="control">
											<span class="tag is-large is-warning">SCHEMA</span>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-up">&nbsp;</li>
											</span>
											</button>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-down">&nbsp;</li>
											</span>
											</button>
										</p>
									</div>
									<hr>
									<div class="columns is-gapless is-mobile data_preparation_area_container ${container_id}">
										${this.Form.Initialize.FormCard('New_SCHEMA___' + num, this.Forms[0], 0, 1, 100, container_id)}
									</div>
								</div>`;

					document.querySelector('#app_data_preparation_area').innerHTML += str;

					// Calculate WIDTH
					let maxcount = 0;
					let childContainers = document.querySelectorAll('.data_preparation_area_container ');
					childContainers.forEach((container) => {
						if (maxcount < container.childElementCount) maxcount = container.childElementCount;
					});

					// Set the new width
					document.querySelector('#app_data_preparation_area.show').style.flexBasis = maxcount * (22+2) + 'rem';

					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 500);
					setTimeout(() => {
						document.querySelector('#app_data_preparation_area').scrollTo({
							left: document.querySelector('#app_data_preparation_area').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					
				});

				// NOTE - ADD FORM BUTTON
				document.querySelector('#graph_addform_button').addEventListener('click', () => {
					console.log('add Form clicked');
					if (!document.querySelector('#app_data_preparation_area').classList.contains('show')) document.querySelector('#app_data_preparation_area').classList.add('show');

					let num = Date.now();
					let container_id = `container_node_${Date.now()}`;
					let str = ` <div class="box m-3">
									<div class="field has-addons">
										<p class="control">
											<span class="tag is-large is-link">FORM</span>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-up">&nbsp;</li>
											</span>
											</button>
										</p>
										<p class="control">
											<button class="button">
											<span class="icon">
												<li class="fa-solid fa-angle-down">&nbsp;</li>
											</span>
											</button>
										</p>
									</div>
									<hr>
									<div class="columns is-gapless is-mobile data_preparation_area_container ${container_id}">
										${this.Form.Initialize.FormCard('New_FORM___' + num, this.Forms[0], 0, 1, 100, container_id)}
									</div>
								</div>`;

					document.querySelector('#app_data_preparation_area').innerHTML += str;

					// Calculate WIDTH					
					let maxcount = 0;
					let childContainers = document.querySelectorAll('.data_preparation_area_container ');
					childContainers.forEach((container) => {
						if (maxcount < container.childElementCount) maxcount = container.childElementCount;
					});

					// Set the new width
					document.querySelector('#app_data_preparation_area.show').style.flexBasis = maxcount * (22+2) + 'rem';

					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 500);
					setTimeout(() => {
						document.querySelector('#app_data_preparation_area').scrollTo({
							left: document.querySelector('#app_data_preparation_area').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
				});
				//NOTE - NEW VERSION
				this.Form.Events.addGlobalEventListener('click', [
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
								ParadigmREVOLUTION.Utility.DataStore.SurrealDB.initSurrealDB(config.name, config.label, config.shortlabel, config.connect, config.instance, window.ParadigmREVOLUTION.SystemCore.Blueprints.Data, window.ParadigmREVOLUTION.SystemCore.Modules, cr)
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
										datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-disabled" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>`;
									} else {
										try {
											// Await the promise for connection status
											if (entry.Instance == false) { 
												datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-disabled" value="${idx}" title="${entry.Metadata.Label} DISABLED">${entry.Metadata.ShortLabel}</button>` ;
											} else if (entry.Instance.connection == undefined) {
												datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-danger" value="${idx}" title="${entry.Metadata.Label} NO CONNECTION">${entry.Metadata.ShortLabel}</button>`;
											} else { 
												const status = await entry.Instance.connection.status;
												// Check connection status
												if (status === "connected") {
													datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-success" value="${idx}" title="${entry.Metadata.Label} CONNECTED">${entry.Metadata.ShortLabel}</button>`;
												} else if (status === "disconnected") {
													datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-warning" value="${idx}" title="${entry.Metadata.Label} DISCONNECTED">${entry.Metadata.ShortLabel}</button>`;
												} else {
													datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-danger" value="${idx}" title="${entry.Metadata.Label} NO CONNECTION">${entry.Metadata.ShortLabel}</button>`;
												}	
											}
										} catch (error) {
											console.error(`Error fetching status for ${idx}:`, error);
											datastore_status += `<button class="datastore-status-indicator button is-outlined is-small p-2 m-0 mr-1 is-danger" value="${idx}" title="${entry.Metadata.Label} ERROR">${entry.Metadata.ShortLabel}</button>`;
										}
									}
								}
								return datastore_status;
							};
							getDatastoreStatus().then(datastore_status => {
								document.querySelector('#datastore_status').innerHTML = datastore_status;
						});
						}
					},
					{
						selector: '.in-tail-button',
						callback: (e) => {
							let num = Date.now();
							//ADD FORM COLUMN HERE
							// console.log(e.target.dataset);
							let form_container = e.target.closest(`.${e.target.dataset.form_container}`);
							// console.log('form_container >>>>', form_container);
							let newCol = this.Form.Initialize.FormCard('form_components___' + num, this.Forms[1], 1, 1, 100);
							// console.log('newCol :>> ', newCol);
							form_container.innerHTML += newCol;

							// Calculate WIDTH
							let maxcount = 0;
							let childContainers = document.querySelectorAll('.data_preparation_area_container ');
							childContainers.forEach((container) => {
								if (maxcount < container.childElementCount) maxcount = container.childElementCount;
								container.parentElement.classList.remove('box');
								container.parentElement.classList.add('box');
							});

							// Set the new width
							document.querySelector('#app_data_preparation_area.show').style.flexBasis = maxcount * (22+1) + 'rem';

							this.SnapScroll = false;
							setTimeout(() => {
								document.querySelector('#app_root_container').scrollTo({
									left: document.querySelector('#app_root_container').scrollWidth,
									behavior: 'smooth'
								});
							}, 300);
							setTimeout(() => {
								this.SnapScroll = true;
							}, 500);
							setTimeout(() => {
								document.querySelector('#app_data_preparation_area').scrollTo({
									left: document.querySelector('#app_data_preparation_area').scrollWidth,
									behavior: 'smooth'
								});
							}, 300);
						}
					},
					{
						selector: '.form-close-button',
						callback: (e) => {
							let formid = e.target.dataset.formid;
							const formElement = document.querySelector(`#${formid}`).parentElement;

							// Step 1: Add collapsing class to trigger CSS transition
							formElement.classList.add('collapsing');

							// Step 2: Use a timeout slightly longer than the CSS transition duration
							setTimeout(() => {
								// Remove the element from DOM after the transition
								console.log('formElement', formElement.parentElement);
								let parentEl = formElement.parentElement;
								formElement.remove(); 
								console.log('parentEl', parentEl, parentEl.childElementCount);
								if (parentEl.childElementCount == 0) {
									parentEl.closest('.box').remove();
								}

								// Check child elements count to handle visibility
								if (document.querySelector('#app_data_preparation_area').childElementCount == 0) {
									document.querySelector('#app_data_preparation_area').classList.remove('show');
								}

								// Calculate WIDTH
								let maxcount = 0;
								let childContainers = document.querySelectorAll('.data_preparation_area_container ');
								childContainers.forEach((container) => {
									if (maxcount < container.childElementCount) maxcount = container.childElementCount;
									container.parentElement.classList.remove('box');
									container.parentElement.classList.add('box');
								});

								// Set the new width
								document.querySelector('#app_data_preparation_area').style.flexBasis = maxcount * (22+2) + 'rem';
							}, 350); // Timeout slightly longer than the CSS transition (0.3s)
						}
					}, {
						selector: '.button .icon .fa-angle-up, .button .icon .fa-angle-down',
						callback: (e) => {
							console.log('CLICK!!');
							// // Find the current .box container
							// const currentBox = e.target.closest('.box');
							// console.log('currentBox :>> ', currentBox);

							// // Determine the direction (up or down)
							// const isUp = e.target.classList.contains('fa-angle-up');
							// console.log('isUp :>> ', isUp);
							// // Find all boxes
							// const allBoxes = Array.from(document.querySelectorAll('.box.m-3'));
							// console.log('allBoxes :>> ', allBoxes);
							// // Get the current index of the active box
							// const currentIndex = allBoxes.indexOf(currentBox);
							// console.log('currentIndex :>> ', currentIndex);
							// // Calculate the target index
							// let targetIndex = isUp ? currentIndex - 1 : currentIndex + 1;
							// console.log('targetIndex :>> ', targetIndex);
							// // Ensure the target index is within bounds
							// if (targetIndex >= 0 && targetIndex < allBoxes.length) {
							// 	console.log('Get the target box');
							// 	// Get the target box
							// 	const targetBox = allBoxes[targetIndex];
							// 	console.log('targetBox :>> ', targetBox);

							// 	// Move focus to the target box
							// 	targetBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
								
							// 	// Optionally add a focus effect (e.g., add a CSS class)
							// 	currentBox.classList.remove('focused');
							// 	targetBox.classList.add('focused');
							// }
						}
					}
				]);
				// Add event listeners to each up and down button
				// document.querySelectorAll('.box .fa-angle-up, .box .fa-angle-down').forEach(button => {
				// 	button.addEventListener('click', (event) => {
				// 		// Find the current .box container
				// 		const currentBox = event.target.closest('.box');
				// 		console.log('currentBox :>> ', currentBox);

				// 		// Determine the direction (up or down)
				// 		const isUp = event.target.classList.contains('fa-angle-up');
				// 		console.log('isUp :>> ', isUp);
				// 		// Find all boxes
				// 		const allBoxes = Array.from(document.querySelectorAll('.box.m-3'));
				// 		console.log('allBoxes :>> ', allBoxes);
				// 		// Get the current index of the active box
				// 		const currentIndex = allBoxes.indexOf(currentBox);
				// 		console.log('currentIndex :>> ', currentIndex);
				// 		// Calculate the target index
				// 		let targetIndex = isUp ? currentIndex - 1 : currentIndex + 1;
				// 		console.log('targetIndex :>> ', targetIndex);
				// 		// Ensure the target index is within bounds
				// 		if (targetIndex >= 0 && targetIndex < allBoxes.length) {
				// 			console.log('Get the target box');
				// 			// Get the target box
				// 			const targetBox = allBoxes[targetIndex];
				// 			console.log('targetBox :>> ', targetBox);

				// 			// Move focus to the target box
				// 			targetBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
							
				// 			// Optionally add a focus effect (e.g., add a CSS class)
				// 			currentBox.classList.remove('focused');
				// 			targetBox.classList.add('focused');
				// 		}
				// 	});
				// });

				// // Optional: Add a CSS class for focused boxes
				// document.querySelectorAll('.box').forEach(box => {
				// 	box.classList.remove('focused');
				// });
				// document.querySelector('.box.m-3').classList.add('focused');
				document.querySelector('#app_console_button').addEventListener('click', () => {
					document.querySelector('#app_console').classList.toggle('show');
				});

				document.querySelectorAll('.tab-graph-selector').forEach((tab, index, tabs) => {
					tab.addEventListener('click', () => {
						// Remove 'is-active' class from all tabs
						tabs.forEach((t) => t.parentElement.classList.remove('is-active'));
				
						// Add 'is-active' to the clicked tab
						tab.parentElement.classList.add('is-active');
				
						// Remove 'show' from all main content containers
						document.querySelectorAll('.app_configurator_containers').forEach((container) => {
							container.classList.remove('show');
							container.style.transform = '';  // Reset transform
						});
				
						// Also remove 'show' from all control containers
						document.querySelectorAll('.app_graph_controls_containers > div').forEach((controlContainer) => {
							controlContainer.classList.remove('show');
						});
				
						// Determine the selected main container and control container based on tab type
						const selectedContainerId = {
							'Graph': '#app_graph_container',
							'PageLayout': '#app_page_layout_container',
							'Forms': '#app_form_container',
							'Schema': '#app_schema_container'
						}[tab.dataset.tabtype];
				
						const selectedContainer = document.querySelector(selectedContainerId);
				
						// Slide out all other containers to the left or right except the selected one
						document.querySelectorAll('.app_configurator_containers').forEach((container, containerIndex) => {
							if (container !== selectedContainer) {
								container.style.transform = containerIndex < index ? 'translateX(-100%)' : 'translateX(100%)';
							}
						});
				
						// Show and slide in the selected main container
						selectedContainer.classList.add('show');
						selectedContainer.style.transform = 'translateX(0)';
				
						// Show the appropriate control container based on the selected tab
						switch (tab.dataset.tabtype) {
							case 'Graph':
								document.querySelector('.graph-control-container').classList.add('show');
								break;
							case 'PageLayout':
								document.querySelector('.layout-control-container').classList.add('show');
								break;
							case 'Forms':
								document.querySelector('.form-control-container').classList.add('show');
								break;
							case 'Schema':
								document.querySelector('.schema-control-container').classList.add('show');
								break;
						}
					});
				});
				document.querySelector('#dark_light_selector').addEventListener('click', (e) => {
					let root = document.documentElement;
					let isCurrentThemeDark = this.Utility.DOMElements.detectLightDarkMode();
					root.dataset.count = root.dataset.count ? parseInt(root.dataset.count) : 0;
					console.log(root.dataset.count);
					console.log('e.currentTarget :>> ', e.currentTarget);					
					if (root.dataset.count < 2) {
						console.log('masuk < 2');
						if (root.dataset.theme == 'light') {
							console.log('masuk dark');
							root.dataset.theme = 'dark'
							console.log('e.currentTarget.childNodes[0].classList:>', e.currentTarget.childNodes[0].classList);
							if (e.currentTarget.childNodes[0].classList.contains('fa-sun')) {
								e.currentTarget.childNodes[0].classList.remove('fa-sun');
							}
							e.currentTarget.childNodes[0].classList.add('fa-moon');
						} else if (root.dataset.theme == 'dark') {
							console.log('masuk light');
							root.dataset.theme = 'light';
							console.log('e.currentTarget', e.currentTarget.childNodes);
							console.log('e.currentTarget.childNodes[0].classList:>', e.currentTarget.childNodes[0].classList);
							if (e.currentTarget.childNodes[0].classList.contains('fa-moon')) {
								e.currentTarget.childNodes[0].classList.remove('fa-moon');
							}
							e.currentTarget.childNodes[0].classList.add('fa-sun');
						} else {
							console.log('masuk default');
							console.log('isCurrentThemeDark', isCurrentThemeDark);
							root.dataset.theme = isCurrentThemeDark.matches ? 'dark' : 'light';
							if (isCurrentThemeDark.matches) {
								if (e.currentTarget.childNodes[0].classList.contains('fa-sun')) {
									e.currentTarget.childNodes[0].classList.remove('fa-sun');
								}
								e.currentTarget.childNodes[0].classList.add('fa-moon');
							} else {
								if (e.currentTarget.childNodes[0].classList.contains('fa-moon')) {
									e.currentTarget.childNodes[0].classList.remove('fa-moon');
								}
								e.currentTarget.childNodes[0].classList.add('fa-sun');	
							}
						}
						e.currentTarget.childNodes[0].style.color = '';
						root.dataset.count++;
					} else {
						console.log('masuk reset');
						root.dataset.theme = '';
						e.currentTarget.childNodes[0].style.color = 'red';
						root.dataset.count = 0;
						if (isCurrentThemeDark.matches) {
							if (e.currentTarget.childNodes[0].classList.contains('fa-sun')) {
								e.currentTarget.childNodes[0].classList.remove('fa-sun');
							}
							e.currentTarget.childNodes[0].classList.add('fa-moon');
						} else {
							if (e.currentTarget.childNodes[0].classList.contains('fa-moon')) {
								e.currentTarget.childNodes[0].classList.remove('fa-moon');
							}
							e.currentTarget.childNodes[0].classList.add('fa-sun');	
						}
					}
				});

				document.querySelector('#app_content').innerHTML = `
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium ut suscipit qui quam laboriosam magnam dolor odit minima corrupti veritatis iste impedit obcaecati, dicta provident doloremque amet facere laborum?<br><br>
				`;
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
				console.log('Elements with vertical scrollbars:', scrollableElements.vertical);
				console.log('Elements with horizontal scrollbars:', scrollableElements.horizontal);
				console.log('Elements with both scrollbars:', scrollableElements.both);
			},
			GenerateFormToParadigmJSON: (function ($id, $schema, $util, is_horizontal = false, form_container = "") {
				// console.log('generateFormToParadigmJSON', form_container);
				function makeFieldParadigmJSON($id, field, utilily, form_container) {
					// console.log('makeFieldParadigmJSON', form_container);
					const { id, type, label = '', form, readonly = false, value = '', class: d_class = '', head, tail } = field;
					let inputField = {};
					switch (type) {
						case 'action':
							inputField = { comment: "Button", tag: "button", id: `${$id}___${id}`, name: id, class: `button form-action-button ${d_class} `, value: value, readonly: readonly, type: 'button', innerHTML: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')) };
							break;
						case 'button':
							inputField = { comment: "Button", tag: "button", id: `${$id}___${id}`, name: id, class: `button paradigm-form-element in-form-button is-fullwidth ${d_class} `, value: value, readonly: readonly, type: 'button', innerHTML: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')) };
							break;
						case 'separator':
							inputField = { comment: "HR", tag: "hr" };
							break;
						case 'checkbox':
							inputField = {
								comment: "label", tag: "label", class: "checkbox", content: [
									{
										comment: "Checkbox", tag: "input", id: `${$id}___${id}`, name: id, class: `paradigm-form-element ${d_class}`, value: value, readonly: readonly, type: 'checkbox', content: [
											{tag:"label", class:"m-1" } //innerHTML: label || utilily.Strings.UCwords(id.replace(/\_/g, ' '))
									] }
								]
							};
							break;
						case 'number':
							inputField = { comment: "Number inputbox", tag: "input", id: `${$id}___${id}`, name: id, class: ` paradigm-form-element ${d_class} `, value: value, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')) };
							break;
						case 'textarea':
							inputField = { comment: "Textarea box", tag: "textarea", id: `${$id}___${id}`, name: id, class: `textarea paradigm-form-element ${d_class} `, value: value, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')) };
							break;
						case 'select':
							inputField = {
								comment: "Select container", tag: "div", class: "select is-link is-fullwidth ", content: [
									{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, class: `select_input paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
								]
							};
							break;
						case 'text_select':
							inputField = { comment: "Searchable textbox", tag: "input", id: `${$id}___${id}`, autocomplete:"off", name: id, class: `input paradigm-form-element text_select is-link ${d_class} `, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')), data: { selectValues: value } };
							break;
						default:
							inputField = { comment: "Textbox", tag: "input", id: `${$id}___${id}`, autocomplete:"off", name: id, class: `input text_input paradigm-form-element is-info ${d_class} `, value: value, readonly: readonly, type: 'text', label: label || utilily.Strings.UCwords(id.replace(/\_/g, ' ')), data: { selectValues: value }};
							break;
					}
					// Handle $head and $tail cases
					if (!head && !tail) {
					
						return { comment: "Container inputbox", tag: "div", class:`control ${field.type == 'action' ? '' : 'is-expanded'}   ${type == 'boolean' ? 'mt-2' : ''}`, content: [inputField] };
					}

					if (head && !tail) {
						switch (head.type) {
							case 'button':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{ comment: "Label button", tag: "button", class: "button in-head-button is-primary head-paradigm-form-element", innerHTML: Array.isArray(head.value) ? head.value[0] : head.value },
									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
							case 'label':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(head.value) ? head.value.join(', ') : head.value },

									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
							case 'input':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{ comment: "Head input", tag: "input", type: "text", class: "input head_input head-paradigm-form-element", placeholder: head.value, readonly: readonly }
									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
							case 'select':
								return [{
									comment: "Container form", tag: "p", class: "control ", content: [
										{
											comment: "Container form", tag: "div", class: "select", content: [
												{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${head.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input head-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(head.value) ? head.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
											]
										}
									]
								}, { comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] }];
								break;
						}
					}
					if (!head && tail) {
						switch (tail.type) {
							case 'button':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
									comment: "Container form", tag: "p", class: "control ", content: [
											{ comment: "Label button", tag: "button", class: "button tail-paradigm-form-element in-tail-button is-link", data: {form_container: form_container}, innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value },
									]
								}];
								break
							case 'label':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
										comment: "Container form", tag: "p", class: "control ", content: [
											{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value }
										]
									}
								];
								break;
							case 'input':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
										comment: "Container form", tag: "p", class: "control ", content: [
											{ comment: "Tail input", tag: "input", type: "text", class: "input tail-paradigm-form-element tail_input", placeholder: Array.isArray(tail.value) ? tail.value[0] : tail.value, readonly: readonly }
										]
									}];
								break;
								break;
							case 'select':
								return [
									{ comment: "Container form", tag: "p", class: "control is-expanded ", content: [inputField] },
									{
										comment: "Container form", tag: "p", class: "control ", content: [
											{
												comment: "Container form", tag: "div", class: "select", content: [
													{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${tail.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input tail-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(tail.value) ? tail.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
												]
											}
										]
									}];
								break;
						}
					}
					if (head && tail) {
						let tObj = [];
						switch (head.type) {
							case 'button':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Label button", tag: "button", class: "button in-head-button is-primary head-paradigm-form-element ", innerHTML: Array.isArray(head.value) ? head.value[0] : head.value },
									]
								});
								break;
							case 'label':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(head.value) ? head.value.join(', ') : head.value },
									]
								});
								break;
							case 'input':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Head input", tag: "input", type: "text", class: "input head_input head-paradigm-form-element ", placeholder: head.value, readonly: readonly }
									]
								});
								break;
							case 'select':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{
											comment: "Container form", tag: "div", class: "select", content: [
												{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${head.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input head-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(head.value) ? head.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
											]
										}
									]
								})
								break;
						}
						tObj.push({comment: "Container form", tag: "p", class: "control is-expanded", content: [inputField]});
						switch (tail.type) {
							case 'button':
								tObj.push(
									{
										comment: "Container form", tag: "p", class: "control", content: [
											{ comment: "Label button", tag: "button", class: "button in-tail-button is-link tail-paradigm-form-element ", data: {form_container: form_container}, innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value },
										]
									});
								break;
							case 'label':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Label", tag: "a", class: "button is-static", innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value }
									]
								});
								break;
							case 'input':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{ comment: "Tail input", tag: "input", type: "text", class: "input tail_input tail-paradigm-form-element ", placeholder: Array.isArray(tail.value) ? tail.value[0] : tail.value, readonly: readonly }
									]
								});
								break;
							case 'select':
								tObj.push({
									comment: "Container form", tag: "p", class: "control", content: [
										{
											comment: "Container form", tag: "div", class: "select", content: [
												{ comment: "Select", tag: "select", id: `${$id}___${id}`, name: id, style: `${tail.width == 'short' ? 'width: 2rem;' : 'auto'}`, class: `select_input tail-paradigm-form-element ${d_class}`, innerHTML: `${Array.isArray(tail.value) ? tail.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}` }
											]
										}
									]
								});
								break;
						}
						return tObj;
					}
				}
				let Obj = { comment: "Paradigm Form", tag: "div", class: "paradigm-form", style: "", content: [] };
				let tObj = {};
				let tfield = {};
				let Util = $util;
				$schema.forEach((field, index) => {
					const { id, label = '', form } = field;
					if (form === 1) {
						if (label || field.type !== 'separator') {
							tfield = {comment: "Field", tag: "div", class: `field ${is_horizontal ? 'is-horizontal' : ''}`, style: "", innerHTML: "", content: []};

							let tlabel = field.label || (field.type === 'action' ? '' : label || Util.Strings.UCwords(id.replace(/_/g, ' ')));
							if (is_horizontal) {
								tObj = {
									comment: "Field label", tag: "div", class: `field-label is-normal `, style: "", innerHTML: "", content: [
										{ comment: "Label", tag: "label", class: "label", id: `id_label___${$id}___${id}`, style: "", innerHTML: `${tlabel}`, content: [] }
									]
								};
							} else {
								tObj = { comment: "Label", tag: "label", class: "label", id: `id_label___${$id}___${id}`, style: "", innerHTML: `${tlabel}`, content: [] };
							}
							tfield.content.push(tObj);
						}
						let temp = makeFieldParadigmJSON($id, field, $util, form_container);
						if (Array.isArray(temp)) {
							temp = [...temp];
						} else {
							temp = [temp];
						}
						tObj = {
							comment: "Field body", tag: "div", class: `field-body`, style: "", innerHTML: "", content: [
								{ comment: "Field", tag: "div", class: `field has-addons has-addons-centered `, style: "", innerHTML: "", content: temp }
						] };
						tfield.content.push(tObj);
						Obj.content.push(tfield);
					}
				});
				// Obj.content.push(tObj);
			
				return Obj;
			}).bind(this),
			GenerateFormToHTML: (function ($id, $schema, $util, is_horizontal = 0) {
				function makeField($id, field, utilily) {
					const { id, type, label = '', form, readonly = false, value = '', class: d_class = '', head, tail } = field;
					let inputField = '';
					switch (type) {
						case 'button':
							inputField = `<button id="${$id}___${id}" name="${id}" class="button in-form-button ${d_class} " value="${value}" ${readonly ? 'disabled' : ''} autocomplete="off">${label || utilily.Strings.UCwords(id.replace(/\_/g, ' '))}</button>`;
							break;
						case 'separator':
							inputField = `<hr />`;
							break;
						case 'boolean':
							inputField = `
							<label class="checkbox">
								<input type="checkbox" id="${$id}___${id}" name="${id}" class="${d_class}" ${value ? 'checked' : ''} ${readonly ? 'disabled' : ''} autocomplete="off"/>
								${utilily.Strings.UCwords(id.replace(/\_/g, ' '))}
							</label>`;
							break;
						case 'number':
							inputField = `<input type="text" id="${$id}___${id}" name="${id}" class="input number_input is-success ${d_class}" value="${value}" ${readonly ? 'readonly' : ''} autocomplete="off"/>`;
							break;
						case 'textarea':

							inputField = `<textarea id="${$id}___${id}" name="${id}" class="textarea ${d_class}" ${readonly ? 'readonly' : ''} autocomplete="off">${value}</textarea>`;
							break;
						case 'select':
							inputField = `<div class="select is-link">
											<select id="${$id}___${id}" name="${id}" class="select_input ${d_class}">
												${Array.isArray(value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</div>`;
							break;
						case 'text_select':
							inputField = `<input type="text" id="${$id}___${id}" name="${id}" class="input text_select is-link ${d_class}" value="" ${readonly ? 'readonly' : ''} autocomplete="off" data-select-values='${JSON.stringify(value)}'/>`;
							break;
						default:
							inputField = `<input type="text" id="${$id}___${id}" name="${id}" class="input text_input is-info ${d_class}" value="${value}" ${readonly ? 'readonly' : ''} autocomplete="off"/>`;
							break;
					}

					// Handle $head and $tail cases
					if (!head && !tail) {
						return `<div class="control">${inputField}</div>`;
					}

					if (head && !tail) {
						switch (head.type) {
							case 'label':
								return `<p class="control"><a class="button is-static">${head.value}</a></p><p class="control">${inputField}</p>`;
								break;
							case 'input':
								return `<p class="control"><input type="text" id="" name="" class="input head_input" value="" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								return `<p class="control">
										<div class="select">
											<select id="" name="" class="select_input head_input ${d_class}">
												${Array.isArray(head.value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</div>
									</p>`;
								break;
						}
					}
					if (!head && tail) {
						switch (tail.type) {
							case 'label':
								return `<p class="control">${inputField}</p><p class="control"><a class="button is-static">${tail.value}</a></p>`;
								break;
							case 'input':
								return `<p class="control"><input type="text" id="" name="" class="input tail_input" value="" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								return `<p class="control">
										<div class="select">
											<select id="" name="" class="select_input tail_input ${d_class}">
												${Array.isArray(tail.value) ? value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</div>
									</p>`;
								break;
						}
					}
					if (head && tail) {
						let zstr = "";
						switch (head.type) {
							case 'label':
								zstr += `<p class="control"><a class="button is-static">${Array.isArray(head.value) ? head.value[0] : head.value}</a></p>`;
								break;
							case 'input':
								zstr += `<p class="control"><input type="text" id="" name="" class="input head_input" value="" placeholder="${Array.isArray(head.value) ? head.value[0] : head.value}" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								zstr += `<p class="control">
										<span class="select">
											<select id="" name="" class="select_input head_input ${d_class}">
												${Array.isArray(head.value) ? head.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</span>
									</p>`;
								break;
						}
						zstr += `<p class="control">${inputField}</p>`;
						switch (tail.type) {
							case 'label':
								zstr += `<p class="control"><a class="button is-static">${Array.isArray(tail.value) ? tail.value[0] : tail.value}</a></p>`;
								break;
							case 'input':
								zstr += `<p class="control"><input type="text" id="" name="" class="input tail_input" value="" placeholder="${Array.isArray(tail.value) ? tail.value[0] : tail.value}" ${readonly ? 'readonly' : ''} autocomplete="off"/></p>`;
								break;
							case 'select':
								zstr += `<p class="control">
										<span class="select">
											<select id="" name="" class="select_input tail_input ${d_class}">
												${Array.isArray(tail.value) ? tail.value.map(option => `<option value="${option}">${option}</option>`).join('') : ''}
											</select>
										</span>
									</p>`;
								break;
						}
						return zstr;
					}
				}
				let str = '<div class="paradigm-form">';

				$schema.forEach((field) => {
					const { id, label = '', form } = field;
					if (form === 1) {
					
						str += `<div class="field ${is_horizontal ? 'is-horizontal' : ''}">`;

						if (label || field.type !== 'separator') {
							let tlabel = field.label || (field.type === 'button' ? '' : label || Util.Strings.UCwords(id.replace(/_/g, ' ')));
							if (is_horizontal) {
								str += `<div class="field-label is-normal is-left">
										<label class="label" id="id_label___${$id}___${id}">
											${tlabel}
										</label>
									</div>`;
							} else {
								str += `<label class="label" id="id_label___${$id}___${id}">
											${tlabel}
										</label>`;
							}
						}

						str += `<div class="field-body">`;
						str += (field.head || field.tail) ? `<div class="field has-addons">` : `<div class="field">`;
						str += makeField($id, field, $util);
						str += `</div></div></div>`;
					}
				});
				str += '</div>';
			
				return str;
			}).bind(this),
			initSearchDropdown: (function (inputElement, source) {
				const parent = inputElement.parentElement;
				const wrapper = document.createElement('div');
				wrapper.classList.add('control', 'has-icons-left');

				const magnifierIcon = document.createElement('span');
				magnifierIcon.classList.add('icon', 'is-left');
				magnifierIcon.innerHTML = '<i class="fas fa-search"></i>';

				// Preserve the input's attributes and move it inside the wrapper
				wrapper.appendChild(inputElement);
				wrapper.appendChild(magnifierIcon);
				parent.innerHTML = '';
				parent.appendChild(wrapper, inputElement); // Insert wrapper in the same position as the original input

				// Set input styling (class, padding) if it's not already there
				inputElement.classList.add('input');
				inputElement.style.paddingLeft = '2.5em'; // Add padding to make room for the icon

				// Step 2: Create the dropdown container
				const dropdownMenu = document.createElement('div');
				dropdownMenu.classList.add('dropdown');
				dropdownMenu.style.cssText = `
					width: 100%;
					position: absolute; /* Make dropdown position absolute */
					top: 100%; /* Position it directly below the input */
					left: 0;
					z-index: 10; /* Ensure it appears on top of other content */
				`;

				// Create dropdown menu structure
				dropdownMenu.innerHTML = `
				<div class="dropdown-menu" style="width: 100%; left: 0; right: 0;">
					<div class="dropdown-content" style="max-height: 300px; overflow-y: auto; width: 100%; "></div>
				</div>
				`;

				const searchResults = dropdownMenu.querySelector('.dropdown-content');
				parent.appendChild(dropdownMenu); // Append the dropdown to the parent of the input


				let activeIndex = -1;  // Track the currently selected result
				let results = [];  // Store the current search results

				inputElement.addEventListener('input', async function () {
					const query = inputElement.value.trim();

					if (query.length > 0) {
						if (typeof source === 'string') {
							results = await fetchResults(query); // If source is an API string, use fetch
						} else if (Array.isArray(source)) {
							results = filterLocalResults(query); // If source is an array, search locally
						}
						displayResults(results);
					} else {
						dropdownMenu.classList.remove('is-active');
						results = [];
						activeIndex = -1;
					}
				});

				// Show all results when the input gains focus
				inputElement.addEventListener('focus', function () {
					if (Array.isArray(source)) {
						// Display all available options
						results = source;
						displayResults(results);
					}
				});
				inputElement.addEventListener('focusout', function () {
					setTimeout(() => {
						dropdownMenu.classList.remove('is-active');
						activeIndex = -1; // Reset the active index
					}, 100);
				});

				// Fetch results from API
				async function fetchResults(query) {
					try {
						const response = await fetch(`${source}?name=${query}`);
						const data = await response.json();
						return data.results || [];
					} catch (error) {
						console.error('Error fetching results:', error);
						return [];
					}
				}

				// Filter results from local array
				function filterLocalResults(query) {
					const lowerCaseQuery = query.toLowerCase();
					return source.filter(item => item.toLowerCase().includes(lowerCaseQuery));
				}

				function displayResults(results) {
					searchResults.innerHTML = '';
					activeIndex = -1; // Reset the active index

					if (results.length === 0) {
						searchResults.innerHTML = '<div class="dropdown-item">No results found</div>';
					} else {
						results.forEach((result, index) => {
							const item = document.createElement('a');
							item.classList.add('dropdown-item');
							item.textContent = typeof result === 'string' ? result : result.name; // Handle both string and object results
							item.addEventListener('click', () => selectResult(index));
							searchResults.appendChild(item);
						});
					}
					dropdownMenu.classList.add('is-active');
				}

				function selectResult(index) {
					if (results[index]) {
						const selectedValue = typeof results[index] === 'string' ? results[index] : results[index].name;
						inputElement.value = selectedValue; // Populate the input with selected result
						dropdownMenu.classList.remove('is-active');
						activeIndex = -1; // Reset the active index
					}
				}

				inputElement.addEventListener('keydown', function (e) {
					const items = searchResults.getElementsByClassName('dropdown-item');
					if (e.key === 'ArrowDown') {
						e.preventDefault();
						if (activeIndex < items.length - 1) {
							activeIndex++;
							updateActiveItem(items);
						}
					} else if (e.key === 'ArrowUp') {
						e.preventDefault();
						if (activeIndex > 0) {
							activeIndex--;
							updateActiveItem(items);
						}
					} else if (e.key === 'Enter') {
						e.preventDefault();
						if (activeIndex >= 0) {
							selectResult(activeIndex);
						}
					}
				});

				function updateActiveItem(items) {
					// Remove 'is-selected' class from all items
					for (let i = 0; i < items.length; i++) {
						items[i].classList.remove('is-selected');
					}

					// Add 'is-selected' class to the active item
					if (items[activeIndex]) {
						items[activeIndex].classList.add('is-selected');
					}
				}
			}),
		},
		Initialize: {
			FormCard: (id, form, is_horizontal, isHTML = false, order = 0, form_container) => {
				let testcard = this.Form.Components.BulmaCSS.Components.Card({
					id: id,
					order: order,
					style: "width:100%;",
					headerIcon: form.icon,
					header: form.label,
					content: [this.Form.Events.GenerateFormToParadigmJSON(id, form.Dataset.Schema, this.Utility, is_horizontal, form_container)]
				});
				let column = { comment: "Column", tag: "div", class: `column is-flex collapsible`, style: "max-width:22rem;min-width:22rem;", order: 0, content: [testcard] }
				return isHTML ? this.Form.Render.traverseDOMProxyOBJ(column) : column;
			},
		},
		Render: {
			traverseDOMProxyOBJ: ((element, callback, cr=0) => {
				let html = `<${element.tag}`;
				if (element.class) html += ` class="${element.class}"`;
				if (element.id) html += ` id="${element.id}"`;
				if (element.style) html += ` style="${element.style}"`;
				if (element.href) html += ` href="${element.href}"`;
				if (element.type) html += ` type="${element.type}"`;
				if (element.value) html += ` value="${element.value}"`;
				if (element.title) html += ` title="${element.title}"`;
				if (element.readonly) html += ` readonly="${element.readonly}"`;
				if (element.placeholder) html += ` placeholder="${element.placeholder}"`;
				if (element.checked) html += ` checked`;
				if (element.autocomplete) html += ` autocomplete="${element.autocomplete}"`;

				if (element.data) {
					for (let [key, value] of Object.entries(element.data)) {
						html += ` data-${key}="${value}"`;
					}
				}
				if (element.aria) {
					for (let [key, value] of Object.entries(element.aria)) {
						html += ` aria-${key}="${value}"`;
					}
				}

				html += ">";
				if (element.innerHTML) html += element.innerHTML;
				if (element.content && Array.isArray(element.content)) {
					for (let child of element.content) {
					
						html += this.Form.Render.traverseDOMProxyOBJ(child); // Recursively generate HTML for child elements
					}
				}

				html += `</${element.tag}>`;

				if (callback) callback();
				return html;
			}),
		},
		Run: {
			setRunMode: (mode) => {
				if (this.run_mode.includes(mode)) {
					this.run_mode_selected = mode;
					if (mode === "stop") {
						this.cursor = null; // Reset to the start of the chain
					}
				} else {
					console.error(`Invalid run mode: ${mode}`);
				}
			},

			// Resolve input, handling dynamic references
			resolveInput: (input, chain) => {
				let resolvedInput = {};
				for (let key in input) {
					let value = input[key];

					if (Array.isArray(value)) {
						// Resolve each element in arrays
						resolvedInput[key] = value.map(item => {
							if (typeof item === "string" && item.includes(".output")) {
								let processId = item.split(".")[0];
								let processItem = chain.find(item => item.id === processId);
								return processItem ? processItem.output : null;
							}
							return item;
						});
					} else if (typeof value === "string" && value.includes(".output")) {
						let processId = value.split(".")[0];
						let processItem = chain.find(item => item.id === processId);
						resolvedInput[key] = processItem ? processItem.output : null;
					} else {
						resolvedInput[key] = value;
					}
				}
				return resolvedInput;
			},

			// Execute the chain with respect to the current run mode
			executeChain: () => {
				if (this.run_mode_selected === "stop") {
					8
					this.cursor = this.chain.find(item => item.id === "P1"); // Reset cursor
					return;
				}

				// Initialize cursor to the first item if not set
				if (!this.cursor) {
					this.cursor = this.chain.find(item => item.id === "P1");
				}

				// Loop to execute processes until end of chain or as per run mode
				while (this.cursor) {
					const resolvedInput = this.Form.Run.resolveInput(this.cursor.input, this.chain);
					const processFunc = this.processFunctions[this.cursor.process];

					// Execute if the function exists
					if (processFunc) {
						const output = processFunc(...Object.values(resolvedInput));
						this.cursor.output = output;

						// Debug mode output for step-by-step tracing
						if (this.run_mode_selected === "debug") {
						} else {
						}
					} else {
						console.error(`Process function ${this.cursor.process} not found`);
						break;
					}

					// Step mode stops after each process
					if (this.run_mode_selected === "step" || this.run_mode_selected === "debug") {
						this.cursor = this.cursor.next_process ?
							this.chain.find(item => item.id === this.cursor.next_process) : null;
						break; // Stop after one step in step mode
					}

					// Move to the next process for run/debug modes
					if (this.cursor.next_process) {
						this.cursor = this.chain.find(item => item.id === this.cursor.next_process);
					} else {
						this.cursor = null; // End of chain
					}
				}
			}
		},
	};
	Datastore = {}; //Data storage where the Flow can store it's data.
	Datasource = {}; // Data source to be used by the Form, to fill the Form.
	Sequence = {

	};
	Decision = {
		if: {
			input_pin1: null,
			input_pin2: null,
			operator: null,
			output_pin1: null,
			output_pin2: null,
			operator_template: OperatorTemplate,
			do_if: function () {
				switch (operator) {
					case '<':

						break;
					case '<=':

						break;
					case '==':

						break;
					case '===':

						break;
					case '>':

						break;
					case '>=':

						break;

					case 'is':

						break;

					default:
						break;
				}
			}
		},
		switch: function (input_pin1, operator) {

		}
	};
	Repetition = {

	};
};