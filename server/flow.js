console.time("runtime");
import { Flow, CoreProcessFunctions } from "../Classes/Flow.mjs";
import { evaluateMathExpression } from '../Classes/evaluateMathExpression.mjs';

const coreFunctions = new CoreProcessFunctions();
// console.log('coreFunctions', coreFunctions);
console.log(coreFunctions.math.add([1, 2, 3]));
console.log("-----------------------------------------");
const flow = new Flow(
	[
		{
			id: "P1",
			input: {
				a: [1, 2, 3],
			},
			process: "add",
			output: null,
			next_process: "P2",
		},
		{
			id: "P2",
			input: {
				a: ["P1.output", 3],
			},
			process: "subtract",
			output: null,
			next_process: "P3",
		},
		{
			id: "P3",
			input: {
				a: ["P2.output", 5],
			},
			process: "multiply",
			output: null,
			next_process: "P4",
		},
		{
			id: "P4",
			input: {
				a: "P3.output",
			},
			process: "store",
			output: null,
			next_process: null,
		},
	],
	coreFunctions.math
);
flow.executeChain();


function testExpression(label, expression, config, expectedSuccess = true, expectedValue) {
    if (typeof config === 'boolean') {
        expectedValue = expectedSuccess; // If config is boolean, it means expectedValue was passed as expectedSuccess
        expectedSuccess = config;      // and config was meant to be default
        config = undefined;
    } else if (typeof expectedSuccess !== 'boolean') { // config is object, expectedSuccess is value
        expectedValue = expectedSuccess;
        expectedSuccess = true;
    }


    console.log(`Testing: "${expression}" (Config: ${config ? JSON.stringify(config) : 'default (,) decimal'})`);
    try {
        const result = evaluateMathExpression(expression, config);
        if (!expectedSuccess) {
            console.error(`  ❌ FAILED: Expected error, but got result: ${result}`);
        } else {
            if (expectedValue !== undefined) {
                // Basic float comparison (can be improved with tolerance)
                if (Math.abs(result - expectedValue) < 1e-9) { // Tolerance for float comparison
                    console.log(`  ✅ Result: ${result} (Matches expected: ${expectedValue})`);
                } else {
                    console.error(`  ❌ FAILED: Result: ${result}, Expected: ${expectedValue}`);
                }
            } else {
                console.log(`  ✅ Result: ${result}`);
            }
        }
    } catch (e) {
        if (expectedSuccess) {
            console.error(`  ❌ FAILED: Expected success, but got error: ${e.message}`);
        } else {
            console.log(`  ✅ Error (as expected): ${e.message}`);
        }
    }
    console.log('---');
}

// --- Existing Valid tests (will use default comma decimal) ---
console.log("--- Valid Expressions (Default Config: Comma Decimal) ---");
testExpression("Simple addition", "1 + 2", true, 3);
testExpression("Modulo", "4 mod 3", true, 1);
testExpression("Square function", "square(5)", true, 25);
testExpression("Square root", "sqrt(25)", true, 5);
testExpression("Complex precedence", "2 + 3 * (4 ^ 2)", true, 50);
testExpression("Nested parentheses", "((1 + 2) * 3) ^ 2", true, 81);
testExpression("Indonesian decimal", "1,5 + 2,5", true, 4);
testExpression("Indonesian thousand sep", "1.000 + 500", true, 1500);
testExpression("Percent of", "50 percent of 200", true, 100);
testExpression("Log base 10", "log(100)", true, 2);
testExpression("Absolute value", "abs(-10)", true, 10);

console.log("\n--- Trigonometric Function Tests (Radians) ---");
// Note: For exact PI, you might want to add PI as a constant. Using approximations.
const PI = Math.PI;
testExpression("sin(0)", "sin(0)", true, Math.sin(0)); // Expected: 0
testExpression("cos(0)", "cos(0)", true, Math.cos(0)); // Expected: 1
testExpression("tan(0)", "tan(0)", true, Math.tan(0)); // Expected: 0

testExpression("sin(PI/2)", `sin(${PI / 2})`, true, Math.sin(PI / 2)); // Expected: 1
testExpression("cos(PI)", `cos(${PI})`, true, Math.cos(PI));       // Expected: -1
testExpression("tan(PI/4)", `tan(${PI / 4})`, true, Math.tan(PI / 4)); // Expected: 1 (approx)

