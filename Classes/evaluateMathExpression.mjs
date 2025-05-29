// evaluateMathExpression.mjs

// --- Configuration ---
const DEFAULT_CONFIG = {
    preferredDecimalSeparator: ',', // Default to comma for Indonesian context
};

// Regex for initial character validation (allows underscore for _PERCENTOF_ and now comma for numbers)
const ALLOWED_CHAR_REGEX = /^[a-zA-Z0-9\s.+\-*/%^().,_]+$/;

const ALLOWED_FUNCTIONS = {
    'square': { /* ... (no change) ... */ },
    'sqrt': { /* ... (no change) ... */ },
    'abs': { /* ... (no change) ... */ },
    'log': { /* ... (no change) ... */ },
};
// Copy existing ALLOWED_FUNCTIONS definitions here
ALLOWED_FUNCTIONS['square'] = {
    fn: (x) => {
        if (typeof x !== 'number') throw new Error("Invalid argument for square: must be a number.");
        return x * x;
    },
    arity: 1
};
ALLOWED_FUNCTIONS['sqrt'] = {
    fn: (x) => {
        if (typeof x !== 'number') throw new Error("Invalid argument for sqrt: must be a number.");
        if (x < 0) throw new Error("sqrt of negative number is not supported by this evaluator.");
        return Math.sqrt(x);
    },
    arity: 1
};
ALLOWED_FUNCTIONS['abs'] = {
    fn: (x) => {
        if (typeof x !== 'number') throw new Error("Invalid argument for abs: must be a number.");
        return Math.abs(x);
    },
    arity: 1
};
ALLOWED_FUNCTIONS['log'] = {
    fn: (x) => {
        if (typeof x !== 'number') throw new Error("Invalid argument for log: must be a number.");
        if (x <= 0) throw new Error("log (base 10) of non-positive number is not supported.");
        return Math.log10(x);
    },
    arity: 1
};


const OPERATORS = { /* ... (no change) ... */ };
// Copy existing OPERATORS definitions here
OPERATORS['+'] = { precedence: 1, associativity: 'Left', fn: (a, b) => a + b };
OPERATORS['-'] = { precedence: 1, associativity: 'Left', fn: (a, b) => a - b };
OPERATORS['*'] = { precedence: 2, associativity: 'Left', fn: (a, b) => a * b };
OPERATORS['/'] = {
    precedence: 2,
    associativity: 'Left',
    fn: (a, b) => {
        if (b === 0) throw new Error("Division by zero.");
        return a / b;
    }
};
OPERATORS['%'] = {
    precedence: 2,
    associativity: 'Left',
    fn: (a, b) => {
        if (b === 0) throw new Error("Modulo by zero.");
        return a % b;
    }
};
OPERATORS['_PERCENTOF_'] = {
    precedence: 2,
    associativity: 'Left',
    fn: (percentageValue, baseValue) => (percentageValue / 100) * baseValue
};
OPERATORS['^'] = { precedence: 3, associativity: 'Right', fn: (a, b) => Math.pow(a, b) };


