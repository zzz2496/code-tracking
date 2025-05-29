// evaluateMathExpression.mjs

// --- Configuration ---
const DEFAULT_CONFIG = {
    preferredDecimalSeparator: ',', // Default to comma for Indonesian context
};

// Regex for initial character validation (allows underscore for _PERCENTOF_ and now comma for numbers)
const ALLOWED_CHAR_REGEX = /^[a-zA-Z0-9\s.+\-*/%^().,_]+$/;

const ALLOWED_FUNCTIONS = {
    'square': {
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for square: must be a number.");
            return x * x;
        },
        arity: 1
    },
    'sqrt': {
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for sqrt: must be a number.");
            if (x < 0) throw new Error("sqrt of negative number is not supported by this evaluator.");
            return Math.sqrt(x);
        },
        arity: 1
    },
    'abs': {
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for abs: must be a number.");
            return Math.abs(x);
        },
        arity: 1
    },
    'log': { // Log base 10
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for log: must be a number.");
            if (x <= 0) throw new Error("log (base 10) of non-positive number is not supported.");
            return Math.log10(x);
        },
        arity: 1
    },
    'sin': { // Sine function (argument in radians)
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for sin: must be a number.");
            return Math.sin(x);
        },
        arity: 1
    },
    'cos': { // Cosine function (argument in radians)
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for cos: must be a number.");
            return Math.cos(x);
        },
        arity: 1
    },
    'tan': { // Tangent function (argument in radians)
        fn: (x) => {
            if (typeof x !== 'number') throw new Error("Invalid argument for tan: must be a number.");
            // Handle cases where tan is undefined (e.g., tan(PI/2))
            // Math.tan(Math.PI/2) gives a very large number, not Infinity.
            // Depending on precision needs, this might be acceptable or require specific checks.
            const result = Math.tan(x);
            // if (Math.abs(Math.cos(x)) < 1e-15) { // cos(x) is close to 0
            //     throw new Error("Tangent undefined for this input (e.g., PI/2 + k*PI).");
            // }
            return result;
        },
        arity: 1
    },
    // Consider adding PI as a constant if trig functions are used often
    // 'PI': { value: Math.PI } // This would require changes to how constants are handled
};

const OPERATORS = {
    '+': { precedence: 1, associativity: 'Left', fn: (a, b) => a + b },
    '-': { precedence: 1, associativity: 'Left', fn: (a, b) => a - b },
    '*': { precedence: 2, associativity: 'Left', fn: (a, b) => a * b },
    '/': {
        precedence: 2,
        associativity: 'Left',
        fn: (a, b) => {
            if (b === 0) throw new Error("Division by zero.");
            return a / b;
        }
    },
    '%': { // Modulo operator
        precedence: 2,
        associativity: 'Left',
        fn: (a, b) => {
            if (b === 0) throw new Error("Modulo by zero.");
            return a % b;
        }
    },
    '_PERCENTOF_': { // Added for "X percent of Y"
        precedence: 2, // Same as multiply/divide
        associativity: 'Left',
        fn: (percentageValue, baseValue) => (percentageValue / 100) * baseValue
    },
    '^': { precedence: 3, associativity: 'Right', fn: (a, b) => Math.pow(a, b) },
};