// Using comma decimal for radian value
testExpression("sin(1,570796)", "sin(1,570796)", true, Math.sin(1.570796)); // Approx sin(PI/2)
testExpression("cos(3,141592)", "cos(3,141592)", true, Math.cos(3.141592)); // Approx cos(PI)

// Expression within trig functions
testExpression("sin(1+0,570796)", "sin(1+0,570796)", true, Math.sin(1+0.570796));
testExpression("2 * cos(0)", "2 * cos(0)", true, 2 * Math.cos(0)); // Expected: 2
testExpression("sin(abs(-1))", "sin(abs(-1))", true, Math.sin(Math.abs(-1)));
testExpression("square(sin(0,5))", "square(sin(0,5))", true, Math.pow(Math.sin(0.5), 2));


console.log("\n--- Number Format Tests (US Style - Period Decimal by Config) ---");
const usConfig = { preferredDecimalSeparator: '.' };
testExpression("US decimal", "1.5 + 2.5", usConfig, true, 4);
testExpression("US thousand sep", "1,000 + 500", usConfig, true, 1500);
testExpression("sin(1.570796) US", "sin(1.570796)", usConfig, true, Math.sin(1.570796));


console.log("\n--- Invalid/Error Condition Tests ---");
testExpression("Alert Hacked", "alert('hacked')", false);
testExpression("Process Exit", "5; process.exit()", false);
testExpression("Unknown function", "unknownFunc(10)", false);
testExpression("Invalid character", "1 + @ + 2", false);
testExpression("Mismatched parentheses 1", "(1 + 2", false);
testExpression("Division by zero", "10 / 0", false);
testExpression("Log negative", "log(-100)", false);
testExpression("Empty expression", "", false);
testExpression("Incomplete expression", "5 +", false);
testExpression("Trig func too few args", "sin()", false);
testExpression("Trig func too many args", "cos(1, 2)", false);
testExpression("Invalid number for trig", "sin(abc)", false);

console.log("\n--- Test single number input ---");
testExpression("Single positive integer", "5", true, 5);
testExpression("Single negative integer", "-10", true, -10);
testExpression("Single positive float (comma)", "123,45", true, 123.45);
testExpression("Single negative float (comma)", "-0,5", true, -0.5);
testExpression("Single positive float (dot, US config)", "123.45", usConfig, true, 123.45);
testExpression("Single negative float (dot, US config)", "-0.5", usConfig, true, -0.5);
testExpression("Single number with thousand sep", "1.234.567,89", true, 1234567.89);

console.log("\n--- Edge case for unary and tokenizer ---");
// This TOKEN_REGEX: [0-9][0-9.,]*|[0-9]*\.[0-9]+|[0-9]+
// For ".5" (leading dot), [0-9]*\.[0-9]+ should catch it.
testExpression("Leading dot US", ".5", usConfig, true, 0.5);
testExpression("Leading comma default", ",5", true, 0.5); // Should tokenize as "," then "5", leading to error if not handled, or parse as 0.5 if tokenizer handles ,5
                                                        // My current TOKEN_REGEX will give ",5" as a token with [0-9]*\.[0-9]+ (if , is decimal)
                                                        // or [0-9][0-9.,]* if , is thousand sep.
                                                        // It seems parseNumberToken correctly handles ".5" (becomes 0.5) and ",5" (becomes 0.5 if comma is decimal).
                                                        // So let's test if tokenization allows this.
                                                        // It does if `config.preferredDecimalSeparator` is `,` for ",5" and `.` for ".5"
testExpression("Unary plus before number", "+5", true, 5);
testExpression("Unary minus before number with comma", "-5,5", true, -5.5);
testExpression("Unary plus before parentheses", "+(5+2)", true, 7);
testExpression("Unary minus before parentheses", "-(5+2)", true, -7);

testExpression("Test Eval and Function", "eval(1+2); function aaa(){}", false);
testExpression("Test Function", "function aaa(){}", false);
testExpression("Test Eval", "eval(1+2)", false);
testExpression("Test Eval and calling a function within it", "eval(\"hackme()\")", false);

console.timeEnd("runtime");