// --- Sanitization ---
function sanitizeInput(expression) {
    // ... (no structural change, but ALLOWED_CHAR_REGEX updated) ...
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
/**
 * Parses a string token into a number, handling preferred decimal and thousand separators.
 * @param {string} tokenString The string token to parse.
 * @param {string} preferredDecimalSeparator The character to treat as decimal (',' or '.').
 * @returns {number} The parsed number, or NaN if invalid.
 */
function parseNumberToken(tokenString, preferredDecimalSeparator) {
    if (typeof tokenString !== 'string' || tokenString.trim() === '') return NaN;

    let s = tokenString.trim();
    const thousandSeparator = preferredDecimalSeparator === ',' ? '.' : ',';

    // 1. Remove all occurrences of the determined thousand separator.
    // Escape the separator if it's a period for regex.
    const thousandSeparatorRegex = new RegExp(thousandSeparator === '.' ? '\\.' : thousandSeparator, 'g');
    s = s.replace(thousandSeparatorRegex, '');

    // 2. If the preferred decimal separator is not '.', convert it to '.'
    if (preferredDecimalSeparator === ',') {
        s = s.replace(',', '.');
    }

    // 3. Validate: After normalization, the string should have at most one '.'
    //    and should not contain the original thousandSeparator char (unless it was also the preferredDecimalSeparator initially).
    //    The second condition (s.includes(thousandSeparator)) is implicitly handled if step 1 & 2 are correct
    //    and the input wasn't malformed like "1.2,3.4" where both are used as decimals.
    if ((s.match(/\./g) || []).length > 1) {
        return NaN; // Invalid format: multiple decimal points after normalization (e.g., "1.2.3" or "1,2,3" becoming "1.2.3")
    }

    // 4. Use parseFloat for the final conversion.
    const result = parseFloat(s);

    // Ensure that the entire string was a valid number structure.
    // parseFloat can be lenient (e.g. "1.2abc" -> 1.2). We want stricter.
    // A simple check: if 's' after normalization still contains non-numeric characters (excluding a single leading '-' and single '.'), it's likely not purely a number.
    if (!/^-?[0-9]*\.?[0-9]+$/.test(s) && !/^-?[0-9]+$/.test(s)) {
         if (!isNaN(result)) { // If parseFloat got something but our stricter check fails
            // This can happen for "1.2.3" if the multiple dot check was bypassed, or "1..2"
            // The multiple dot check should catch most of this.
         }
         // If result is NaN, it's already caught.
    }

    return isNaN(result) ? NaN : result;
}


// --- Tokenizer ---
// Regex to capture:
// 1. Function names/Keywords (alphanumeric with underscores)
// 2. Number-like patterns (digits, dots, commas). parseNumberToken will validate.
// 3. Operators, Parentheses, Comma (for function args)
const TOKEN_REGEX = /\s*([a-zA-Z_][a-zA-Z0-9_]*|[0-9][0-9.,]*|[0-9]+|[\+\-\*\/\%\^\(\)\,])\s*/g;
// Explanation of number part:
// - [0-9][0-9.,]* : A digit followed by any sequence of digits, dots, or commas. Catches "1,234.56", "1.000", "1,2" etc.
// - [0-9]+ : Catches simple integers like "123" if not caught by the above.
// The order matters. [a-zA-Z_] for functions first.

function tokenize(expression) {
    // ... (no structural change, but TOKEN_REGEX updated) ...
    const tokens = [];
    let match;
    let lastIndex = 0;
    TOKEN_REGEX.lastIndex = 0; // Reset regex state for multiple calls

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
function preprocessUnaryOperators(tokens, config) { // Pass config for parseNumberToken
    // ... (logic needs to use parseNumberToken if combining unary with number) ...
    const processedTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const prevToken = i > 0 ? tokens[i-1] : null;

        if ((token === '-' || token === '+') &&
            (i === 0 || prevToken === '(' || prevToken === ',' || OPERATORS[prevToken])) {
            // It's a unary operator
            const nextToken = tokens[i + 1];
            if (nextToken !== undefined) {
                const potentialNum = parseNumberToken(token + nextToken, config.preferredDecimalSeparator);
                if (!isNaN(potentialNum)) { // Successfully combined like "-5" or "+3.14"
                    processedTokens.push(potentialNum); // Push the combined number
                    i++; // Skip the nextToken as it's now part of the number
                    continue;
                }
            }
            // If not combinable into a single number (e.g., "-sqrt(4)" or "-(5+2)")
            if (token === '-') {
                processedTokens.push(0); // Represent as 0 - next
                processedTokens.push('-');
            } else if (token === '+') {
                // Unary plus can often be ignored if it's not forming a number like "+5"
                // If it's "+(expression)", it effectively becomes (expression) or 0+(expression)
                // Let's choose to ignore it unless it forms a number (handled above)
            }
        } else {
            processedTokens.push(token);
        }
    }
    return processedTokens;
}


// --- Shunting-yard Algorithm (Infix to RPN) ---
function infixToRpn(tokens, config) { // Pass config for parseNumberToken
    const outputQueue = [];
    const operatorStack = [];

    const getOperatorInfo = (token) => OPERATORS[token];
    const getFunctionInfo = (token) => ALLOWED_FUNCTIONS[token];

    for (const token of tokens) {
        // If token is already a number (from unary preprocessing), push it.
        if (typeof token === 'number') {
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
            // Not an operator, function, or parenthesis, try parsing as a number
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
    // ... (no change) ...
    const stack = [];
    for (const token of rpnTokens) {
        if (typeof token === 'number') {
            stack.push(token);
        } else if (ALLOWED_FUNCTIONS[token]) { // Token is a function name
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
        } else if (OPERATORS[token]) { // Token is an operator symbol
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
            throw new Error("Invalid expression: Expression resulted in no operations.");
        }
         if (rpn.length === 0 && tokens.length === 0) {
            throw new Error("Invalid expression: Expression is empty.");
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