// --- Sanitization ---
function sanitizeInput(expression) {
    if (typeof expression !== 'string') {
        throw new Error("Invalid input: Expression must be a string.");
    }
    let processedExpression = expression.trim();
    if (!processedExpression) {
        throw new Error("Invalid expression: Expression is empty.");
    }
    if (!ALLOWED_CHAR_REGEX.test(processedExpression)) {
        for (let i = 0; i < processedExpression.length; i++) {
            if (!ALLOWED_CHAR_REGEX.test(processedExpression[i])) {
                throw new Error(`Invalid expression: Contains disallowed character '${processedExpression[i]}' at position ${i}.`);
            }
        }
        throw new Error("Invalid expression: Contains disallowed characters.");
    }

    let balance = 0;
    for (const char of processedExpression) {
        if (char === '(') balance++;
        else if (char === ')') balance--;
        if (balance < 0) throw new Error("Invalid expression: Mismatched parentheses (unexpected closing parenthesis).");
    }
    if (balance !== 0) throw new Error("Invalid expression: Mismatched parentheses (not all opened parentheses were closed).");

    processedExpression = processedExpression.replace(/\bmod\b/gi, '%');
    processedExpression = processedExpression.replace(/\s+percent\s+of\s+/gi, ' _PERCENTOF_ ');

    return processedExpression.trim();
}

// --- Number Parsing with Localization ---
function parseNumberToken(tokenString, preferredDecimalSeparator) {
    if (typeof tokenString !== 'string' || tokenString.trim() === '') return NaN;

    let s = tokenString.trim();
    const thousandSeparator = preferredDecimalSeparator === ',' ? '.' : ',';

    const thousandSeparatorRegex = new RegExp(thousandSeparator === '.' ? '\\.' : thousandSeparator, 'g');
    s = s.replace(thousandSeparatorRegex, '');

    if (preferredDecimalSeparator === ',') {
        s = s.replace(',', '.');
    }

    if ((s.match(/\./g) || []).length > 1) {
        return NaN;
    }

    // Test if the string is a valid number format after cleaning
    // Allows for optional leading minus, digits, optional single dot, then more digits.
    if (!/^-?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(s) && !/^-?[0-9]+$/.test(s)) {
         // If s is just "-" or "+", it's not a number here.
         if (s === '-' || s === '+') return NaN;
         // If parseFloat gets something but our stricter check fails, it might be something like "1.2.3"
         // which should have been caught by multiple dot check. Or "1..2" etc.
         // If parse_float can get number but regex test fails -> this case is possible if regex is not perfect
         const temp_val = parseFloat(s);
         if (isNaN(temp_val)) return NaN; // if parseFloat also fail, confirmed NaN
         // if parseFloat success, but string is like "1.2abc", parseFloat will return 1.2
         // So we need to check if original cleaned string `s` *only* contains valid numeric parts
         // This regex is more robust than the previous one:
         if(!/^-?((\d+(\.\d*)?)|(\.\d+))$/.test(s)) { // stricter check for number format
            return NaN;
         }
    }
    const result = parseFloat(s);
    return isNaN(result) ? NaN : result;
}


// --- Tokenizer ---
const TOKEN_REGEX = /\s*([a-zA-Z_][a-zA-Z0-9_]*|[0-9][0-9.,]*|[0-9]*\.[0-9]+|[0-9]+|[\+\-\*\/\%\^\(\)\,])\s*/g;
// Updated number part:
// - [0-9][0-9.,]* : Digit followed by digits, dots, or commas (e.g., "1,234.56", "1.000.000", "1,2")
// - [0-9]*\.[0-9]+ : Optional digits, dot, then digits (e.g., ".5", "0.5", "123.45")
// - [0-9]+ : Integers (e.g., "123")

function tokenize(expression) {
    const tokens = [];
    let match;
    let lastIndex = 0;
    TOKEN_REGEX.lastIndex = 0;

    while ((match = TOKEN_REGEX.exec(expression)) !== null) {
        if (match.index > lastIndex) {
            const untokenizedPart = expression.substring(lastIndex, match.index).trim();
            if (untokenizedPart) {
                 throw new Error(`Invalid expression: Unexpected characters or malformed token sequence near '${untokenizedPart}'.`);
            }
        }
        tokens.push(match[1]);
        lastIndex = TOKEN_REGEX.lastIndex;
    }

    if (lastIndex < expression.length) {
        const remaining = expression.substring(lastIndex).trim();
        if (remaining) {
            throw new Error(`Invalid expression: Unable to tokenize remaining part: '${remaining}'.`);
        }
    }
    return tokens;
}

