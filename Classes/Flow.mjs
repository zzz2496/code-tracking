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
		console.log('this', this.cursor, this);

		while (this.cursor) {
			console.log('Cursor ID:', this.cursor.id);
			console.log('Selected Method:', this.cursor.process);
			const resolvedInput = this.resolveInput(this.cursor.input, this.chain);
			const processFunc = this.processFunctions[this.cursor.process];

			if (processFunc) {
				const output = processFunc(...Object.values(resolvedInput));
				this.cursor.output = output;
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

	CoreProcessFunctions = {
		"math": {
			"add": () => {

			}, 
			"subtract":() =>{

			}, 
			"multiply":() =>{

			}, 
			"divide":() =>{

			}, 
			"modulus":() =>{

			}, 
			"power":() =>{

			}, 
			"sqr": () => { 

			},
			"sqrt":() =>{

			}, 
			"abs":() =>{

			}, 
			"round":() =>{

			}, 
			"ceil":() =>{

			}, 
			"floor":() =>{

			}, 
			"random":() =>{

			}, 
		},
		"math_array": {
			"average":() =>{

			}, 
			"sum":() =>{

			}, 
			"min":() =>{

			}, 
			"max":() =>{

			},
		},
		"datetime": {
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
		},
		"string": {
			"concat": {},
			"split":{},
			"replace":{},
			"toUpperCase":{},
			"toLowerCase":{},
			"trim":{},
			"length":{},
			"substring":{},
			"indexOf":{},
			"lastIndexOf":{},
			"includes":{},
			"startsWith":{},
			"endsWith":{},
			"match":{},
			"search":{},
			"slice":{},
			"padStart":{},
			"padEnd":{},
		},
		"boolean": {
			"and": {},
			"or":{},
			"not":{},
			"xor":{},
			"nand":{},
			"nor":{},
			"xnor":{},
		},
		"array": {
			"push": {},
			"pop":{},
			"shift":{},
			"unshift":{},
			"empty":{},
			"length":{},
			"sort":{},
			"filter":{},
			"map":{},
			"count":{},
			"find":{},
			"includes":{},
			"indexOf":{},
			"lastIndexOf":{},
			"join":{},
			"slice":{},
			"splice":{},
			"reverse":{},
			"concat":{},
			"forEach":{},
			"every":{},
			 "some":{},
			"reduce":{},
		},
	};
}