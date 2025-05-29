const OperatorTemplate = {
	"datetime": [">", ">=", "=", "!=", "<=", "<", "is", "is not"],
	"number": [">", ">=", "=", "!=", "<=", "<", "contains"],
	"string": ["starts with", "ends with", "contains", "is", "is not"],
	"boolean": ["is", "is not"],
	"array": ["starts with", "ends with", "contains", "in", "not in"]
};

export class Flow {
	constructor(chain = [], funcObject = null) {
		this.chain = chain;
		this.run_mode = ["run", "stop", "pause", "step", "debug"];
		this.run_mode_selected = "run";
		this.cursor = null;
		this.processFunctions = funcObject;
	}

	setRunMode(mode) {
		if (this.run_mode.includes(mode)) {
			this.run_mode_selected = mode;
			if (mode === "stop") {
				this.cursor = null;
			}
		} else {
			console.error(`Invalid run mode: ${mode}`);
		}
	}

	resolveInput(input, chain) {
		let resolvedInput = {};
		for (let key in input) {
			let value = input[key];

			if (Array.isArray(value)) {
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
	}

	executeChain() {
		if (this.run_mode_selected === "stop") {
			this.cursor = this.chain.find(item => item.id === "P1");
			return;
		}

		if (!this.cursor) {
			this.cursor = this.chain.find(item => item.id === "P1");
		}

		console.log('>>>>> START PROGRAMMING FLOW');
		console.log('Input Chain', this.chain);
		// console.log('this', this.cursor, this);

		while (this.cursor) {
			console.log('Cursor ID:', this.cursor.id);
			console.log('Selected Method:', this.cursor.process);
			// console.log('this.processFunctions:', this.processFunctions);
			const resolvedInput = this.resolveInput(this.cursor.input, this.chain);
			const processFunc = this.processFunctions[this.cursor.process];

			if (processFunc) {
				const output = processFunc(...Object.values(resolvedInput));
				this.cursor.output = output;
				console.log(`Process ${this.cursor.id} executed. Output:`, output);
			} else {
				console.error(`Process function ${this.cursor.process} not found`);
				break;
			}

			if (this.run_mode_selected === "step" || this.run_mode_selected === "debug") {
				this.cursor = this.cursor.next_process ?
					this.chain.find(item => item.id === this.cursor.next_process) : null;
				break;
			}

			console.log('Done on Cursor ID:', this.cursor.id);
			this.cursor = this.cursor.next_process ?
				this.chain.find(item => item.id === this.cursor.next_process) : null;
		}

		console.log('<<<<< DONE PROGRAMMING FLOW');
	}

	getDecisionTemplate() {
		return {
			operator_template: OperatorTemplate,
			do_if: (op, input1, input2) => {
				switch (op) {
					case '<': return input1 < input2;
					case '<=': return input1 <= input2;
					case '==': return input1 == input2;
					case '===': return input1 === input2;
					case '>': return input1 > input2;
					case '>=': return input1 >= input2;
					case 'is': return input1 === input2;
					default: return false;
				}
			}
		};
	}
}

export class CoreProcessFunctions {
	constructor(numbers) { }
	"math" = {
		"calc": (numbers, sign) => {
			if (!Array.isArray(numbers)) {
				console.error("Input must be an array.");
				return 0;
			}
			if (numbers.length === 0) {
				console.warn("Input array is empty. Returning 0.");
				return 0;
			}

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
			console.log('Input: ', numbers, 'With Sign: ', `[${sign}]`, 'Result', result);
			return result;
		},
		"add": (numbers) => {
			return this.math.calc(numbers, '+');
		},
		"subtract": (numbers) => {
			return this.math.calc(numbers, '-');
		},
		"multiply": (numbers) => {
			return this.math.calc(numbers, '*');
		},
		"divide": (numbers) => {
			return this.math.calc(numbers, '/');
		},
		"store": (numbers) => { 
			console.log(`Storing data into database: ${numbers.toString()}`);
			return `Storing data into database: ${numbers.toString()}`;
		},
		"modulus": (number) => {
			this.math.calc(numbers, 'mod');
		},
		"power": (number) => {

		},
		"sqr": (number) => {

		},
		"sqrt": (number) => {

		},
		"abs": (number) => {

		},
		"round": (number) => {

		},
		"ceil": (number) => {

		},
		"floor": (number) => {

		},
		"random": (number) => {

		},
	};
	"math_array" = {
		"average": () => {

		},
		"sum": () => {

		},
		"min": () => {

		},
		"max": () => {

		},
	};
	"datetime" = {
		"now": {},
		"today": {},
		"tomorrow": {},
		"yesterday": {},
		"next week": {},
		"last week": {},
		"next month": {},
		"last month": {},
		"next year": {},
		"last year": {},
		"this week": {},
		"this month": {},
		"this year": {},
	};
	"string" = {
		"concat": {},
		"split": {},
		"replace": {},
		"toUpperCase": {},
		"toLowerCase": {},
		"trim": {},
		"length": {},
		"substring": {},
		"indexOf": {},
		"lastIndexOf": {},
		"includes": {},
		"startsWith": {},
		"endsWith": {},
		"match": {},
		"search": {},
		"slice": {},
		"padStart": {},
		"padEnd": {},
	};
	"boolean" = {
		"and": {},
		"or": {},
		"not": {},
		"xor": {},
		"nand": {},
		"nor": {},
		"xnor": {},
	};
	"array" = {
		"push": {},
		"pop": {},
		"shift": {},
		"unshift": {},
		"empty": {},
		"length": {},
		"sort": {},
		"filter": {},
		"map": {},
		"count": {},
		"find": {},
		"includes": {},
		"indexOf": {},
		"lastIndexOf": {},
		"join": {},
		"slice": {},
		"splice": {},
		"reverse": {},
		"concat": {},
		"forEach": {},
		"every": {},
		"some": {},
		"reduce": {},
	};
};