// --- Preprocess for Unary Minus/Plus ---
function preprocessUnaryOperators(tokens, config) {
    const processedTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const prevToken = i > 0 ? tokens[i-1] : null;

        if ((token === '-' || token === '+') &&
            (i === 0 || prevToken === '(' || prevToken === ',' || OPERATORS[prevToken])) {
            const nextTokenStr = tokens[i + 1];
            if (nextTokenStr !== undefined) {
                // Try to form a number like "-5" or "+3.14"
                // We need to check if nextTokenStr itself is number-like, not just an operator/function
                // A quick check: if nextTokenStr starts with a digit or a decimal separator for the current config
                const isNextPotentiallyNumeric = /^[0-9]/.test(nextTokenStr) ||
                                               (config.preferredDecimalSeparator === '.' && nextTokenStr.startsWith('.')) ||
                                               (config.preferredDecimalSeparator === ',' && nextTokenStr.startsWith(','));

                if (isNextPotentiallyNumeric) {
                    const potentialNum = parseNumberToken(token + nextTokenStr, config.preferredDecimalSeparator);
                    if (!isNaN(potentialNum)) {
                        processedTokens.push(potentialNum);
                        i++; // Skip the nextToken as it's now part of the number
                        continue;
                    }
                }
            }
            // If not combinable into a single number (e.g., "-sqrt(4)" or "-(5+2)")
            if (token === '-') {
                processedTokens.push(0);
                processedTokens.push('-');
            } else if (token === '+') {
                // Unary plus can be ignored if not forming a number
            }
        } else {
            processedTokens.push(token);
        }
    }
    return processedTokens;
}


// --- Shunting-yard Algorithm (Infix to RPN) ---
function infixToRpn(tokens, config) {
    const outputQueue = [];
    const operatorStack = [];

    const getOperatorInfo = (token) => OPERATORS[token];
    const getFunctionInfo = (token) => ALLOWED_FUNCTIONS[token];

    for (const token of tokens) {
        if (typeof token === 'number') { // Already parsed by unary preprocessor
            outputQueue.push(token);
        } else if (getFunctionInfo(token)) {
            operatorStack.push(token);
        } else if (token === ',') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1] !== '(') {
                throw new Error("Invalid expression: Misplaced comma or mismatched parentheses for function arguments.");
            }
        } else if (getOperatorInfo(token)) {
            const op1Info = getOperatorInfo(token);
            while (operatorStack.length > 0) {
                const topStackToken = operatorStack[operatorStack.length - 1];
                const op2Info = getOperatorInfo(topStackToken);
                if (op2Info && (
                    (op1Info.associativity === 'Left' && op1Info.precedence <= op2Info.precedence) ||
                    (op1Info.associativity === 'Right' && op1Info.precedence < op2Info.precedence)
                )) {
                    outputQueue.push(operatorStack.pop());
                } else {
                    break;
                }
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1] !== '(') {
                throw new Error("Invalid expression: Mismatched parentheses (unexpected ')' or missing '(' ).");
            }
            operatorStack.pop(); // Pop the '('
            if (operatorStack.length > 0 && getFunctionInfo(operatorStack[operatorStack.length - 1])) {
                outputQueue.push(operatorStack.pop());
            }
        } else {
            // Not an operator, function, or parenthesis, try parsing as a number string
            const numValue = parseNumberToken(token, config.preferredDecimalSeparator);
            if (!isNaN(numValue)) {
                outputQueue.push(numValue);
            } else {
                throw new Error(`Invalid expression: Unknown or misplaced token '${token}', or invalid number format.`);
            }
        }
    }

    while (operatorStack.length > 0) {
        const op = operatorStack.pop();
        if (op === '(') {
            throw new Error("Invalid expression: Mismatched parentheses (operator stack has unpopped '(' ).");
        }
        outputQueue.push(op);
    }
    return outputQueue;
}

