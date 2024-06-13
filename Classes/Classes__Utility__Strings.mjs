export class Strings {
	SafeString = (function (str, textDecoration) {
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
	}).bind(this);
	UCwords = (function (zstr) {
		let str = this.Strings.SafeString(zstr);
		if (this.checkType(str) === 'Object') {
			console.error(str.message);
			return str;
		}
		return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
			return $1.toUpperCase();
		});
	}).bind(this);
	LCwords = (function (zstr) {
		let str = this.Strings.SafeString(zstr);
		if (this.checkType(str) === 'Object') {
			console.error(str.message);
			return str;
		}
		return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
			return $1.toLowerCase();
		});
	}).bind(this);
	Readable = (function (zstr) {
		let str = this.Strings.SafeString(zstr);
		if (this.checkType(str) === 'Object') {
			console.error(str.message);
			return str;
		}
		return str.replace(/\_/gi, ' ').toUpperCase();
	}).bind(this);
	ReadableUCWords = (function (zstr) {
		let str = this.Strings.SafeString(zstr);
		if (this.checkType(str) === 'Object') {
			console.error(str.message);
			return str;
		}
		return this.Strings.UCwords(str.replace(/\_/gi, ' ').toLowerCase());
	}).bind(this);
	UnReadable = (function (zstr) {
		let str = this.Strings.SafeString(zstr);
		if (this.checkType(str) === 'Object') {
			console.error(str.message);
			return str;
		}
		return str.replace(/[\s\.\-]/gi, '_').toLowerCase();
	}).bind(this);
};