let cr = false;
if (cr) console.log('>>> Utility.mjs');
// import { NodeProperties } from "./NodeProperties.mjs";
// import { Surreal } from './node_modules/surrealdb.wasm/dist/full/index.js';
// import { Surreal } from '../paradigm_modules/surrealdb.wasm/dist/full/index.js';

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */

// NOTE - HTML addEventOnce function
HTMLElement.prototype.addEventOnce = function (eventName, eventHandler) {
	const element = this;
	const eventKey = `data-event-${eventName}-initialized`;

	// Check if the element already has the event marker
	if (element.hasAttribute(eventKey)) {
		return; // Event is already initialized, do nothing
	}

	// Add the event handler
	element.addEventListener(eventName, eventHandler);

	// Add the marker attribute to the element
	element.setAttribute(eventKey, 'true');

	// Add a function to remove the event
	element.removeEvent = function () {
		element.removeEventListener(eventName, eventHandler);
		element.removeAttribute(eventKey);
		delete element.removeEvent;
	};
};
// NOTE - HTML removeAllEvents function
HTMLElement.prototype.removeAllEvents = function (eventName) {
	const element = this;
	const eventKey = `data-event-${eventName}-initialized`;

	// Check if the element has the event marker
	if (element.hasAttribute(eventKey)) {
		// Remove all event listeners of the specified type
		element.querySelectorAll(`[data-event-${eventName}-initialized="true"]`).forEach((el) => {
			el.removeEventListener(eventName, el.eventHandler);
			el.removeAttribute(eventKey);
		});
	}
};


// Define a helper function to check if an SVG element has the event marker
function hasSvgEventMarker(element, eventName) {
	return element._eventMarkers && element._eventMarkers[eventName];
}

// Define a helper function to mark an SVG element with an event marker
function markSvgElement(element, eventName) {
	if (!element._eventMarkers) {
		element._eventMarkers = {};
	}
	element._eventMarkers[eventName] = true;
}

// NOTE - Add the addEventOnce method for SVG elements
// The above code is adding a method `addEventOnce` to the `SVGElement` prototype in JavaScript. This method allows you to add an event listener to an SVG element that will only trigger the event handler once for a specific event.
SVGElement.prototype.addEventOnce = function (eventName, eventHandler) {
	const element = this;

	// Check if the element already has the event marker
	if (hasSvgEventMarker(element, eventName)) {
		return; // Event is already initialized, do nothing
	}

	// Add the event handler
	element.addEventListener(eventName, function (e) {
		// Call the event handler
		eventHandler(e);

		// Remove the event listener and marker after the event is triggered
		element.removeEventListener(eventName, eventHandler);
		markSvgElement(element, eventName);
	});

	// Mark the SVG element with the event marker
	markSvgElement(element, eventName);
};

// NOTE - Add a function to remove the event from an SVG element
SVGElement.prototype.removeEvent = function (eventName, eventHandler) {
	const element = this;
	if (hasSvgEventMarker(element, eventName)) {
		element.removeEventListener(eventName, eventHandler);
		delete element._eventMarkers[eventName];
	}
};

// NOTE - Add the getWeek function
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

