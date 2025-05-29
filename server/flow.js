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


function testExpression(label, expression, config, expectedSuccess = true) {
    // If config is a boolean, it's the old expectedSuccess, adjust
    if (typeof config === 'boolean') {
        expectedSuccess = config;
        config = undefined; // use default config
    }

    console.log(`Testing: "${expression}" (Config: ${config ? JSON.stringify(config) : 'default (,) decimal'})`);
    try {
        const result = evaluateMathExpression(expression, config);
        if (!expectedSuccess) {
            console.error(`  ❌ FAILED: Expected error, but got result: ${result}`);
        } else {
            console.log(`  ✅ Result: ${result}`);
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
testExpression("Simple addition", "1 + 2");
testExpression("Modulo", "4 mod 3");
testExpression("Square function", "square(5)");
testExpression("Square root", "sqrt(25)");
// ... (keep other existing valid tests)
testExpression("Complex precedence", "2 + 3 * (4 ^ 2)"); // Expected: 50
testExpression("Nested parentheses", "((1 + 2) * 3) ^ 2"); // Expected: 81

console.log("\n--- Number Format Tests (Indonesian Style - Comma Decimal by Default) ---");
testExpression("Indonesian decimal", "1,5 + 2,5"); // 1.5 + 2.5 = 4
testExpression("Indonesian thousand sep", "1.000 + 500"); // 1000 + 500 = 1500
testExpression("Indonesian mixed", "1.234,5 + 0,5"); // 1234.5 + 0.5 = 1235
testExpression("Indonesian only comma as decimal", "100,75 * 2"); // 100.75 * 2 = 201.5
testExpression("Indonesian negative with comma", "-2,5 * 4"); // -2.5 * 4 = -10
testExpression("Indonesian negative with thousand sep", "-1.000 + 200"); // -1000 + 200 = -800
testExpression("Indonesian many thousand seps", "1.000.000 + 1.000"); // 1000000 + 1000 = 1001000
testExpression("Unary minus with Indonesian decimal", "-2,5 + 5"); // -2.5 + 5 = 2.5
testExpression("Unary minus with Indonesian thousand/decimal", "-(1.000,50) + 0,50"); // -(1000.50) + 0.50 = -1000


console.log("\n--- Number Format Tests (US Style - Period Decimal by Config) ---");
const usConfig = { preferredDecimalSeparator: '.' };
testExpression("US decimal", "1.5 + 2.5", usConfig); // 1.5 + 2.5 = 4
testExpression("US thousand sep", "1,000 + 500", usConfig); // 1000 + 500 = 1500
testExpression("US mixed", "1,234.5 + 0.5", usConfig); // 1234.5 + 0.5 = 1235
testExpression("US only period as decimal", "100.75 * 2", usConfig); // 100.75 * 2 = 201.5
testExpression("US negative with period", "-2.5 * 4", usConfig); // -2.5 * 4 = -10
testExpression("US negative with thousand sep", "-1,000 + 200", usConfig); // -1000 + 200 = -800
testExpression("US many thousand seps", "1,000,000 + 1,000", usConfig); // 1000000 + 1000 = 1001000


console.log("\n--- Invalid Number Formats ---");
testExpression("Invalid mixed separators 1", "1.2,3.4", false); // Ambiguous if default config
testExpression("Invalid mixed separators 2", "1,2.3,4", usConfig, false); // Ambiguous
testExpression("Multiple decimals (comma preferred)", "1,2,3 + 4", false); // Should be "1.2.3" -> NaN
testExpression("Multiple decimals (period preferred)", "1.2.3 + 4", usConfig, false);
testExpression("Trailing comma invalid", "1, + 2", false); // Tokenizer might make "1," -> parseNumberToken fails
testExpression("Trailing period invalid", "1. + 2", usConfig, false);
testExpression("Leading comma invalid", ",5 + 1", false);
testExpression("Leading period invalid", ".5 + 1", usConfig, false); // This IS valid JS (0.5), our tokenizer might make ".5" -> parseNumberToken may handle. Let's see.
                                                                // Current parseNumberToken will make ".5" -> 0.5. Our TOKEN_REGEX will give "5" token. So it will fail.
                                                                // If TOKEN_REGEX yields ".5", then parseNumberToken would convert it to 0.5.
                                                                // My TOKEN_REGEX `[0-9][0-9.,]*` needs a leading digit.
                                                                // So ",5" will be tokenized as "," then "5". Correctly an error.


console.log("\n--- Other Existing Invalid/Malicious Tests (should use default config) ---");
testExpression("Alert Hacked", "alert('hacked')", false);
// ... (add back other existing invalid tests) ...
testExpression("Process Exit", "5; process.exit()", false);
testExpression("Unknown function", "unknownFunc(10)", false);
testExpression("Invalid character", "1 + @ + 2", false);
testExpression("Mismatched parentheses 1", "(1 + 2", false);
testExpression("Division by zero", "10 / 0", false);
testExpression("Log negative", "log(-100)", false);
testExpression("Empty expression", "", false);

console.timeEnd("runtime");
