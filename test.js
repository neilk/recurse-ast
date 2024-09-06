const assert = require('assert');

const { parse, SYMBOLS } = require('./ast.js');
const { PLUS, FIRST, LIST, STRCONCAT } = SYMBOLS;

assert.deepStrictEqual(
    parse('(first (list 1 (+ 2 3) 9))'),
    [FIRST, [LIST, 1, [PLUS, 2, 3], 9]],
    "Example from specifications"
);

assert.deepStrictEqual(
    parse('(strconcat "foo" "bar")'),
    [STRCONCAT, 'foo', 'bar'],
    "Parse strings"
);

assert.deepStrictEqual(
    parse('()'),
    [],
    "Simplest list"
);

assert.throws(
    () => parse('(foo "bar")'),
    { message: "Unknown symbol foo" }
);

assert.deepStrictEqual(
    parse('(1)'),
    [1],
    "List with one element"
);

assert.throws(
    () => parse(''),
    { message: "Could not parse" }
);

assert.throws(
    () => parse('list 1 2 3'),
    { message: "Could not parse" }
);

assert.throws(
    () => parse('(list 1'),
    { message: "Unbalanced parentheses" }
);

assert.throws(
    () => parse('(list 1))'),
    { message: "Unbalanced parentheses" }
);

assert.throws(
    () => parse(')(list 1'),
    { message: "Unbalanced parentheses" }
);

