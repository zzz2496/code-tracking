const OperatorTemplate = {
	"datetime": [">", ">=", "=", "!=", "<=", "<", "is", "is not"],
	"number": [">", ">=", "=", "!=", "<=", "<", "contains"],
	"string": ["starts with", "ends with", "contains", "is", "is not",],
	"boolean": ["is", "is not"],
	"array": ["starts with", "ends with", "contains", "in", "not in"]
};

export class Flow {
	constructor(funcObject, chain) {
		this.cursor = null; // Track the current process
		this.chain = chain;
		this.run_mode = ["run", "stop", "pause", "step", "debug"];
		this.run_mode_selected = "run"; // Default to "run"
		this.processFunctions = funcObject;
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
	//NOTE - sanitizeInput function added to handle date time input sanitization;
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
		"Components": {
			"DOMElement": () => { 
				return {
					"comment": "",
					"tag": "",
					"class": "",
					"id": "",
					"style": "",
					"href": "",
					"title": "",
					"data": {},
					"aria": {},
					"order": 0,
					"innerHTML": "",
					"content": []
				}
			},
			"BulmaCSS": {
				"Elements": {
					"Block": (({ 
						id = "", 
						class: className = "", 
						style = "", 
						href = "", 
						data = {}, 
						aria = {}, 
						order = 0,
						innerHTML = "", 
						content = []
					} )=> {
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
					"Box": (({ 
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
					"Button": (() => {
						
					}).bind(this),
					"Content": (() => {
						
					}).bind(this),
					"Delete": (() => {
						
					}).bind(this),
					"Icon": (() => {
						
					}).bind(this),
					"Image": (() => {
						
					}).bind(this),
					"Notification": (() => {
						
					}).bind(this),
					"ProgressBars": (() => {
						
					}).bind(this),
					"Table": (() => {
						
					}).bind(this),
					"Tag": (() => {
						
					}).bind(this),
					"Title": (() => {
						
					}).bind(this),
				},
				"Components": {
					"Card": (({
						id = "", 
						className = "", 
						style = "", 
						href = "", 
						data = {}, 
						aria = {}, 
						order = 0, 
						headerIcon = "", 
						header = "", 
						content = "", 
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
									innerHTML: (content)
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
				"Layout": {
					"Hero": (({ 
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
					"Section": (({ 
						id = "", 
						class: className = "", 
						style = "", 
						href = "", 
						data = {}, 
						aria = {}, 
						order = 0, 
						innerHTML = "", 
						content = []
					} )=> {
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
		"Events": {
			addGlobalEventListener: function (type, selector, callback, parent = document) {
				const nonBubblingEvents = ['focus', 'blur', 'keyup'];
			
				// Add event listener on the parent (or global) scope
				parent.addEventListener(type, (e) => {
					console.log('addGlobalEventListener :>> ', type, selector);
			
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
		},
		"Initialize": () => { },
		"Render": {
			"traverseDOMProxyOBJ": ((element, callback) => {
				let html = `<${element.tag}`;
		
				if (element.class) html += ` class="${element.class}"`;
				if (element.id) html += ` id="${element.id}"`;
				if (element.style) html += ` style="${element.style}"`;
				if (element.href) html += ` href="${element.href}"`;
				if (element.type) html += ` type="${element.type}"`;
				if (element.value) html += ` value="${element.value}"`;
		
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
						// console.log(this);
						html += this.Form.Render.traverseDOMProxyOBJ(child); // Recursively generate HTML for child elements
					}
				}
		
				html += `</${element.tag}>`;
				
				if (callback) callback();

				return html;
			})
		},
		"Run": {
			setRunMode: (mode) =>{
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
				if (this.run_mode_selected === "stop") {8
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
					if (this.run_mode_selected === "step" ||this.run_mode_selected === "debug") {
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
		"if": {
			"input_pin1": null,
			"input_pin2": null,
			"operator": null,
			"output_pin1": null,
			"output_pin2": null,
			"operator_template": OperatorTemplate,
			"do_if": function () {
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
		"switch": function (input_pin1, operator) {

		}
	};
	Repetition = {

	};
};