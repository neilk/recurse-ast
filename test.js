const assert = require('assert');

const { parse } = require('./ast.js');

assert.deepStrictEqual(
    parse('(first (list 1 (+ 2 3) 9))'),
    ['first', ['list', 1, ['+', 2, 3], 9]],
    "Nested list"
);

assert.deepStrictEqual(
    parse('()'),
    [],
    "Simplest list"
);

assert.throws(
    () => parse(''),
    "Parse empty string"
);

assert.throws(
    () => parse('(first (list 1 (+ 2 3) 9)'),
    "Unbalanced parentheses"
);
