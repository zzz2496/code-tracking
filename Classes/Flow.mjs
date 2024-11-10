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
		this.FormOBJ = null;
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
			console.log('match regex224');
			input = new Date(zinput);
		} else if (datetimeRegex422.test(zinput)) {
			console.log('match regex422');
			input = new Date(zinput);
		}
		let varType = this.checkType(input);
		console.log('input', input);
		console.log('varType', varType);
		// const datetimeRegex = /^\d{1,2,4}\/\d{1,2}\/\d{1,2,4}(\s\d{1,2}:\d{2}:\d{2})?$/;

		switch (varType) {
			case 'DateTime':
				console.log('masuk datetime');
				return this.Time.SafeDateTime(input);
				break;
			case 'Number':
				console.log('masuk number');
				return this.Numbers.SafeNumber(input);
				break;
			case 'Boolean':
				console.log('masuk boolean');
				return this.Booleans.SafeBoolean(input, true);
				break;
			case 'String':
				console.log('masuk string');
				return this.Strings.SafeString(input);
				break;
			case 'Array':
				console.log('masuk array');
				return this.Array.IsArrayOK(input);
				break;
			case 'Function':
				console.log('masuk function');
				return input;
				break;
			case 'DOM Element':
				console.log('masuk dom element');
				return input;
				break;
			case 'Object':
				console.log('masuk object');
				return input;
				break;
			case 'null':
				console.log('masuk null');
				return null;
				break;
			default:
				console.log('masuk default undefined');
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
									aria: { label: "more options" },
									content: [
										{
											tag: "span",
											class: "icon",
											innerHTML: `<i class="fa-solid fa-xmark"></i>`
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
			addGlobalEventListener: function (type, selectors, parent = document) {
				const nonBubblingEvents = ['focus', 'blur', 'keyup'];
			
				// Add event listener on the parent (or global) scope
				parent.addEventListener(type, (e) => {
					console.log('addGlobalEventListener :>> ', type, e.target);
			
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
					console.log('addGlobalEventListener :>> ', type, selector, e.target);
					// Check if the event target matches the selector
					if (e.target.matches(selector)) {
						// Directly call callback if the event bubbles
						if (!nonBubblingEvents.includes(type)) {
							callback(e);
						} else {
							// For non-bubbling events, manually trigger on ancestors
							let currentElement = e.target;
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
					document.querySelector('#app_graph_container').classList.toggle('show');
					document.querySelector('#app_graph_controls').classList.toggle('show');

				});

				document.querySelector('#app_helper_button').addEventListener('click', () => {
					document.querySelector('#app_helper').classList.toggle('show');
					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 1000);
				});
				document.querySelector('#graph_addnode_button').addEventListener('click', () => {
					document.querySelector('#app_helper').classList.toggle('show');
					this.SnapScroll = false;
					setTimeout(() => {
						document.querySelector('#app_root_container').scrollTo({
							left: document.querySelector('#app_root_container').scrollWidth,
							behavior: 'smooth'
						});
					}, 300);
					setTimeout(() => {
						this.SnapScroll = true;
					}, 1000);
					let num = 1;
					document.querySelector('#app_helper.show').style.flexBasis = '22rem';
					document.querySelector('#app_helper').innerHTML = this.Form.Initialize.FormInput('form_component_types' + num, 'FormComponentsTypes');
					this.Form.Events.addGlobalEventListenerV1('click', '.in-tail-button', ((e) => {
						console.log('RUNNING in-tail-button :>> ');
						num++;
						document.querySelector('#app_helper').innerHTML += this.Form.Initialize.FormInput('form_components' + num, 'FormComponents', 1);
						// document.querySelector('#app_helper').style.width = (num * 22) + 'rem';

						// Calculate the new width
						const currentWidth = parseFloat(getComputedStyle(document.querySelector('#app_helper')).width); // Get width in px
						console.log('currentWidth :>> ', currentWidth);
						const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize); // 1 rem in px
						console.log('remToPx :>> ', remToPx);
						const newWidth = (currentWidth / remToPx + 22) + 'rem'; // Convert width to rem and add 22
						console.log('newWidth :>> ', newWidth);

						// Set the new width
						document.querySelector('#app_helper.show').style.flexBasis = newWidth;

						this.SnapScroll = false;
						setTimeout(() => {
							document.querySelector('#app_root_container').scrollTo({
								left: document.querySelector('#app_root_container').scrollWidth,
								behavior: 'smooth'
							});
						}, 300);
						setTimeout(() => {
							this.SnapScroll = true;
						}, 1000);
						setTimeout(() => {
							document.querySelector('#app_helper').scrollTo({
								left: document.querySelector('#app_helper').scrollWidth,
								behavior: 'smooth'
							});
						}, 300);
					}), document.querySelector('#app_helper'));
					this.Form.Events.addGlobalEventListener('click', [
						{ 
							selector: '.in-tail-button', 
							callback: (e) => {
								console.log('RUNNING in-tail-button :>> ');
								num++;
								document.querySelector('#app_helper').innerHTML += this.Form.Initialize.FormInput('form_components' + num, 'FormComponents', 1);
								// document.querySelector('#app_helper').style.width = (num * 22) + 'rem';
		
								// Calculate the new width
								const currentWidth = parseFloat(getComputedStyle(document.querySelector('#app_helper')).width); // Get width in px
								console.log('currentWidth :>> ', currentWidth);
								const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize); // 1 rem in px
								console.log('remToPx :>> ', remToPx);
								const newWidth = (currentWidth / remToPx + 22) + 'rem'; // Convert width to rem and add 22
								console.log('newWidth :>> ', newWidth);
		
								// Set the new width
								document.querySelector('#app_helper.show').style.flexBasis = newWidth;
		
								this.SnapScroll = false;
								setTimeout(() => {
									document.querySelector('#app_root_container').scrollTo({
										left: document.querySelector('#app_root_container').scrollWidth,
										behavior: 'smooth'
									});
								}, 300);
								setTimeout(() => {
									this.SnapScroll = true;
								}, 1000);
								setTimeout(() => {
									document.querySelector('#app_helper').scrollTo({
										left: document.querySelector('#app_helper').scrollWidth,
										behavior: 'smooth'
									});
								}, 300);
							} 
						},
						{ 
							selector: '.form-close-button', 
							callback: (e) => {
								console.log('CLOSE button clicked :>> ');
								console.log(e.target);
								let formid = e.target.dataset.formid;
								console.log('formid :>> ', formid);
								console.log(document.querySelector(`#${formid}`));
								setTimeout(() => {
									console.log('document.querySelector(#app_helper).childElementCount :>> ', document.querySelector('#app_helper').childElementCount);
									if (document.querySelector('#app_helper').childElementCount === 1){
										document.querySelector('#app_helper').classList.remove('show');
										num = document.querySelector('#app_helper').childElementCount;
									}
									document.querySelector(`#${formid}`).parentElement.remove();
									
								}, 300);
						} 
						}
					]);
					


					// this.Form.Events.addGlobalEventListener('click', 'button.form-close-button', ((e) => {
					// 	console.log(e.target);
					// 	let formid = e.target.dataset.formid;
					// 	console.log('formid :>> ', formid);
					// 	console.log(document.querySelector(`#${formid}`));
					// 	setTimeout(() => {
					// 		console.log('document.querySelector(#app_helper).childElementCount :>> ', document.querySelector('#app_helper').childElementCount);
					// 		if (document.querySelector('#app_helper').childElementCount === 1){
					// 			document.querySelector('#app_helper').classList.remove('show');
					// 			num = document.querySelector('#app_helper').childElementCount;
					// 		}
					// 		document.querySelector(`#${formid}`).parentElement.remove();
							
					// 	}, 300);
					// }), document.querySelector('#app_helper'));
				});
				document.querySelector('#app_console_button').addEventListener('click', () => {
					document.querySelector('#app_console').classList.toggle('show');
				});
			},
			GenerateFormToParadigmJSON: (function ($id, $schema, $util, is_horizontal = false) {
				function makeFieldParadigmJSON($id, field, utilily) {
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
					// NOTE - DEBUG HEAD/TAIL
					// Handle $head and $tail cases 
					if (!head && !tail) {
						// console.log('masuk !head && !tail');
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
										{ comment: "Label button", tag: "button", class: "button tail-paradigm-form-element in-tail-button is-link", innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value },
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
											{ comment: "Label button", tag: "button", class: "button in-tail-button is-link tail-paradigm-form-element ", innerHTML: Array.isArray(tail.value) ? tail.value[0] : tail.value },
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
						let temp = makeFieldParadigmJSON($id, field, $util);
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
				if(cr) console.log('Obj final :>> ', Obj);
				return Obj;
			}).bind(this),
			GenerateFormToHTML: (function ($id, $schema, $util, is_horizontal = 0) {
				function makeField($id, field, utilily) {
					const { id, type, label = '', form, readonly = false, value = '', class: d_class = '', head, tail } = field;
					let inputField = '';
					console.log('type :>> ', type);
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

				console.log('$util :>> ', $util);
				$schema.forEach((field) => {
					const { id, label = '', form } = field;
					if (form === 1) {
						// console.log('is_horizontal', is_horizontal);
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
				// console.log('str :>> ', str);
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
				console.log('wrapper', wrapper);
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
			MainForm: () => {
				return {
					comment: "BODY", tag: "div", id: "", content: [
						{
							comment: "App Root Container", tag: "div", id: "app_root_container", content: [
								{ comment: "App Menu", tag: "div", id: "app_menu", class: "", innerHTML: "MENU", content: [] },
								{
									comment: "App Container", tag: "div", id: "app_container", content: [
										{
											comment: "App Top Menu Container", tag: "div", id: "app_top_menu_container", innerHTML: "", class: "columns is-gapless is-mobile m-0", content: [
												{
													comment: "Left Container", tag: "div", id: "app_left_container", innerHTML: "", class: "column is-gapless is-one-quarter", content: [
														{ comment: "Menu button", tag: "button", class: "button is-default", id: "app_menu_button", title: "Open Menu", innerHTML: "<li class=\"fa fa-bars\"></li>" },
														{ comment: "Graph button", tag: "button", class: "button is-default", id: "app_graph_button", title: "Open Graph", innerHTML: "<li class=\"fa fa-circle-nodes\"></li>" },
													]
												},
												{
													comment: "Right Container", tag: "div", id: "app_right_container", innerHTML: "", class: "column is-gapless is-three-quarters is-justify-content-flex-end is-flex", content: [
														{ comment: "Datastore Status", tag: "div", class: "is-inline", id: "datastore_status", innerHTML: "" },
														{ comment: "Console button", tag: "button", class: "button is-default", id: "app_console_button", title: "Open Console", innerHTML: "<li class=\"fa fa-terminal\"></li>" },
														{ comment: "Helper button", tag: "button", class: "button is-default", id: "app_helper_button", title: "Open Helper Sidebar", innerHTML: "<li class=\"fa fa-arrows-left-right\"></li>" },
													]
												},
											]
										},
										{
											comment: "App Graph Controls", tag: "div", innerHTML: "", id: "app_graph_controls", class: "columns m-0 is-gapless is-multiline show", content: [
												{
													comment: "Left Container", tag: "div", id: "app_graph_controls_container_left", innerHTML: "", class: "app_graph_controls_containers column my-2 p-0 is-flex is-justify-content-left", content: [
														{ comment: "Load button", tag: "button", class: "button mr-1 is-small is-default", id: "graph_loadnodes_button", title: "Load Nodes", innerHTML: `<i class="p-1 fa-solid fa-file-arrow-down"></i>` },
														{ comment: "Remove button", tag: "button", class: "button mr-1 is-small is-danger", id: "graph_removenode_button", title: "Remove Node", innerHTML: `<i class="p-1 fa-solid fa-minus"></i>` },
														{ comment: "Add Node", tag: "button", class: "button mr-1 is-small is-link", id: "graph_addnode_button", title: "Add Node", innerHTML: `<i class="p-1 fa-solid fa-plus"></i>` },
														{ comment: "Save Nodes", tag: "button", class: "button mr-1 is-small is-default", id: "graph_savenodes_button", title: "Save Nodes", innerHTML: `<i class="p-1 fa-solid fa-file-arrow-up"></i>` },
													]
												},
												{
													comment: "Center Container", tag: "div", id: "app_graph_controls_container_center", innerHTML: "", class: "app_graph_controls_containers column my-2 p-0 is-flex is-justify-content-center", content: [
														{ comment: "Rewind Fast button", tag: "button", class: "button mr-1 is-small is-default", id: "graph_rewindfast_button", innerHTML: "<li class=\"p-1 fa fa-backward-fast\"></li>" },
														{ comment: "Rewind button", tag: "button", class: "button mr-1 is-small is-default", id: "graph_rewind_button", innerHTML: "<li class=\"p-1 fa fa-backward\"></li>" },
														{ comment: "Stop button", tag: "button", class: "button mr-1 is-small is-info", id: "graph_stop_button", innerHTML: `<li class="fa fa-stop"></li>` },
														{ comment: "Play button", tag: "button", class: "button mr-1 is-small is-success", id: "graph_play_button", innerHTML: `<li class="fa fa-play"></li>` },
														{ comment: "Pause button", tag: "button", class: "button mr-1 is-small is-warning", id: "graph_pause_button", innerHTML: `<li class="fa fa-pause"></li>` },
														{ comment: "Forward button", tag: "button", class: "button mr-1 is-small is-default", id: "graph_forward_button", innerHTML: "<li class=\"p-1 fa fa-forward\"></li>" },
														{ comment: "Forward Fast button", tag: "button", class: "button mr-1 is-small is-default", id: "graph_forwardfast_button", innerHTML: "<li class=\"p-1 fa fa-forward-fast\"></li>" },
													]
												},
												{ comment: "Right Container", tag: "div", id: "app_graph_controls_container_right", innerHTML: "", class: "app_graph_controls_containers column is-gapless m-0 p-0 is-flex is-justify-content-right", content: [] }
											]
										},
										{
											comment: "App Graph Container", tag: "div", class: "m-0 p-0 show", id: "app_graph_container", content: [

												{
													tag: "div", id: "graph_scroll_content", style: "width:calc(100vw);height:calc(80vh);overflow:scroll;", content: [
														{ comment: "App Graph Content", tag: "div", innerHTML: "App Graph Content", class: "columns is-gapless is-mobile grid2020-background", style: "width:20000px; height:20000px;", id: "app_graph_content", content: [] },
													]
												}
												,

											]
										},
										{ comment: "App Content", tag: "div", innerHTML: "Content", id: "app_content", content: [] }
									]
								},
								{ comment: "App helper", tag: "div", id: "app_helper", class: "columns is-gapless is-mobile", innerHTML: "Helper", content: [] }
							]
						},
						{
							comment: "App Console", tag: "div", id: "app_console", content: [
								{ comment: "Core Status Container", tag: "div", id: "core_status", innerHTML: "", class: "app_graph_controls_containers is-gapless m-0 p-0 is-flex is-flex-wrap-wrap is-justify-content-center is-full", content: [] },
								{ comment: "Debugging", tag: "div", id: "debugging", innerHTML: "Console", content: [] },
							]
						}
					]
				};
			},
			FormInput: (id, type, is_horizontal) => {
				let formc = this.Form.Initialize[type]();
				let testform = this.Form.Events.GenerateFormToParadigmJSON(id, formc.Dataset.Schema, this.Utility, is_horizontal);
				let testcard = this.Form.Components.BulmaCSS.Components.Card({
					id: "form_components",
					order: 0,
					style: "width:100%;",
					headerIcon: `<i class="fa-brands fa-wpforms"></i>`,
					header: `Form Components`,
					// innerHTML: this.Form.Events.GenerateFormToHTML(id, formc.Dataset.Schema, this.Utility, is_horizontal),
					content: [this.Form.Events.GenerateFormToParadigmJSON(id, formc.Dataset.Schema, this.Utility, is_horizontal)]
				});
				let column = { comment: "Column", tag: "div", class: "column is-flex", id: "", style: "max-width:22rem;min-width:22rem;", href: "", data: {}, aria: {}, order: 0, innerHTML: "", content: [testcard] }
				return this.Form.Render.traverseDOMProxyOBJ(column);
			},
			FormComponentsTypes: () => {
				return {
					"id": "form_components_types",
					"type": "record", //record or array >>> array of records
					"icon": `<li class="fa fa-wpforms"></li>`,
					"order": 100,
					"Dataset": {
						"Layout": {
							"Form": {},
							"Properties": {
								"FormEntry": {
									"Show": 1,
									"Label": "Form Components Types",
									"ShowLabel": 1,
								},
								"Preview": {
									"Show": 1,
									"Label": "Form Components Types",
									"ShowLabel": 1,
								}
							}
						}, // NOTE - SCHEMA HEAD/TAIL
						"Schema": [{
							"id": "textbox",
							"label": "Text Box",
							"type": "text",
							"form": 1,
							"value": "",
							"head": {
								"type": "select", //input/select/label/button
								"value": ['IDR', 'SGD', 'USD', 'AUD', 'MYR'], //string or array
								"append_to_value": 1,
								"readonly": 0,
								// "width": "short"
							},
							"tail": {
								"type": "button", //input/select/label/button
								"value": "Select", //string or array
								"append_to_value": 1,
								"readonly":0
							}
						},
						{
							"id": "searchable_textbox",
							"label": "Searchable Text Box",
							"type": "text_select",
							"form": 1,
							"value": ["Nostrum", "earum", "quis", "repudiandae", "optio", "qui", "fuga.", "Quos", "optio", "ab.", "Ipsam", "aperiam", "sed", "facilis.", "Aut", "eos", "eaque", "inventore", "ipsam", "aut", "voluptatem", "non."],
							"tail": {
								"type": "button", //input/select/label/button
								"value": "Select", //string or array
								"append_to_value": 1,
								"readonly":0
							}
						},
						{
							"id": "dropdownbox",
							"label": "Dropdown Box",
							"type": "select",
							"value": ["Value example", "Jakarta", "Magelang", "Malaysia", "Singapura"],
							"form": 1,
							"tail": {
								"type": "button", //input/select/label/button
								"value": "Select", //string or array
								"append_to_value": 1,
								"readonly":0
							}
						},
						{
							"id": "textarea",
							"label": "Text Area",
							"type": "textarea",
							"form": 1,
							"tail": {
								"type": "button", //input/select/label/button
								"value": "Select", //string or array
								"append_to_value": 1,
								"readonly":0
							}
						},
						{
							"id": "boolean",
							"label": "Checkbox",
							"type": "checkbox",
							"form": 1,
							"tail": {
								"type": "button", //input/select/label/button
								"value": "Select", //string or array
								"append_to_value": 1,
								"readonly":0
							}
						},
						{
							"id": "button",
							"label": "Button",
							"type": "button",
							"class": "is-default",
							"form": 1,
							"tail": {
								"type": "button", //input/select/label/button
								"value": "Select", //string or array
								"append_to_value": 1,
								"readonly":0
							}
						},
						{
							"id": "button",
							"label": "Main Action",
							"type": "button",
							"class": "is-default",
							"form": 1,
							"tail": {
								"type": "select", //input/select/label/button
								"value": ["", "Action 1", "Action 2", "Action 3"], //string or array
								"append_to_value": 1,
								"readonly": 0,
								"width": "short"
							}
						},
						{
							"id": "add",
							"label": "",
							"type": "action",
							"class": "is-link",
							"form": 1,
						}]
					}
				}
			},
			FormComponents: () => {
				return {
					"id": "form_components",
					"type": "record", //record or array >>> array of records
					"icon": `<li class="fa fa-wpforms"></li>`,
					"order": 100,
					"Dataset": {
						"Layout": {
							"Form": {},
							"Properties": {
								"FormEntry": {
									"Show": 1,
									"Label": "Form Components",
									"ShowLabel": 1,
								},
								"Preview": {
									"Show": 1,
									"Label": "Form Components",
									"ShowLabel": 1,
								}
							}
						},
						"Schema": [{
							"id": "id",
							"label": "ID",
							"type": "text",
							"form": 1,
							"value": "",
						},
						{
							"id": "name",
							"label": "Nama",
							"type": "text",
							"form": 1,
						},
						{
							"id": "label",
							"label": "Label",
							"type": "text",
							"form": 1,
						},
						{
							"id": "type",
							"label": "Type",
							"type": "text",
							"form": 1,
							"readonly": 1,
							"value": "text",
						},
						{
							"id": "form",
							"label": "Form",
							"type": "checkbox",
							"form": 1,
							"value": 1
						},
						{
							"id": "readonly",
							"label": "Readonly",
							"type": "checkbox",
							"form": 1,
						},
						{
							"id": "value",
							"label": "Value",
							"type": "text",
							"form": 1,
						},
						{
							"id": "add",
							"label": "",
							"type": "button",
							"class": "is-link",
							"form": 1,
						}]
					}
				}
			}
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
						if (cr) console.log('child', child);
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
					console.log("Execution stopped.");
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
							console.log(`DEBUG - Process ${this.cursor.id}:`);
							console.log(`  Input:`, resolvedInput);
							console.log(`  Output:`, output);
							console.log(`  Next process:`, this.cursor.next_process);
						} else {
							console.log(`Process ${this.cursor.id} executed. Output:`, output);
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