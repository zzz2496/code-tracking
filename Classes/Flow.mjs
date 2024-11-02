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
	
	// Method to change the run mode and reset the cursor if needed
	setRunMode = (mode) =>{
		if (this.run_mode.includes(mode)) {
			this.run_mode_selected = mode;
			if (mode === "stop") {
				this.cursor = null; // Reset to the start of the chain
			}
		} else {
			console.error(`Invalid run mode: ${mode}`);
		}
	}
	
	// Resolve input, handling dynamic references
	resolveInput = (input, chain) => {
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
	}
	
	// Execute the chain with respect to the current run mode
	executeChain = () => {
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
			const resolvedInput = this.resolveInput(this.cursor.input, this.chain);
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
	};

	
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