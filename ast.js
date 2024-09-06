// Simple parser for a lisp-like language
// Neil Kandalgaonkar, 2024-09-06

const TOKEN_TYPES = {
    OPEN_PAREN: 'OPEN_PAREN',
    CLOSE_PAREN: 'CLOSE_PAREN',
    SYMBOL: 'SYMBOL',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
}

const SYMBOLS = {
    PLUS: '+',
    FIRST: 'first',
    LIST: 'list',
    GREP: 'grep'
}

function* getTokenIterator(program) {
    let start = 0;
    let end = 0;
    while (start < program.length) {
        if (program[start].match(/[\s\n\r]/)) {
            start++;
            continue;
        }
        end = start;
        if (program[start] === '(') {
            yield [TOKEN_TYPES.OPEN_PAREN, null];
            end++;
        } else if (program[start] === ')') {
            yield [TOKEN_TYPES.CLOSE_PAREN, null];
            end++;
        } else {
            while (end < program.length && program[end].match(/\S/) && !program[end].match(/[()]/)) {
                end++;
            }
            const token = program.slice(start, end);
            if (token.match(/^-?\d+$/)) {
                yield [TOKEN_TYPES.NUMBER, parseInt(token)];
            } else if (token.match(/^".*"$/)) {
                yield [TOKEN_TYPES.STRING, token.slice(1, -1)];
            } else if (token.match(/^\S+$/)) {
                // probably we will check if it is a valid symbol or something
                const symbolEntry = Object.entries(SYMBOLS).find(([_, sym]) => sym === token);
                if (symbolEntry) {
                    yield [TOKEN_TYPES.SYMBOL, symbolEntry[1]];
                } else {
                    throw new Error(`Unknown symbol ${token}`);
                }
            } else {
                throw new Error(`Don't know how to parse token ${token}`);
            }
        }
        start = end;
    }
}


function getAst(tokenIterator, depth=0) {
    let tree = [];
    let token, done;
    while ({ value: token, done } = tokenIterator.next()) {
        if (done) {
            if (depth !== 0) {
                throw new Error("Unbalanced parentheses");
            }
            return tree;
        }
        const [type, val] = token;
        if (type === TOKEN_TYPES.OPEN_PAREN) {
            tree.push(getAst(tokenIterator, depth + 1));
        } else if (type === TOKEN_TYPES.CLOSE_PAREN) {
            if (depth === 0) {
                throw new Error("Unbalanced parentheses");
            }
            return tree;
        } else if (type === TOKEN_TYPES.NUMBER) {
            tree.push(val);
        } else if (type === TOKEN_TYPES.STRING) {
            tree.push(val);
        } else if (type === TOKEN_TYPES.SYMBOL) {
            tree.push(val);
        }
    }
    throw new Error("Should never reach here");
}

function parse(s) {
    const ast = getAst(getTokenIterator(s))[0];
    if (!(Array.isArray(ast))) {
        throw new Error("Could not parse")
    }
    return ast;
}

module.exports = {
    parse,
    SYMBOLS,
}
