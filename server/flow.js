import { Flow } from '../Classes/Flow.mjs';

const functions = {
  sayHello: (name) => `Hello, ${name}!`
};

let BasicMath = {};
BasicMath.calc = (numbers, sign) => {
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
	console.log('Input', numbers);
	console.log('result', result);
	return result;
};
BasicMath.add = (numbers) => BasicMath.calc(numbers, '+');
BasicMath.subtract = (numbers) => BasicMath.calc(numbers, '-');
BasicMath.multiply = (numbers) => BasicMath.calc(numbers, '*');
BasicMath.divide = (numbers) => BasicMath.calc(numbers, '/');
BasicMath.store = (data) => `Storing data into database: ${data}`;




// Example usage
const flow = new Flow([
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
], BasicMath);
flow.executeChain();