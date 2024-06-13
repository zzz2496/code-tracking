import { NodeProperties } from "./NodeProperties.mjs";
import { Surreal } from 'https://unpkg.com/surrealdb.wasm/lib/full.js';

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
export class Utility {
	constructor(cr) {
		if (cr) {
			// console.log("Utility class initialized !");
			this.cr = cr;
		}
		this.zoom_level = 1;
		this.activeElement = null;
		this.makingConnection = false;
		this.ConnectionDirection = null;

		this.characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}|;:",.<>?/~`';
		this.passwordLength = 16;
		this.Operators = {
			"datetime": [">", ">=", "=", "!=", "<=", "<", "is", "is not"],
			"number": [">", ">=", "=", "!=", "<=", "<", "contains"],
			"string": ["starts with", "ends with", "contains", "is", "is not",],
			"boolean": ["is", "is not"],
			"array": ["starts with", "ends with", "contains", "in", "not in"]
		};
	};

	checkType = function (variable) {
		// console.log(typeof variable);
		if (variable instanceof Date) {
			return "DateTime";
		} else if (typeof variable === 'number') {
			return "Number";
		} else if (typeof variable === 'string') {
			// Check for string representations of numbers, allowing for commas as thousand separators
			if (/^-?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(variable)) {
				return "Number";
			}
			// Check for string representations of booleans
			else if (variable.toLowerCase() === "true" || variable.toLowerCase() === "yes" || variable.toLowerCase() === "ya" || variable.toLowerCase() === "sudah") {
				return "Boolean";
			}
			else if (variable.toLowerCase() === "false" || variable.toLowerCase() === "no" || variable.toLowerCase() === "tidak" || variable.toLowerCase() === "belum") {
				return "Boolean";
			}
			else {
				return "String";
			}
		} else if (typeof variable === 'boolean') {
			return "Boolean";
		} else if (Array.isArray(variable)) {
			return "Array";
		} else if (typeof variable === 'object') {
			return "Object";
		} else if (variable === null) {
			return 'null';
		} else {
			return "Unknown";
		}
	}

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
	Strings = {
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
						.replace(/[^a-zA-Z0-9\/\s\-_,.()+@=$%:&<>'"]/g, '')
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
						.replace(/[^a-zA-Z0-9\/\s\-_,.()+@=$%:&<>'"]/g, '')
						.replace(/\s+/g, ' ')
						.trim() : '';
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
	Numbers = {
		"SafeNumber": (function (input, nullable = false) {
			let datatype = this.checkType(input);
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
						input = input.replace(',', '');  // Remove the period from the string
					}
					if (isNaN(input) || !isFinite(input)) {
						return (nullable) ? null : 0;
					}
					return input;
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
			// return Math.random().toString().replace("0.", "");
			return 'xxxxxxxx-xxyx-xyxx-yxxx-xxxxxxxxxxxx'.replace(/[xyz]/g, function (c) {
				const r = (Math.random() * 16) | 0;
				const v = c === 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
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
		"ThousandSeparator": (function (num, decpoint, sep) {
			if (num == null) {
				num = 0;
			}

			// Check if num is a string and if so, attempt to convert it to a number
			if (typeof num === "string") {
				if (isNaN(Number(num))) {
					return "Invalid input";
				}
				num = Number(num);
			}

			// Handle negative numbers by temporarily converting to positive,
			// then adding the negative sign back at the end.
			let isNegative = false;
			if (num < 0) {
				isNegative = true;
				num = Math.abs(num);
			}

			// Convert number to string and split it into whole and decimal parts.
			let [whole, decimal] = num.toFixed(2).toString().split(decpoint);

			// Add the thousand separators to the whole number part.
			whole = parseInt(whole).toLocaleString('en-US', {
				maximumFractionDigits: 0,
			});

			// Join everything back together.
			let result = decimal ? whole + decpoint + decimal : whole;

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
	Objects = {
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
	};
	Array = {
		"IsArrayOK": (function (array, zlabel) {
			if (arguments.length > 1) if (this.Strings.SafeString(zlabel).length === 0) label = '';
			let label = zlabel + ' ';
			if (typeof array !== 'object') {
				console.error('Array ' + label + 'not an object');
				return { "status": false, "message": 'Array not an object' };
			}
			if (!Array.isArray(array)) {
				console.error('Array ' + label + 'not an array');
				return { "status": false, "message": 'Array ' + label + 'not an array' };
			}
			if (array.length == 0) {
				console.error('Array ' + label + 'length = 0');
				return { "status": false, "message": 'Array ' + label + 'length = 0' };
			}
			return { "status": true, "message": "" };
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
				// console.log('>>>>>>', array, i, ii, array[i][ii]);
				// console.log('check for operator', Operator.toLowerCase(), this.Operators['string']);
				// console.log(this.Operators['string'].indexOf(Operator.toLowerCase()));
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
				// console.log("check data", array[i][ii], check_data, value);
				// console.log("check array", array[i]);//, check_data, value);
				// console.log('CHECK >>>>>>', array, i, ii, array[i][ii], value);
				// console.log('check for operator', Operator.toLowerCase(), this.Operators['boolean']);
				// console.log(this.Operators['boolean'].indexOf(Operator.toLowerCase()));
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
	DataStore = {
		"LocalStore": {
			"saveGraphToLocalStore": function (self, collection, document_id) {
				//Save to Storage.LocalStore
				console.log('Save Nodes to LocalStore');
				let storeNodes = [];
				self.nodes.forEach((d, i) => {
					storeNodes.push(d.node);
				});
				self.Storage.LocalStore.collection(collection).doc(document_id).set({
					Revision: 0,
					Nodes: storeNodes
				});
				//Save to Storage.LocalStore
			},
			"getGraphFromLocalStore": function (self, collection, document_id) {
				//GET NODES FROM LOCALSTORE
				console.log('Get Nodes from LocalStore');
				self.Storage.LocalStore.collection(collection).doc(document_id).get().then(res => {
					// console.log(res);
					if (res == null) return;
					res.Nodes.forEach(d => {
						// console.log('d >>>>>>', d.Presentation.Perspectives.GraphNode.Position);
						self.nodes.push({ id: d.UID, node: d, element: null, position: { x: d.Presentation.Perspectives.GraphNode.Position.x, y: d.Presentation.Perspectives.GraphNode.Position.y } });
					});
					self.DOMElements.renderGraph(self);
				});
				//GET NODES FROM LOCALSTORE
			}
		},
		"SurrealDB": new Surreal(),
	}
};
export class IndexedDBHandler {
	constructor(databaseName, version, storeName) {
		this.dbName = databaseName;
		this.version = version;
		this.storeName = storeName;
		this.db = null;
		this.Utility = new Utility();
	}

	openDatabase() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);

			request.onerror = (event) => {
				reject(new Error(`Error opening database: ${event.target.error}`));
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				this.db = event.target.result;
				if (!this.db.objectStoreNames.contains(this.storeName)) {
					this.db.createObjectStore(this.storeName, { keyPath: 'uuid'});
				}
			};
		});
	}

	closeDatabase() {
		if (this.db) {
			this.db.close();
		}
	}

	async addRecord(record, Tuuid=null) {
		// console.log('arguments', arguments);
		console.log('record', record);
		console.log('Tuuid', Tuuid);
		if (!this.db) {
			await this.openDatabase();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const objectStore = transaction.objectStore(this.storeName);

			// Generate a UUID as the primary key.
			const uuid = (Tuuid == null) ? this.Utility.Numbers.generateUUID() : Tuuid;
			
			// Set the UUID as the primary key for the record.
			record.uuid = uuid;

			const request = objectStore.add(record);

			request.onsuccess = (event) => {
				resolve(uuid);
			};

			request.onerror = (event) => {
				reject(new Error(`Error adding record: ${event.target.error}`));
			};
		});
	}

	async updateRecord(id, newData) {
		if (!this.db) {
			await this.openDatabase();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const objectStore = transaction.objectStore(this.storeName);

			const getRequest = objectStore.get(id);

			getRequest.onsuccess = (event) => {
				const existingData = event.target.result;
				if (existingData) {
					const updatedData = { ...existingData, ...newData };
					const updateRequest = objectStore.put(updatedData, id);

					updateRequest.onsuccess = () => {
						resolve(id);
					};

					updateRequest.onerror = (event) => {
						reject(new Error(`Error updating record: ${event.target.error}`));
					};
				} else {
					reject(new Error(`Record with id ${id} not found.`));
				}
			};

			getRequest.onerror = (event) => {
				reject(new Error(`Error getting record: ${event.target.error}`));
			};
		});
	}

	async deleteRecord(id) {
		if (!this.db) {
			await this.openDatabase();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readwrite');
			const objectStore = transaction.objectStore(this.storeName);

			const request = objectStore.delete(id);

			request.onsuccess = () => {
				resolve(id);
			};

			request.onerror = (event) => {
				reject(new Error(`Error deleting record: ${event.target.error}`));
			};
		});
	}

	async getRecordsWithCriteria(criteria) {
		if (!this.db) {
			await this.openDatabase();
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], 'readonly');
			const objectStore = transaction.objectStore(this.storeName);

			const request = objectStore.openCursor();

			const matchingRecords = [];

			request.onsuccess = (event) => {
				const cursor = event.target.result;
				console.log('this.Utility.checkType(criteria)', this.Utility.checkType(criteria));
				if (cursor) {
					if (this.Utility.checkType(criteria) == 'Array') {
						console.log('criteria >>', criteria);
						criteria.forEach(d => {
							if (this.checkCriteria(cursor.value, d)) {
								matchingRecords.push(cursor.value);
							}
						});
						cursor.continue();
						
					} else if (this.Utility.checkType(criteria)=='Object') {
						if (this.checkCriteria(cursor.value, criteria)) {
							matchingRecords.push(cursor.value);
						}
						cursor.continue();
					}
				} else {
					resolve(matchingRecords);
				}
			};

			request.onerror = (event) => {
				reject(new Error(`Error getting records: ${event.target.error}`));
			};
		});
	}
	checkCriteria(record, criteria) {
		const { operator, field, value } = criteria;
		switch (operator) {
			case '>':
				return record[field] > value;
			case '>=':
				return record[field] >= value;
			case '<':
				return record[field] < value;
			case '<=':
				return record[field] <= value;
			case '==':
				return record[field] == value;
			case '===':
				return record[field] === value;
			default:
				return false;
		}
	}

	async getAllRecords() {
		const db = await this.openDatabase();

		return new Promise(async (resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readonly');
			const objectStore = transaction.objectStore(this.storeName);

			const request = objectStore.getAll();

			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = (event) => {
				reject(new Error(`Error getting all records: ${event.target.error}`));
			};

			await transaction.complete;
			await this.closeDatabase(db);
		});
	}
}

export class DataStoreUtilities {
	SurrealDB = new Surreal();
}


export class DOMUtilities {
	DOMElements = {
		"RoundToNearestBase": function (num, base) {
			return Math.round(num / base) * base;
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
		},
		"initElementEventsDataset": function (element) {
			// element.dataset.onwheelEventInitialized = 'false';
			// element.dataset.onfocusEventInitialized = 'false';
			// element.dataset.onfocusoutEventInitialized = 'false';
			// element.dataset.onclickEventInitialized = 'false';
			// element.dataset.onmousedownEventInitialized = 'false';
			// element.dataset.onmouseupEventInitialized = 'false';
			// element.dataset.onmousemoveEventInitialized = 'false';

			// element.dataset.ontouchstartEventInitialized = 'false';
			// element.dataset.ontouchendEventInitialized = 'false';
			// element.dataset.ontouchmoveEventInitialized = 'false';
			return element;
		},
		"resetElementEventsDataset": function () {
			document.querySelectorAll('div').forEach(element => {
				element.dataset.onwheelEventInitialized = 'false';
				element.dataset.onfocusEventInitialized = 'false';
				element.dataset.onfocusoutEventInitialized = 'false';
				element.dataset.onclickEventInitialized = 'false';
				element.dataset.onmousedownEventInitialized = 'false';
				element.dataset.onmouseupEventInitialized = 'false';
				element.dataset.onmousemoveEventInitialized = 'false';
	
				element.dataset.ontouchstartEventInitialized = 'false';
				element.dataset.ontouchendEventInitialized = 'false';
				element.dataset.ontouchmoveEventInitialized = 'false';	
			});
		},
		"renderGraphConnections": (function (conns, graphSurface, cr = false) {
			if (cr) console.log('Masuk renderGraphConnections');
			// if (cr) console.log('this', this.DOMElements.FindPosition());
			if (arguments.length == 0) {
				console.error('Connections array needed!');
				return;
			}
			if (conns.length == 0) {
				console.error('Connections array is empty!');
				return;
			}
			if (!Array.isArray(conns)) {
				console.error('Connections array is not an array!');
				return;
			}

			// let svgChildren = graphSurface.svg.querySelectorAll('path').length;
			let svgChildren = document.querySelectorAll(`#${graphSurface.svg.id} > path`).length;;

			let connArrayLength = conns.length;
			if (cr) console.log(`svgChildren: ${svgChildren}, connArrayLength:${connArrayLength}`);
			let utilClass = this;
			let DOMUtils = new DOMUtilities();
			if (svgChildren == 0) {
				if (cr) console.log('svg children = 0');
				// graphSurface.svg.textContent = '';
				conns.forEach(function (conn, idx, arr) {
					let src = DOMUtils.DOMElements.FindPosition(conns[idx].Source);
					let dst = DOMUtils.DOMElements.FindPosition(conns[idx].Destination);

					conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
					conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
					conns[idx].path = conns[idx].createQCurve();
					graphSurface.svg.appendChild(conns[idx].path);
					document.querySelector(`i#${conns[idx].Source}`).dataset.Connected = true;
					document.querySelector(`i#${conns[idx].Destination}`).dataset.Connected = true;
				});
			} else if (svgChildren != connArrayLength) {
				if (cr) console.log('svgChildren != connArrayLength');
				conns.forEach(function (conn, idx, arr) {
					// console.log('conns foreach ke '+idx);
					let src = DOMUtils.DOMElements.FindPosition(conns[idx].Source);
					let src_coord_str = `${src.x},${src.y}`;

					let dst = DOMUtils.DOMElements.FindPosition(conns[idx].Destination);
					let dst_coord_str = `${dst.x},${dst.y}`;

					conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
					conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
					if (idx < (svgChildren)) {
						console.log(conns[idx]);
						//IF Connection's current cursor array index is smaller or equal than svg children index, connections array and svg children are still hand on hand
						if (conns[idx].pathMode == 'h') {
							conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
						} else {
							conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
						}
					} else {
						console.log(conns[idx]);
						//IF Connection's current cursor array index is larger than svg children's index, need to create new svg children.
						conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
						conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
						conns[idx].path = conns[idx].createQCurve();
						graphSurface.svg.appendChild(conns[idx].path);
					}
				});
			} else if (svgChildren == connArrayLength) {
				if (cr) console.log('svgChildren == connArrayLength');
				conns.forEach(function (conn, idx, arr) {
					let src = DOMUtils.DOMElements.FindPosition(conns[idx].Source);
					let src_coord_str = `${src.x},${src.y}`;

					let dst = DOMUtils.DOMElements.FindPosition(conns[idx].Destination);
					let dst_coord_str = `${dst.x},${dst.y}`;

					conns[idx].startPos = { x: Math.round(src.x / utilClass.zoom_level), y: Math.round(src.y / utilClass.zoom_level) };
					conns[idx].endPos = { x: Math.round(dst.x / utilClass.zoom_level), y: Math.round(dst.y / utilClass.zoom_level) };
					if (conns[idx].pathMode == 'h') {
						conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
					} else {
						conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
					}
				});
			}
		}).bind(this),
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
				console.log('this >>>>', this);
				newElement = this.initElementEventsDataset(newElement);
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
				if (newElement.querySelector('.x_title') != null) this.initElementEventsDataset(newElement.querySelector('.x_title'));
				this.initElementEventsDataset(newElement.querySelector('.x_content'));
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
			newElement = this.initElementEventsDataset(newElement);
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
			if (newElement.querySelector('.toolbar-titlebar') != null) this.initElementEventsDataset(newElement.querySelector('.toolbar-titlebar'));
			this.initElementEventsDataset(newElement.querySelector('.toolbar-content'));

			newElement.querySelector(`#${id}-content`).appendChild(content);
			return newElement;
		},
		"MakeDraggableNode": function (id, objclass, label, content, x, y, zIndex = 'auto') {
			let newElement = document.createElement('div');
			newElement.id = id;
			newElement.className = objclass;
			newElement.style.top = `${y}px`;
			newElement.style.left = `${x}px`;
			newElement.style.zIndex = zIndex;
			newElement.tabIndex = 0;
			newElement.innerHTML = `
				<div class="container text-center" style="margin:0px; padding: 0px;">
					<div class="row g-0 top-row" style="margin:0; padding:0;">
						<div class="container-fluid text-center connection-container" style="overflow:hidden; max-width: 40vh;margin:0; padding: 0;">
							<i class="remove-connection fa-solid fa-minus text-danger-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
							<span class="top-input"></span>
							<i class="add-connection fa-solid fa-plus text-danger-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
						</div>
					</div>
					<div class="d-flex mid-row">
						<div class="flex d-flex align-items-center left-column" style="overflow:hidden; margin:0; padding: 0;">
							<div class="container text-start connection-container" style="width:1vx;overflow:hidden; margin:0; padding: 0;">
								<i class="add-connection fa-solid fa-plus text-warning-emphasis" style="--bs-text-opacity: .8;" data--connection-direction="h" data-click-event-initialized="false"></i><br>
								<span class="left-input connection-column" style="flex-direction: column;align-items: center;"></span>
								<i class="remove-connection fa-solid fa-minus text-warning-emphasis" style="--bs-text-opacity: .8; data--connection-direction="h" data-click-event-initialized="false"></i>
							</div>
						</div>
						<div class="flex-fill mid-column" style="margin:0vh; padding: 0;">
							<div id="${id}-header" class="raised-element container-fluid graph-node-titlebar" >${label}</div>
							<div id="${id}-content" style="margin-top: 1rem;">${content}</div>
						</div>
						<div class="flex d-flex align-items-center right-column" style="overflow:hidden; margin:0; padding: 0;">
							<div class="container text-end connection-container" style="margin:0; padding:0;">
								<i class="add-connection fa-solid fa-plus text-success-emphasis" style="--bs-text-opacity: .8;" data--connection-direction="h" data-click-event-initialized="false"></i><br>
								<span class="right-output connection-column" style="flex-direction: column;align-items: center;"></span>
								<i class="remove-connection fa-solid fa-minus text-success-emphasis" style="--bs-text-opacity: .8; data--connection-direction="h" data-click-event-initialized="false"></i><br>
							</div>
						</div>
					</div>
					<div class="row g-0 bottom-row" style="height:1vx;margin:0; padding: 0;">
						<div class="container-fluid connection-container" style="overflow:hidden; max-width: 40vh;margin:0; padding: 0;">
							<i class="remove-connection fa-solid fa-minus text-success-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
							<span class="bottom-output"></span>
							<i class="add-connection fa-solid fa-plus text-success-emphasis" style="--bs-text-opacity: .8; data--connection-direction="v" data-click-event-initialized="false"></i>
						</div>
					</div>
				</div>
			`;
			this.initElementEventsDataset(newElement.querySelector('.graph-node-titlebar'));
			newElement.addEventListener('animationend', function () {
				this.classList.remove('fade-in');
			});
			return newElement;
		},
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
		"DragElement": (function (elmnt, zoomed = false, snap_every = 1, callback) {
			//DragElement in Utility
			console.log('this', this);
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0, self = this;
			if (document.getElementById(elmnt.id + "-header")) {
				// If present, the header is where you move the DIV from:
				let el = document.getElementById(elmnt.id + "-header");

				el.onmousedown = dragMouseDown;
				el.addEventListener("touchstart", touchStart, { passive: false });
			} else {
				// Otherwise, move the DIV from anywhere inside the DIV:
				elmnt.onmousedown = dragMouseDown;
				elmnt.addEventListener("touchstart", touchStart, { passive: false });
			}

			function dragMouseDown(e) {
				if (self.activeElement == null) self.activeElement = elmnt.id;
				if (self.activeElement != elmnt.id) return; // Prevent initiating another drag
				self.activeElement = elmnt.id;
				e = e || window.event;
				e.preventDefault();
				// get the mouse cursor position at startup:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = self.DOMElements.RoundToNearestBase((e.clientX / divider), snap_every);
				pos4 = self.DOMElements.RoundToNearestBase((e.clientY / divider), snap_every);
				document.onmouseup = closeDragElement;
				// call a function whenever the cursor moves:
				document.onmousemove = elementDrag;
			}

			function touchStart(e) {
				if (self.activeElement == null) self.activeElement = elmnt.id;
				if (self.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				document.getElementById('touchevent').innerHTML = 'Touch Start';
				document.getElementById('touchelement').innerHTML = self.activeElement;
				const touch = e.changedTouches[0];
				// Reset the initial touch position at the start of a new touch:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = this.RoundToNearestBase((touch.clientX / divider), snap_every);
				pos4 = this.RoundToNearestBase((touch.clientY / divider), snap_every);
				// Ensure previous touchend and touchmove event listeners are removed:
				document.removeEventListener("touchend", closeDragElement);
				document.removeEventListener("touchmove", elementDrag);
				// Attach new event listeners:
				document.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
				document.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
			}

			function elementDrag(e) {
				if (self.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				// calculate the new cursor/touch position:
				let clientX, clientY;
				let divider = (zoomed) ? this.zoom_level : 1;

				if (e.type === "touchmove") {
					document.getElementById('touchevent').innerHTML = 'Touch Move';
					const touch = e.changedTouches[0];
					clientX = self.DOMElements.RoundToNearestBase((touch.clientX / divider), snap_every);
					clientY = self.DOMElements.RoundToNearestBase((touch.clientY / divider), snap_every);
				} else {
					clientX = self.DOMElements.RoundToNearestBase((e.clientX / divider), snap_every);
					clientY = self.DOMElements.RoundToNearestBase((e.clientY / divider), snap_every);
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
				console.log('this', this);
				self.activeElement = null;

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
					let element = DOMUtilities.DOMElements.FindPosition(this);
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
					DOMUtilities.DOMElements.renderGraphConnections(connections, graphSurface);
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

					let element = DOMUtilities.DOMElements.FindPosition(this);
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
		}).bind(this),

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
		"GenerateTableV2": (function (id, dataset, with_action, npage_num = 1, npage_result_number = 0) {
			console.log('Type of Dataset', this.checkType(dataset), dataset);
			console.log('Type of with_action', this.checkType(with_action), with_action);
			if (!Array.isArray(dataset)) console.error("Invalid arguments: 'dataset' must be an array");
			if (this.checkType(with_action) !== 'Unknown' && typeof with_action !== 'object') console.error("'with_action' must be an object");

			let page_number = npage_num || 0;
			let no_urut = page_number * (npage_result_number || 0);
			let ada_action = (typeof with_action == 'object') && (with_action !== null);
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
	};
}

// import { Utility } from "./UtilityClass.mjs";
export class GraphSurface {
	constructor(storageClass) {
		this.svg = null;//SVG where the line paths are drawn
		// console.log('arguments', arguments);
		this.Utility = new Utility();
		this.DOMUtilities = new DOMUtilities();
		this.Storage = storageClass;
		// this.NodeProperties = new NodeProperties();
		this.zoom_level = 1;
		this.activeElement = null;
		this.makingConnection = false;
		this.ConnectionDirection = null;
		this.id_graph_surface = null;
		this.div_graph_surface = null;
		this.controlPalette = null;
		this.panel = null;
		this.id_graph_control_palette = null;
		this.control_palette_xpanel = null;
		this.nodes = [];
		this.connections = [];
		this.startPosX = 0;
		this.startPosY = 0;
		this.startElement = null;
		this.mousedown = false;
		this.newConn = false;
		this.tempConn = null;
		this.centerPointOfDocumentRelativeToViewport = null;
		this.graph_canvas_dimension = {
			width: 20000,
			height: 20000
		};
		this.divs = null;
		this.selectedDivs = null;
		this.snapEvery = 10;
	}
	initializeGraphSurface = function (graphSurfaceID) {
		//TEMPORARY VARIABLE TO HOLD "this"
		let self = this;

		//Graph Container Initialization and Processing

		function createGraphContainer(obj) {
			//Creation Graph Container
			//ID of the Graph Container
			obj.id_graph_surface = graphSurfaceID;

			obj.div_graph_surface = document.createElement('div');
			obj.div_graph_surface.id = obj.id_graph_surface;
			// obj.div_graph_surface.className = 'graph-surface';
			obj.div_graph_surface.style.width = '100vw';
			obj.div_graph_surface.style.height = '100vh';
			obj.div_graph_surface.style.overflow = 'scroll';
			obj.div_graph_surface.style.position = 'relative';

			// this.div_graph_surface = this.DOMUtilities.DOMElements.initElementEventsDataset(this.div_graph_surface);

			//Creation of Graph Surface in Graph Container
			obj.div_graph_surface.appendChild(obj.DOMElements.initiateGraphSurfaceContainer(obj.id_graph_surface));
		}

		function createGraphControlPaletteContainer(obj) {
			//Initialization of Graph Surface in Graph Container
			obj.svg = obj.div_graph_surface.querySelector('#' + obj.id_graph_surface + '-connsvg');
			obj.svg.ns = obj.svg.namespaceURI;

			//Creation and Initialization Graph Control Palette
			//ID of the Graph Control Palette
			obj.id_graph_control_palette_container = obj.id_graph_surface + '_control_palette_container';

			obj.div_graph_control_palette = document.createElement('div');
			obj.div_graph_control_palette.id = obj.id_graph_control_palette_container;
			// obj.div_graph_control_palette = obj.DOMUtilities.DOMElements.initElementEventsDataset(obj.div_graph_control_palette);

			//Prepend Graph Control Palette into Graph Container
			obj.div_graph_surface.appendChild(obj.div_graph_control_palette);

		}
	
		createGraphContainer(this);
		createGraphControlPaletteContainer(this);

		// Creation of Graph Surface in Graph Container
		this.zoom_level = 1;
		this.controlPalette = document.createElement('table');
		this.controlPalette.className = 'toolbar-kit';
		this.controlPalette.style.width = '100%';
		this.controlPalette.innerHTML = `
			<tr>
				<td colspan="3">ZOOM Level (<label id='zoom-level'>${this.zoom_level}</label>)</td>
			</tr>
			<tr>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-zoom-out"><i class="fa-solid fa-minus"></i></button></td>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-zoom-reset">RESET</button></td>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-zoom-in"><i class="fa-solid fa-plus"></i></button></td>
			</tr>
			<tr>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-node-reduce"><i class="fa-solid fa-minus"></i></button></td>
				<td>NODE</td>
				<td><button class="raised-element" id="${this.id_graph_control_palette_container}-node-add"><i class="fa-solid fa-plus"></i></button></td>
			</tr>
			<tr>
				<td></td>
				<td>Vertical Link</td>
				<td><input type='checkbox' id='${this.id_graph_control_palette_container}-vertical_link'></td>
			</tr>
			<tr>
				<td colspan='3'>Tilt Control</td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), '', 'up')">Up</button></td>
				<td></td>
			</tr>
			<tr>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), 'left')">Left</button></td>
				<td></td>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), 'right')">Right</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateTilt(document.getElementById('control-palette'), '', 'down')">Down</button></td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>Slide Control</td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('top-panel'), 'top')">Up</button></td>
				<td></td>
			</tr>
			<tr>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('left-panel'), 'left')">Left</button></td>
				<td></td>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('right-panel'), 'right')">Right</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button class="raised-element" onclick="animateSlide(document.getElementById('bottom-panel'), 'bottom')">Down</button></td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>Switch Theme</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<button class="raised-element" id="${this.id_graph_control_palette_container}___theme-switch" style="color:red;"><i class="fa-solid fa-repeat"></i></button>
				</td>
				<td></td>
			</tr>
			<tr>
				<td colspan='3'>
					<label>Mouse X</label>: <span id="${this.id_graph_control_palette_container}___mouse-x"></span><br>
					<label>Mouse Y</label>: <span id="${this.id_graph_control_palette_container}___mouse-y"></span>
				</td>
			</tr>
			`;

		this.panel = this.DOMUtilities.DOMElements.makeXpanel({
			id: '',
			class: '',
			// title: 'Control Palette',
			title: '',
			smalltitle: '',
			contentid: 'control_palette',
			content: this.controlPalette
		});

		this.id_graph_control_palette = this.id_graph_control_palette_container + '___control_palette';
		this.control_palette_xpanel = this.DOMUtilities.DOMElements.MakeDraggableDiv(this.id_graph_control_palette, 'Control Palette', this.panel, 10, 10, 'auto');
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container).appendChild(this.control_palette_xpanel);



































		//HANDLE ON CANVAS NAVIGATION, CLICK TO SCROLL LEFT RIGHT UP DOWN, SCROLL TO ZOOM IN OR OUT

		//ZOOM EVENT HANDLER
		function animateZoom(el, event) {
			let element = el;
			let centers;
			if (typeof el == 'string') {
				element = self.div_graph_surface.querySelector('#' + el);
			}
			self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transform = `scale(${self.zoom_level}, ${self.zoom_level})`;
			self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph-surface').style.transformOrigin = '0px 0px';
			self.zoom_level = self.Utility.Numbers.Round1(self.zoom_level);
			self.div_graph_surface.querySelector('#zoom-level').innerHTML = self.zoom_level;
		}

		self.div_graph_surface.addEventListener('wheel', function (event) {
			event.preventDefault();
			if (event.deltaY < 0) {
				if (self.zoom_level < 3) self.zoom_level += 0.1;
			} else {
				if (self.zoom_level > 0.2) self.zoom_level -= 0.1;
			}
			self.zoom_level = self.Utility.Numbers.Round1(self.zoom_level);
			animateZoom(self.div_graph_surface, event);
			// self.DOMUtilities.DOMElements.scrollTo(self.div_graph_surface, event);
		});

		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-in').addEventListener('click', function () {
			if (self.zoom_level < 3) self.zoom_level += 0.1;
			animateZoom(self.div_graph_surface);
		});
		console.log('#' + this.id_graph_control_palette_container + '-zoom-reset');
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-reset').addEventListener('click', function () {
			self.zoom_level = 1;
			animateZoom(self.div_graph_surface);
		});
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '-zoom-out').addEventListener('click', function () {
			if (self.zoom_level > 0.2) self.zoom_level -= 0.1;
			animateZoom(self.div_graph_surface);
		});
		//ZOOM EVENT HANDLER

		// Initialize variables for selection
		let isSelecting = false;
		let BoxStart = { x: 0, y: 0 };
		let selectionStart = { x: 0, y: 0 };
		let BoxEnd = { x: 0, y: 0 };
		let selectionEnd = { x: 0, y: 0 };
		self.selectedDivs = new Set(); // Keep track of selected divs
		let selectionBox; // The visual selection area element

		self.divs = document.querySelectorAll('.graph-node'); // Replace 'your-div-class' with the class name of your divs

		function createSelectionBox() {
			selectionBox = document.createElement('div');
			selectionBox.classList.add('selection-box'); // Apply CSS styling for the selection box
			self.div_graph_surface.appendChild(selectionBox);
		}

		function updateSelection() {
			self.divs.forEach(div => {
				const rect = div.getBoundingClientRect();
				const divX = rect.left + window.scrollX;
				const divY = rect.top + window.scrollY;

				if (
					divX >= Math.min(selectionStart.x, selectionEnd.x) &&
					divX + rect.width <= Math.max(selectionStart.x, selectionEnd.x) &&
					divY >= Math.min(selectionStart.y, selectionEnd.y) &&
					divY + rect.height <= Math.max(selectionStart.y, selectionEnd.y)
				) {
					div.classList.add('onselect');
					self.selectedDivs.add(div);
				} else {
					div.classList.remove('onselect');
					self.selectedDivs.delete(div);
				}
			});
		}

		function dragSelectedDivs(e, selectedDivs, callback) {
			e.preventDefault();
			console.log('start on drag, mousedown >>');

			// Store the initial mouse/touch position
			let initialX, initialY;
			if (e.type === "touchstart") {
				initialX = e.changedTouches[0].clientX;
				initialY = e.changedTouches[0].clientY;
			} else {
				initialX = e.clientX;
				initialY = e.clientY;
			}

			const dragHandler = function (event) {
				event.preventDefault();
				console.log('start on drag, mousemove >>');

				// Calculate the distance moved by the mouse/touch
				const deltaX = event.clientX - initialX;
				const deltaY = event.clientY - initialY;

				console.log('delta', deltaX, deltaY);

				// Update the position of each selected div without snapping for smooth movement
				self.selectedDivs.forEach((div) => {
					const currentLeft = parseInt(div.style.left) || 0;
					const currentTop = parseInt(div.style.top) || 0;

					// Calculate new positions without snapping
					let divider = self.zoom_level;
					const newLeft = currentLeft + deltaX / divider;
					const newTop = currentTop + deltaY / divider;

					div.style.left = newLeft + "px";
					div.style.top = newTop + "px";
				});

				// Update the initial mouse/touch position
				if (event.type === "touchmove") {
					initialX = event.changedTouches[0].clientX;
					initialY = event.changedTouches[0].clientY;
				} else {
					initialX = event.clientX;
					initialY = event.clientY;
				}
			};

			const stopDragHandler = function () {
				console.log('start on drag, mouseup >>');
				document.removeEventListener("mousemove", dragHandler);
				document.removeEventListener("touchmove", dragHandler);
				document.removeEventListener("mouseup", stopDragHandler);
				document.removeEventListener("touchend", stopDragHandler);

				// Perform snapping after the drag is complete
				self.selectedDivs.forEach((div) => {
					const currentLeft = parseInt(div.style.left) || 0;
					const currentTop = parseInt(div.style.top) || 0;

					// Snap to the nearest grid position
					const snappedLeft = Math.round(currentLeft / self.snapEvery) * self.snapEvery;
					const snappedTop = Math.round(currentTop / self.snapEvery) * self.snapEvery;

					div.style.left = snappedLeft + "px";
					div.style.top = snappedTop + "px";

					let found = self.Utility.Array.findArrayElement(self.nodes, 'id', div.id, 0);
					// console.log('self.nodes[found.array_index]', self.nodes[found.array_index].node);
					self.nodes[found.array_index].node.Presentation.Perspectives.GraphNode.Position = { x: snappedLeft, y: snappedTop };
				});
				if (typeof callback === 'function') callback();
			};

			// Add event listeners to handle dragging
			document.addEventListener("mousemove", dragHandler);
			document.addEventListener("touchmove", dragHandler, { passive: false });
			document.addEventListener("mouseup", stopDragHandler);
			document.addEventListener("touchend", stopDragHandler, { passive: false });
		}
		function onMouseDownHandler(e) {
			dragSelectedDivs(e, self.selectedDivs, function () {
				if (self.connections.length > 0) self.DOMElements.renderGraphConnections(self.connections, self);
				self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
			});
		}
		function finalizeSelection() {
			// FINALIZE SELECTION FROM SHIFT CLICK DRAG
			self.selectedDivs.forEach((div) => {
				div.classList.replace("onselect", "active");
				div.dataset.isActive = true;
				div.addEventListener("mousedown", onMouseDownHandler);
			});
		}

		// Reset selection when connsvg is clicked
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventListener('click', function (e) {
			// Clear the previous selection
			if (e.shiftKey) return;
			self.divs = document.querySelectorAll('.graph-node');
			self.divs.forEach((div) => {
				div.removeEventListener("mousedown", onMouseDownHandler);
				div.removeEventListener("mousedown", self.onNodeClick);
			});
			self.DOMElements.DragElementArray(self.divs, true, function () { }, function () {
				console.log('Done reset on DragElementArray');
			});

			self.resetSelection(self);

		});

		let pos = { top: 0, left: 0, x: 0, y: 0 };
		const mouseDownHandler = function (e) {
			// Check if the event target is the div itself and not any other element within the div
			if (e.target !== self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg')) return;

			// Check if the shift key is held down
			if (e.shiftKey) {
				isSelecting = true;
				BoxStart = { x: e.clientX + self.div_graph_surface.scrollLeft, y: e.clientY + self.div_graph_surface.scrollTop };
				BoxEnd = { x: e.clientX + self.div_graph_surface.scrollLeft, y: e.clientY + self.div_graph_surface.scrollTop };
				selectionStart = { x: e.clientX, y: e.clientY };
				selectionEnd = { x: e.clientX, y: e.clientY };

				createSelectionBox();
			} else {
				// console.log('masuk moousedown handler biasa');
				self.div_graph_surface.style.cursor = 'grabbing';
				self.div_graph_surface.style.userSelect = 'none';

				pos = {
					left: self.div_graph_surface.scrollLeft,
					top: self.div_graph_surface.scrollTop,
					// Get the current mouse position
					x: e.clientX,
					y: e.clientY,
				};

			}
			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);
		};

		const mouseMoveHandler = function (e) {
			e.preventDefault();
			if (isSelecting) {
				selectionEnd = { x: e.clientX, y: e.clientY };
				BoxEnd = { x: e.clientX + self.div_graph_surface.scrollLeft, y: e.clientY + self.div_graph_surface.scrollTop };

				// Update the visual selection box
				const left = Math.min(BoxStart.x, BoxEnd.x);
				const top = Math.min(BoxStart.y, BoxEnd.y);
				const width = Math.abs(BoxStart.x - BoxEnd.x);
				const height = Math.abs(BoxStart.y - BoxEnd.y);
				selectionBox.style.left = left + 'px';
				selectionBox.style.top = top + 'px';
				selectionBox.style.width = width + 'px';
				selectionBox.style.height = height + 'px';

				updateSelection();
			} else {
				// Calculate the distance moved by the mouse
				const dx = e.clientX - pos.x;
				const dy = e.clientY - pos.y;

				// Scroll the element only if the distance moved is significant
				if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
					self.div_graph_surface.scrollTop = pos.top - dy;
					self.div_graph_surface.scrollLeft = pos.left - dx;
				}

				// How far the mouse has been moved
				// const dx = e.clientX - pos.x;
				// const dy = e.clientY - pos.y;
				// self.div_graph_surface.querySelector('#' + self.id_graph_control_palette_container + '___mouse-x').innerHTML = e.clientX;
				// self.div_graph_surface.querySelector('#' + self.id_graph_control_palette_container + '___mouse-y').innerHTML = e.clientY;

				// // Scroll the element
				// self.div_graph_surface.scrollTop = pos.top - dy;
				// self.div_graph_surface.scrollLeft = pos.left - dx;
			}
		};

		const mouseUpHandler = function () {
			if (isSelecting) {
				isSelecting = false;
				updateSelection();
				finalizeSelection();
				// Remove the visual selection box
				self.div_graph_surface.removeChild(selectionBox);
				selectionBox = null;
			} else {
				self.div_graph_surface.style.cursor = 'grab';
				self.div_graph_surface.style.removeProperty('user-select');

			}
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};

		// Attach the handler
		self.div_graph_surface.addEventListener('mousedown', mouseDownHandler);
		self.div_graph_surface.addEventListener('dblclick', function (e) {
			self.DOMUtilities.DOMElements.scrollTo(self.div_graph_surface, e);
		});

		// Add mouseover and mouseout handlers to change cursor style
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventListener('mouseover', function (e) {
			self.div_graph_surface.style.cursor = 'grab';
		});
		self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-connsvg').addEventListener('mouseout', function () {
			self.div_graph_surface.style.cursor = 'default';
		});



		// // Variables to keep track of mouse click state
		// let clickCount = 0;
		// let isMouseDown = false;

		// // Function to perform action when the left mouse button is held down
		// function onLeftMouseDown() {
		// 	isMouseDown = true;
		// 	console.log("Mouse down", clickCount);
		// }

		// // Function to perform action when the left mouse button is released
		// function onLeftMouseUp() {
		// 	isMouseDown = false;
		// 	if (clickCount === 2) {
		// 		// Double click action
		// 		console.log("Double click and mouse released", clickCount);
		// 		// Replace with your desired action for double click
		// 	} else {
		// 		// Single click and mouse released action
		// 		console.log("Single click and mouse released", clickCount);
		// 		// Replace with your desired action for single click and release
		// 	}
		// }

		// // Function to detect double click
		// function detectDoubleClick() {
		// 	clickCount++;
		// 	if (clickCount === 1) {
		// 		setTimeout(function () {
		// 			if (clickCount === 1) {
		// 				// Single click action
		// 				console.log("Single click", clickCount);
		// 				// Replace with your desired action for single click
		// 			}
		// 			clickCount = 0;
		// 		}, 250); // Adjust the time interval for detecting double clicks (in milliseconds)
		// 	} else if (clickCount === 2) {
		// 		// Reset the click count for subsequent clicks
		// 		clickCount = 0;
		// 	}
		// }

		// // Event listeners for mouse events
		// document.addEventListener("mousedown", onLeftMouseDown);
		// document.addEventListener("mouseup", onLeftMouseUp);
		// document.addEventListener("click", detectDoubleClick);



		//HANDLE ON CANVAS NAVIGATION, CLICK TO SCROLL LEFT RIGHT UP DOWN, SCROLL TO ZOOM IN OR OUT























		//LIGHT/DARK THEME SWITCHER
		this.div_graph_surface.querySelector('#' + this.id_graph_control_palette_container + '___theme-switch').addEventListener('click', function () {
			// console.log('theme switch');
			let root = document.documentElement;
			this.dataset.count = this.dataset.count ? parseInt(this.dataset.count) : 0;
			// console.log('this.dataset.count', this.dataset.count);

			if (this.dataset.count < 2) {
				// console.log('masuk < 2');
				if (root.classList.contains('light-theme')) {
					// console.log('masuk dark');
					root.classList.replace('light-theme', 'dark-theme');
				} else if (root.classList.contains('dark-theme')) {
					// console.log('masuk light');
					root.classList.replace('dark-theme', 'light-theme');
				} else {
					// console.log('masuk default');
					let isCurrentThemeDark = self.DOMUtilities.DOMElements.detectLightDarkMode();
					root.classList.add(isCurrentThemeDark.matches ? 'light-theme' : 'dark-theme');
				}
				this.style.color = '';
				this.dataset.count++;
			} else {
				// console.log('masuk reset');
				root.classList.remove('dark-theme', 'light-theme');
				this.style.color = 'red';
				this.dataset.count = 0;
			}
		});
		//LIGHT/DARK THEME SWITCHER

		//MAKE GRAPH CONTROL PALETTE DRAGABLE
		this.DOMUtilities.DOMElements.DragElement(this.div_graph_surface.querySelector('#' + this.id_graph_control_palette));

		//ADD NODE
		this.div_graph_surface.querySelectorAll(`#${self.id_graph_control_palette_container}-node-add`).forEach((d, i) => {
			d.addEventListener('click', function (e) {
				let newNode = new NodeProperties();
				newNode.UID = self.Utility.Numbers.generateUUID();
				newNode.DocumentID = newNode.UID;
				let n = 20;
				newNode.Presentation.Perspectives.GraphNode.Position = { x: 200 + (n * self.nodes.length - 1), y: 300 + (n * self.nodes.length - 1) };
				let temp = self.DOMUtilities.DOMElements.MakeDraggableNode(newNode.UID, 'graph-node fade-in', 'Node TEST ' + newNode.UID + ' DIV', '<p>Make</p><p>this</p><p>MOVE</p>', newNode.Presentation.Perspectives.GraphNode.Position.x, newNode.Presentation.Perspectives.GraphNode.Position.y, self.nodes.length);
				self.nodes.push({ id: newNode.UID, node: newNode, element: temp });
				self.DOMElements.renderGraph(self);
				self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
			});
		});
		//ADD NODE

		//GET NODES FROM LOCALSTORE
		self.Utility.DataStore.LocalStore.getGraphFromLocalStore(self, 'graph_data', 'Graph-Nodes');
		//GET NODES FROM LOCALSTORE

		return this.div_graph_surface;
	}
	resetSelection = function (self) {
		console.log('Clear previously selected nodes');
		self.selectedDivs.forEach(div => {
			div.classList.remove('active');
			div.dataset.isActive = false;
		});
		self.selectedDivs.clear();
	}
	onNodeClick = (function (e, element, callback) {
		//GRAPH NODE CLICK EVENT
		this.resetSelection(this);

		if (element.dataset.isActive == undefined) element.dataset.isActive = 'false';
		if (element.dataset.isActive == 'false') {
			// console.log('masuk isActive kosong or false');
			element.classList.add('active');
			element.dataset.isActive = 'true';
			this.selectedDivs.add(element);
		}
		if (typeof callback != 'undefined') callback();
		//GRAPH NODE CLICK EVENT
	}).bind(this);

	DOMElements = {
		"initiateGraphSurfaceContainer": (function (id = '') {
			let id_str = (id.length > 0) ? id + '-' : '';
			let div = document.createElement('div');
			console.log('this', this);
			div = this.DOMUtilities.DOMElements.initElementEventsDataset(div);
			div.id = id_str + 'graph-surface';
			div.className = 'graph-surface grid2020-background'
			// console.log('this', this);
			// div.style.cssText = `width: ${this.graph_canvas_dimension.width}px; height: ${this.graph_canvas_dimension.height}px; z-index:100;`;
			// div.innerHTML = `
			// 	<div id="${id_str}graph"></div>
			// 	<svg id="${id_str}connsvg" style="width:100%; height:100%;">
			// 		<defs>
			// 			<marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
			// 				<path class="arrowhead-path" d="M 0 0 L 10 5 L 0 10 z" fill="#2f344cd2"/>
			// 			</marker>
			// 		</defs>
			// 	</svg>`;


			let div_graph = document.createElement('div');
			div_graph.id = `${id_str}graph`;
			div_graph = this.DOMUtilities.DOMElements.initElementEventsDataset(div_graph);
			let div_connsvg = document.createElement('svg');
			div_connsvg.id = `${id_str}connsvg`;
			// div_connsvg.style.width = '100%';
			// div_connsvg.style.height = '100%';
			div_connsvg = this.DOMUtilities.DOMElements.initElementEventsDataset(div_connsvg);
			div_connsvg.innerHTML = `
				<defs>
					<marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
						<path class="arrowhead-path" d="M 0 0 L 10 5 L 0 10 z" fill="#2f344cd2"/>
					</marker>
				</defs>`
			// console.log('>>>>', div.style.cssText);
			div.appendChild(div_graph);
			div.appendChild(div_connsvg);
			console.log('div init graph surface', div);
			return div;
		}).bind(this),
		"initNodeClick": (function (element, callback) {
			let self = this;
			// console.log('element.dataset', element.dataset);
			// console.log('element.dataset >>>>>>>', element.querySelector('.graph-node-titlebar').dataset);
			if (element.querySelector('.graph-node-titlebar').dataset.onclickEventInitialized == 'false') {
				element.querySelector('.graph-node-titlebar').dataset.onclickEventInitialized = 'true';
			}
			if (!element.classList.contains('active')) {
				element.querySelector('.graph-node-titlebar').addEventListener('click', function (e) {
					console.log('click executed');
					self.onNodeClick(e, element, callback);
				});

				// Add touch event listener
				element.querySelector('.graph-node-titlebar').addEventListener('touchstart', function (e) {
					// Check if the touch event target has an ID ending with "header"
					if (e.target.id && e.target.id.endsWith("header")) {
						// Prevent the default behavior to avoid issues with touch events
						console.log('touch di header e executed');
						e.preventDefault();
						self.onNodeClick(e, element, callback);
					}
				}, { passive: false });
			} else {
				console.log('contains active');
				// element.onclick = function (e) { };
			}
			// console.log('initNodeClick done');
		}).bind(this),
		"renderGraph": (function (self) {
			self.nodes.forEach((d, i) => {
				let n = 20;
				if (!self.div_graph_surface.querySelector(`[id="${d.id}"]`)) {
					let temp = self.DOMUtilities.DOMElements.MakeDraggableNode(d.id, 'graph-node fade-in', 'Node TEST ' + d.id + ' DIV', '<p>Make</p><p>this</p><p>MOVE</p>', d.node.Presentation.Perspectives.GraphNode.Position.x, d.node.Presentation.Perspectives.GraphNode.Position.y, self.nodes.length);
					self.nodes[i].element = temp;
					self.div_graph_surface.querySelector('#' + self.id_graph_surface + '-graph').append(temp);
				}
			});
			self.divs = document.querySelectorAll('.graph-node');
			self.DOMElements.initConnectorEvents(self);
			self.nodes.forEach((segment, idx, array) => {
				if (segment.element.dataset.connectorsInitialized == undefined) {
					segment.element.dataset.connectorsInitialized = 'true';
				}
				self.DOMElements.initNodeClick(segment.element, function () {
					self.DOMElements.DragElementArray(self.selectedDivs, 0, function () {
						if (self.connections.length > 0) self.DOMElements.renderGraphConnections(self.connections, self);
					}, function () {
						self.Utility.DataStore.LocalStore.saveGraphToLocalStore(self, 'graph_data', 'Graph-Nodes');
					});
				});
			});
		}).bind(this),
		"initConnectorEvents": (function (self) {
			function inputEvents(d, i, arr) {
				d.addEventListener('click', function (e) {
					console.log('top input ' + i);
					if (!self.makingConnection) {
						// console.error('Not in Making Connection mode');
						return;
					}
					if (self.ConnectionDirection != d.dataset.ConnectionDirection) {
						console.error('Connection direction is ' + self.ConnectionDirection);
						// utility.ConnectionDirection = null;
						return;
					}
					let element = self.DOMUtilities.DOMElements.FindPosition(this, self.div_graph_surface);
					console.log('element', element);
					let endElement = element.element.id;
					// console.log('element', element, endElement);

					if (self.connections.length > 0) {
						// console.log('startElement', self.startElement, 'endElement', self.endElement);
						let sourceFound = false;
						let destinationFound = false;
						self.connections.forEach(elmt => {
							if ((elmt.Source == self.startElement) && (elmt.Destination == self.endElement)) {
								console.error(`Connection from ${self.startElement} to ${self.endElement} already exist!`);
								return;
							}
						});
					}

					if (self.activeElement == null) self.activeElement = element.element.id;
					if (self.activeElement != this.id) return;

					let endPosX = parseFloat(element.x);
					let endPosY = parseFloat(element.y);

					self.tempConn = new Connection(self.Utility.Numbers.generateUUID(), self);

					self.tempConn.Source = self.startElement;
					self.tempConn.pathMode = self.ConnectionDirection;

					self.tempConn.endPos = { x: (endPosX), y: (endPosY) };
					// console.log('startPos', self.tempConn.startPos);
					// console.log('endPos', self.tempConn.endPos);
					self.tempConn.Destination = element.element.id;
					if (self.tempConn !== null) self.connections.push(self.tempConn);

					self.div_graph_surface.querySelector('#' + self.tempConn.Source).dataset.Connected = 'false';
					self.div_graph_surface.querySelector('#' + self.tempConn.Destination).dataset.Connected = 'true';

					self.tempConn = null;
					self.startPosX = 0;
					self.startPosY = 0;
					self.DOMElements.renderGraphConnections(self.connections, self);
					self.makingConnection = false;
					self.ConnectionDirection = null;
					self.activeElement = null;
				});
			}
			function outputEvents(d, i, arr) {
				d.addEventListener('click', function (e) {
					console.log('right output ' + i);
					self.makingConnection = true;
					self.ConnectionDirection = d.dataset.ConnectionDirection;

					let element = self.DOMUtilities.DOMElements.FindPosition(this, self.div_graph_surface);
					self.startPosX = parseFloat(element.x);
					self.startPosY = parseFloat(element.y);
					self.startElement = element.element.id;
					// console.log(`startX: ${self.startPosX}, startY: ${self.startPosY}`);
				});
			}
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(d => {
				d.addEventListener('click', () => {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.top-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					if (this.nextElementSibling.children.length >= 10) return;
					let connectorUID = 'Connector-Input-' + self.Utility.Numbers.generateUUID();
					this.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-down text-danger" style="--bs-text-opacity: .5;" id="${connectorUID}" data--connected="false" data--connection-direction="v"></i>`;

					self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.left-input > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					let connectorUID = 'Connector-Input-' + self.Utility.Numbers.generateUUID();
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-chevron-right text-warning" style="--bs-text-opacity: .8; display:block;" id="${connectorUID}" data--connected="false" data--connection-direction="h"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.right-output > i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.dataset.clickEventInitialized = true;
				d.addEventListener('click', function () {
					if (this.nextElementSibling.nextElementSibling.children.length >= 20) return;
					let connectorUID = 'Connector-Output-' + self.Utility.Numbers.generateUUID();
					this.nextElementSibling.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-right text-success" style="--bs-text-opacity: .5; display:block;" id="${connectorUID}" data--connected="false" data--connection-direction="h"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.remove-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					console.log('clicked remove conn bottom');
					let inputsArray = Array.from(d.parentElement.querySelectorAll('span.bottom-output> i')).reverse();
					let inputToDelete = inputsArray.find(input => input.dataset.Connected == 'false');
					if (inputToDelete) {
						inputToDelete.remove();
					}
				});
			});
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > i.add-connection[data-click-event-initialized='false']").forEach(function (d, i, arr) {
				d.addEventListener('click', function () {
					if (this.nextElementSibling.children.length >= 100) return;
					let connectorUID = 'Connector-Output-' + self.Utility.Numbers.generateUUID();
					this.nextElementSibling.innerHTML += `<i class="fa-solid fa-circle-arrow-down text-primary-emphasis" style="--bs-text-opacity: .5;" id="${connectorUID}" data--connected="false" data--connection-direction="v"></i>`;
					self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
				});
			});

			self.div_graph_surface.querySelectorAll(".graph-node > div > div.top-row > div.connection-container > span.top-input > i").forEach(inputEvents);
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.left-column > div.connection-container > span.left-input > i").forEach(inputEvents);
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.mid-row > div.right-column > div.connection-container > span.right-output > i").forEach(outputEvents);
			self.div_graph_surface.querySelectorAll(".graph-node > div > div.bottom-row > div.connection-container > span.bottom-output > i").forEach(outputEvents);
		}).bind(this),

		"renderGraphConnections": (function (conns, graphSurface, cr = true) {
			if (cr) console.log('Masuk renderGraphConnections');
			if (cr) console.log('graphSurface', graphSurface);
			// if (cr) console.log('this', this.DOMElements.FindPosition());
			if (arguments.length == 0) {
				console.error('Connections array needed!');
				return;
			}
			if (conns.length == 0) {
				console.error('Connections array is empty!');
				return;
			}
			if (!Array.isArray(conns)) {
				console.error('Connections array is not an array!');
				return;
			}

			// let svgChildren = graphSurface.svg.querySelectorAll('path').length;
			// console.log('this >>>>>', this);
			let svgChildren = this.div_graph_surface.querySelectorAll(`#${this.svg.id} > path`).length;

			let connArrayLength = conns.length;
			if (cr) console.log(`svgChildren: ${svgChildren}, connArrayLength:${connArrayLength}`);
			let utilClass = this.Utility;
			let DOMUtils = new DOMUtilities();
			if (svgChildren == 0) {
				if (cr) console.log('svg children = 0');
				// graphSurface.svg.textContent = '';
				conns.forEach(function (conn, idx, arr) {
					let src = DOMUtils.DOMElements.FindPositionV1(conns[idx].Source, graphSurface.div_graph_surface);
					let dst = DOMUtils.DOMElements.FindPositionV1(conns[idx].Destination, graphSurface.div_graph_surface);

					// conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
					// conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					if (conns[idx].pathMode == 'h') {
						conns[idx].startPos = { x: ((src.x + 12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x - 18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					} else {
						conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: ((src.y) / graphSurface.zoom_level) };
						conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: ((dst.y) / graphSurface.zoom_level) };
					}

					conns[idx].path = conns[idx].createQCurve();
					graphSurface.svg.appendChild(conns[idx].path);
					graphSurface.div_graph_surface.querySelector(`i#${conns[idx].Source}`).dataset.Connected = true;
					graphSurface.div_graph_surface.querySelector(`i#${conns[idx].Destination}`).dataset.Connected = true;
				});
			} else if (svgChildren != connArrayLength) {
				if (cr) console.log('svgChildren != connArrayLength');
				conns.forEach(function (conn, idx, arr) {
					// console.log('conns foreach ke '+idx);
					let src = DOMUtils.DOMElements.FindPositionV1(conns[idx].Source, graphSurface.div_graph_surface);
					let dst = DOMUtils.DOMElements.FindPositionV1(conns[idx].Destination, graphSurface.div_graph_surface);

					// conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
					// conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					if (conns[idx].pathMode == 'h') {
						conns[idx].startPos = { x: ((src.x + 12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x - 18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					} else {
						conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: ((src.y) / graphSurface.zoom_level) };
						conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: ((dst.y) / graphSurface.zoom_level) };
					}

					if (idx < (svgChildren)) {
						console.log(conns[idx]);
						//IF Connection's current cursor array index is smaller or equal than svg children index, self.connections array and svg children are still hand on hand
						if (conns[idx].pathMode == 'h') {
							conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
						} else {
							conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
						}
					} else {
						console.log(conns[idx]);
						//IF Connection's current cursor array index is larger than svg children's index, need to create new svg children.
						conns[idx].startPos = { x: (src.x + 12) / graphSurface.zoom_level, y: (src.y) / graphSurface.zoom_level };
						conns[idx].endPos = { x: (dst.x - 18) / graphSurface.zoom_level, y: (dst.y) / graphSurface.zoom_level };
						conns[idx].path = conns[idx].createQCurve();
						graphSurface.svg.appendChild(conns[idx].path);
					}
				});
			} else if (svgChildren == connArrayLength) {
				if (cr) console.log('svgChildren == connArrayLength');
				conns.forEach(function (conn, idx, arr) {
					let src = DOMUtils.DOMElements.FindPosition(conns[idx].Source, graphSurface.div_graph_surface);
					let dst = DOMUtils.DOMElements.FindPosition(conns[idx].Destination, graphSurface.div_graph_surface);

					if (conns[idx].pathMode == 'h') {
						conns[idx].startPos = { x: ((src.x + 12) / graphSurface.zoom_level), y: (src.y / graphSurface.zoom_level) };
						conns[idx].endPos = { x: ((dst.x - 18) / graphSurface.zoom_level), y: (dst.y / graphSurface.zoom_level) };
					} else {
						conns[idx].startPos = { x: (src.x / graphSurface.zoom_level), y: ((src.y) / graphSurface.zoom_level) };
						conns[idx].endPos = { x: (dst.x / graphSurface.zoom_level), y: ((dst.y) / graphSurface.zoom_level) };
					}
					if (conns[idx].pathMode == 'h') {
						conns[idx].setQCurveD(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
					} else {
						conns[idx].setQCurveDV(document.getElementById(conns[idx].uuid), conns[idx].startPos.x, conns[idx].startPos.y, conns[idx].endPos.x, conns[idx].endPos.y)
					}
				});
			}
		}).bind(this),
		"DragElementArray": (function (selectedDivs, reset = false, callbackOnDrag, callback) {
			// console.log('start dragelementarray>>');

			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0, self = this;
			const selectedDivsArray = Array.from(selectedDivs); // Convert the Set to an array

			function RoundToNearestBase(num, base) {
				return Math.round(num / base) * base;
			}

			selectedDivsArray.forEach(elmnt => {
				// console.log('init mousedown on active elements');
				if (!reset) {
					elmnt.addEventListener("mousedown", dragMouseDown.bind(this));
					elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
					elmnt.onmousemove = null;
					elmnt.removeEventListener("touchmove", elementDrag);
					elmnt.removeEventListener("touchend", closeDragElement);
				} else {
					elmnt.removeEventListener("mousedown", dragMouseDown.bind(this));
					elmnt.removeEventListener("touchstart", touchStart.bind(this), { passive: false });
				}
			});

			function dragMouseDown(e) {
				if (this.activeElement != null) return; // Prevent initiating another drag

				e = e || window.event;
				e.preventDefault();
				let divider = this.zoom_level;
				pos3 = (e.clientX / divider);
				pos4 = (e.clientY / divider);
				selectedDivsArray.forEach(elmnt => {
					if (elmnt.dataset.isActive == 'true') {
						const rect = elmnt.getBoundingClientRect();
						touchOffsetX = e.clientX - (rect.left + window.scrollX);
						touchOffsetY = e.clientY - (rect.top + window.scrollY);
					}
				});

				document.onmouseup = closeDragElement.bind(this);
				selectedDivsArray.forEach(elmnt => {
					if (elmnt.dataset.isActive == 'true') {
						elmnt.onmousemove = elementDrag.bind(this);
					}
				});
			}

			function touchStart(e) {
				// console.log('begin touch start');
				if (this.activeElement != null) return; // Prevent initiating another drag

				e = e || window.event;
				e.preventDefault();
				let divider = this.zoom_level;
				pos3 = RoundToNearestBase((e.changedTouches[0].clientX / divider), self.snapEvery);
				pos4 = RoundToNearestBase((e.changedTouches[0].clientY / divider), self.snapEvery);
				selectedDivsArray.forEach(elmnt => {
					const rect = elmnt.getBoundingClientRect();
					touchOffsetX = e.changedTouches[0].clientX - (rect.left + window.scrollX);
					touchOffsetY = e.changedTouches[0].clientY - (rect.top + window.scrollY);
				});

				document.removeEventListener("touchend", closeDragElement);
				selectedDivsArray.forEach(elmnt => {
					elmnt.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
					elmnt.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
				});
				// console.log('end touch start');
			}

			function elementDrag(e) {
				// console.log('start drag');
				e = e || window.event;
				e.preventDefault();
				let clientX, clientY;
				let divider = this.zoom_level;
				let isTouch = false;

				if (e.type === "touchmove") {
					// console.log('touchmove >>');
					isTouch = true;
					const touch = e.changedTouches[0];
					clientX = (touch.clientX / divider);
					clientY = (touch.clientY / divider);
				} else {
					clientX = (e.clientX / divider);
					clientY = (e.clientY / divider);
				}

				selectedDivsArray.forEach(elmnt => {
					pos1 = pos3 - clientX;
					pos2 = pos4 - clientY;
					pos3 = clientX;
					pos4 = clientY;
					let cY = elmnt.offsetTop - pos2;
					let cX = elmnt.offsetLeft - pos1;
					// console.log('clientXY', clientX, clientY);
					// console.log('pos', pos1, pos2, pos3, pos4);
					// console.log('c pos', cX, cY);
					if (cY >= 0) elmnt.style.top = cY + "px";
					if (cX >= 0) elmnt.style.left = cX + "px";
				});
				if (typeof callbackOnDrag != 'undefined') callbackOnDrag();
				// console.log('end drag');
			}

			function closeDragElement() {
				pos3 = 0;
				pos4 = 0;
				this.activeElement = null;

				document.onmouseup = null;
				selectedDivsArray.forEach(elmnt => {
					elmnt.onmousemove = null;
					// elmnt.removeEventListener('mousemove', elementDrag);
					elmnt.removeEventListener("touchmove", elementDrag);
					elmnt.removeEventListener("touchend", closeDragElement);
				});

				// selectedDivsArray.forEach(elmnt => {
				// });

				selectedDivsArray.forEach((div) => {
					const currentLeft = parseInt(div.style.left) || 0;
					const currentTop = parseInt(div.style.top) || 0;

					const snappedLeft = Math.round(currentLeft / this.snapEvery) * this.snapEvery;
					const snappedTop = Math.round(currentTop / this.snapEvery) * this.snapEvery;

					div.style.left = snappedLeft + "px";
					div.style.top = snappedTop + "px";

					let found = self.Utility.Array.findArrayElement(self.nodes, 'id', div.id, 0);
					self.nodes[found.array_index].node.Presentation.Perspectives.GraphNode.Position = { x: snappedLeft, y: snappedTop };
				});

				if (typeof callback != 'undefined') callback();
			}
		}).bind(this),
		"DragElementArrayV1": (function (selectedDivs, callbackOnDrag, callback) {
			// console.log('>> Initialized for Array!');
			// console.log('selectedDivs', selectedDivs);

			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0, self = this;
			const selectedDivsArray = Array.from(selectedDivs); // Convert the Set to an array
			// console.log('selectedDivsArray', selectedDivsArray);

			function RoundToNearestBase(num, base) {
				return Math.round(num / base) * base;
			};

			selectedDivsArray.forEach(elmnt => {
				// if (elmnt.querySelector('[id="' + elmnt.id + '-header"]')) {
				// 	elmnt.querySelector('[id="' + elmnt.id + '-header"]').onmousedown = dragMouseDown.bind(this);
				// 	elmnt.querySelector('[id="' + elmnt.id + '-header"]').addEventListener("touchstart", touchStart.bind(this), { passive: false });
				// } else {
				// 	elmnt.onmousedown = dragMouseDown.bind(this);
				// 	elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
				// }
				elmnt.onmousedown = dragMouseDown.bind(this);
				elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			});

			function dragMouseDown(e) {
				console.log('>> dragmousedown !');
				// console.log('selectedDivsArray', selectedDivsArray);
				if (this.activeElement != null) return; // Prevent initiating another drag

				e = e || window.event;
				e.preventDefault();
				// Get the mouse cursor position at startup:
				let divider = this.zoom_level;
				pos3 = (e.clientX / divider);
				pos4 = (e.clientY / divider);
				// console.log('selectedDivsArray', selectedDivsArray);
				// Calculate the touch offset for each selected element
				selectedDivsArray.forEach(elmnt => {
					// console.log('elmnt.dataset', elmnt.dataset);
					if (elmnt.dataset.isActive == 'true') {
						const rect = elmnt.getBoundingClientRect();
						touchOffsetX = e.clientX - (rect.left + window.scrollX);
						touchOffsetY = e.clientY - (rect.top + window.scrollY);
						// console.log('dragmousedown coord >>>', touchOffsetX, touchOffsetY);
					}
				});

				// Call a function whenever the cursor moves:
				document.onmouseup = closeDragElement.bind(this);
				// Attach the same mousemove handler to all selected divs
				selectedDivsArray.forEach(elmnt => {
					if (elmnt.dataset.isActive == 'true') {
						elmnt.onmousemove = elementDrag.bind(this);
					}
				});
			}

			function touchStart(e) {
				// console.log('>> touchstart !');
				// console.log('selectedDivsArray', selectedDivsArray);
				if (this.activeElement != null) return; // Prevent initiating another drag

				e = e || window.event;
				e.preventDefault();

				// Reset the initial touch position at the start of a new touch:
				let divider = zoomed ? this.zoom_level : 1;
				pos3 = RoundToNearestBase((e.changedTouches[0].clientX / divider), self.snapEvery);
				pos4 = RoundToNearestBase((e.changedTouches[0].clientY / divider), self.snapEvery);

				// Calculate the touch offset for each selected element
				selectedDivsArray.forEach(elmnt => {
					const rect = elmnt.getBoundingClientRect();
					touchOffsetX = e.changedTouches[0].clientX - (rect.left + window.scrollX);
					touchOffsetY = e.changedTouches[0].clientY - (rect.top + window.scrollY);
				});

				// Ensure previous touchend and touchmove event listeners are removed:
				document.removeEventListener("touchend", closeDragElement);
				// Attach new event listeners to all selected divs
				selectedDivsArray.forEach(elmnt => {
					elmnt.addEventListener("touchend", closeDragElement.bind(this), { passive: false });
					elmnt.addEventListener("touchmove", elementDrag.bind(this), { passive: false });
				});
			}

			function elementDrag(e) {
				// console.log('>> dragmouse drag !');
				// console.log('selectedDivsArray', selectedDivsArray);
				e = e || window.event;
				e.preventDefault();

				// Calculate the new cursor/touch position:
				let clientX, clientY;
				let divider = this.zoom_level;
				let isTouch = false;

				if (e.type === "touchmove") {
					// console.log('touch event');
					isTouch = true;
					const touch = e.changedTouches[0];
					clientX = (touch.clientX / divider);
					clientY = (touch.clientY / divider);
				} else {
					// console.log('click event');
					clientX = (e.clientX / divider);
					clientY = (e.clientY / divider);
				}

				// Update the position of each selected div
				selectedDivsArray.forEach(elmnt => {
					if (isTouch) {
						pos1 = pos3 - clientX + touchOffsetX;
						pos2 = pos4 - clientY + touchOffsetY;
					} else {
						pos1 = pos3 - clientX;
						pos2 = pos4 - clientY;
					}
					pos3 = clientX;
					pos4 = clientY;
					let cY = elmnt.offsetTop - pos2;
					let cX = elmnt.offsetLeft - pos1;
					if (cY >= 0) elmnt.style.top = cY + "px";
					if (cX >= 0) elmnt.style.left = cX + "px";
				});
				if (typeof callbackOnDrag != 'undefined') callbackOnDrag();

			}

			function closeDragElement() {
				console.log('>> closeDragElement !');
				// Reset initial touch positions and activeElement to avoid the jump behavior on subsequent touches:
				pos3 = 0;
				pos4 = 0;
				this.activeElement = null;

				// Stop moving when the mouse/touch is released:
				document.onmouseup = null;
				// Remove the same mousemove and touchmove handlers from all selected divs
				selectedDivsArray.forEach(elmnt => {
					elmnt.onmousemove = null;
					elmnt.removeEventListener("touchmove", elementDrag);
				});

				// Remove the same touchend handlers from all selected divs
				selectedDivsArray.forEach(elmnt => {
					elmnt.removeEventListener("touchend", closeDragElement);
				});

				// Perform snapping after the drag is complete
				selectedDivsArray.forEach((div) => {
					// console.log('div coord', div.style.left, div.style.top, this.snapEvery);
					const currentLeft = parseInt(div.style.left) || 0;
					const currentTop = parseInt(div.style.top) || 0;

					// Snap to the nearest grid position
					const snappedLeft = Math.round(currentLeft / this.snapEvery) * this.snapEvery;
					const snappedTop = Math.round(currentTop / this.snapEvery) * this.snapEvery;

					div.style.left = snappedLeft + "px";
					div.style.top = snappedTop + "px";

					let found = self.Utility.Array.findArrayElement(self.nodes, 'id', div.id, 0);
					console.log('self.nodes[found.array_index]', self.nodes[found.array_index].node);
					self.nodes[found.array_index].node.Presentation.Perspectives.GraphNode.Position = { x: snappedLeft, y: snappedTop };
				});

				if (typeof callback != 'undefined') callback();
			}
		}).bind(this),

		"DragElement": (function (elmnt, zoomed = false, snap_every = 1, callback) {
			//DragElement in GraphSurface
			// console.log('start drag element');
			// console.log('elmnt>', elmnt);
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, touchOffsetX = 0, touchOffsetY = 0;
			function RoundToNearestBase(num, base) {
				return Math.round(num / base) * base;
			}
			if (elmnt.querySelector('[id="' + elmnt.id + '-header"]')) {
				// If present, the header is where you move the DIV from:
				// console.log('masuk drag via header');
				elmnt.querySelector('[id="' + elmnt.id + '-header"]').onmousedown = dragMouseDown.bind(this);
				elmnt.querySelector('[id="' + elmnt.id + '-header"]').addEventListener("touchstart", touchStart.bind(this), { passive: false });
			} else {
				// Otherwise, move the DIV from anywhere inside the DIV:
				// console.log('masuk drag via body');
				elmnt.onmousedown = dragMouseDown.bind(this);
				elmnt.addEventListener("touchstart", touchStart.bind(this), { passive: false });
			}

			function dragMouseDown(e) {
				// console.log('start drag element >>');
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				this.activeElement = elmnt.id;
				e = e || window.event;
				e.preventDefault();
				// get the mouse cursor position at startup:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = RoundToNearestBase((e.clientX / divider), snap_every);
				pos4 = RoundToNearestBase((e.clientY / divider), snap_every);
				document.onmouseup = closeDragElement.bind(this);
				// call a function whenever the cursor moves:
				document.onmousemove = elementDrag.bind(this);
			}

			function touchStart(e) {
				if (this.activeElement == null) this.activeElement = elmnt.id;
				if (this.activeElement != elmnt.id) return; // Prevent initiating another drag
				e = e || window.event;
				e.preventDefault();
				const touch = e.changedTouches[0];
				// Reset the initial touch position at the start of a new touch:
				let divider = (zoomed) ? this.zoom_level : 1;
				pos3 = RoundToNearestBase((touch.clientX / divider), snap_every);
				pos4 = RoundToNearestBase((touch.clientY / divider), snap_every);
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
					// document.getElementById('touchevent').innerHTML = 'Touch Move';
					const touch = e.changedTouches[0];
					clientX = RoundToNearestBase((touch.clientX / divider), snap_every);
					clientY = RoundToNearestBase((touch.clientY / divider), snap_every);
				} else {
					clientX = RoundToNearestBase((e.clientX / divider), snap_every);
					clientY = RoundToNearestBase((e.clientY / divider), snap_every);
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
		"WorldNode": (function (id, dataset, parameters) {
		}).bind(this),
		"SystemObjectNode": (function () {
		}).bind(this),
		"InputNode": (function () {
		}).bind(this),
		"FunctionNode": (function () {
		}).bind(this),
		"DatastorageNode": (function () {
		}).bind(this),
	}
}

export class Connection {
	constructor(uuid, graphSurface, id = '') {
		// this.dragItem = null;    //reference to the dragging ite,
		// this.startPos = null;    //Used for starting position of dragging line,
		// this.offsetX = 0;        //OffsetX for dragging node,
		// this.offsetY = 0;        //OffsetY for dragging node,

		this.zoom_level = 1;
		this.activeElement = null;
		this.makingConnection = false;
		this.ConnectionDirection = null;

		this.isActive = false;
		this.hasEvent = {
			"Select": false,
			"FocusOut": false,
			"Delete": false
		};
		this.isVertical = false;
		this.isDragging = false;
		this.startPos = { x: 0, y: 0 };
		this.endPos = { x: 0, y: 0 };
		this.Source = null;
		this.Destination = null;
		this.uuid = uuid;
		this.id = id;
		if (id == '') this.id = uuid;
		this.svg = null;         //SVG where the line paths are drawn
		this.graphSurface = graphSurface;

		this.pathColorHorizontal = {
			"Normal": "#999999",
			"Selected": "#86d530"
		};
		this.pathColorVertical = {
			"Normal": "#ff0000af",
			"Selected": "#d530d2af"
		};
		this.pathWidth = 5;
		this.pathDashArray = "20";
		this.path = null;
		this.pathMode = 'h';
	}
	//Creates an Quadratic Curve path in SVG
	createQCurve = function () {
		console.log('this', this);
		let elm = document.createElementNS(this.graphSurface.svg.ns, "path");
		elm.setAttribute("id", this.id);
		elm.setAttribute("fill", "none");
		elm.setAttribute("stroke-width", this.pathWidth);
		elm.setAttribute("class", "graphConnections");
		elm.setAttribute("data-source", this.Source);
		elm.setAttribute("data-destination", this.Destination);
		elm.setAttribute("data-source_location", `${this.startPos.x},${this.startPos.y}`);
		elm.setAttribute("data-destination_location", `${this.endPos.x},${this.endPos.y}`);
		elm.setAttribute('marker-end', 'url(#arrowhead)');
		// elm.setAttribute("stroke-dasharray", this.pathDashArray);
		switch (this.pathMode) {
			case 'h':
				elm.setAttribute("stroke", this.pathColorHorizontal.Normal);
				this.setQCurveD(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
				break;
			case 'v':
				elm.setAttribute("stroke", this.pathColorVertical.Normal);
				this.isVertical = true;
				this.setQCurveDV(elm, this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
				break;
		}
		return elm;
	}

	//This is separated from the create so it can be reused as a way to update an existing path without duplicating code.
	setQCurveD = function (elm, x1, y1, x2, y2) {
		let dif = Math.abs(x1 - x2) / 1.5,
			str = "M" + (x1) + "," + y1 + " C" +	//MoveTo
				(x1 + dif) + "," + y1 + " " +	//First Control Point
				(x2 - dif) + "," + y2 + " " +	//Second Control Point
				(x2) + "," + y2;				//End Point
		elm.setAttribute('d', str);
	}

	setQCurveDV = function (elm, x1, y1, x2, y2) {
		let dif = Math.abs(y1 - y2) / 1.5,
			str = "M" + x1 + "," + (y1 + 15) + " C" +	//MoveTo
				(x1) + "," + (y1 + dif) + " " +	//First Control Point
				(x2) + "," + (y2 - dif) + " " +	//Second Control Point
				(x2) + "," + (y2 - 18);				//End Point
		// console.log('str in setQCurveD', str);
		// console.log('elm in setQCurveD', elm);
		elm.setAttribute('d', str);
	}

	setCurveColor = function (elm, isActive) {
		elm.setAttribute('stroke', (isActive) ? pathColorSelectedHorizontal : pathColorHorizontal);
	}
}C