//NOTE - Add the OperatorTemplate
const OperatorTemplate = {
	"datetime": [">", ">=", "=", "!=", "<=", "<", "is", "is not"],
	"number": [">", ">=", "=", "!=", "<=", "<", "contains"],
	"string": ["starts with", "ends with", "contains", "is", "is not",],
	"boolean": ["is", "is not"],
	"array": ["starts with", "ends with", "contains", "in", "not in"]
};
//SECTION - Utility Class
export class Utility {
	constructor(cr) {
		this.characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}|;:",.<>?/~`';
		this.passwordLength = 16;
		this.Operators = OperatorTemplate;
	};

	// NOTE - checkType
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
	// NOTE - Booleans related methods.
	BasicMath = {
		calc: ((numbers, sign) => {
			if (!Array.isArray(numbers)) {
				console.error("Input must be an array.");
				return 0;
			}
		
			// Ensure array has at least one number; return early if empty
			if (numbers.length === 0) {
				console.warn("Input array is empty. Returning 0.");
				return 0;
			}
		
			// Initialize result based on operation
			let result;
			switch (sign) {
				case '+':
					result = 0;
					for (let i = 0; i < numbers.length; i++) {
						const num = numbers[i];
						if (typeof num === "number" && isFinite(num)) {
							result += num;
						} else {
							console.warn(`Invalid number at index ${i}: ${num} - ignored in sum.`);
						}
					}
					break;
		
				case '-':
					result = numbers[0];
					for (let i = 1; i < numbers.length; i++) {
						const num = numbers[i];
						if (typeof num === "number" && isFinite(num)) {
							result -= num;
						} else {
							console.warn(`Invalid number at index ${i}: ${num} - ignored in subtraction.`);
						}
					}
					break;
		
				case '*':
					result = 1;
					for (let i = 0; i < numbers.length; i++) {
						const num = numbers[i];
						if (typeof num === "number" && isFinite(num)) {
							result *= num;
						} else {
							console.warn(`Invalid number at index ${i}: ${num} - ignored in multiplication.`);
						}
					}
					break;
		
				case '/':
					result = numbers[0];
					for (let i = 1; i < numbers.length; i++) {
						const num = numbers[i];
						if (typeof num === "number" && isFinite(num)) {
							if (num === 0) {
								console.warn(`Division by zero at index ${i}. Ignoring this value.`);
								continue;
							}
							result /= num;
						} else {
							console.warn(`Invalid number at index ${i}: ${num} - ignored in division.`);
						}
					}
					break;
		
				default:
					console.error(`Invalid operation sign: ${sign}. Use +, -, *, or /.`);
					return 0;
			}
		
			return result;
		}).bind(this),
			
		add: (numbers) => {
			return this.BasicMath.calc(numbers, '+');
		},
		
		// Subtraction function
		subtract: (numbers) => {
			return this.BasicMath.calc(numbers, '-');
		},
		
		// Multiplication function
		multiply: (numbers) => {
			return this.BasicMath.calc(numbers, '*');
		},
		
		// Division function
		divide: (numbers) => {
			return this.BasicMath.calc(numbers, '/');
		},
		store: (data) => {
			return `Storing data into database: ${data}`;
		}
	};
	Booleans = {
		"SafeBoolean": (function (bool, return_false = true) {
			let datatype = this.checkType(bool);
			// console.log('>>>> masuk safe boolean > check datatype >>>>', datatype, bool);
			// console.log('>>>> masuk safe boolean > typeof bool>>>>', typeof bool);
			switch (datatype) {
				case 'DateTime':
					return (return_false) ? false : { status: false, message: 'Input datatype is DateTime' };
					break;
				case 'String':
					// console.log('>>>> masuk safe boolean > string', bool.toLowerCase());
					if (bool.toLowerCase() === "true" || bool.toLowerCase() === "yes" || bool.toLowerCase() === "ya" || bool.toLowerCase() === "sudah") {
						return true;
					}
					else if (bool.toLowerCase() === "false" || bool.toLowerCase() === "no" || bool.toLowerCase() === "tidak" || bool.toLowerCase() === "belum") {
						return false;
					}
					break;
				case 'Number':
					if (bool === 0) {
						return false;
					} else if (bool === 1) {
						return true;
					}
					break;
				case 'Boolean':
					if (typeof bool == 'string') {
						if (bool.toLowerCase() === "true" || bool.toLowerCase() === "yes" || bool.toLowerCase() === "ya" || bool.toLowerCase() === "sudah") {
							return true;
						}
						else if (bool.toLowerCase() === "false" || bool.toLowerCase() === "no" || bool.toLowerCase() === "tidak" || bool.toLowerCase() === "belum") {
							return false;
						}
					}
					return bool;
					break;
				case 'Array':
					return (return_false) ? false : { status: false, message: 'Input datatype is Array' };
					break;
				case 'Object':
					return (return_false) ? false : { status: false, message: 'Input datatype is Object' };
					break;
				case 'null':
					return false;
					break;
				default:
					return (return_false) ? false : { status: false, message: 'Input datatype is unknown' };
					break;
			}
		}).bind(this),
	}
	// NOTE - Strings related methods
	Strings = {
		"Concat": (function (strings) {
			if (!Array.isArray(strings)) {
				console.error("Input must be an array.");
				return "";
			}
	
			let result = "";
	
			for (let i = 0; i < strings.length; i++) {
				const str = strings[i];
				if (typeof str === "string") {
					result += str;
				} else {
					console.warn(`Invalid string at index ${i}: ${str} - ignored in concatenation.`);
				}
			}
			return result;
		}).bind(this),
		"IndexOf": (function (string, needle) {				const str = strings[i];
			if (typeof str === "string") {
				return str.indexOf(needle);
			} else {
				console.warn(`Invalid string.`);
			}
		}).bind(this),
		"SafeString": (function (str, textDecoration) {
			/*
				textDecoration = {
					"textOverlay": "some overlay %%% some other overlay" // %%% will be replaced by the original text from the array
					"datetimeDecoration":{
						"date_separator":"/",
						"date_with_time": false
					},
					"numberProcessing":{
						"thousandSeparator":true
					}
				}
			*/
			let datatype = this.checkType(str);
			let sanitizedString = '';
			switch (datatype) {
				case 'DateTime':
					let date = str;
					let mode = this.Time.mode;

					const day = String(date.getDate()).padStart(2, '0');
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const year = date.getFullYear();

					const hour = String(date.getHours()).padStart(2, '0');
					const minute = String(date.getMinutes()).padStart(2, '0');
					const second = String(date.getSeconds()).padStart(2, '0');

					let date_separator = '/';
					let date_with_time = false;
					if (typeof textDecoration != 'undefined') if (textDecoration.hasOwnProperty('datetimeDecoration')) {
						date_separator = textDecoration.datetimeDecoration.date_separator;
						date_with_time = textDecoration.datetimeDecoration.date_with_time;
					}

					let formattedDate = '';

					switch (mode.toUpperCase()) {
						case 'DMY':
							formattedDate = `${day}${date_separator}${month}${date_separator}${year}`;
							break;
						case 'MDY':
							formattedDate = `${month}${date_separator}${day}${date_separator}${year}`;
							break;
						case 'YMD':
							formattedDate = `${year}${date_separator}${month}${date_separator}${day}`;
							break;
						default:
							return { status: false, message: 'Invalid mode' };
					}

					if (date_with_time) {
						sanitizedString = `${formattedDate} ${hour}:${minute}:${second}`;
					} else {
						sanitizedString = formattedDate;
					}

					if (typeof textDecoration != 'undefined') if (textDecoration.hasOwnProperty('textOverlay')) sanitizedString = textDecoration.textOverlay.replace('%%%', sanitizedString);
					return sanitizedString;
					break;
				case 'String':
					sanitizedString = (str.length > 0) ? str
						.replace(/[^a-zA-Z0-9\/\s\-_\,.()+@=$%:&<>'"]/gmi, '')
						.replace(/\s+/g, ' ')
						.trim() : '';
					if (typeof textDecoration != 'undefined') {
						if (textDecoration.hasOwnProperty('numberProcessing')) {
							sanitizedString = this.Numbers.ThousandSeparator(sanitizedString);
						}
						if (textDecoration.hasOwnProperty('textOverlay')) {
							sanitizedString = textDecoration.textOverlay.replace('%%%', sanitizedString);
						}
					}
					return sanitizedString;
					break;
				case 'Number':
					str = str.toString();
					sanitizedString = (str.length > 0) ? str
						.replace(/[^0-9\,\.]/gmi, '')
						.replace(/\s+/g, ' ')
						.trim() : '0';
					if (typeof textDecoration != 'undefined') {
						if (textDecoration.hasOwnProperty('numberProcessing')) {
							sanitizedString = this.Numbers.ThousandSeparator(this.Numbers.SafeNumber(sanitizedString));
						}
						if (textDecoration.hasOwnProperty('textOverlay')) {
							sanitizedString = textDecoration.textOverlay.replace('%%%', sanitizedString.toString());
						}
					}

					return sanitizedString;
					break;
				case 'Boolean':
					if (this.Booleans.SafeBoolean(str) === true) {
						sanitizedString = 'Ya';
					} else if (this.Booleans.SafeBoolean(str) === false) {
						sanitizedString = 'Tidak';
					}
					if (typeof textDecoration != 'undefined') {
						if (textDecoration.hasOwnProperty('booleanReplace')) {
							switch (textDecoration.booleanReplace.mode) {
								case "true":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "true" : "false";
									break;
								case "false":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "true" : "false";
									break;
								case "yes":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "yes" : "no";
									break;
								case "no":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "yes" : "no";
									break;
								case "ya":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "ya" : "tidak";
									break;
								case "tidak":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "ya" : "tidak";
									break;
								case "sudah":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "sudah" : "belum";
									break;
								case "belum":
									sanitizedString = (this.Booleans.SafeBoolean(sanitizedString)) ? "sudah" : "belum";
									break;
							}
						};
						if (textDecoration.hasOwnProperty('textOverlay')) sanitizedString = textDecoration.textOverlay.replace('%%%', sanitizedString);
					}
					return sanitizedString;
					break;
				case 'Array':
					return { status: false, message: 'Input is an array' };
					break;
				case 'Object':
					return { status: false, message: 'Input is an object' };
					break;
				case 'null':
					return '';
					break;
				default:
					return { status: false, message: 'Input datatype is unknown' };
					break;
			}
		}).bind(this),
		"UCwords": (function (zstr) {
			let str = this.Strings.SafeString(zstr);
			if (this.checkType(str) === 'Object') {
				console.error(str.message);
				return str;
			}
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		}).bind(this),
		"LCwords": (function (zstr) {
			let str = this.Strings.SafeString(zstr);
			if (this.checkType(str) === 'Object') {
				console.error(str.message);
				return str;
			}
			return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toLowerCase();
			});
		}).bind(this),
		"Readable": (function (zstr) {
			let str = this.Strings.SafeString(zstr);
			if (this.checkType(str) === 'Object') {
				console.error(str.message);
				return str;
			}
			return str.replace(/\_/gi, ' ').toUpperCase();
		}).bind(this),
		"ReadableUCWords": (function (zstr) {
			let str = this.Strings.SafeString(zstr);
			if (this.checkType(str) === 'Object') {
				console.error(str.message);
				return str;
			}
			return this.Strings.UCwords(str.replace(/\_/gi, ' ').toLowerCase());
		}).bind(this),
		"UnReadable": (function (zstr) {
			let str = this.Strings.SafeString(zstr);
			if (this.checkType(str) === 'Object') {
				console.error(str.message);
				return str;
			}
			return str.replace(/[\s\.\-]/gi, '_').toLowerCase();
		}).bind(this),
	};
	// NOTE - Numbers related methods
	Numbers = {
		"SafeNumber": (function (input, nullable = false) {
			// console.log('arguments', arguments);
			let datatype = this.checkType(input);
			// console.log('input', input)
			// console.log('datatype', datatype)
			switch (datatype) {
				case 'DateTime':
					return (nullable) ? null : 0;
					break;
				case 'String':
					// Remove leading and trailing whitespaces
					input = input.trim();

					// If empty string after trimming, return null
					if (input.length === 0) {
						return (nullable) ? null : 0;
					}

					// Handle negative numbers: keep initial '-' if present
					let isNegative = false;
					if (input.charAt(0) === '-') {
						isNegative = true;
						input = input.substring(1);
					}

					// Replace commas, consider them as thousand separators
					input = input.replace(/,/g, '');

					// Keep only the first decimal point, remove all others
					let decimalIndex = input.indexOf('.');
					if (decimalIndex !== -1) {
						input = input.substring(0, decimalIndex + 1) +
							input.substring(decimalIndex + 1).replace(/\./g, '');
					}

					// Remove all other non-numeric characters
					input = input.replace(/[^0-9.]/g, '');

					// Convert the cleaned string to a number
					let num = parseFloat(input);

					// Apply negative sign if needed
					if (isNegative) {
						num = -num;
					}

					// Validate the parsed number
					if (isNaN(num) || !isFinite(num)) {
						return (nullable) ? null : 0;
					}
					return num;
					break;
				case 'Number':
					if (typeof input === "string") {
						input = input.replace(',', '');
					}
					if (isNaN(input) || !isFinite(input)) {
						return (nullable) ? null : 0;
					}
					return parseFloat(input);
					break;
				case 'Boolean':
					if (input === true) {
						return 1;
					} else if (input === false) {
						return 0;
					}
					break;
				case 'Array':
					return (nullable) ? null : 0;
					break;
				case 'Object':
					return (nullable) ? null : 0;
					break;
				case 'null':
					return (nullable) ? null : 0;
					break;
				default:
					return (nullable) ? null : 0;
					break;
			}
		}).bind(this),
		"generateUUID": (function () {
			return Math.random().toString().replace("0.", "");
		}).bind(this),
		"Round1": (function (num) {
			return Math.round(parseFloat(this.Numbers.SafeNumber(num)) * 10) / 10;
		}).bind(this),
		"Round2": (function (num) {
			return Math.round(parseFloat(this.Numbers.SafeNumber(num)) * 100) / 100;
		}).bind(this),
		"Round3": (function (num) {
			return Math.round(parseFloat(this.Numbers.SafeNumber(num)) * 1000) / 1000;
		}).bind(this),
		"Round4": (function (num) {
			return Math.round(parseFloat(this.Numbers.SafeNumber(num)) * 10000) / 10000;
		}).bind(this),
		"Round5": (function (num) {
			return Math.round(parseFloat(this.Numbers.SafeNumber(num)) * 100000) / 100000;
		}).bind(this),
		"RoundToNearestBase": (function (num, base) {
			return Math.round(num / base) * base;
		}).bind(this),
		"ThousandSeparator": (function (num, decpoint = ".", sep = ",") {
			if (num == null) {
				return "0";
			}

			// Check for live typing cases where we should avoid processing
			if (num === "0") {
				return num; // Return "0" if the input is exactly "0"
			}
			if (num === "0" + decpoint) {
				return num; // Return "0." if the input is exactly "0."
			}

			// If the input is just a minus sign or ends with a decimal point, return as-is for live input
			if (num === "-" || num.endsWith(decpoint) || (num.endsWith("0") && num.match(/\./))) {
				return num;
			}

			// Handle the case where num is a string with comma separators and try to convert it
			if (typeof num === "string") {
				// Remove thousand separators and replace decimal point to handle as number
				const parsedNum = Number(num.replace(new RegExp("\\" + sep, "g"), "").replace(decpoint, "."));
				
				// If parsedNum is NaN (invalid input), return the original string without processing
				if (isNaN(parsedNum)) {
					return num;
				}
				
				num = parsedNum;
			}

			// Detect if the number is negative, and handle separately
			let isNegative = false;
			if (num < 0) {
				isNegative = true;
				num = Math.abs(num);
			}

			// Convert to string and split into whole and decimal parts
			let [whole, decimal] = num.toFixed(2).split(".");

			// Format the whole number part with thousands separators
			whole = parseInt(whole).toLocaleString('en-US').replace(",", sep);

			// Reassemble with decimal point only if there's a decimal part
			let result = decimal && decimal !== "00" ? whole + decpoint + decimal : whole;

			// Add back the negative sign if necessary
			if (isNegative) {
				result = '-' + result;
			}

			return result;
		}).bind(this),


		"ThousandSeparatorV1": (function (num, decpoint, sep) {
			console.log('thousand separator!!!', num);
			if (num == null) {
				num = 0;
			}
			console.log('tembus == null');
			console.log('num.endsWith(decpoint)', num.endsWith(decpoint));
			// If the input is a minus sign only or a partial input ending with a decimal point, return it without formatting
			if (num === "-" || num.endsWith(decpoint)) {
				console.log('masuk cHECKKKK')
				return num;
			}
			console.log('tembus (num === "-" || num.endsWith(decpoint))');

			// Check if num is a string and if so, attempt to convert it to a number
			if (typeof num === "string") {
				if (isNaN(Number(num))) {
					return "Invalid input";
				}
				num = Number(num);
			}
			console.log('tembus attempt NUMBER(string)');

			// Handle negative numbers by temporarily converting to positive,
			// then adding the negative sign back at the end.
			let isNegative = false;
			if (num < 0) {
				isNegative = true;
				num = Math.abs(num);
			}
			console.log('tembus negative');

			// Convert number to string and split it into whole and decimal parts.
			let [whole, decimal] = num.toFixed(2).toString().split(decpoint);
			console.log('start bikin whole', whole, decimal);
			// Add the thousand separators to the whole number part.
			whole = parseInt(whole).toLocaleString('en-US', {
				maximumFractionDigits: 0,
			});
			console.log('tembus bikin whole', whole);

			// Join everything back together.
			console.log('elements', deciman, whole, decpoint, decimal);
			let result = decimal ? whole + decpoint + decimal : whole;
			console.log('tembus bikin result', result);

			// Add negative sign back if necessary.
			if (isNegative) {
				result = '-' + result;
			}

			return result;
		}).bind(this),
		"ToRoman": (function (N, s, b, a, o, t) {
			t = N / 1e3 | 0;
			N %= 1e3;
			for (s = b = '', a = 5; N; b++, a ^= 7)
				for (o = N % a, N = N / a ^ 0; o--;)
					s = 'IVXLCDM'.charAt(o > 2 ? b + N - (N &= ~1) + (o = 1) : b) + s;
			return Array(t + 1).join('M') + s;
		}).bind(this),
		"Pad": (function (number, length) {
			let str = '' + number;
			while (str.length < length) {
				str = '0' + str;
			}
			return str;
		}).bind(this),
		"IsItANumber": function (num) {
			if (typeof num !== 'number') {
				return { status: false, message: 'Input is not a number' };
			}

			if (isNaN(num)) {
				return { status: false, message: 'Input is NaN' };
			}

			return { status: true, sanitizedNumber: num };
		},
		"Terbilang": (function (num, tail = '') {
			let bilangan = this.Numbers.SafeNumber(num);
			if (bilangan === null) {
				return { "status": false, "message": "The number is not a safe number" };
			}
			bilangan = String(bilangan);
			let angka = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
			let kata = new Array('', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan');
			let tingkat = new Array('', 'ribu', 'juta', 'milyar', 'triliun');

			let panjang_bilangan = bilangan.length;
			/* pengujian panjang bilangan */
			if (panjang_bilangan > 15) return "Diluar Batas";


			/* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
			for (let i = 1; i <= panjang_bilangan; i++) {
				angka[i] = bilangan.substr(-(i), 1);
			}

			let i = 1;
			let j = 0;
			let kaLimat = "";

			/* mulai proses iterasi terhadap array angka */
			while (i <= panjang_bilangan) {
				let subkaLimat = "";
				let kata1 = "";
				let kata2 = "";
				let kata3 = "";

				/* untuk Ratusan */
				if (angka[i + 2] != "0") {
					if (angka[i + 2] == "1") {
						kata1 = "seratus";
					} else {
						kata1 = kata[angka[i + 2]] + " ratus";
					}
				}

				/* untuk Puluhan atau Belasan */
				if (angka[i + 1] != "0") {
					if (angka[i + 1] == "1") {
						if (angka[i] == "0") {
							kata2 = "sepuluh";
						} else if (angka[i] == "1") {
							kata2 = "sebelas";
						} else {
							kata2 = kata[angka[i]] + " belas";
						}
					} else {
						kata2 = kata[angka[i + 1]] + " puluh";
					}
				}

				/* untuk Satuan */
				if (angka[i] != "0") {
					if (angka[i + 1] != "1") {
						kata3 = kata[angka[i]];
					}
				}

				/* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
				if ((angka[i] != "0") || (angka[i + 1] != "0") || (angka[i + 2] != "0")) {
					subkaLimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
				}

				/* gabungkan variabe sub kaLimat (untuk Satu blok 3 angka) ke variabel kaLimat */
				kaLimat = subkaLimat + kaLimat;
				i = i + 3;
				j = j + 1;
			}
			/* mengganti Satu Ribu jadi Seribu jika diperlukan */
			if ((angka[5] == "0") && (angka[6] == "0")) {
				kaLimat = kaLimat.replace("satu ribu", "seribu");
			}
			return kaLimat + tail;
		}).bind(this),
	};
	// NOTE - Objects related methods
	Objects = {
		"monitorDependentPropertyChanges": ((object, dependencies, finalCallback) => {
			const state = {};
			dependencies.forEach(dep => {
				state[dep] = false;  // Initialize the state for each dependency
			});
			const handler = {
				set(target, property, value) {
					if (dependencies.includes(property) && target[property] !== value) {
						target[property] = value; // Set the value
						state[property] = value === 'LOADED'; // Update the state

						// Check if all dependencies are satisfied
						const allLoaded = Object.values(state).every(v => v === true);
						if (allLoaded) {
							finalCallback();  // Trigger the callback
						}
					} else {
						target[property] = value;
					}
					return true;
				}
			};
			function applyProxyToDependencies(obj) {
				dependencies.forEach(dep => {
					if (obj.hasOwnProperty(dep)) {
						obj[dep] = new Proxy(obj[dep], handler);
					}
				});
			}
			applyProxyToDependencies(object);
		}),
		"monitorSingleProperty": ((property, callback) => {
			monitorDependentPropertyChanges(coreStatus, [property], callback);
		}),
		"fetchData": async function (DataARRAY, callback, progressCallback, cr = 0) {
			async function fetchJSON(Fdata = { "URL": "", "Method": 'GET', "Params": {}, "ContentType": "application/json" }, key) {
				const options = {
					method: Fdata.Method ?? 'GET',
					headers: {
						'Content-Type': Fdata.ContentType
					}
				};
				if (progressCallback) progressCallback(key, Fdata.URL, 'STARTED');
				switch (Fdata.Method) {
					case 'POST':
						if (Fdata.ContentType === 'application/json') {
							options.body = JSON.stringify(Fdata.Params);
						} else if (Fdata.ContentType === 'application/x-www-form-urlencoded') {
							options.body = new URLSearchParams(Fdata.Params).toString();
						}
						if (cr) {
							console.log('OPTIONS after append:>> ', options);
						}
						break;
					case 'GET':
						const queryString = new URLSearchParams(Fdata.Params).toString();
						Fdata.URL += `?${queryString}`;
						if (cr) {
							console.log('URL after append:>> ', Fdata.URL);
						}
						break;
				}
				try {
					const response = await fetch(Fdata.URL, options);
					if (!response.ok) {
						throw new Error(`Error: ${response.status} ${response.statusText}`);
					}
					if (progressCallback) progressCallback(key, Fdata.URL, 'DONE');
					return await response.json();
				} catch (error) {
					console.error(`Fetch error for Request ${key}:`, error);
					throw error;
				}
			}

			/**
			* Processes an array of blueprints and fetches their data.
			* @param {Object} blueprints - An object containing blueprint configurations.
			* @param {Function} callback - A callback function to execute after all requests are completed.
			* @returns {Promise<void>}
			*/
			async function fetchRequestsArray(blueprints, callback, progressCallback) {
				const results = {};
				const requests = Object.keys(blueprints).map(async key => {
					try {
						const data = await fetchJSON(blueprints[key], key, progressCallback);
						results[key] = data;
					} catch (error) {
						results[key] = error;
					}
				});

				try {
					await Promise.all(requests);
					if (callback) callback(results);
				} catch (error) {
					console.error('Error with the Promise.all:', error);
				}
			}
			// Start the FETCH DATA request
			try {
				await fetchRequestsArray(DataARRAY, (results) => {
					if (callback) callback(results);
				}, (progress) => {
					if (progressCallback) progressCallback(progress);
				});
			} catch (error) {
				console.error('Error with fetchRequestsArray:', error);
			}
		},
		"print_r": (function (obj, tab, depth = 0) {
			// Guard against null or undefined
			if (obj === null || obj === undefined) {
				return String(obj);
			}

			// Guard against infinite recursion by limiting depth
			if (depth > 10) {
				return 'Max Depth Reached';
			}

			const isArray = Array.isArray(obj);
			let str = isArray ? 'Array\n' + tab + '[\n' : 'Object\n' + tab + '{\n';

			for (const prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					const val = obj[prop];
					let valStr = '';

					// Guard against null or undefined nested objects
					if (val === null || val === undefined) {
						valStr = String(val);
					} else if (typeof val === 'object') {
						valStr = this.Objects.print_r(val, tab + '\t', depth + 1);
					} else if (typeof val === 'string') {
						valStr = `"${val}"`;
					} else {
						valStr = val;
					}

					str += `${tab}\t${prop} => ${valStr},\n`;
				}
			}
			str = str.slice(0, -2) + '\n' + tab; // Remove trailing comma and newline

			return isArray ? str + ']' : str + '}';
		}).bind(this),
		"cr": (function (json) {
			return '<pre>' + this.Objects.print_r(json) + '</pre>';
		}).bind(this),
		"copyObject": (function (obj) {
			return JSON.parse(JSON.stringify(obj));
		}).bind(this),
		// "blockHighlighter.background": "#",

		//NOTE - Linked List related methods
		"LinkedList": {
			"init": (function (list) {

			}).bind(this),
			"head": {},
			"tail": {},
			"cursor": {},
			"add": (function (cursor, new_node) {

			}).bind(this),
			"remove": (function (cursor) {

			}).bind(this),
			"prevNode": (function (cursor, connectionPin, steps = 1) {

			}).bind(this),
			"nextNode": (function (cursor, connectionPin, steps = 1) {

			}).bind(this),
			"statistics": (function (list) {

			}).bind(this),
		},
	};
	// NOTE - Array related methods
	Array = {
		"forEach": (function (array, callback) {
			if (Array.isArray(array)) {
				array.forEach(callback);
			} else {
				console.warn('Invalid array.');
			}
		}).bind(this),
		"IsArrayOK": (function (array, zlabel, return_array = false) {
			if (arguments.length > 1) if (this.Strings.SafeString(zlabel).length === 0) label = '';
			let label = zlabel + ' ';
			if (typeof array !== 'object') {
				console.error('Array ' + label + 'not an object');
				// return { "status": false, "message": 'Array not an object' };
				return (return_array) ? false : { "status": false, "message": 'Array not an object' };
			}
			if (!Array.isArray(array)) {
				console.error('Array ' + label + 'not an array');
				return (return_array) ? false : { "status": false, "message": 'Array ' + label + 'not an array' };
			}
			if (array.length == 0) {
				console.error('Array ' + label + 'length = 0');
				return (return_array) ? false : { "status": false, "message": 'Array ' + label + 'length = 0' };
			}
			return (return_array) ? array : { "status": true, "message": "" };
		}).bind(this),
		"ArrayKeys": (function (input, search_value, argStrict) {
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
			// Define a function that takes an array of objects and a key-value pair to match

			let search = typeof search_value !== 'undefined',
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
		}).bind(this),
		"findArrayElement": (function (array, key, value, ilike = 0) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array);
			if (!check.status) return check.message;

			// Loop through the array
			let rowsFound = [];
			let found = false;
			let obj = false;
			for (let i = 0; i < array.length; i++) {
				// Check if the current object has the key and the value
				if ((key === '*') || (key === '')) {
					let keys = this.Array.ArrayKeys(array[i]);
					for (const ii of keys) {
						if (ilike === 1 && array[i][ii].toString().toLowerCase().indexOf(value) > -1) {
							if (rowsFound.indexOf(i) === -1) {
								const endTime = performance.now(); // Record the end time
								const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
								return {
									"executionTime": executionTime,
									"search_term": value,
									"search_column": key,
									"found_in_column": ii,
									"array_index": i,
									"data": array[i][ii],
									"row": array[i],
								};
							}
						} else if (array[i][key] === value) {
							if (rowsFound.indexOf(i) === -1) {
								const endTime = performance.now(); // Record the end time
								const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
								return {
									"executionTime": executionTime,
									"search_term": value,
									"search_column": key,
									"found_in_column": ii,
									"array_index": i,
									"data": array[i][ii],
									"row": array[i],
								};
							}
						}
					};
				} else {
					if (ilike === 1 && array[i][key].toLowerCase().indexOf(value) > -1) {
						const endTime = performance.now(); // Record the end time
						const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
						return {
							"executionTime": executionTime,
							"search_term": value,
							"search_column": key,
							"found_in_column": key,
							"array_index": i,
							"data": array[i][key],
							"row": array[i],
						};
					} else if (array[i][key] === value) {
						const endTime = performance.now(); // Record the end time
						const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
						return {
							"executionTime": executionTime,
							"search_term": value,
							"search_column": key,
							"found_in_column": key,
							"array_index": i,
							"data": array[i][key],
							"row": array[i],
						};
					}
				}
			}
		}).bind(this),
		"findArrayElementsAll": (function (array, key, value, ilike = 1) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array);
			if (!check.status) return check.message;

			// Loop through the array
			let result = [];
			let resultArray = [];
			let rowsFound = [];
			console.log(arguments);
			for (let i = 0; i < array.length; i++) {
				// Check if the current object has the key and the value
				if ((key === '*') || (key === '')) {
					// console.log('masuk key = *');
					let keys = this.Array.ArrayKeys(array[i]);
					keys.forEach((ii, idx) => {
						if (ilike === 1) {
							if (array[i][ii].toString().toLowerCase().indexOf(value.toLowerCase()) > -1) {
								if (rowsFound.indexOf(i) === -1) {
									rowsFound.push(i);
									result.push({
										"search_term": value,
										"search_column": key,
										"found_in_column": ii,
										"array_index": i,
										"data": array[i][ii],
										"row": array[i],
									});
									resultArray.push(array[i]);
								}
							}
						} else {
							if (this.Strings.SafeString(array[i][ii]) === value) {
								if (rowsFound.indexOf(i) === -1) {
									rowsFound.push(i);
									result.push({
										"search_term": value,
										"search_column": ii,
										"found_in_column": ii,
										"array_index": i,
										"data": array[i][ii],
										"row": array[i],
									});
									resultArray.push(array[i]);
								}
							}
						}
					});
				} else {
					console.log('masuk key = some_string');
					if (ilike === 1 && array[i][key].toString().indexOf(value) > -1) {
						console.log('masuk fuzzy search');
						result.push({
							"search_term": value,
							"search_column": key,
							"found_in_column": key,
							"array_index": i,
							"data": array[i][key],
							"row": array[i],
						});
						resultArray.push(array[i]);
					} else if (array[i][key].toString() === value) {
						console.log('masuk exact search');
						result.push({
							"search_term": value,
							"search_column": key,
							"found_in_column": key,
							"array_index": i,
							"data": array[i][key],
							"row": array[i],
						});
						resultArray.push(array[i]);
					}
				}
			}
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": resultArray,
				"query": result,
				"resume": {
					"rows": resultArray.length,
					"totalrows": array.length,
				},
			};
		}).bind(this),
		"FindArrayElementsAllAdvanced": (function (array, key, Operator, value, ilike = 1, limit = 0) {
			let matchString = (function (Operator, array, i, ii, value, trowsFound, tresult, tresultArray) {
				let rowsFound = trowsFound;
				let result = tresult;
				let resultArray = tresultArray;
				if (this.Operators['string'].indexOf(Operator.toLowerCase()) === -1) {
					console.error("matchString within FindArrayElementsAllAdvanced, Operator is not defined within parameters, submitted operator: " + Operator.toLowerCase() + ", parameters are: " + this.Operators.string.toString());
					return { "status": false, "message": "Operator is not defined within parameters, submitted operator: " + Operator.toLowerCase() + ", parameters are: " + this.Operators.string.toString() };
				}
				function putRowsIn() {
					if (rowsFound.indexOf(i) === -1) {
						rowsFound.push(i);
						result.push({
							"search_term": value,
							"search_column": key,
							"found_in_column": ii,
							"array_index": i,
							"data": array[i][ii],
							"row": array[i],
							"path": [i, ii]  // Add path here
						});
						resultArray.push(array[i]);
					}
				}

				switch (Operator.toLowerCase().trim()) {
					case 'is':
						// console.log('masuk is');
						if (this.Strings.SafeString(array[i][ii]) === value) {
							putRowsIn();
						}
						break;
					case 'is not':
						// console.log('masuk is not');
						if (this.Strings.SafeString(array[i][ii]) !== value) {
							putRowsIn();
						}
						break;
					case 'contains':
						// console.log('masuk contains');
						if (array[i][ii].toString().toLowerCase().indexOf(value.toLowerCase()) > -1) {
							putRowsIn();
						}
						break;
					case 'starts with':
						// console.log('masuk starts with');
						if (array[i][ii].toString().toLowerCase().indexOf(value.toLowerCase()) === 0) {
							putRowsIn();
						}
						break;
					case 'ends with':
						// console.log('masuk ends with');
						let arrStrings = array[i][ii].toString().toLowerCase().split(' ');
						if (arrStrings[arrStrings.length - 1] == value.toLowerCase().trim()) {
							putRowsIn();
						}
						break;
					default:
						break;
				}
				return {
					"rowsFound": rowsFound,
					"result": result
				}
			}).bind(this);

			let matchNumber = (function (Operator, array, i, ii, value, trowsFound, tresult, tresultArray) {
				let rowsFound = trowsFound;
				let result = tresult;
				let resultArray = tresultArray;
				value = parseFloat(value);
				array[i][ii] = parseFloat(array[i][ii]);
				let check_data = this.Booleans.SafeBoolean(array[i][ii]);
				if (this.Operators['number'].indexOf(Operator.toLowerCase()) === -1) {
					console.error("matchNumber within FindArrayElementsAllAdvanced, Operator is not defined within parameters, submitted operator: " + Operator.toLowerCase() + ", parameters are: " + this.Operators.number.tonumber());
					return { "status": false, "message": "Operator is not defined within parameters, submitted operator: " + Operator.toLowerCase() + ", parameters are: " + this.Operators.number.toString() };
				}
				function putRowsIn() {
					if (rowsFound.indexOf(i) === -1) {
						rowsFound.push(i);
						result.push({
							"search_term": value,
							"search_column": key,
							"found_in_column": ii,
							"array_index": i,
							"data": array[i][ii],
							"row": array[i],
							"path": [i, ii]  // Add path here
						});
						resultArray.push(array[i]);
					}
				}

				switch (Operator.toLowerCase().trim()) {
					case ">":
						// console.log('masuk >');
						if (array[i][ii] > value) {
							putRowsIn();
						}
						break;
					case ">=":
						// console.log('>=');
						if (array[i][ii] >= value) {
							putRowsIn();
						}
						break;
					case "=":
						// console.log('masuk =');
						if (array[i][ii] == value) {
							putRowsIn();
						}
						break;
					case "!=":
						// console.log('masuk !=');
						if (array[i][ii] != value) {
							putRowsIn();
						}
						break;
					case "<=":
						// console.log('masuk <=');
						if (array[i][ii] <= value) {
							putRowsIn();
						}
						break;
					case "<":
						// console.log('masuk <');
						if (array[i][ii] < value) {
							putRowsIn();
						}
						break;
					case "contains":
						// console.log('masuk contains');
						if (array[i][ii].toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1) {
							putRowsIn();
						}
						break;
						break;
					default:
						break;
				}
				return {
					"rowsFound": rowsFound,
					"result": result
				}
			}).bind(this);

			let matchBoolean = (function (Operator, array, i, ii, value, trowsFound, tresult, tresultArray) {
				let rowsFound = trowsFound;
				let result = tresult;
				let resultArray = tresultArray;
				value = this.Booleans.SafeBoolean(value);
				array[i][ii] = this.Booleans.SafeBoolean(array[i][ii]);
				// let check_data = this.Booleans.SafeBoolean(array[i][ii]);
				// console.log("check data", array[i][ii], check_data, value);
				// console.log('CHECK >>>>>>', array, i, ii, array[i][ii], value);
				// console.log('check for operator', Operator.toLowerCase(), this.Operators['boolean']);
				// console.log(this.Operators['boolean'].indexOf(Operator.toLowerCase()));
				if (this.Operators['boolean'].indexOf(Operator.toLowerCase()) === -1) {
					console.error("matchNumber within FindArrayElementsAllAdvanced, Operator is not defined within parameters, submitted operator: " + Operator.toLowerCase() + ", parameters are: " + this.Operators.boolean.tonumber());
					return { "status": false, "message": "Operator is not defined within parameters, submitted operator: " + Operator.toLowerCase() + ", parameters are: " + this.Operators.boolean.toString() };
				}
				function putRowsIn() {
					if (rowsFound.indexOf(i) === -1) {
						rowsFound.push(i);
						result.push({
							"search_term": value,
							"search_column": key,
							"found_in_column": ii,
							"array_index": i,
							"data": array[i][ii],
							"row": array[i],
							"path": [i, ii]  // Add path here
						});
						resultArray.push(array[i]);
					}
				}

				switch (Operator.toLowerCase().trim()) {
					case 'is':
						// console.log('masuk is');
						if (array[i][ii] === value) {
							putRowsIn();
						}
						break;
					case 'is not':
						// console.log('masuk is not');
						if (array[i][ii] !== value) {
							putRowsIn();
						}
						break;
					default:
						break;
				}
				return {
					"rowsFound": rowsFound,
					"result": result
				}
			}).bind(this);

			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array);
			if (!check.status) return check.message;

			// Loop through the array
			let result = [];
			let resultArray = [];
			let rowsFound = [];
			let tRes;
			// console.log(arguments);
			let datatype = this.checkType(value);
			// console.log(datatype);

			switch (datatype) {
				case 'DateTime':
					break;
				case 'String':
					// console.log('masuk String datatype');
					for (let i = 0; i < array.length; i++) {
						// Check if the current object has the key and the value
						if ((key === '*') || (key === '')) {
							let keys = this.Array.ArrayKeys(array[i]);
							keys.forEach((ii, idx) => {
								tRes = matchString(Operator, array, i, ii, value, rowsFound, result, resultArray);
							});
						} else {
							tRes = matchString(Operator, array, i, key, value, rowsFound, result, resultArray);
						}
					}
					break;
				case 'Number':
					// console.log('masuk Number datatype', key, value);
					for (let i = 0; i < array.length; i++) {
						// Check if the current object has the key and the value
						if ((key === '*') || (key === '')) {
							let keys = this.Array.ArrayKeys(array[i]);
							keys.forEach((ii, idx) => {
								tRes = matchNumber(Operator, array, i, ii, value, rowsFound, result, resultArray);
							});
						} else {
							tRes = matchNumber(Operator, array, i, key, value, rowsFound, result, resultArray);
						}
					}
					break;
				case 'Boolean':
					// console.log('masuk Boolean datatype');
					for (let i = 0; i < array.length; i++) {
						// Check if the current object has the key and the value
						if ((key === '*') || (key === '')) {
							let keys = this.Array.ArrayKeys(array[i]);
							keys.forEach((ii, idx) => {
								tRes = matchBoolean(Operator, array, i, ii, value, rowsFound, result, resultArray);
							});
						} else {
							tRes = matchBoolean(Operator, array, i, key, value, rowsFound, result, resultArray);
						}
					}
					break;
				case 'Array':
					break;
				case 'Object':
					break;
				case 'null':
					break;
				default:
					break;

			}
			// console.log('resultArray', resultArray);
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": resultArray,
				"query": result,
				"resume": {
					"rows": resultArray.length,
					"totalrows": array.length,
				},
			};
		}).bind(this),
		"dynamicSort": (function (columns, array) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array);
			if (!check.status) return check.message;
			/*
			let People = [
				{Name: "Name", Surname: "Surname"},
				{Name:"AAA", Surname:"ZZZ"},
				{Name: "Name", Surname: "AAA"}
			];
			People.sort(dynamicSort("Name"));
			People.sort(dynamicSort("Surname"));
			People.sort(dynamicSort("-Surname"));

			People.sort(dynamicSortMultiple("Name", "-Surname"));

			*/
			function dynamicSort(property) {
				let sortOrder = 1;
				if (property[0] === "-") {
					sortOrder = -1;
					property = property.substr(1);
				}
				return function (a, b) {
					/* next line works with strings and numbers,
					* and you may want to customize it to your needs
					*/
					let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
					return result * sortOrder;
				}
			}
			function dynamicSortMultiple() {
				/*
				* save the arguments object as it will be overwritten
				* note that arguments object is an array-like object
				* consisting of the names of the properties to sort by
				*/
				let props = arguments;
				return function (obj1, obj2) {
					let i = 0, result = 0, numberOfProperties = props.length;
					/* try getting a different result from 0 (equal)
					* as long as we have extra properties to compare
					*/
					while (result === 0 && i < numberOfProperties) {
						result = dynamicSort(props[i])(obj1, obj2);
						i++;
					}
					return result;
				}
			}
			if (columns.indexOf(',') === -1) {
				let rows = array.sort(dynamicSort(columns));
				const endTime = performance.now(); // Record the end time
				const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
				return {
					"executionTime": executionTime,
					"rows": rows,
				};
			} else {
				const args = columns.split(",").map(arg => arg.trim());
				let rows = array.sort(dynamicSortMultiple(...args));
				const endTime = performance.now(); // Record the end time
				const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
				return {
					"executionTime": executionTime,
					"rows": rows,
				};
			}
		}).bind(this),
		"Pagination": (function (array, pagenum, rows_per_page) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array, 'Array for pagination');
			if (!check.status) return check.message;
			if (this.Numbers.SafeNumber(pagenum) == 0) {
				console.error("Page number paramter is empty");
				return { "status": false, "message": "Page number paramter is empty" };
			}
			if (this.Numbers.SafeNumber(rows_per_page) == 0) {
				console.error("Rows per page paramter is empty");
				return { "status": false, "message": "Rows per page paramter is empty" };
			}

			let tempArray = [];
			let start = (this.Numbers.SafeNumber(pagenum) - 1) * this.Numbers.SafeNumber(rows_per_page);
			let end = this.Numbers.SafeNumber(pagenum) * this.Numbers.SafeNumber(rows_per_page);
			let total = array.length;
			// console.log(start, end, total);
			for (let index = start; index < end; index++) {
				if (index < array.length) tempArray.push(array[index]);
			}
			let page_num = (start <= total) ? pagenum : Math.ceil(array.length / rows_per_page)
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": tempArray,
				"resume": {
					"page": page_num,
					"total_pages": Math.ceil(array.length / rows_per_page),
					"rowsperpage": rows_per_page,
					"totalrows": array.length,
				}
			};
		}).bind(this),
		"RearrangeColumns": (function (Columns, array) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array, 'Array for pagination');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			let tempArray = [];
			array.forEach((d, i, a) => {
				let tempRow = {};
				Columns.forEach((dd) => {
					if (Array.isArray(dd)) {
						tempRow[dd[1]] = d[dd[0]];
					} else {
						tempRow[dd] = d[dd];
					}
				});
				tempArray.push(tempRow);
			});

			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": tempArray,
			};
		}).bind(this),
		"TextDecoration": (function (Columns, array) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array, 'Array for pagination');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			Columns.forEach((dd) => {
				check = this.Array.IsArrayOK(dd, 'Columns cells');
				if (!check.status) return check.message;
			});

			let tempArray = [];
			array.forEach((d, i, a) => {
				let tempRow = d;
				Columns.forEach((dd) => {
					if (!Array.isArray(dd)) return { "status": false, "message": "Array is expected, compraised of Column_name, datatype, and textDecoration_object" };
					if (dd.length >= 2) {
						// console.log(d[dd[0]], dd[1]);
						tempRow[dd[0]] = this.Strings.SafeString(d[dd[0]], dd[1]);
					} else {
						console.error("Request array parameters are not enough, this function need at least 2 parameters which are Column_name and Datatype that you want to cast");
					}

				});
				tempArray.push(tempRow);
			});

			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": tempArray,
			};
		}).bind(this),
		"CastColumnDatatype": (function (Columns, array) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(array, 'Array for pagination');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			Columns.forEach((dd) => {
				check = this.Array.IsArrayOK(dd, 'Columns cells');
				if (!check.status) return check.message;
			});

			let tempArray = [];
			array.forEach((d, i, a) => {
				let tempRow = d;
				Columns.forEach((dd) => {
					if (!Array.isArray(dd)) return { "status": false, "message": "Array is expected, compraised of Column_name, datatype, and textDecoration_object" };
					if (dd.length >= 2) {
						switch (dd[1]) {
							case 'text':
								switch (dd.length) {
									case 2:
										if (dd[0] in d) tempRow[dd[0]] = this.Strings.SafeString(d[dd[0]]);
										break;
									case 3:
										tempRow[dd[0]] = this.Strings.SafeString(d[dd[0]], dd[2]);
										break;
									default:
										console.error('Request array too long, at max this function requires 4 paramteres, Column_name, Datatype, Date_separator, Date_with_time');
										break;
								}
								break;
							case 'number':
								// // console.log('masuk number');
								tempRow[dd[0]] = this.Numbers.SafeNumber(d[dd[0]]);
								break;
							case 'boolean':
								// // console.log('masuk boolean');
								tempRow[dd[0]] = this.Booleans.SafeBoolean(d[dd[0]]);
								break;
							case 'datetime':
								// // console.log('masuk datetime');
								tempRow[dd[0]] = this.Time.SafeDateTime(d[dd[0]]);
								break;
							default:
								console.error('Datatype mismatch: ' + dd[1] + ' > select from [text/number/boolean/datetime]');
								break;
						}
					} else {
						console.error("Request array parameters are not enough, this function need at least 2 parameters which are Column_name and Datatype that you want to cast");
					}

				});
				tempArray.push(tempRow);
			});

			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": tempArray,
			};
		}).bind(this),
		"Average": (function (Columns, Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if (Columns.length == 0) {
				console.error('Columns is expected to have at least 1 elements');
				return { "status": false, "message": "Columns is expected to have at least 1 elements" };
			}
			let avg = {};
			let counter = {};
			Columns.forEach((elements, index, arr) => {
				avg[elements] = 0;
				counter[elements] = 0;
			});
			Dataset.forEach((elements, index, arr) => {
				Columns.forEach((Celements, Cindex, Carr) => {
					if ((Dataset[index][Celements] != null) && (Dataset[index][Celements] != '')) {
						avg[Celements] += this.Numbers.SafeNumber(Dataset[index][Celements]);
						counter[Celements]++;
					}
				});
			});
			let keys = this.Array.ArrayKeys(avg);
			keys.forEach((d, i, a) => {
				avg[d] = this.Numbers.Round3(avg[d] / counter[d]);
			});
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": avg,
			};
		}).bind(this),
		"Min": (function (Columns, Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if (Columns.length == 0) {
				console.error('Columns is expected to have at least 1 elements');
				return { "status": false, "message": "Columns is expected to have at least 1 elements" };
			}
			let min = {};
			Columns.forEach((elements, index, arr) => {
				min[elements] = 999999999999;
			});
			Dataset.forEach((elements, index, arr) => {
				Columns.forEach((Celements, Cindex, Carr) => {
					if ((Dataset[index][Celements] != null) && (Dataset[index][Celements] != '')) {
						let comp = this.Numbers.SafeNumber(Dataset[index][Celements]);
						if (comp < min[Celements]) min[Celements] = comp;
					}
				});
			});
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": min,
			};
		}).bind(this),
		"Max": (function (Columns, Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if (Columns.length == 0) {
				console.error('Columns is expected to have at least 1 elements');
				return { "status": false, "message": "Columns is expected to have at least 1 elements" };
			}
			let max = {};
			Columns.forEach((elements, index, arr) => {
				max[elements] = -999999999999;
			});
			Dataset.forEach((elements, index, arr) => {
				Columns.forEach((Celements, Cindex, Carr) => {
					if ((Dataset[index][Celements] != null) && (Dataset[index][Celements] != '')) {
						let comp = this.Numbers.SafeNumber(Dataset[index][Celements]);
						if (comp > max[Celements]) max[Celements] = comp;
					}
				});
			});
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": max,
			};
		}).bind(this),
		"Count": (function (Columns, Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if (Columns.length == 0) {
				console.error('Columns is expected to have at least 1 elements');
				return { "status": false, "message": "Columns is expected to have at least 1 elements" };
			}
			let counter = {};
			Columns.forEach((elements, index, arr) => {
				counter[elements] = 0;
			});
			Dataset.forEach((elements, index, arr) => {
				Columns.forEach((Celements, Cindex, Carr) => {
					if ((Dataset[index][Celements] != null) && (Dataset[index][Celements] != '')) counter[Celements]++;
				});
			});
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": counter,
			};
		}).bind(this),
		"Sum": (function (Columns, Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if (Columns.length == 0) {
				console.error('Columns is expected to have at least 1 elements');
				return { "status": false, "message": "Columns is expected to have at least 1 elements" };
			}
			let result = {};
			Columns.forEach((elements, index, arr) => {
				result[elements] = 0;
			});
			Dataset.forEach((elements, index, arr) => {
				Columns.forEach((Celements, Cindex, Carr) => {
					if ((Dataset[index][Celements] != null) && (Dataset[index][Celements] != '')) result[Celements] += this.Numbers.SafeNumber(Dataset[index][Celements]);
				});
			});
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": result,
			};
		}).bind(this),
		"OperationsForColumns": (function (Columns, Operator, Dataset, ResultColumn) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if ((Columns.length == 0) && (Columns.length < 2)) {
				console.error("Columns is expected to have at least 2 elements");
				return { "status": false, "message": "Columns is expected to have at least 2 elements" };
			}

			if (typeof Operator == 'undefined') {
				console.error("Operator is not defined");
				return { "status": false, "message": "Operator is not defined" };
			}
			if (typeof Operator != 'string') {
				console.error("Operator is not a string");
				return { "status": false, "message": "Operator is not a string" };
			}
			if ((Operator.length == 0) || (Operator.length > 2)) {
				if (Operator.toLowerCase() != 'concat') {
					console.error("Operator is not one or two characters long");
					return { "status": false, "message": "Operator is not one or two characters long" };
				}
			}

			if (typeof ResultColumn == 'undefined') {
				console.error("ResultColumn is not defined");
				return { "status": false, "message": "ResultColumn is not defined" };
			}
			if (typeof ResultColumn != 'string') {
				console.error("ResultColumn is not a string");
				return { "status": false, "message": "ResultColumn is not a string" };
			}
			if ((ResultColumn.length == 0) || (ResultColumn.length < 2)) {
				console.error("ResultColumn is length must be more than 2 characters");
				return { "status": false, "message": "ResultColumn is length must be more than 2 characters" };
			}

			let TempDataset = [];
			switch (Operator) {
				case "+":
					//This can accept more than 2 columns
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						TempData[ResultColumn] = 0;
						Columns.forEach((elementsC, indexC, arrC) => {
							if (!Number.isNaN(elements[elementsC])) TempData[ResultColumn] += parseFloat(elements[elementsC]);
						});
						TempDataset.push(TempData);
					});
					break;
				case "-":
					//This can accept more than 2 columns
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						TempData[ResultColumn] = Dataset[index][Columns[0]];
						Columns.forEach((elementsC, indexC, arrC) => {
							if (indexC > 0)
								if (!Number.isNaN(elements[elementsC]))
									TempData[ResultColumn] -= parseFloat(elements[elementsC]);
						});
						TempDataset.push(TempData);
					});
					break;
				case "*":
					//This can accept more than 2 columns
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						TempData[ResultColumn] = Dataset[index][Columns[0]];
						Columns.forEach((elementsC, indexC, arrC) => {
							if (indexC > 0)
								if (!Number.isNaN(elements[elementsC]))
									TempData[ResultColumn] *= this.Numbers.Round3(elements[elementsC]);
						});
						TempDataset.push(TempData);
					});
					break;
				case "/":
					//This can accept more than 2 columns
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						TempData[ResultColumn] = Dataset[index][Columns[0]];
						Columns.forEach((elementsC, indexC, arrC) => {
							if (indexC > 0)
								if (!Number.isNaN(elements[elementsC]))
									TempData[ResultColumn] /= this.Numbers.Round3(elements[elementsC]);
						});
						TempDataset.push(TempData);
					});
					break;
				case "%":
					//This can accept more than 2 columns
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						TempData[ResultColumn] = Dataset[index][Columns[0]];
						Columns.forEach((elementsC, indexC, arrC) => {
							if (indexC > 0)
								if (!Number.isNaN(elements[elementsC]))
									TempData[ResultColumn] %= this.Numbers.Round3(elements[elementsC]);
						});
						TempDataset.push(TempData);
					});
					break;
				case "%%":
					//This CANNOT accept more than 2 columns
					if (Columns.length > 2) {
						console.error("Columns is expected to have TWO elements ONLY");
						return { "status": false, "message": "Columns is expected to have TWO elements ONLY" };
					}
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						let ColOneValue = 0;
						let ColTwoValue = 0;
						if (!Number.isNaN(elements[Columns[0]])) ColOneValue = parseFloat(elements[Columns[0]]);
						if (!Number.isNaN(elements[Columns[1]])) ColTwoValue = parseFloat(elements[Columns[1]]);
						TempData[ResultColumn] = (this.Numbers.Round5((ColOneValue / ColTwoValue) * 100)).toString() + '%';
						TempDataset.push(TempData);
					});
					break;
				case "concat":
					//This can accept more than 2 columns
					Dataset.forEach((elements, index, arr) => {
						let TempData = JSON.parse(JSON.stringify(Dataset[index]));
						TempData[ResultColumn] = '';
						Columns.forEach((elementsC, indexC, arrC) => {
							TempData[ResultColumn] += (elements[elementsC]) + ' ';
						});
						TempData[ResultColumn] = TempData[ResultColumn].trim();
						TempDataset.push(TempData);
					});
					break;
			}
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": TempDataset,
			};
		}).bind(this),
		"RunningBalance": (function (Columns, Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Columns, 'Columns');
			if (!check.status) return check.message;

			if ((Columns.length == 0) && (Columns.length < 2)) {
				console.error("Columns is expected to have at least 2 elements");
				return { "status": false, "message": "Columns is expected to have at least 2 elements" };
			}

			let TempDataset = [];
			let Cursor = {};
			Dataset.forEach((elements, index, arr) => {
				let TempData = JSON.parse(JSON.stringify(Dataset[index]));

				Columns.forEach((elementsC, indexC, arrC) => {
					if (typeof Cursor['Balance-' + elementsC] == 'undefined') Cursor['Balance-' + elementsC] = 0;
					Cursor['Balance-' + elementsC] += this.Numbers.SafeNumber(elements[elementsC]);
				});
				Columns.forEach((elementsC, indexC, arrC) => {
					TempData['Running_Balance___' + elementsC] = Cursor['Balance-' + elementsC];
				});
				TempDataset.push(TempData);
			});

			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"rows": TempDataset,
			};
		}).bind(this),
		"DatasetTools": (function (Tools, tDataset) {
			const startTime = performance.now(); // Record the start time
			if ((arguments[0] === 'help') || (arguments[0] === 'h')) {
				return `
	This is the HELP section for DatasetTools

	This method has 2 inputs, [Tools] and [Dataset]

	Definition of Tools array:
		Tools = [
			{
				"Tool": "findArrayElmenetAl",
				"Column_name": "name",
				"Search_value": "rober",
				"FuzzySearch": 1, // or 0 for EXACTLY LOOK FOR 'rober'
			},
			{
				"Tool": "dynamicSort",
				"Column_names": "hire_date", // can accept multiple column names
			},
			{
				"Tool": "RearrangeColumns",
				"Column_array_or_name": [
					"id",
					["name", "nama"],
					["hire_date", "tanggal_kerja"],
					["age", "umur"],
					"wealth",
					"hire_timestamp"
				] //can accept a string, or an array of strings, the first element will be the column_name, the second element will be what the column_name to be renamed to
			},
			{
				"Tool": "OperationsForColumns",
				"Column_array":["umur", "tanggal_kerja", "id"], // can accept multiple column names
				"Operator": "+", // Operator, selections are: [+], [-], [/], [*], {%}, [%%]
				"Column_result":"sum_umur_tanggal_kerja_id", // can accept multiple column names
			},
			{
				"Tool": "RunningBalance",
				"Column_array":["id", "tanggal_kerja"] // can accept multiple column names
			},
			{
				"Tool": "CastColumnDatatype",
				"Column_array": [
					["id", "text"],
					["nama", "text"],
					["tanggal_kerja", "text"],
					["umur", "text"],
					["wealth", "text", textDecorationWealth],
					["hire_timestamp", "text"]
				] //can accept a string, or an array of strings, the first element will be the column_name, the second element will be what the column_name to be renamed to
			},
			{
				"Tool": "Pagination",
				"Page_number": 1,
				"Rows_per_page": 3
			},
			{
				"Tool": "Average",
				"Column_array":["id", "tanggal_kerja"] // can accept multiple column names
			},
			{
				"Tool": "Min",
				"Column_array":["id", "tanggal_kerja"] // can accept multiple column names
			},
			{
				"Tool": "Max",
				"Column_array":["id", "tanggal_kerja"] // can accept multiple column names
			},
			{
				"Tool": "Sum",
				"Column_array":["id", "tanggal_kerja"] // can accept multiple column names
			},
			{
				"Tool":"Count",
				"Column_array":["id", "tanggal_kerja"] // can accept multiple column names
			},
			{
				"Tool": "Parameters",
			}
		]
	Definition of textDecoration object
		textDecoration = {
			"textOverlay": "some string %%% some other string", // %%% is to be replaced by the original column content
			"numberProcessing": {
				"thousandSeparator": true // enable thousand separator on a numeric string
			},
			"datetimeDecoration": {
				"date_separator": "/", // change the date separator, eg: 01-01-2023 or 01/01/2023
				"date_with_time": true // add hour:minutes:seconds to the string converted timestamp
			},
			"booleanReplace":{
				"mode":"sudah" // "ya"/"tidak"/"yes"/"no"/"true"/"false"/"sudah"/"belum"
			}

		}
	Dataset array is a Dataset containing multiple objects containing row data, for example
		Dataset = [
			{
				"id": 1,
				"name": "John Doe",
				"hire_date": 15,
				"hire_timestamp": '15/08/2023',
				"for_operations": 2,
				"wealth":100000000,
				"age": 30,
				"email": "john.doe@example.com",
				"occupation": "Software Engineer",
			},
			{
				"id": 2,
				"name": "Jane Doe",
				"hire_date": 14,
				"hire_timestamp": '14/08/2023',
				"for_operations": 2,
				"wealth":150000000,
				"age": 25,
				"email": "jane.doe@example.com",
				"occupation": "Data Analyst",
			},
			{
				"id": 3,
				"name": "Emily Smith",
				"hire_date": 13,
				"hire_timestamp": '13/08/2023',
				"for_operations": 3,
				"wealth":200000000,
				"age": 22,
				"email": "emily.smith@example.com",
				"occupation": "Student",
			}
		]
	The output of this method is an object containing 2 elements, executionTime is the time required to complete the method, and rows is an array containing objects containing row dataset.
	Example of result
		result = {
			executionTime: 1.676200032234192,
			rows: [
				{
					id: 1,
					name: 'MISTER John Doe',
					hire_date: 15,
					hire_timestamp: '2023-08-14T17:00:00.000Z',
					for_operations: 2,
					wealth: 'IDR 100,000,000',
					age: 30,
					email: 'john.doe@example.com',
					occupation: 'Software Engineer',
					tanggal_kerja: { status: false, message: 'Input datatype is unknown' },
					Running_Balance___id: 1,
					Running_Balance___age: 30,
					Running_Balance___for_operations: 2
				},
				{
					id: 2,
					name: 'MISTER Jane Doe',
					hire_date: 14,
					hire_timestamp: '2023-08-13T17:00:00.000Z',
					for_operations: 2,
					wealth: 'IDR 150,000,000',
					age: 25,
					email: 'jane.doe@example.com',
					occupation: 'Data Analyst',
					tanggal_kerja: { status: false, message: 'Input datatype is unknown' },
					Running_Balance___id: 3,
					Running_Balance___age: 55,
					Running_Balance___for_operations: 4
				},
				{
					id: 3,
					name: 'MISTER Emily Smith',
					hire_date: 13,
					hire_timestamp: '2023-08-12T17:00:00.000Z',
					for_operations: 3,
					wealth: 'IDR 200,000,000',
					age: 22,
					email: 'emily.smith@example.com',
					occupation: 'Student',
					tanggal_kerja: { status: false, message: 'Input datatype is unknown' },
					Running_Balance___id: 6,
					Running_Balance___age: 77,
					Running_Balance___for_operations: 7
				}
			]
		}
`
			}
			let Methods = (function (tool, Dataset) {
				switch (tool.Tool) {
					case "findArrayElmenetAll":
						return this.Array.findArrayElementsAll(Dataset.rows, tool.Column_name, tool.Search_value, tool.FuzzySearch);
						break;
					case "FindArrayElementsAllAdvanced":
						return this.Array.FindArrayElementsAllAdvanced(Dataset.rows, tool.Column_name, tool.Operator, tool.Search_value, tool.Limit);
						break;
					case "dynamicSort":
						return this.Array.dynamicSort(tool.Column_names, Dataset.rows);
						break;
					case "RearrangeColumns":
						return this.Array.RearrangeColumns(tool.Column_array_or_name, Dataset.rows);
						break;
					case "CastColumnDatatype":
						return this.Array.CastColumnDatatype(tool.Column_array, Dataset.rows);
						break;
					case "TextDecoration":
						return this.Array.TextDecoration(tool.Column_array, Dataset.rows);
						break;
					case "OperationsForColumns":
						return this.Array.OperationsForColumns(tool.Column_array, tool.Operator, Dataset.rows, tool.Column_result);
						break;
					case "Average":
						Dataset.rows.push(this.Array.Average(tool.Column_array, Dataset.rows).rows);
						return Dataset;
						break;
					case "Min":
						Dataset.rows.push(this.Array.Min(tool.Column_array, Dataset.rows).rows);
						return Dataset;
						break;
					case "Max":
						Dataset.rows.push(this.Array.Max(tool.Column_array, Dataset.rows).rows);
						return Dataset;
						break;
					case "Sum":
						Dataset.rows.push(this.Array.Sum(tool.Column_array, Dataset.rows).rows);
						return Dataset;
						break;
					case "Count":
						Dataset.rows.push(this.Array.Count(tool.Column_array, Dataset.rows).rows);
						return Dataset;
						break;
					case "RunningBalance":
						return this.Array.RunningBalance(tool.Column_array, Dataset.rows);
						break;
					case "Pagination":
						return this.Array.Pagination(Dataset.rows, tool.Page_number, tool.Rows_per_page);
						break;
					case "Parameters":
						return this.Array.Parameters(Dataset.rows);
						break;
					case "AppendRow":
						return this.Array.Parameters(Dataset.rows);
						break;
					default:
						break;
				}

			}).bind(this);

			let check = this.Array.IsArrayOK(tDataset, 'Dataset');
			if (!check.status) return check.message;

			check = this.Array.IsArrayOK(Tools, 'Tools');
			if (!check.status) return check.message;

			let Dataset = { rows: tDataset };

			Tools.forEach((d, i) => {
				Dataset = Methods(d, Dataset);
			});

			// console.log('Dataset >>>>>', Dataset);
			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"result": Dataset,
			};
		}).bind(this),
		"Parameters": (function (Dataset) {
			const startTime = performance.now(); // Record the start time
			let check = this.Array.IsArrayOK(Dataset, 'Dataset');
			if (!check.status) return check.message;

			let total_fields = {
				"count": 0,
				"idx": 0,
				"columns": [],
				"shortest_count": false,
				"shortest_idx": false,
			};
			Dataset.forEach((d, i) => {
				let keys = this.Array.ArrayKeys(d);
				if (total_fields.count < keys.length) {
					total_fields = {
						count: keys.length,
						idx: i,
						columns: keys,
						shortest_count: total_fields.shortest_count,
					};
				}
				if (!total_fields.shortest_count) {
					total_fields.shortest_count = keys.length;
					total_fields.shortest_idx = i;
				}

				if (total_fields.shortest_count > keys.length) {
					total_fields.shortest_count = keys.length;
					total_fields.shortest_idx = i;
				}
			});

			const endTime = performance.now(); // Record the end time
			const executionTime = endTime - startTime; // Calculate and store the elapsed time in milliseconds
			return {
				"executionTime": executionTime,
				"parameters": {
					"total_rows": Dataset.length,
					"total_columns": total_fields.count,
					"longest_column_row_idx": total_fields.idx,
					"shortest_column_row_count": total_fields.shortest_count,
					"shortest_column_row_idx": total_fields.shortest_idx,
					"column_names": total_fields.columns,
				},
				"rows": Dataset,
			};
		}).bind(this),
	}
	// NOTE - Passwords related methods
	Passwords = {
		"generateRandomString": async (length, characterSet) => {
			let randomString = '';
			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * characterSet.length);
				randomString += characterSet[randomIndex];
			}
			return randomString;
		},

		"generateSalt": async () => {
			const array = new Uint8Array(16); // 16 bytes salt
			crypto.getRandomValues(array);
			return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
		},

		"hashPassword": async (password, salt) => {
			const encoder = new TextEncoder();
			const data = encoder.encode(salt + password); // Combine salt and password
			const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Perform SHA-256 hashing
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
		},

		"generateSecurePassword": async () => {
			// Generate random password
			const randomPassword = await this.Passwords.generateRandomString(this.passwordLength, this.characterSet);
			// console.log(`Randomly generated password: ${randomPassword}`);

			// Generate random salt
			const salt = await this.Passwords.generateSalt();
			// console.log(`Generated salt: ${salt}`);

			// Hash the random password with the salt
			const hashedPassword = await this.Passwords.hashPassword(randomPassword, salt);
			// console.log(`Hashed Password: ${hashedPassword}`);

			return {
				randomPassword,
				salt,
				hashedPassword
			};
		}
	};
	// NOTE - Time related methods
	Time = {
		"mode": "dmy",
		"parseDateParts": function (dateParts, defaultMode) {
			let parsed = {};
			// console.log(dateParts.length);
			switch (defaultMode) {
				case 'DMY':
					// console.log('masuk DMY');
					if (dateParts.length == 6) {
						[parsed.day, parsed.month, parsed.year] = dateParts.slice(0, 3).map(Number);
						[parsed.hour, parsed.minute, parsed.second] = dateParts.slice(3).map(Number);
					} else if (dateParts.length == 3) {
						[parsed.day, parsed.month, parsed.year] = dateParts.slice(0, 3).map(Number);
					}
					break;
				case 'MDY':
					// console.log('masuk MDY');
					if (dateParts.length == 6) {
						[parsed.month, parsed.day, parsed.year] = dateParts.slice(0, 3).map(Number);
						[parsed.hour, parsed.minute, parsed.second] = dateParts.slice(3).map(Number);
					} else if (dateParts.length == 3) {
						[parsed.month, parsed.day, parsed.year] = dateParts.slice(0, 3).map(Number);
					}
					break;
				case 'YMD':
					// console.log('masuk YMD');
					if (dateParts.length == 6) {
						[parsed.year, parsed.month, parsed.day] = dateParts.slice(0, 3).map(Number);
						[parsed.hour, parsed.minute, parsed.second] = dateParts.slice(3).map(Number);
					} else if (dateParts.length == 3) {
						[parsed.year, parsed.month, parsed.day] = dateParts.slice(0, 3).map(Number);
					}
					break;
				default:
					// console.log('masuk INVALID');
					return { status: false, message: 'Invalid parse defaultMode' };
			}
			return parsed;
		},
		"SafeDateTime": (function (input, zdefaultMode = this.Time.mode) {
			if (input instanceof Date && !isNaN(input)) {
				return input;
			}

			if (typeof input === 'number' && !isNaN(new Date(input))) {
				return new Date(input);
			}

			if (typeof input === 'string') {
				let pattern, dateOnlyPattern = null;
				input = input.trim();
				let defaultMode = zdefaultMode.toUpperCase();
				switch (defaultMode) {
					case 'DMY':
						// console.log('masuk DMY');
						pattern = /^(\d{2})[\/-](\d{2})[\/-](\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
						dateOnlyPattern = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
						break;
					case 'MDY':
						// console.log('masuk MDY');
						pattern = /^(\d{2})[\/-](\d{2})[\/-](\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
						dateOnlyPattern = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
						break;
					case 'YMD':
						// console.log('masuk YMD');
						pattern = /^(\d{4})[\/-](\d{2})[\/-](\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
						dateOnlyPattern = /^(\d{4})[\/-](\d{2})[\/-](\d{2})$/;
						break;
					default:
						// console.log('masuk INVALID');
						return { status: false, message: 'Invalid defaultMode' };
				}

				const match = input.match(pattern) || input.match(dateOnlyPattern);

				if (match) {
					let [, ...dateParts] = match;
					let parsed = {};
					// console.log(dateParts.length);
					if (dateParts.length === 6 || dateParts.length === 3) {
						parsed = this.Time.parseDateParts(dateParts, defaultMode);
					}
					// console.log(parsed);
					// console.log(typeof parsed);

					let dateTime;
					// console.log(parsed);
					if ('hour' in parsed) {
						// console.log('masuk ada hour e');
						dateTime = new Date(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute, parsed.second);
					} else {
						// console.log('masuk tanpa hour');
						dateTime = new Date(parsed.year, parsed.month - 1, parsed.day);
					}

					if (!isNaN(dateTime)) {
						return dateTime;
					}
				}
			}

			const convertedDateTime = new Date(input);
			if (!isNaN(convertedDateTime)) {
				return convertedDateTime;
			}

			return { status: false, message: 'Input is not a valid date or datetime' };
		}).bind(this),
		"initDate": (function (date, mode = this.Time.mode) {
			let arrayDate;
			let arrayTime;
			switch (mode) {
				case "dmy":
					if (typeof date == 'string') {
						if (date.length > 10) {
							arrayDate = date.split(' ');
							arrayTime = arrayDate[1];
							arrayDate = arrayDate[0];
							arrayDate = arrayDate.split(arrayDate[2]);
							arrayTime = arrayTime.split(arrayTime[2]);
						} else {
							arrayDate = date.split(date[2]);
						}
						return new Date(Date.UTC(arrayDate[2], arrayDate[1] - 1, arrayDate[0], arrayTime[0], arrayTime[1], arrayTime[2]));
					} else if (typeof date == 'number') {
						return new Date(Date.UTC(date));
					}
					break;
				case "ymd":
					arrayDate = date.split(date[4]);
					return new Date(Date.UTC(arrayDate[0], arrayDate[1], arrayDate[2]));
					break;
				case "mdy":
					arrayDate = date.split(date[2]);
					return new Date(Date.UTC(arrayDate[2], arrayDate[0], arrayDate[1]));
					break;
			}
		}).bind(this),
		"addDays": (function (date, days) {
			let result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		}).bind(this),
		"subDays": (function (date, days) {
			let result = new Date(date);
			result.setDate(result.getDate() - days);
			return result;
		}).bind(this),
		"formatDate": (function (date, mode = this.Time.mode) {
			switch (mode) {
				case "dmy": return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
				case "ymd": return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
				case "mdy": return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
			}
		}).bind(this),
		"getNow": (function (mode = this.Time.mode) {
			return new Date;
		}).bind(this),
		"getNowDateTimeString": (function (mode = this.Time.mode) {
			const currentDate = new Date();

			// Get day, month, and year
			const day = currentDate.getDate();
			const month = currentDate.getMonth() + 1; // Note: Month is zero-based
			const year = currentDate.getFullYear();

			// Get hours, minutes, and seconds
			const hours = currentDate.getHours();
			const minutes = currentDate.getMinutes();
			const seconds = currentDate.getSeconds();
			const milliseconds = currentDate.getMilliseconds();

			// Add leading zeros if needed
			const formattedDay = day < 10 ? '0' + day : day;
			const formattedMonth = month < 10 ? '0' + month : month;
			const formattedHours = hours < 10 ? '0' + hours : hours;
			const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
			const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

			// Format the milliseconds with leading zeros
			const formattedMilliseconds =
				milliseconds < 10
					? '00' + milliseconds
					: milliseconds < 100
						? '0' + milliseconds
						: milliseconds;

			// Create the formatted date string
			let formattedDate;
			switch (mode.toLowerCase()) {
				case 'dmy':
					formattedDate = `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
					break;
				case 'ymd':
					formattedDate = `${year}/${formattedMonth}/${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
					break;
				case 'mdy':
					formattedDate = `${formattedMonth}/${formattedDay}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
					break;
			}
			return formattedDate;
		}).bind(this),
		"getToday": (function (mode = this.Time.mode) {
			return this.Time.formatDate(new Date, mode);
		}).bind(this),
		"getTodayDate": (function (mode = this.Time.mode) {
			return new Date().getDate();
		}).bind(this),
		"getTodayDayOfWeek": (function (mode = this.Time.mode) {
			return new Date().getDay();
		}).bind(this),
		"getTodayWeek": (function (mode = this.Time.mode) {
			return new Date().getWeek();
		}).bind(this),
		"getTodayMonth": (function (datetime, mode = this.Time.mode) {
			return new Date().getMonth() + 1;
		}).bind(this),
		"getTodayYear": (function (datetime, mode = this.Time.mode) {
			return new Date().getFullYear();
		}).bind(this),
		"getTomorrow": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.Time.addDays(date, 1);
		}).bind(this),
		"getYesterday": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.Time.addDays(date, -1);
		}).bind(this),
		"getNextWeek": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.Time.addDays(date, 7);
		}).bind(this),
		"getNextWeekStart": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			let nextWeek = this.Time.addDays(date, 7);
			let day = (nextWeek.getDay()) * -1;
			return this.Time.addDays(nextWeek, day + 1);
		}).bind(this),
		"getNextWeekEnd": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			let nextWeek = this.Time.addDays(date, 7);
			let day = (nextWeek.getDay() * -1) + 7;
			return this.Time.addDays(nextWeek, day);
		}).bind(this),
		"getLastWeek": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return this.Time.addDays(date, -7);
		}).bind(this),
		"getLastWeekStart": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			let nextWeek = this.Time.addDays(date, -7);
			let day = (nextWeek.getDay()) * -1;
			return this.Time.addDays(nextWeek, day + 1);
		}).bind(this),
		"getLastWeekEnd": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			let nextWeek = this.Time.addDays(date, -7);
			let day = (nextWeek.getDay() * -1) + 7;
			return this.Time.addDays(nextWeek, day);
		}).bind(this),
		"getNextMonthStart": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() + 1, 1);
		}).bind(this),
		"getNextMonthEnd": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() + 2, 0);
		}).bind(this),
		"getLastMonth": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() - 1, 1);
		}).bind(this),
		"getLastMonthStart": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth() - 1, 1);
		}).bind(this),
		"getLastMonthEnd": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear(), date.getMonth(), 0);
		}).bind(this),
		"getLastYear": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear() - 1, date.getMonth() + 1, 0);
		}).bind(this),
		"getNextYear": (function (datetime, mode = this.Time.mode) {
			let date = new Date;
			if (typeof datetime != 'undefined') date = datetime;
			return new Date(date.getFullYear() + 1, date.getMonth() + 1, 0);
		}).bind(this),
		"getDiff": {
			inSeconds: (function (d1, d2) {
				// console.log(arguments);
				let t2 = d2.getTime();
				let t1 = d1.getTime();

				return parseFloat((t2 - t1) / 1000);
			}).bind(this),
			inMinutes: (function (d1, d2) {
				let t2 = d2.getTime();
				let t1 = d1.getTime();

				return parseFloat((t2 - t1) / 60000);
			}).bind(this),
			inHours: (function (d1, d2) {
				let t2 = d2.getTime();
				let t1 = d1.getTime();

				return parseFloat((t2 - t1) / 3600000);
			}).bind(this),
			inDays: (function (d1, d2) {
				let t2 = d2.getTime();
				let t1 = d1.getTime();

				return parseFloat((t2 - t1) / (24 * 3600 * 1000));
			}).bind(this),
			inWeeks: (function (d1, d2) {
				let t2 = d2.getTime();
				let t1 = d1.getTime();
				return parseFloat((t2 - t1) / (24 * 3600 * 1000 * 7));
			}).bind(this),
			inMonths: (function (d1, d2) {
				let d1Y = d1.getFullYear();
				let d2Y = d2.getFullYear();
				let d1M = d1.getMonth();
				let d2M = d2.getMonth();
				return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
			}).bind(this),
			inYears: (function (d1, d2) {
				return d2.getFullYear() - d1.getFullYear();
			}).bind(this)
		}
	};
	// NOTE - Window related methods
	Window = {
		"popUp": function (URL) {
			let reUA = /MSIE/;
			if (reUA.test(navigator.userAgent)) {
				let $w = document.body.offsetWidth;
				let $h = document.body.offsetHeight;

			} else {
				let $w = window.outerWidth;
				let $h = window.outerHeight;
			}
			let day = new Date();
			let id = day.getTime();
			eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=" + $w + ",height=" + $h + ",left = 0,top = 0');");
		},
		"PrintElem": function (title, str, style, print, autoclose) {
			let mywindow = window.open('', 'PRINT', 'height=400,width=600');

			mywindow.document.write('<html><head>');
			mywindow.document.write('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
			mywindow.document.write('<meta charset="utf-8">');
			mywindow.document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
			mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');

			mywindow.document.write('<title>PARADIGM REVOLUTION > Print</title>');

			mywindow.document.write('<script type="text/javaScript">');
			mywindow.document.write('$(document).ready(function(){');
			if ((arguments.length >= 4) && (print)) {
				mywindow.document.write("window.print();");
			}
			if ((arguments.length >= 5) && (autoclose)) {
				mywindow.document.write("setTimeout(function() {parent = window.self;parent.opener = window.self;parent.close();}, 1000);");
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
		}
	};
	DOMComponents = {
		
	};
	// NOTE - DOMElements related methods
	DOMElements = {
		"viewToggle": ((element, callback) => {
			// Check if the element is currently hidden
			const isHidden = element.classList.contains('hidden') || getComputedStyle(element).height === '0px' || getComputedStyle(element).opacity === '0';

			if (isHidden) {
				// If the element is hidden, show it
				element.classList.remove('hidden');
				element.style.height = '0'; // Start from height 0
				element.style.opacity = '0'; // Start from opacity 0

				// Trigger a reflow
				void element.offsetHeight;

				const autoHeight = element.scrollHeight + 'px';
				element.style.transition = 'opacity 1s cubic-bezier(0, 0, 0, 1), height 0.5s cubic-bezier(0, 0, 0, 1)';
				element.style.height = autoHeight;
				element.style.opacity = '1';

				element.addEventListener('transitionend', function handler(e) {
					if (e.propertyName === 'height') {
						element.style.height = 'auto'; // Set height to auto after transition
						element.style.transition = ''; // Clear transition
						element.removeEventListener('transitionend', handler);
						if (callback) callback();
					}
				});
			} else {
				// If the element is visible, hide it
				const originalHeight = element.scrollHeight + 'px';

				element.style.height = originalHeight; // Set to original height
				element.style.opacity = '1'; // Ensure opacity is at 1

				// Trigger a reflow
				void element.offsetHeight;

				element.style.transition = 'opacity 1s cubic-bezier(0, 0, 0, 1), height 0.5s cubic-bezier(0, 0, 0, 1)';
				element.style.height = '0';
				element.style.opacity = '0';

				element.addEventListener('transitionend', function handler(e) {
					if (e.propertyName === 'height') {
						element.classList.add('hidden');
						element.style.transition = ''; // Clear transition
						element.removeEventListener('transitionend', handler);
						if (callback) callback();
					}
				});
			}
		}),
		"hide": ((element, callback) => {
			const originalHeight = element.scrollHeight + 'px';

			element.style.height = originalHeight; // Set to original height
			element.style.opacity = '1'; // Ensure opacity is at 1

			// Trigger a reflow
			void element.offsetHeight;

			element.style.transition = 'opacity 1s cubic-bezier(0, 0, 0, 1), height 0.5s cubic-bezier(0, 0, 0, 1)';
			element.style.height = '0';
			element.style.opacity = '0';

			element.addEventListener('transitionend', function handler(e) {
				if (e.propertyName === 'height') {
					element.classList.add('hidden');
					element.style.transition = ''; // Clear transition
					if (callback) callback();
				}
				element.removeEventListener('transitionend', handler);
			});
			if (originalHeight == '0px') {
				if (callback) callback();
			}
		}),
		"show": ((element, callback) => {
			element.classList.remove('hidden');
			const autoHeight = element.scrollHeight + 'px';

			// Capture initial styles
			const initialHeight = element.style.height;
			const initialOpacity = element.style.opacity;

			element.style.height = '0'; // Start from height 0
			element.style.opacity = '0'; // Start from opacity 0

			// Trigger a reflow
			void element.offsetHeight;

			element.style.transition = 'opacity 1s cubic-bezier(0, 0, 0, 1), height 0.5s cubic-bezier(0, 0, 0, 1)';
			element.style.height = autoHeight;
			element.style.opacity = '1';

			// Fallback timeout to check if the transition started
			let transitionStarted = false;
			const checkTransitionStart = setTimeout(() => {
				const computedStyle = getComputedStyle(element);
				if (computedStyle.height !== initialHeight || computedStyle.opacity !== initialOpacity) {
					transitionStarted = true;
				} else {
					// Transition didn't start, call the callback
					if (callback) callback();
				}
			}, 50); // 50ms delay to check if transition started

			// Set a fallback timeout to call the callback if transitionend doesn't fire
			const fallbackTimeout = setTimeout(() => {
				if (!transitionStarted) {
					element.style.height = 'auto'; // Set height to auto if timeout happens
					element.style.transition = ''; // Clear transition
					if (callback) callback();
				}
			}, 1000); // Max transition time in milliseconds (1s for opacity)

			element.addEventListener('transitionend', function handler(e) {
				if (e.propertyName === 'height') {
					element.style.height = 'auto'; // Set height to auto after transition
					element.style.transition = ''; // Clear transition
					transitionStarted = true;
					clearTimeout(fallbackTimeout); // Clear the fallback timeout
				}
				element.removeEventListener('transitionend', handler);
				if (callback) callback();
			});
		}),
		"addEventOnce": function (element, eventName, eventHandler) {
			const eventKey = `data-event-${eventName}-initialized`;

			// Check if the element already has the event marker
			if (element.hasAttribute(eventKey)) {
				return; // Event is already initialized, do nothing
			}

			// Add the event handler
			element.addEventListener(eventName, eventHandler);

			// Add the marker attribute to the element
			element.setAttribute(eventKey, 'true');

			// Add a function to remove the event
			element.removeEvent = function () {
				element.removeEventListener(eventName, eventHandler);
				element.removeAttribute(eventKey);
				delete element.removeEvent;
			};
		},
		"detectLightDarkMode": function () {
			return window.matchMedia('(prefers-color-scheme: dark)');
		},
		"hasScrollbars": function (element) {
			// Check horizontal scrollbar
			const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;

			// Check vertical scrollbar
			const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;

			return {
				horizontal: hasHorizontalScrollbar,
				vertical: hasVerticalScrollbar,
			};
		}, "initializeDragAndSelect": ((options = {}, selectedDivs) => {
			const { snapSize = 20, containerSelector = '.container', itemSelector = '.selectable' } = options;

			const container = document.querySelector(containerSelector);
			let selectedItems = selectedDivs;
			let isDraggingSelection = false;
			let isDraggingItem = false;
			let isResizing = false;
			let startX, startY, currentX, currentY;
			let selectionBox = null;
			let initialPositions = new Map();
			const minDragDistance = 5; // Minimum distance to consider as a drag

			function snapToGrid(value, gridSize) {
				return Math.round(value / gridSize) * gridSize;
			}

			function toggleSelection(item) {
				if (selectedItems.has(item)) {
					item.classList.remove('active');
					selectedItems.delete(item);
				} else {
					item.classList.add('active');
					selectedItems.add(item);
				}
				console.log(Array.from(selectedItems));  // Log selected items for debugging
				monitorSelection(selectedItems, "#selected_elements_status");
			}

			function startDraggingSelection(event) {
				isDraggingSelection = true;

				// Calculate the mouse position relative to the container
				const containerRect = container.getBoundingClientRect();
				startX = event.clientX - containerRect.left + container.scrollLeft;
				startY = event.clientY - containerRect.top + container.scrollTop;

				selectionBox = null;  // Do not create the selection box immediately
			}

			function updateSelectionBox(event) {
				if (!isDraggingSelection) return;

				// Calculate the current mouse position relative to the container
				const containerRect = container.getBoundingClientRect();
				currentX = event.clientX - containerRect.left + container.scrollLeft;
				currentY = event.clientY - containerRect.top + container.scrollTop;

				// Calculate the distance moved
				const dx = Math.abs(currentX - startX);
				const dy = Math.abs(currentY - startY);

				// Check if the movement exceeds the minimum drag distance
				if (dx >= minDragDistance || dy >= minDragDistance) {
					// Create the selection box if it hasn't been created yet
					if (!selectionBox) {
						selectionBox = document.createElement('div');
						selectionBox.className = 'selection-box';
						container.appendChild(selectionBox);
					}

					selectionBox.style.left = `${Math.min(startX, currentX)}px`;
					selectionBox.style.top = `${Math.min(startY, currentY)}px`;
					selectionBox.style.width = `${dx}px`;
					selectionBox.style.height = `${dy}px`;

					const rect = selectionBox.getBoundingClientRect();

					document.querySelectorAll(itemSelector).forEach(item => {
						const itemRect = item.getBoundingClientRect();
						if (rect.right >= itemRect.left &&
							rect.left <= itemRect.right &&
							rect.bottom >= itemRect.top &&
							rect.top <= itemRect.bottom) {
							if (!selectedItems.has(item)) {
								item.classList.add('active');
								selectedItems.add(item);
							}
						} else {
							if (selectedItems.has(item)) {
								item.classList.remove('active');
								selectedItems.delete(item);
							}
						}
					});
				}
			}

			function finalizeSelection() {
				isDraggingSelection = false;
				if (selectionBox) {
					selectionBox.remove();
					selectionBox = null;
				}
				console.log(Array.from(selectedItems));  // Log selected items for debugging
				monitorSelection(selectedItems, "#selected_elements_status");
			}

			function monitorSelection(selectedItems, monitorDiv) {
				let arrSelected = Array.from(selectedItems);
				let str = '';
				console.log('arrSelected :>> ', arrSelected);
				arrSelected.forEach(item => {
					console.log(item.innerHTML);
					str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary runtime-controls-button" id="" title="">${item.innerHTML}</button>`;
				});
				document.querySelector(monitorDiv).innerHTML = str;
			}

			function startDraggingItem(event, item) {
				if (!selectedItems.has(item)) {
					selectedItems.forEach(selectedItem => {
						selectedItem.classList.remove('active');
					});
					selectedItems.clear();
					selectedItems.add(item);
					item.classList.add('active');
				}

				isDraggingItem = true;
				startX = event.clientX;
				startY = event.clientY;

				selectedItems.forEach(selectedItem => {
					initialPositions.set(selectedItem, {
						left: selectedItem.offsetLeft,
						top: selectedItem.offsetTop
					});
				});
			}

			function dragItem(event) {
				const dx = event.clientX - startX;
				const dy = event.clientY - startY;

				selectedItems.forEach(item => {
					const initialPosition = initialPositions.get(item);
					item.style.left = `${snapToGrid(initialPosition.left + dx, snapSize)}px`;
					item.style.top = `${snapToGrid(initialPosition.top + dy, snapSize)}px`;
				});
			}

			function stopDraggingItem() {
				isDraggingItem = false;
				initialPositions.clear();
				console.log(Array.from(selectedItems));  // Log selected items for debugging
			}

			function deselectAll() {
				selectedItems.forEach(item => {
					item.classList.remove('active');
				});
				selectedItems.clear();
				console.log(Array.from(selectedItems));  // Log selected items for debugging

				// FORCE RESET SELECTION
				const selectableItems = document.querySelectorAll(itemSelector);
				selectableItems.forEach(item => {
					item.classList.remove('active');
				});
				monitorSelection(selectedItems, "#selected_elements_status");
			}

			function setupEventListeners() {
				const selectableItems = document.querySelectorAll(itemSelector);

				selectableItems.forEach(item => {
					item.addEventListener('mousedown', (event) => {
						console.log('mousedown');
						const resizeHandleSize = 10;
						const rect = item.getBoundingClientRect();

						if (event.clientX >= rect.right - resizeHandleSize && event.clientY >= rect.bottom - resizeHandleSize) {
							isResizing = true;
							item.style.cursor = 'se-resize';
						} else {
							isResizing = false;
							item.style.cursor = 'pointer';
							if (event.ctrlKey || event.metaKey) {
								toggleSelection(event.target);
							} else if (selectedItems.has(event.target)) {
								startDraggingItem(event, item);
							} else {
								deselectAll();
								toggleSelection(event.target);
								startDraggingItem(event, item);
							}
						}
						event.stopPropagation();
					});

					item.addEventListener('mousemove', (event) => {
						const resizeHandleSize = 10;
						const rect = item.getBoundingClientRect();
						if (event.clientX >= rect.right - resizeHandleSize && event.clientY >= rect.bottom - resizeHandleSize) {
							item.style.cursor = 'se-resize';
						} else {
							item.style.cursor = 'pointer';
						}
					});

					item.addEventListener('mouseup', () => {
						isResizing = false;
					});
				});

				container.addEventListener('mousedown', (event) => {
					if (!event.ctrlKey && !event.metaKey && !event.target.classList.contains(itemSelector.substring(1))) {
						deselectAll();
						startDraggingSelection(event);
					}
				});

				container.addEventListener('mousemove', (event) => {
					if (isDraggingSelection) {
						updateSelectionBox(event);
					} else if (isDraggingItem) {
						dragItem(event);
					}
				});

				container.addEventListener('mouseup', () => {
					if (isDraggingSelection) {
						finalizeSelection();
					} else if (isDraggingItem) {
						stopDraggingItem();
					}
				});
			}

			setupEventListeners();

			return {
				reinitialize() {
					console.log('Start debug initializeDragAndSelect');
					console.log('snapSize :>> ', snapSize);
					console.log('containerSelector :>> ', containerSelector);
					console.log('itemSelector :>> ', itemSelector);
					console.log('selectedDivs :>> ', selectedDivs);

					// Call deselectAll before reinitializing
					deselectAll();

					// Remove all previous event listeners and reinitialize
					const selectableItems = document.querySelectorAll(itemSelector);
					selectableItems.forEach(item => {
						item.removeEventListener('mousedown', startDraggingItem);
						item.removeEventListener('mousemove', (event) => { /* Add corresponding event listener removal logic here */ });
						item.removeEventListener('mouseup', () => { /* Add corresponding event listener removal logic here */ });
					});

					container.removeEventListener('mousedown', startDraggingSelection);
					container.removeEventListener('mousemove', updateSelectionBox);
					container.removeEventListener('mouseup', finalizeSelection);

					setupEventListeners();
				},
				addItem(html) {
					deselectAll();
					container.insertAdjacentHTML('beforeend', html);
					this.reinitialize();
				},
				removeItem(item) {
					deselectAll();
					item.remove();
					this.reinitialize();
				}
			};
		}),

		"initializeDragAndSelectV2": ((options = {}, selectedDivs) => {
			const { snapSize = 20, containerSelector = '.container', itemSelector = '.selectable' } = options;

			const container = document.querySelector(containerSelector);
			let selectedItems = selectedDivs;
			let isDraggingSelection = false;
			let isDraggingItem = false;
			let isResizing = false;
			let startX, startY, currentX, currentY;
			let selectionBox = null;
			let initialPositions = new Map();
			const minDragDistance = 5; // Minimum distance to consider as a drag

			function snapToGrid(value, gridSize) {
				return Math.round(value / gridSize) * gridSize;
			}

			function toggleSelection(item) {
				if (selectedItems.has(item)) {
					item.classList.remove('active');
					selectedItems.delete(item);
				} else {
					item.classList.add('active');
					selectedItems.add(item);
				}
				console.log(Array.from(selectedItems));  // Log selected items for debugging
				monitorSelection(selectedItems, "#selected_elements_status");
			}

			function startDraggingSelection(event) {
				isDraggingSelection = true;

				// Calculate the mouse position relative to the container
				const containerRect = container.getBoundingClientRect();
				startX = event.pageX - containerRect.left + container.scrollLeft;
				startY = event.pageY - containerRect.top + container.scrollTop;

				selectionBox = null;  // Do not create the selection box immediately
			}

			function updateSelectionBox(event) {
				if (!isDraggingSelection) return;

				// Calculate the current mouse position relative to the container
				const containerRect = container.getBoundingClientRect();
				currentX = event.pageX - containerRect.left + container.scrollLeft;
				currentY = event.pageY - containerRect.top + container.scrollTop;

				// Calculate the distance moved
				const dx = Math.abs(currentX - startX);
				const dy = Math.abs(currentY - startY);

				// Check if the movement exceeds the minimum drag distance
				if (dx >= minDragDistance || dy >= minDragDistance) {
					// Create the selection box if it hasn't been created yet
					if (!selectionBox) {
						selectionBox = document.createElement('div');
						selectionBox.className = 'selection-box';
						container.appendChild(selectionBox);
					}

					selectionBox.style.left = `${Math.min(startX, currentX)}px`;
					selectionBox.style.top = `${Math.min(startY, currentY)}px`;
					selectionBox.style.width = `${dx}px`;
					selectionBox.style.height = `${dy}px`;

					const rect = selectionBox.getBoundingClientRect();

					document.querySelectorAll(itemSelector).forEach(item => {
						const itemRect = item.getBoundingClientRect();
						if (rect.right >= itemRect.left &&
							rect.left <= itemRect.right &&
							rect.bottom >= itemRect.top &&
							rect.top <= itemRect.bottom) {
							if (!selectedItems.has(item)) {
								item.classList.add('active');
								selectedItems.add(item);
							}
						} else {
							if (selectedItems.has(item)) {
								item.classList.remove('active');
								selectedItems.delete(item);
							}
						}
					});
				}
			}

			function finalizeSelection() {
				isDraggingSelection = false;
				if (selectionBox) {
					selectionBox.remove();
					selectionBox = null;
				}
				console.log(Array.from(selectedItems));  // Log selected items for debugging
				monitorSelection(selectedItems, "#selected_elements_status");
			}


			function monitorSelection(selectedItems, monitorDiv) {
				let arrSelected = Array.from(selectedItems);
				let str = '';
				console.log('arrSelected :>> ', arrSelected);
				arrSelected.forEach(item => {
					console.log(item.innerHTML);
					str += `<button class="datastore-status-light toolbar-kit btn btn-sm btn-primary runtime-controls-button" id="" title="">${item.innerHTML}</button>`;
				});
				document.querySelector(monitorDiv).innerHTML = str;
			}

			function finalizeSelection() {
				isDraggingSelection = false;
				if (selectionBox) {
					selectionBox.remove();
					selectionBox = null;
				}
				console.log(Array.from(selectedItems));  // Log selected items for debugging
				monitorSelection(selectedItems, "#selected_elements_status");
			}

			function startDraggingItem(event, item) {
				if (!selectedItems.has(item)) {
					selectedItems.forEach(selectedItem => {
						selectedItem.classList.remove('active');
					});
					selectedItems.clear();
					selectedItems.add(item);
					item.classList.add('active');
				}

				isDraggingItem = true;
				startX = event.clientX;
				startY = event.clientY;

				selectedItems.forEach(selectedItem => {
					initialPositions.set(selectedItem, {
						left: selectedItem.offsetLeft,
						top: selectedItem.offsetTop
					});
				});
			}

			function dragItem(event) {
				const dx = event.clientX - startX;
				const dy = event.clientY - startY;

				selectedItems.forEach(item => {
					const initialPosition = initialPositions.get(item);
					item.style.left = `${snapToGrid(initialPosition.left + dx, snapSize)}px`;
					item.style.top = `${snapToGrid(initialPosition.top + dy, snapSize)}px`;
				});
			}

			function stopDraggingItem() {
				isDraggingItem = false;
				initialPositions.clear();
				console.log(Array.from(selectedItems));  // Log selected items for debugging
			}

			function deselectAll() {
				selectedItems.forEach(item => {
					item.classList.remove('active');
				});
				selectedItems.clear();
				console.log(Array.from(selectedItems));  // Log selected items for debugging

				// FORCE RESET SELECTION
				const selectableItems = document.querySelectorAll(itemSelector);
				selectableItems.forEach(item => {
					item.classList.remove('active');
				});
				monitorSelection(selectedItems, "#selected_elements_status");
			}

			function setupEventListeners() {
				const selectableItems = document.querySelectorAll(itemSelector);

				selectableItems.forEach(item => {
					item.addEventListener('mousedown', (event) => {
						console.log('mousedown');
						const resizeHandleSize = 10;
						const rect = item.getBoundingClientRect();

						if (event.clientX >= rect.right - resizeHandleSize && event.clientY >= rect.bottom - resizeHandleSize) {
							isResizing = true;
							item.style.cursor = 'se-resize';
						} else {
							isResizing = false;
							item.style.cursor = 'pointer';
							if (event.ctrlKey || event.metaKey) {
								toggleSelection(event.target);
							} else if (selectedItems.has(event.target)) {
								startDraggingItem(event, item);
							} else {
								deselectAll();
								toggleSelection(event.target);
								startDraggingItem(event, item);
							}
						}
						event.stopPropagation();
					});

					item.addEventListener('mousemove', (event) => {
						const resizeHandleSize = 10;
						const rect = item.getBoundingClientRect();
						if (event.clientX >= rect.right - resizeHandleSize && event.clientY >= rect.bottom - resizeHandleSize) {
							item.style.cursor = 'se-resize';
						} else {
							item.style.cursor = 'pointer';
						}
					});

					item.addEventListener('mouseup', () => {
						isResizing = false;
					});
				});

				container.addEventListener('mousedown', (event) => {
					if (!event.ctrlKey && !event.metaKey && !event.target.classList.contains(itemSelector.substring(1))) {
						deselectAll();
						startDraggingSelection(event);
					}
				});

				container.addEventListener('mousemove', (event) => {
					if (isDraggingSelection) {
						updateSelectionBox(event);
					} else if (isDraggingItem) {
						dragItem(event);
					}
				});

				container.addEventListener('mouseup', () => {
					if (isDraggingSelection) {
						finalizeSelection();
					} else if (isDraggingItem) {
						stopDraggingItem();
					}
				});
			}

			setupEventListeners();

			return {
				reinitialize() {
					console.log('Start debug initializeDragAndSelect');
					console.log('snapSize :>> ', snapSize);
					console.log('containerSelector :>> ', containerSelector);
					console.log('itemSelector :>> ', itemSelector);
					console.log('selectedDivs :>> ', selectedDivs);

					// Call deselectAll before reinitializing
					deselectAll();

					// Remove all previous event listeners and reinitialize
					const selectableItems = document.querySelectorAll(itemSelector);
					selectableItems.forEach(item => {
						item.removeEventListener('mousedown', startDraggingItem);
						item.removeEventListener('mousemove', (event) => { /* Add corresponding event listener removal logic here */ });
						item.removeEventListener('mouseup', () => { /* Add corresponding event listener removal logic here */ });
					});

					container.removeEventListener('mousedown', startDraggingSelection);
					container.removeEventListener('mousemove', updateSelectionBox);
					container.removeEventListener('mouseup', finalizeSelection);

					setupEventListeners();
				},
				addItem(html) {
					deselectAll();
					container.insertAdjacentHTML('beforeend', html);
					this.reinitialize();
				},
				removeItem(item) {
					deselectAll();
					item.remove();
					this.reinitialize();
				}
			};
		}),

		"enableDragAndDropGroup": ((selector, direction = 'v') => {
			const items = document.querySelectorAll(selector);

			items.forEach(item => {
				item.setAttribute('draggable', 'true');

				item.addEventListener('dragstart', dragStart);
				item.addEventListener('dragover', dragOver);
				item.addEventListener('dragleave', dragLeave);
				item.addEventListener('drop', drop);
				item.addEventListener('dragend', dragEnd);
			});

			let draggedItem = null;

			function dragStart(event) {
				draggedItem = this;
				this.classList.add('dragging');
			}

			function dragOver(event) {
				event.preventDefault();
				this.classList.add('drag-over');

				const bounding = this.getBoundingClientRect();

				switch (direction) {
					case 'v':
						const offsetY = event.clientY - bounding.top - bounding.height / 2;
						if (offsetY < 0) {
							this.classList.add('move-up');
							this.classList.remove('move-down');
						} else {
							this.classList.add('move-down');
							this.classList.remove('move-up');
						}
						break;

					case 'h':
						const offsetX = event.clientX - bounding.left - bounding.width / 2;
						if (offsetX < 0) {
							this.classList.add('move-right');
							this.classList.remove('move-left');
						} else {
							this.classList.add('move-left');
							this.classList.remove('move-right');
						}
						break;
				}

			}

			function dragLeave(event) {
				this.classList.remove('drag-over', 'move-left', 'move-right', 'move-up', 'move-down');
			}

			function drop(event) {
				event.preventDefault();
				this.classList.remove('drag-over', 'move-left', 'move-right', 'move-up', 'move-down');

				if (draggedItem !== this) {
					const allItems = Array.from(document.querySelectorAll(selector));
					const draggedIndex = allItems.indexOf(draggedItem);
					const targetIndex = allItems.indexOf(this);

					if (draggedIndex > targetIndex) {
						this.parentNode.insertBefore(draggedItem, this);
					} else {
						this.parentNode.insertBefore(draggedItem, this.nextSibling);
					}
				}
			}

			function dragEnd(event) {
				this.classList.remove('dragging');
				draggedItem.style.visibility = 'visible';
				draggedItem = null;
			}
		}),
		// "renderGraphConnections": (function (conns, graphSurface, cr = false) {
		// 	if (cr) console.log('Masuk renderGraphConnections');
		// 	// if (cr) console.log('this', this.DOMElements.FindPosition());
		// 	if (arguments.length == 0) {
		// 		console.error('Connections array needed!');
		// 		return;
		// 	}
		// 	if (conns.length == 0) {
		// 		console.error('Connections array is empty!');
		// 		return;
		// 	}
		// 	if (!Array.isArray(conns)) {
		// 		console.error('Connections array is not an array!');
		// 		return;
		// 	}

		// 	// let svgChildren = graphSurface.svg.querySelectorAll('path').length;
		// 	let svgChildren = document.querySelectorAll(`#${graphSurface.svg.id} > path`).length;;

		// 	let connArrayLength = conns.length;
		// 	if (cr) console.log(`svgChildren: ${svgChildren}, connArrayLength:${connArrayLength}`);
		// 	let utilClass = this;
		// 	if (svgChildren == 0) {
		// 		if (cr) console.log('svg children = 0');
		// 		// graphSurface.svg.textContent = '';
		// 		conns.forEach(function (conn, idx, arr) {
		// 			let src = utilClass.DOMElements.FindPosition(conns[idx].Source);
		// 			let dst = utilClass.DOMElements.FindPosition(conns[idx].Destination);

		// 			conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
		// 			conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
		// 			conns[idx].path = conns[idx].createQCurve();
		// 			graphSurface.svg.appendChild(conns[idx].path);
		// 			document.querySelector(`i#${conns[idx].Source}`).dataset.Connected = true;
		// 			document.querySelector(`i#${conns[idx].Destination}`).dataset.Connected = true;
		// 		});
		// 	} else if (svgChildren != connArrayLength) {
		// 		if (cr) console.log('svgChildren != connArrayLength');
		// 		conns.forEach(function (conn, idx, arr) {
		// 			// console.log('conns foreach ke '+idx);
		// 			let src = utilClass.DOMElements.FindPosition(conns[idx].Source);
		// 			let src_coord_str = `${src.x},${src.y}`;

		// 			let dst = utilClass.DOMElements.FindPosition(conns[idx].Destination);
		// 			let dst_coord_str = `${dst.x},${dst.y}`;

		// 			conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
		// 			conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
		// 			if (idx < (svgChildren)) {
		// 				console.log(conns[idx]);
		// 				//IF Connection's current cursor array index is smaller or equal than svg children index, connections array and svg children are still hand on hand
		// 				if (conns[idx].pathMode == 'h') {
		// 					conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
		// 				} else {
		// 					conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
		// 				}
		// 			} else {
		// 				console.log(conns[idx]);
		// 				//IF Connection's current cursor array index is larger than svg children's index, need to create new svg children.
		// 				conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
		// 				conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
		// 				conns[idx].path = conns[idx].createQCurve();
		// 				graphSurface.svg.appendChild(conns[idx].path);
		// 			}
		// 		});
		// 	} else if (svgChildren == connArrayLength) {
		// 		if (cr) console.log('svgChildren == connArrayLength');
		// 		conns.forEach(function (conn, idx, arr) {
		// 			let src = utilClass.DOMElements.FindPosition(conns[idx].Source);
		// 			let src_coord_str = `${src.x},${src.y}`;

		// 			let dst = utilClass.DOMElements.FindPosition(conns[idx].Destination);
		// 			let dst_coord_str = `${dst.x},${dst.y}`;

		// 			conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
		// 			conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
		// 			if (conns[idx].pathMode == 'h') {
		// 				conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
		// 			} else {
		// 				conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
		// 			}
		// 		});
		// 	}
		// }).bind(this),
		"makeXpanel_str": function (value) {
			if (typeof value == 'object') {
				/*
				value = {
					id : xpanel_id,
					class : xpanel_class,
					title: xpanel_title,
					smalltitle: xpanel_smalltitle,
					contentid: xpanel_contentid,
					content: xpanel_content,
					content_overflow : 1
				}
				*/
				let str_label = (value.title.length > 0) ? `<div class="x_title">
					<h2>${value.title}<small>${value.smalltitle}</small></h2>
					<ul class="nav navbar-right panel_toolbox">
						<li>
							<a class="configuration-items">
								<i class="fa fa-chevron-up"></i>
							</a>
						</li>
						<li>
							<a class="configuration-items">
								<i class="fa fa-gear"></i>
							</a>
						</li>
					</ul>
				</div>` : '';
				let str_position = (typeof value.x != 'undefined' && typeof value.y != 'undefined') ? `top:${value.x}px; left:${value.y}px` : '';
				let str_overflow = (value.content_overflow) ? 'x_content_overflow' : '';
				console.log('str_overflow', str_overflow);
				let str = `
				<div class= "x_panel ${value.class}" id="${value.id}" style="${str_position}">
					${str_label}
					<div class="x_content ${str_overflow}" id="${value.contentid}">${value.content}</div>
				</div>`;
				return str;
			}
		},
		"makeXpanel": function (value) {
			if (typeof value == 'object') {
				/*
				value = {
					id : xpanel_id,
					class : xpanel_class,
					title: xpanel_title,
					smalltitle: xpanel_smalltitle,
					contentid: xpanel_contentid,
					content: xpanel_content,
					content_overflow : 1
				}
				*/
				let newElement = document.createElement('div');
				newElement.id = value.id;
				newElement.className = 'x_panel ' + value.class;
				newElement.style.top = value.y;
				newElement.style.left = value.x;
				let str_label = (value.title.length > 0) ? `<div class="x_title">
					<h2>${value.title}<small>${value.smalltitle}</small></h2>
					<ul class="nav navbar-right panel_toolbox">
						<li>
							<a class="configuration-items">
								<i class="fa fa-chevron-up"></i>
							</a>
						</li>
						<li>
							<a class="configuration-items">
								<i class="fa fa-gear"></i>
							</a>
						</li>
					</ul>
				</div>` : '';
				let str_overflow = (value.content_overflow) ? 'x_content_overflow' : '';
				if (typeof value.content == 'string') {
					newElement.innerHTML = `
						${str_label}
						<div class="x_content ${str_overflow}" id="${value.contentid}">${value.content}</div>`;
				} else {
					newElement.innerHTML = `
						${str_label}
						<div class="x_content ${str_overflow}" id="${value.contentid}"></div>`;
					newElement.querySelector(`#${value.contentid}`).appendChild(value.content);
				}
				return newElement;
			}
		},
		"MakeDraggableDiv_str": function (id, label, content, x, y) {
			let str_label = (label.length > 0 && typeof label != 'undefined') ? `
			<div id="${id}-header" class="toolbar-titlebar" style="">
				${label}
				<ul class="nav navbar-right toolbar-panel_toolbox">
					<li>
						<a class="toolbar-configuration-items">
							<i class="fa fa-chevron-up"></i>
						</a>
					</li>
					<li>
						<a class="toolbar-configuration-items">
							<i class="fa fa-gear"></i>
						</a>
					</li>
				</ul>
			</div>
			` : '';
			return `
			<div id="${id}" class="toolbar-panel light-mode-translucent" style="top:${x}px; left:${y}px;">
				${str_label}
				<div id="${id}-content" class="toolbar-content" style="">${content}</div>
			</div>
			`;
		},
		"MakeDraggableDiv": function (id, label, content, x, y, zIndex = 'auto', cr = 0) {
			if (cr) console.log(arguments);
			let str_label = (label.length > 0 && typeof label != 'undefined') ? `
			<div id="${id}-header" class="toolbar-titlebar" style="">
				${label}
				<ul class="nav navbar-right toolbar-panel_toolbox">
					<li>
						<a class="toolbar-configuration-items">
							<i class="fa fa-chevron-up"></i>
						</a>
					</li>
					<li>
						<a class="toolbar-configuration-items">
							<i class="fa fa-gear"></i>
						</a>
					</li>
				</ul>
			</div>
			` : '';
			let newElement = document.createElement('div');
			newElement.id = id;
			newElement.className = 'toolbar-panel';
			newElement.style.top = `${x}px`;
			newElement.style.left = `${y}px`;
			newElement.style.zIndex = zIndex;
			newElement.innerHTML = `
				${str_label}
				<div id="${id}-content" class="toolbar-content" style=""></div>
			`;
			// console.log(`#${id}-content`);
			newElement.querySelector(`#${id}-content`).appendChild(content);
			return newElement;
		},
		// "MakeDraggableNode": function (id, objclass, label, content, x, y, zIndex = 'auto') {
		// 	let newElement = document.createElement('div');
		// 	newElement.id = id;
		// 	newElement.className = objclass;
		// 	newElement.style.top = `${y}px`;
		// 	newElement.style.left = `${x}px`;
		// 	newElement.style.zIndex = zIndex;
		// 	newElement.tabIndex = 0;
		// 	newElement.innerHTML = `
		// 		<div class="container text-center" style="margin:0px; padding: 0px;">
		// 			<div class="row g-0 top-row" style="margin:0; padding:0;">
		// 				<div class="container-fluid text-center connection-container" style="overflow:hidden; max-width: 40vh;margin:0; padding: 0;">
		// 					<i class="remove-connection fa-solid fa-minus text-danger-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
		// 					<span class="top-input"></span>
		// 					<i class="add-connection fa-solid fa-plus text-danger-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
		// 				</div>
		// 			</div>
		// 			<div class="d-flex mid-row">
		// 				<div class="flex d-flex align-items-center left-column" style="overflow:hidden; margin:0; padding: 0;">
		// 					<div class="container text-start connection-container" style="width:1vx;overflow:hidden; margin:0; padding: 0;">
		// 						<i class="add-connection fa-solid fa-plus text-warning-emphasis" style="--bs-text-opacity: .8;" data--connection-direction="h" data-click-event-initialized="false"></i><br>
		// 						<span class="left-input connection-column" style="flex-direction: column;align-items: center;"></span>
		// 						<i class="remove-connection fa-solid fa-minus text-warning-emphasis" style="--bs-text-opacity: .8; data--connection-direction="h" data-click-event-initialized="false"></i>
		// 					</div>
		// 				</div>
		// 				<div class="flex-fill mid-column" style="margin:0vh; padding: 0;">
		// 					<div id="${id}-header" class="raised-element container-fluid graph-node-titlebar" >${label}</div>
		// 					<div id="${id}-content" style="margin-top: 1rem;">${content}</div>
		// 				</div>
		// 				<div class="flex d-flex align-items-center right-column" style="overflow:hidden; margin:0; padding: 0;">
		// 					<div class="container text-end connection-container" style="margin:0; padding:0;">
		// 						<i class="add-connection fa-solid fa-plus text-success-emphasis" style="--bs-text-opacity: .8;" data--connection-direction="h" data-click-event-initialized="false"></i><br>
		// 						<span class="right-output connection-column" style="flex-direction: column;align-items: center;"></span>
		// 						<i class="remove-connection fa-solid fa-minus text-success-emphasis" style="--bs-text-opacity: .8; data--connection-direction="h" data-click-event-initialized="false"></i><br>
		// 					</div>
		// 				</div>
		// 			</div>
		// 			<div class="row g-0 bottom-row" style="height:1vx;margin:0; padding: 0;">
		// 				<div class="container-fluid connection-container" style="overflow:hidden; max-width: 40vh;margin:0; padding: 0;">
		// 					<i class="remove-connection fa-solid fa-minus text-success-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
		// 					<span class="bottom-output"></span>
		// 					<i class="add-connection fa-solid fa-plus text-success-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	`;
		// 	newElement.addEventListener('animationend', function () {
		// 		this.classList.remove('fade-in');
		// 	});
		// 	return newElement;
		// },
		"FindPosition": (function (elmnt, parentContainer = false) {
			let element = elmnt;
			let ptop = 0, pleft = 0;
			let pheight = 0, pwidth = 0;
			let pscrollTop = 0;
			let pscrollLeft = 0;
			let wscrollTop = window.scrollX;
			let wscrollLeft = window.scrollY;
			if (typeof elmnt == 'string') {
				element = document.getElementById(elmnt);
			}
			let rect = element.getBoundingClientRect();
			if (parentContainer !== false) {
				let parentContainerRect = parentContainer.getBoundingClientRect();
				ptop = parentContainerRect.top;
				pleft = parentContainerRect.left;
				pheight = parentContainerRect.width;
				pwidth = parentContainerRect.height;
				pscrollTop = parentContainer.scrollTop;
				pscrollLeft = parentContainer.scrollLeft;
			}

			// Take zoom level into account
			let zoomFactor = this.zoom_level || 1; // Default to 1 if zoom_level is not set
			return {
				"x": ((rect.left - pleft) + (rect.width / 2) + pscrollLeft) / zoomFactor,
				"y": ((rect.top - ptop) + (rect.height / 2) + pscrollTop) / zoomFactor,
				"raw": {
					"current_element": {
						"position": {
							"x": rect.left,
							"y": rect.top,
						},
						"dimension": {
							"width": rect.width,
							"height": rect.height
						},
						"center_coordinate": {
							"x": rect.left + (rect.width / 2),
							"y": rect.top + (rect.height / 2),
						}
					},
					"parent_container": {
						"position": {
							"x": pleft,
							"y": ptop,
						},
						"dimension": {
							"width": pwidth,
							"height": pheight
						},
						"center_coordinate": {
							"x": pleft + (pwidth / 2),
							"y": ptop + (pheight / 2),
						}
					}
				},
				"viewport": {
					"x": (rect.left + wscrollLeft) / zoomFactor,
					"y": (rect.top + wscrollTop) / zoomFactor,
				},
				"document": {
					"x": (rect.left + pscrollLeft + window.scrollX) / zoomFactor,
					"y": (rect.top + pscrollTop + window.scrollY) / zoomFactor,
				},
				"element": {
					"x": (rect.left - pleft + pscrollLeft) / zoomFactor,
					"y": (rect.top - ptop + pscrollTop) / zoomFactor,
				},
				"parent": {
					"x": (rect.left - pleft) / zoomFactor,
					"y": (rect.top - ptop) / zoomFactor,
				},
				"element": element,
			};
		}).bind(this),
		"FindPositionV1": (function (elmnt, parent = false) {
			let element = elmnt;
			let ptop = 0, pleft = 0;
			let scrollTop = 0;
			let scrollLeft = 0;
			if (typeof elmnt == 'string') {
				element = document.getElementById(elmnt);
			}
			let rect = element.getBoundingClientRect();
			if (parent !== false) {
				let parentRect = parent.getBoundingClientRect();
				ptop = parentRect.top;
				pleft = parentRect.left;
				scrollTop = parent.scrollTop;
				scrollLeft = parent.scrollLeft;
			}

			// Take zoom level into account
			let zoomFactor = this.zoom_level || 1; // Default to 1 if zoom_level is not set
			return {
				"x": ((rect.left - pleft) + (rect.width / 2) + scrollLeft) / zoomFactor,
				"y": ((rect.top - ptop) + (rect.height / 2) + scrollTop) / zoomFactor,
				"element": element
			};
			// OLD VERSION, CALCULTES WINDOW SCROLL POSITION
			// let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			// let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
			// return {
			// 	"x": ((rect.left - pleft) + (rect.width / 2) + scrollLeft),
			// 	"y": ((rect.top - ptop) + (rect.height / 2) + scrollTop),
			// 	"element": element
			// };
		}).bind(this),
		"scrollTo": function (container, e, scrollIt = true) {
			const mouseX = e.clientX;
			const mouseY = e.clientY;
			const containerRect = container.getBoundingClientRect();

			let scX = mouseX - (containerRect.width / 2) + container.scrollLeft;
			scX = (scX < 0) ? 0 : scX;
			let scY = mouseY - (containerRect.height / 2) + container.scrollTop;
			scY = (scY < 0) ? 0 : scY;

			// Scroll to the desired position, centering it in the viewport
			// container.style.scrollBehavior = "smooth";
			// container.scrollTo(scX, scY);
			if (scrollIt) {
				container.scrollTo({
					top: scY,
					left: scX,
					behavior: "smooth",
				});
			} else {
				return {
					x: scX,
					y: scY,
				}
			}
		},
		"FindMousePosition": (function (event, container, zoom_level = 1) {
			// Mouse coordinates relative to the viewport
			let viewportX = event.clientX;
			let viewportY = event.clientY;

			// Mouse coordinates relative to the window
			let windowX = viewportX + window.scrollX;
			let windowY = viewportY + window.scrollY;

			// Mouse coordinates relative to the document
			let documentX = (typeof container != 'undefined') ? viewportX + container.scrollLeft : 0;
			let documentY = (typeof container != 'undefined') ? viewportY + container.scrollTop : 0;

			let scX = 0;
			let scY = 0;
			let elementX = null;
			let elementY = null;
			if (typeof container != 'undefined') {

				// if (this.DOMElements.hasScrollbars(container).x)
				const hasScrollbars = this.DOMElements.hasScrollbars(container);
				let containerRect = container.getBoundingClientRect();
				let parentContainer = container;
				if (hasScrollbars.horizontal == false && hasScrollbars.vertical == false) {
					console.log('masuk parent yg diget rect');
					parentContainer = container.parentNode;
				}
				console.log('>>>>', parentContainer.scrollLeft);
				let computedVals = getComputedStyle(parentContainer);
				console.log('computedVals', computedVals);
				console.log('computedVals', computedVals.width, computedVals.height);
				scX = (viewportX - (parseInt(computedVals.width.replace('px', '')) / 2) + parentContainer.scrollLeft) / zoom_level;
				scX = (scX < 0) ? 0 : scX;
				scY = (viewportY - (parseInt(computedVals.height.replace('px', '')) / 2) + parentContainer.scrollTop) / zoom_level;
				scY = (scY < 0) ? 0 : scY;

				elementX = (viewportX + parentContainer.scrollLeft) / zoom_level;
				elementY = (viewportY + parentContainer.scrollTop) / zoom_level;
			}
			console.log('sc>>>', scX, scY);
			console.log('vp>>>', viewportX, viewportY);
			console.log('el>>>', elementX, elementY);

			// Find out the element that's right under the mouse cursor

			return {
				"viewport": { "x": viewportX, "y": viewportY },
				"document": { "x": documentX, "y": documentY },
				"scrollTo": { "x": scX, "y": scY },
				"window": { "x": windowX, "y": windowY },
				"element": { "x": elementX, "y": elementY },
				"containerElement": container,
				"viewportSize": {
					width: window.innerWidth,
					height: window.innerHeight,
				}
			};
		}).bind(this),
		"FindCenterOfElement": (function (elmnt, parent = false) {
			let element = elmnt;
			let ptop = 0, pleft = 0;
			let scrollTop = 0;
			let scrollLeft = 0;
			if (typeof elmnt == 'string') {
				element = document.getElementById(elmnt);
			}
			let rect = element.getBoundingClientRect();
			if (parent !== false) {
				let parentRect = parent.getBoundingClientRect();
				ptop = parentRect.top;
				pleft = parentRect.left;
				scrollTop = parent.scrollTop;
				scrollLeft = parent.scrollLeft;
			}

			// Take zoom level into account
			let zoomFactor = this.zoom_level || 1; // Default to 1 if zoom_level is not set
			// Calculate the center of the element
			let centerX = (((rect.left - pleft) / zoomFactor) + (rect.width / 2) + scrollLeft);
			let centerY = (((rect.top - ptop) / zoomFactor) + (rect.height / 2) + scrollTop);
			return {
				"x": centerX,
				"y": centerY,
				"element": element
			};
		}).bind(this),

		"DragAndResizeElement": (function (elmnt, zoomed = false, snap_every = 1, callback) {
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
			let isResizing = false;

			// Create a resizer element for the bottom-right corner
			const resizer = document.createElement('div');
			resizer.style.width = '10px';
			resizer.style.height = '10px';
			resizer.style.background = 'rgba(0, 0, 0, 0.5)';
			resizer.style.position = 'absolute';
			resizer.style.right = '0';
			resizer.style.bottom = '0';
			resizer.style.cursor = 'nwse-resize';
			elmnt.appendChild(resizer);

			// Drag functionality, specific to the toolbar-titlebar
			// console.log('elmnt >>>>>>>>>>>>>>', elmnt);
			const header = elmnt.querySelector('.toolbar-titlebar');
			// console.log('header :>>>>>>>>>>>>>>>>>> ', header);
			if (header) {
				header.onmousedown = dragMouseDown.bind(this);
				header.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			}

			// Resize functionality
			resizer.addEventListener('mousedown', initResize.bind(this), { passive: false });
			resizer.addEventListener('touchstart', initResize.bind(this), { passive: false });

			function dragMouseDown(e) {
				console.log('>>>>>> dragMouseDown');
				if (isResizing) return;  // Prevent dragging when resizing
				this.activeElement = elmnt.id;

				e = e || window.event;
				e.preventDefault();

				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.Numbers.RoundToNearestBase((e.clientX / divider), snap_every);
				pos4 = this.Numbers.RoundToNearestBase((e.clientY / divider), snap_every);

				document.onmouseup = closeDragElement.bind(this);
				document.onmousemove = elementDrag.bind(this);
			}

			function touchStart(e) {
				if (isResizing) return;  // Prevent dragging when resizing
				this.activeElement = elmnt.id;

				e = e || window.event;
				e.preventDefault();

				const touch = e.changedTouches[0];
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.Numbers.RoundToNearestBase((touch.clientX / divider), snap_every);
				pos4 = this.Numbers.RoundToNearestBase((touch.clientY / divider), snap_every);

				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);

				document.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
				document.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
			}

			function elementDrag(e) {
				if (this.activeElement != elmnt.id) return;

				e = e || window.event;
				e.preventDefault();

				let clientX, clientY;
				let divider = (zoomed) ? this.zoom_level : 1;

				if (e.type === "touchmove") {
					const touch = e.changedTouches[0];
					clientX = this.Numbers.RoundToNearestBase((touch.clientX / divider), snap_every);
					clientY = this.Numbers.RoundToNearestBase((touch.clientY / divider), snap_every);
				} else {
					clientX = this.Numbers.RoundToNearestBase((e.clientX / divider), snap_every);
					clientY = this.Numbers.RoundToNearestBase((e.clientY / divider), snap_every);
				}

				pos1 = pos3 - clientX;
				pos2 = pos4 - clientY;
				pos3 = clientX;
				pos4 = clientY;

				let cY = elmnt.offsetTop - pos2;
				let cX = elmnt.offsetLeft - pos1;
				if (cY >= 0) elmnt.style.top = cY + "px";
				if (cX >= 0) elmnt.style.left = cX + "px";
				if (typeof callback != 'undefined') callback();
			}

			function closeDragElement() {
				pos3 = 0;
				pos4 = 0;
				this.activeElement = null;

				document.onmouseup = null;
				document.onmousemove = null;
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				if (typeof callback != 'undefined') callback();
			}

			// Initialize resizing
			function initResize(e) {
				isResizing = true;
				e.preventDefault();
				document.onmousemove = doResize.bind(this);
				document.onmouseup = stopResize.bind(this);
				document.addEventListener("touchmove", doResize.bind(this), { passive: false });
				document.addEventListener("touchend", stopResize.bind(this), { passive: false });
			}

			function doResize(e) {
				e = e || window.event;
				let clientX, clientY;
				if (e.type === "touchmove") {
					const touch = e.changedTouches[0];
					clientX = touch.clientX;
					clientY = touch.clientY;
				} else {
					clientX = e.clientX;
					clientY = e.clientY;
				}

				elmnt.style.width = clientX - elmnt.getBoundingClientRect().left + "px";
				elmnt.style.height = clientY - elmnt.getBoundingClientRect().top + "px";
				if (typeof callback != 'undefined') callback();
			}

			function stopResize() {
				isResizing = false;
				document.onmousemove = null;
				document.onmouseup = null;
				document.removeEventListener("touchmove", doResize);
				document.removeEventListener("touchend", stopResize);
				if (typeof callback != 'undefined') callback();
			}
		}).bind(this),
		"DragElement": (function (elmnt, zoomed = false, snap_every = 1, callback) {
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

			if (document.getElementById(elmnt.id + "-header")) {
				document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown.bind(this);
				document.getElementById(elmnt.id + "-header").addEventListener("touchstart", touchStart.bind(this), { passive: false });
			} else {
				elmnt.onmousedown = dragMouseDown.bind(this);
				elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			}

			function dragMouseDown(e) {
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return;

				e = e || window.event;
				e.preventDefault();

				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.Numbers.RoundToNearestBase((e.clientX / divider), snap_every);
				pos4 = this.Numbers.RoundToNearestBase((e.clientY / divider), snap_every);

				document.onmouseup = closeDragElement.bind(this);
				document.onmousemove = elementDrag.bind(this);
			}

			function touchStart(e) {
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return;

				e = e || window.event;
				e.preventDefault();

				const touch = e.changedTouches[0];
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.Numbers.RoundToNearestBase((touch.clientX / divider), snap_every);
				pos4 = this.Numbers.RoundToNearestBase((touch.clientY / divider), snap_every);

				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);

				document.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
				document.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
			}

			function elementDrag(e) {
				if (this.activeElement != elmnt.id) return;

				e = e || window.event;
				e.preventDefault();

				let clientX, clientY;
				let divider = (zoomed) ? this.zoom_level : 1;

				if (e.type === "touchmove") {
					const touch = e.changedTouches[0];
					clientX = this.Numbers.RoundToNearestBase((touch.clientX / divider), snap_every);
					clientY = this.Numbers.RoundToNearestBase((touch.clientY / divider), snap_every);
				} else {
					clientX = this.Numbers.RoundToNearestBase((e.clientX / divider), snap_every);
					clientY = this.Numbers.RoundToNearestBase((e.clientY / divider), snap_every);
				}

				pos1 = pos3 - clientX;
				pos2 = pos4 - clientY;
				pos3 = clientX;
				pos4 = clientY;

				let cY = elmnt.offsetTop - pos2;
				let cX = elmnt.offsetLeft - pos1;
				if (cY >= 0) elmnt.style.top = cY + "px";
				if (cX >= 0) elmnt.style.left = cX + "px";
				if (typeof callback != 'undefined') callback();
			}

			function closeDragElement() {
				pos3 = 0;
				pos4 = 0;
				this.activeElement = null;

				document.onmouseup = null;
				document.onmousemove = null;
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				if (typeof callback != 'undefined') callback();
			}
		}).bind(this),
		"DragElement_pre_resize": (function (elmnt, zoomed = false, snap_every = 1, callback) {
			//DragElement in Utility
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0;
			if (document.getElementById(elmnt.id + "-header")) {
				// If present, the header is where you move the DIV from:
				document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown.bind(this);
				document.getElementById(elmnt.id + "-header").addEventListener("touchstart", touchStart.bind(this), { passive: false });
			} else {
				// Otherwise, move the DIV from anywhere inside the DIV:
				elmnt.onmousedown = dragMouseDown.bind(this);
				elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			}

			function dragMouseDown(e) {
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				this.activeElement = elmnt.id;
				e = e || window.event;
				e.preventDefault();
				// get the mouse cursor position at startup:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.Numbers.RoundToNearestBase((e.clientX / divider), snap_every);
				pos4 = this.Numbers.RoundToNearestBase((e.clientY / divider), snap_every);
				document.onmouseup = closeDragElement.bind(this);
				// call a function whenever the cursor moves:
				document.onmousemove = elementDrag.bind(this);
			}

			function touchStart(e) {
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				document.getElementById('touchevent').innerHTML = 'Touch Start';
				document.getElementById('touchelement').innerHTML = this.activeElement;
				const touch = e.changedTouches[0];
				// Reset the initial touch position at the start of a new touch:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.Numbers.RoundToNearestBase((touch.clientX / divider), snap_every);
				pos4 = this.Numbers.RoundToNearestBase((touch.clientY / divider), snap_every);
				// Ensure previous touchend and touchmove event listeners are removed:
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				// Attach new event listeners:
				document.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
				document.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
			}

			function elementDrag(e) {
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				// calculate the new cursor/touch position:
				let clientX, clientY;
				let divider = (zoomed) ? this.zoom_level : 1;

				if (e.type === "touchmove") {
					document.getElementById('touchevent').innerHTML = 'Touch Move';
					const touch = e.changedTouches[0];
					clientX = this.Numbers.RoundToNearestBase((touch.clientX / divider), snap_every);
					clientY = this.Numbers.RoundToNearestBase((touch.clientY / divider), snap_every);
				} else {
					clientX = this.Numbers.RoundToNearestBase((e.clientX / divider), snap_every);
					clientY = this.Numbers.RoundToNearestBase((e.clientY / divider), snap_every);
				}

				pos1 = pos3 - clientX;
				pos2 = pos4 - clientY;
				pos3 = clientX;
				pos4 = clientY;
				// set the element's new position:
				let cY = elmnt.offsetTop - pos2;
				let cX = elmnt.offsetLeft - pos1;
				if (cY >= 0) elmnt.style.top = cY + "px";
				if (cX >= 0) elmnt.style.left = cX + "px";
				if (typeof callback != 'undefined') callback();
			}

			function closeDragElement() {
				// Reset initial touch positions to avoid the jump behavior on subsequent touches:
				pos3 = 0;
				pos4 = 0;
				this.activeElement = null;

				// stop moving when the mouse/touch is released:
				document.onmouseup = null;
				document.onmousemove = null;
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				if (typeof callback != 'undefined') callback();
			}
		}).bind(this),
		"initConnectorEvents": (function () {
			function inputEvents(d, i, arr) {
				d.addEventListener('click', function (e) {
					// console.log('top input ' + i);
					if (!utility.makingConnection) {
						// console.error('Not in Making Connection mode');
						return;
					}
					if (utility.ConnectionDirection != d.dataset.ConnectionDirection) {
						console.error('Connection direction is ' + utility.ConnectionDirection);
						// utility.ConnectionDirection = null;
						return;
					}
					let element = utility.DOMElements.FindPosition(this);
					let endElement = element.element.id;
					// console.log('element', element, endElement);

					if (connections.length > 0) {
						console.log('startElement', startElement, 'endElement', endElement);
						let sourceFound = false;
						let destinationFound = false;
						connections.forEach(elmt => {
							if ((elmt.Source == startElement) && (elmt.Destination == endElement)) {
								console.error(`Connection from ${startElement} to ${endElement} already exist!`);
								return;
							}
						});
					}

					if (utility.activeElement == null) utility.activeElement = element.element.id;
					if (utility.activeElement != this.id) return;

					let endPosX = parseFloat(element.x);
					let endPosY = parseFloat(element.y);

					tempConn = new Connection(utility.Numbers.generateUUID(), graphSurface);

					tempConn.startPos = { "x": startPosX, "y": startPosY };
					tempConn.Source = startElement;
					tempConn.pathMode = utility.ConnectionDirection;

					tempConn.endPos = { x: (endPosX / utility.zoom_level), y: (endPosY / utility.zoom_level) };
					tempConn.Destination = element.element.id;
					if (tempConn !== null) connections.push(tempConn);

					document.getElementById(tempConn.Source).dataset.Connected = 'true';
					document.getElementById(tempConn.Destination).dataset.Connected = 'true';

					tempConn = null;
					startPosX = 0;
					startPosY = 0;
					distance = 0;
					utility.DOMElements.renderGraphConnections(connections, graphSurface);
					utility.makingConnection = false;
					utility.ConnectionDirection = null;
					utility.activeElement = null;
				});
			}
			function outputEvents(d, i, arr) {
				d.addEventListener('click', function (e) {
					// console.log('right output ' + i);
					utility.makingConnection = true;
					utility.ConnectionDirection = d.dataset.ConnectionDirection;

					let element = utility.DOMElements.FindPosition(this);
					startPosX = parseFloat(element.x);
					startPosY = parseFloat(element.y);
					startElement = element.element.id;
					console.log(`startX: ${startPosX}, startY: ${startPosY}`);
				});
			}
			document.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection top container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.children.length >= 10) return;
					this.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-down text-danger" style="--bs-text-opacity: .5;" id="in-${utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="v"></i>`;
					document.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);
				});
			});
			document.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.remove-connection").forEach(d => {
				d.addEventListener('click', () => {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.top-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});

			document.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection left container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-right text-warning" style="--bs-text-opacity: .8; display:block;" id="in-${utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="h"></i>`;
					document.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
				});
			});
			document.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.remove-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.left-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			document.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection right container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-right text-success" style="--bs-text-opacity: .5; display:block;" id="out-${utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="h"></i>`;
					document.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
				});
			});
			document.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.remove-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.right-output > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			document.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.add-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					// console.log('Click add connection bottom container', this.nextElementSibling.nextElementSibling.children.length);
					if (this.nextElementSibling.children.length >= 100) return;
					this.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-down text-primary-emphasis" style="--bs-text-opacity: .5;" id="out-${utility.Numbers.generateUUID()}" data--connected="false" data--connection-direction="v"></i>`;
					document.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
				});
			});
			document.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.remove-connection").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					console.log('clicked remove conn bottom');
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.bottom-output> i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});

			document.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);
			document.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
			document.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
			document.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
		}).bind(this)
	};
	Forms = {
		"GenerateTable": (function (id, dataset, with_action, npage_num = 1, npage_result_number = 0) {
			let page_number = 0;
			let no_urut = 0;
			let ada_action = false;
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
			}
			if ((arguments.length >= 3) && (typeof with_action == 'object') && (with_action !== null)) {
				ada_action = true;
			}
			let uid = '';
			let str = '';
			let aTotal = [];
			if (dataset !== false) {
				str += '<table border="0" width="100%" id="' + id + '" class="table table-hover table-striped table-condensed datatable" style="font-size:100%;">';
				str += '<thead>';
				str += '<tr>';
				str += '<th class="table-header" ';
				str += ' style="cursor:pointer;">No.</th>';
				let idx = 0;
				let col_header = [];
				let col_header_temp = [];
				let col_header_longest = 0;
				let idx_col_header_longest = 0;
				let count_cols = 0;

				for (let countDS in dataset) {
					col_header_temp = [];
					for (let i in dataset[countDS]) {
						col_header_temp.push(i);
					}
					if (col_header_longest < col_header_temp.length) {
						col_header_longest = col_header_temp.length;
						idx_col_header_longest = countDS;
						col_header = col_header_temp;
					}
				}
				idx = 0;
				for (let i in dataset[idx_col_header_longest]) {
					if (idx === 0) {
						uid = i;
					}
					str += '<th class="table-header" column_name="' + i.replace(/\W/gi, '') + '" style="cursor:pointer;" align="left">' + i.replace(/_/gi, ' ') + '</th>';
					idx++;
				}
				if ((arguments.length >= 3) && (typeof with_action == 'object') && (with_action !== null)) {
					let label = 'aksi';
					if (typeof with_action.label != 'undefined') {
						label = with_action.label;
					}
					str += '<th style="width:1%;white-space:nowrap;" class="header" align="left">' + label + '</th>';
				}
				str += '</tr>';
				str += '</thead>';
				str += '<tbody>';
				idx = 0;
				dataset.forEach(function (d, yyy) {
					let zzstr = dataset[yyy][d];
					if (zzstr == null) zzstr = '';
					str += '<tr class="data_row" id="' + ((yyy * 1) + 1 + no_urut) + '---' + zzstr.toString().replace(/\s/gi, '_') + '" valign="top">';
					str += '<td column_name="no">' + ((yyy * 1) + 1 + no_urut) + '</td>';
					let fc = 1;
					let $style = '';
					for (let index_col_header = 0; index_col_header < col_header.length; index_col_header++) {
						let xxx = col_header[index_col_header];
						if ((parseFloat(dataset[yyy][xxx]) == dataset[yyy][xxx]) && (xxx.search(/char/i) == (-1))) {
							str += '<td ' + $style + ' align="right" ' + $style + ' column_name="' + xxx.replace(/\W/, '') + '">' + (dataset[yyy][xxx]);
						} else {
							if (dataset[yyy][xxx] != null) {
								if (xxx == 'keterangan') {
									str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '" title="' + dataset[yyy][xxx] + '">';
									str += dataset[yyy][xxx];
								} else if (dataset[yyy][xxx].length > 80) {
									if ((dataset[yyy][xxx].indexOf('<') > 0) || (dataset[yyy][xxx].indexOf('>') > 0)) {
										str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
										str += dataset[yyy][xxx];
									} else {
										str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '" title="' + dataset[yyy][xxx] + '">';
										str += dataset[yyy][xxx];
									}
								} else if (typeof dataset[yyy][xxx] == 'object') {
									str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
								} else {
									if ((dataset[yyy][xxx] === 't') || (dataset[yyy][xxx] === true) || (dataset[yyy][xxx] === 'true')) {
										str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
										str += 'Ya';
									} else if ((dataset[yyy][xxx] === 'f') || (dataset[yyy][xxx] === false) || (dataset[yyy][xxx] === 'false')) {
										str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
										str += 'Tidak';
									} else {
										str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
										str += dataset[yyy][xxx];
									}
								}
							} else {
								str += '<td ' + $style + ' id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
								str += '-';
							}
						}
						fc++;
						str += '</td>';
					}
					if (ada_action) {
						if (typeof with_action.data != 'undefined') {
							str += '<td ' + $style + ' column_name="action" align="center">';
							$.each(with_action.data, function (counter_wa, d) {
								str += '<span id="id_action_trigger--' + with_action.data[counter_wa]['nama'] + '--' + ((yyy * 1) + 1 + no_urut) + '" style="cursor:pointer;color:#FF2F34;">' + with_action.data[counter_wa]['label'] + '</span> ';
							});
							str += '</td>';

						} else {
							str += '<td ' + $style + ' column_name="action" align="center">';
							$.each(with_action, function (counter_wa, d) {
								str += '<span id="id_action_trigger--' + with_action[counter_wa]['nama'] + '--' + ((yyy * 1) + 1 + no_urut) + '" style="cursor:pointer;color:#FF2F34;">' + with_action[counter_wa]['label'] + '</span> ';
							});
							str += '</td>';
						}
					}
					str += '</tr>';
					idx++;
					// }
				});
				str += '</tbody>';
				str += '</table>';

				return str;
			} else {
				return "<span style='font-family:arial; font-weight:bold; font-size:18px; color: black; border-bottom: 1px solid silver;'>Tidak ada data yang cocok</span>";
			}
		}).bind(this),
		"GenerateTableV2": (function (id, dataset, actions) {

			console.log('Type of Dataset', this.checkType(dataset), dataset);
			console.log('Type of with_action', this.checkType(with_action), with_action);
			if (!Array.isArray(dataset)) {
				console.error("Invalid arguments: 'dataset' must be an array");
				return;
			}
			if (this.checkType(with_action) !== 'Unknown' && typeof with_action !== 'object') console.error("'with_action' must be an object");

			let page_number = actions.npage_num || 0;
			let no_urut = page_number * (actions.npage_result_number || 0);
			let ada_action = (typeof actions.with_action == 'object') && (actions.with_action !== null);

			let uid = '';
			let str = '';
			let aTotal = [];

			if (dataset !== false) {
				str += '<table border="0" width="100%" id="' + id + '" class="table table-hover table-striped table-condensed datatable" style="font-size:100%;">';
				str += '<thead>';
				str += '<tr>';
				str += '<th class="table-header" style="cursor:pointer;font-style: italic;">No.</th>';

				// Determine the set of all keys used in the dataset
				let allKeys = new Set();
				dataset.forEach(item => {
					Object.keys(item).forEach(key => allKeys.add(key));
				});
				let col_header = Array.from(allKeys);
				uid = col_header[0];

				col_header.forEach(i => {
					str += '<th class="table-header" column_name="' + i.replace(/\W/gi, '') + '" style="cursor:pointer;font-style:italic;" align="left">' + this.Strings.ReadableUCWords(i) + '</th>';
				});
				if (ada_action) {
					let label = with_action.label || 'aksi';
					str += '<th style="width:1%;white-space:nowrap;position:sticky;" class="header" align="left">' + label + '</th>';
				}
				str += '</tr>';
				str += '</thead>';
				str += '<tbody>';
				dataset.forEach((d, yyy) => {
					str += '<tr class="data_row" id="' + ((yyy * 1) + 1 + no_urut) + '---' + (d[uid] ? d[uid].toString().replace(/\s/gi, '_') : '') + '" valign="top">';
					str += '<td column_name="no" style="color:#b1b1b1;font-weight:100;font-style:italic;">' + ((yyy * 1) + 1 + no_urut) + '</td>';
					col_header.forEach(xxx => {
						str += '<td id="' + (yyy * 1) + 1 + no_urut + '-' + uid + '-' + xxx + '" column_name="' + xxx.replace(/\W/, '') + '">';
						str += d[xxx] || '-';
						str += '</td>';
					});
					if (ada_action) {
						str += '<td column_name="action" align="center">';
						with_action.data.forEach(action => {
							str += '<span id="id_action_trigger--' + action['nama'] + '--' + ((yyy * 1) + 1 + no_urut) + '" style="cursor:pointer;color:#FF2F34;">' + action['label'] + '</span> ';
						});
						str += '</td>';
					}
					str += '</tr>';
				});
				str += '</tbody>';
				str += '</table>';
				return str;
			} else {
				return "<span style='font-family:arial; font-weight:bold; font-size:18px; color: black; border-bottom: 1px solid silver;'>Tidak ada data yang cocok</span>";
			}
		}).bind(this),
		"GenerateInfoStrip": (function ($fetch, tlegend, id = '') {
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
		}).bind(this),
		"List": function ($fetch, tlegend, id = '') { },
		"Table": function ($fetch, tlegend, id = '') { },
		"Grid": function ($fetch, tlegend, id = '') { },
		"Card": function ($fetch, tlegend, id = '') { },
		"Calendar": function ($fetch, tlegend, id = '') { },
		"Graph": function ($fetch, tlegend, id = '') { },
		"GraphDB": function ($fetch, tlegend, id = '') { },
		"CSV": function ($fetch, tlegend, id = '') { },
		"Kanban": function ($fetch, tlegend, id = '') { },
		"Timeline": function ($fetch, tlegend, id = '') { }
	}
	// NOTE - Datastore related methods
	DataStore = {
		// NOTE - SurrealDB
		"SurrealDB": {
			// "initiateSurrealDB": async function(storage, namespace, database, server, user, pass) {
			initSurrealDB: async function (mode = 'Memory', Label, ShortLabel, Connect, SurrealDB, BlueprintsDATA, Modules, cr) {
				let token = mode;
				switch (mode) {
					case 'Memory':
						try {
							//Initiate MEMORY
							if (cr) console.info('Start SurrealDB.Memory connection...');
							if (Connect) {
								// Connect to the database
								SurrealDB.Memory.Metadata = {
									"Name": mode,
									"Label": Label,
									"ShortLabel": ShortLabel,
									"Connect": Connect,
								}
								await SurrealDB.Memory.Instance.connect('mem://');
								await SurrealDB.Memory.Instance.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name });

								//NOTE - CREATE DUMMY DATA 
								let query;
								// query = await SurrealDB.Memory.Instance.query('create test:data1 content {nama:"Damir"}');
								// query = await SurrealDB.Memory.Instance.query('create test:data2 content {nama:"Putri"}');
								// query = await SurrealDB.Memory.Instance.query('create test:data3 content {nama:"Olive"}');
								// query = await SurrealDB.Memory.Instance.query('create test:data4 content {nama:"Puji"}');
								// query = await SurrealDB.Memory.Instance.query('create test:data5 content {nama:"Listyono"}');
								// query = await SurrealDB.Memory.query('select * from test');
								// console.log('query', query);								
							} else {
								SurrealDB.Memory.Instance = false;
							}
							if (cr) console.info('Done SurrealDB.Memory connection...');
						} catch (e) {
							console.error("ERROR SurrealDB.Memory on initialization, ", e);
						}
						break;
					case 'IndexedDB':
						try {
							//Initiate INDEXEDDB
							if (cr) console.info('Start SurrealDB.IndexedDB connection...');
							if (Connect) {
								// Connect to the database
								SurrealDB.IndexedDB.Metadata = {
									"Name": mode,
									"Label": Label,
									"ShortLabel": ShortLabel,
									"Connect": Connect
								}
								await SurrealDB.IndexedDB.Instance.connect(`indxdb://${BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name}`, { user: { username: BlueprintsDATA.Datastore.DefaultUser.Username, password: BlueprintsDATA.Datastore.DefaultUser.Password } });

								// Select a specific namespace / database
								await SurrealDB.IndexedDB.Instance.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name });
							} else {
								SurrealDB.IndexedDB.Instance = false;
							}
							if (cr) console.info('Done SurrealDB.IndexedDB connection...');
						} catch (e) {
							console.error("ERROR SurrealDB.IndexedDB on initialization, ", e);
						}
						break;
					default:
						try {
							//Initiate TESTSERVER
							if (cr) console.info('Start SurrealDB.TestServer connection...');
							if (Connect) {
								// Initialize SurrealDB Server Connection subsystem if UNDEFINED
								if (typeof SurrealDB[mode] == "undefined") {
	
									SurrealDB[mode] = {
										"Metadata": {
											"Name": mode,
											"Label": Label,
											"ShortLabel": ShortLabel,
											"Connect": Connect,
											"ConnectionInfo": [
												BlueprintsDATA.Datastore[mode],
												{
													user: {
														username: BlueprintsDATA.Datastore.DefaultUser.Username,
														password: BlueprintsDATA.Datastore.DefaultUser.Password
													}
												}
											],
											"NSDB": {
												namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name,
												database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name
											}

											
										},
										"Instance": new Modules.Surreal({
											engines: Modules.surrealdbWasmEngines()
										})
									}
								}
								// Connect to the database
								// await SurrealDB[mode].Instance.connect(BlueprintsDATA.Datastore[mode], { user: { username: BlueprintsDATA.Datastore.DefaultUser.Username, password: BlueprintsDATA.Datastore.DefaultUser.Password } });
								await SurrealDB[mode].Instance.connect(...SurrealDB[mode].Metadata.ConnectionInfo);

								// Select a specific namespace / database
								// await SurrealDB[mode].Instance.use({ namespace: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Name, database: BlueprintsDATA.Datastore.Namespaces.ParadigmREVOLUTION.Databases.SystemDB.Name });
								await SurrealDB[mode].Instance.use(SurrealDB[mode].Metadata.NSDB);

								// Signin as a namespace, database, or root user
								token = await SurrealDB[mode].Instance.signin({
									username: BlueprintsDATA.Datastore.DefaultUser.Username,
									password: BlueprintsDATA.Datastore.DefaultUser.Password,
								});
							} else {
								SurrealDB[mode] = {
									"Metadata": {
										"Name": mode,
										"Label": Label,
										"ShortLabel": ShortLabel,
										"Connect": Connect
									},
									"Instance": false
								};
							}

							if (cr) console.info(`Done SurrealDB.${mode}. connection...`);
						} catch (e) {
							console.error(`ERROR SurrealDB.${mode} on initialization, `, e);
						}
						break;
				}
				return token;
			},
			"SurrealQL": {
				"create": (function (tableName, data) {
					if (!tableName || !data) {
						throw new Error('Table name and/or data cannot be null or empty');
					}
					return `CREATE tableName CONTENT $data;`;
				}).bind(this),
				"insert": (function (tableName, data) {
					if (!tableName || !data) {
						throw new Error('Table name and/or data cannot be null or empty');
					}
					return `INSERT INTO $tableName $data;`;
				}).bind(this),
				"insert_array": (function (tableName, data) {
					if (!tableName || !data) {
						throw new Error('Table name and/or data cannot be null or empty');
					}
					return `INSERT INTO ${tableName} ${JSON.stringify(data)};`;
				}).bind(this),
				"insert_uppdate_on_duplicate": (function (tableName, data) {
					if (!tableName || !data) {
						throw new Error('Table name and/or data cannot be null or empty');
					}
					return `INSERT INTO ${tableName} CONTENT ${JSON.stringify(data)};`;
				}).bind(this),
				"select": (function (columns, tableName, where = '', limit = 25) {
					if (!tableName || !columns) {
						throw new Error('Table name and/or Columns cannot be null or empty');
					}
					return `SELECT ${columns} FROM ${tableName} ${where ? `WHERE ${where}` : ''} LIMIT ${limit};`;
				}).bind(this),
				"update": (function (recordId, data) {
					if (!recordId || !data) {
						throw new Error('RecordID name and/or data cannot be null or empty');
					}
					return `UPDATE ${recordId} CONTENT ${JSON.stringify(data)};`;
				}).bind(this),
				"delete": (function (recordID) {
					console.log('arguments in delete', arguments)
					if (!recordID) {
						throw new Error('RecordID cannot be null or empty');
					}
					return `DELETE ${recordID};
`;
				}).bind(this),
			},
			"Get": function (self, target = 'Local') {
				//Load nodes from IndexedDB SurrealDB instance
				async function getData(SDBo, q) {
					console.log('query', q);
					let nodes = await SDBo.Local.query(q);
					console.log('nodes', nodes);
					nodes.forEach(d => {
						self.nodes.push({ id: d.UID, node: d, element: null, position: { x: d.Presentation.Perspectives.GraphNode.Position.x, y: d.Presentation.Perspectives.GraphNode.Position.y } });
					});
					self.DOMElements.renderGraph(self);
				}
				switch (target) {
					case 'Memory':
						window.addEventListener('memoryDBEvent', () => {
							(async () => {
								let q = `select * from ${self.DocumentName} where DocumentName = '${self.DocumentName}' and DocumentType = '${self.DocumentType}' order by Timestamp;`
								console.log('query', q);
								let nodes = await self.Storage.SurrealDB.Memory.query(q);
								console.log('nodes', nodes);
								nodes.forEach(d => {
									self.nodes.push({ id: d.UID, node: d, element: null, position: { x: d.Presentation.Perspectives.GraphNode.Position.x, y: d.Presentation.Perspectives.GraphNode.Position.y } });
								});
								self.DOMElements.renderGraph(self);
							})();
							console.log('MemoryDBEvent load graph data on getGraphFromLocalStore');
						});
						break;
					case 'Local':
						window.addEventListener('indexedDBEvent', () => {
							(async () => {
								console.log('start local get data');
								let q = `select * from ${self.DocumentName} where DocumentName = '${self.DocumentName}' and DocumentType = '${self.DocumentType}' order by Timestamp;`
								console.log('query >>>>', q);
								let nodes = await self.Storage.SurrealDB.Local.query(q);
								console.log('nodes', nodes);
								nodes.forEach(d => {
									self.nodes.push({ id: d.UID, node: d, element: null, position: { x: d.Presentation.Perspectives.GraphNode.Position.x, y: d.Presentation.Perspectives.GraphNode.Position.y } });
								});
								self.DOMElements.renderGraph(self);
							})();
							console.log('IndexedDBEvent load graph data on getGraphFromLocalStore');
						});
						break;
					case 'Server':
						window.addEventListener('serverDBEvent', () => {
							(async () => {
								let q = `select * from ${self.DocumentName} where DocumentName = '${self.DocumentName}' and DocumentType = '${self.DocumentType}' order by Timestamp;`
								console.log('query', q);
								let nodes = await self.Storage.SurrealDB.Server.query(q);
								console.log('nodes', nodes);
								nodes.forEach(d => {
									self.nodes.push({ id: d.UID, node: d, element: null, position: { x: d.Presentation.Perspectives.GraphNode.Position.x, y: d.Presentation.Perspectives.GraphNode.Position.y } });
								});
								self.DOMElements.renderGraph(self);
							})();
							console.log('ServerDBEvent load graph data on getGraphFromLocalStore');
						});
						break;

				}
				//Load nodes from IndexedDB SurrealDB instance
			},
			"Put": function (self, target = 'Local', table, data, cr = 1) {
				console.log('Masuk Put >>>>');
				let result;
				let qstr = "";
				if (cr) {
					console.log('arguments', arguments);
				}
				switch (target) {
					case 'Memory':
						//Save to SurrealDB Memory instance
						(async () => {
							if (data.length > 0) {
								data.forEach(d => {
									qstr += self.Utility.DataStore.SurrealDB.SurrealQL.update(table + `:` + d.UID, d);
								});
								if (cr) console.log('qstr', qstr);
								result = await self.Storage.SurrealDB.Memory.query(qstr);
								if (cr) console.log('UPDATE Data submitted to SurrealDB Memory', result);
							}
						})();
						//Save to SurrealDB Memory instance
						break;
					case 'Local':
						//Save to SurrealDB Local instance
						(async () => {
							if (data.length > 0) {
								data.forEach(d => {
									qstr += self.Utility.DataStore.SurrealDB.SurrealQL.update(table + `:` + d.UID, d);
								});
								if (cr) console.log('qstr', qstr);
								result = await self.Storage.SurrealDB.Local.query(qstr);
								if (cr) console.log('UPDATE Data submitted to SurrealDB Local', result);
							}
						})();
						//Save to SurrealDB Local instance
						break;
					case 'Server':
						//Save to SurrealDB Server instance
						(async () => {
							if (data.length > 0) {
								data.forEach(d => {
									qstr += self.Utility.DataStore.SurrealDB.SurrealQL.update(table + `:` + d.UID, d);
								});
								if (cr) console.log('qstr', qstr);
								result = await self.Storage.SurrealDB.Server.query(qstr);
								if (cr) console.log('UPDATE Data submitted to SurrealDB Server', result);
							}
						})();
						// Save to SurrealDB Server instance
						break;
				}
			},
			"Delete": function (self, target = 'Local', table, data, cr = 1) {
				console.log('Masuk Delete >>>>');
				let result;
				let qstr = "";
				if (cr) {
					console.log('arguments', arguments);
				}
				switch (target) {
					case 'Memory':
						//Save to SurrealDB Memory instance
						(async () => {
							if (data.length > 0) {
								data.forEach(d => {
									qstr += self.Utility.DataStore.SurrealDB.SurrealQL.delete(table + `:` + d);
								});
								result = await self.Storage.SurrealDB.Memory.query(qstr);
								if (cr) console.log('DELETE Data submitted to SurrealDB Memory', result);
							}
						})();
						//Save to SurrealDB Memory instance
						break;
					case 'Local':
						//Save to SurrealDB Local instance
						(async () => {
							if (data.length > 0) {
								data.forEach(d => {
									qstr += self.Utility.DataStore.SurrealDB.SurrealQL.delete(table + `:` + d);
								});
								result = await self.Storage.SurrealDB.Local.query(qstr);
								if (cr) console.log('DELETE Data submitted to SurrealDB Local', result);
							}
						})();
						//Save to SurrealDB Local instance
						break;
					case 'Server':
						//Save to SurrealDB Server instance
						(async () => {
							if (data.length > 0) {
								data.forEach(d => {
									qstr += self.Utility.DataStore.SurrealDB.SurrealQL.delete(table + `:` + d);
								});
								if (cr) console.info(qstr);
								result = await self.Storage.SurrealDB.Server.query(qstr);
								if (cr) console.log('DELETE Data submitted to SurrealDB Server', result);
							}
						})();
						// Save to SurrealDB Server instance
						break;
				}
			},
		}
	}
};
if (cr) console.log('<<< Utility.mjs');