// --- RPN Evaluator ---
function evaluateRpn(rpnTokens) {
    const stack = [];
    for (const token of rpnTokens) {
        if (typeof token === 'number') {
            stack.push(token);
        } else if (ALLOWED_FUNCTIONS[token]) {
            const funcData = ALLOWED_FUNCTIONS[token];
            if (stack.length < funcData.arity) {
                throw new Error(`Invalid expression: Not enough arguments for function '${token}'. Expected ${funcData.arity}, found ${stack.length}.`);
            }
            const args = [];
            for (let i = 0; i < funcData.arity; i++) {
                args.unshift(stack.pop());
            }
            try {
                stack.push(funcData.fn(...args));
            } catch (e) {
                throw new Error(`Error during function '${token}' execution: ${e.message}`);
            }
        } else if (OPERATORS[token]) {
            const opData = OPERATORS[token];
            if (stack.length < 2) {
                throw new Error(`Invalid expression: Not enough operands for operator '${token}'. Needs 2, found ${stack.length}.`);
            }
            const b = stack.pop();
            const a = stack.pop();
            try {
                stack.push(opData.fn(a, b));
            } catch (e) {
                throw new Error(`Error during operator '${token}' execution: ${e.message}`);
            }
        } else {
            throw new Error(`Invalid RPN token: '${token}'. This indicates an issue in earlier stages.`);
        }
    }

    if (stack.length !== 1) {
        if (stack.length === 0 && rpnTokens.length > 0) {
             throw new Error("Invalid expression: Malformed expression led to empty evaluation stack.");
        } else if (stack.length > 1) {
             throw new Error(`Invalid expression: Too many operands or missing operators. ${stack.length} items left on stack: [${stack.join(', ')}]. RPN: [${rpnTokens.join(', ')}]`);
        }
    }
    return stack[0];
}


// --- Main Evaluation Function (Exported) ---
export function evaluateMathExpression(expression, userConfig = {}) {
    const config = { ...DEFAULT_CONFIG, ...userConfig };
    try {
        const sanitized = sanitizeInput(expression);
        let tokens = tokenize(sanitized);

        if (tokens.length === 0 && sanitized.length > 0) {
             throw new Error("Invalid expression: No valid tokens found after sanitization.");
        }
        if (tokens.length === 0 && sanitized.length === 0) {
            throw new Error("Invalid expression: Expression is empty.");
        }

        tokens = preprocessUnaryOperators(tokens, config);
        const rpn = infixToRpn(tokens, config);

        if (rpn.length === 0 && tokens.length > 0 && !(tokens.length ===1 && typeof tokens[0] === 'number') ) {
            // Check if the single token is a number that successfully parsed
            if (tokens.length === 1 && typeof rpn[0] === 'number') {
                // This is fine, e.g., "5" or "-5"
            } else {
                throw new Error("Invalid expression: Expression resulted in no operations or is incomplete.");
            }
        }
         if (rpn.length === 0 && tokens.length === 0) { // Empty string
            throw new Error("Invalid expression: Expression is empty.");
         }
          if (rpn.length === 0 && !(tokens.length === 1 && typeof tokens[0] === 'number') ) {
            // This case catches scenarios like "()" or just operators "+" which are invalid
            // unless the original expression was a single valid number that became a single RPN token.
            if (rpn.length === 1 && typeof rpn[0] === 'number') {
                 // This is valid, e.g. input "5"
            } else {
                throw new Error("Invalid expression: Expression is incomplete or results in no operations.");
            }
         }


        const result = evaluateRpn(rpn);

        if (typeof result === 'number' && (isNaN(result) || !isFinite(result))) {
            throw new Error("Result is NaN or Infinity.");
        }
        return result;

    } catch (error) {
        // console.error("Internal evaluation error details:", error.stack || error);
        throw new Error(error.message);
    }
}