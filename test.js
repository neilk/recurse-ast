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

assert.deepStrictEqual(
    parse('(foo)'),
    ['foo'],
    "List with one element"
);

assert.throws(
    () => parse(''),
    { message: "Could not parse" }
);

assert.throws(
    () => parse('did not have any parentheses'),
    { message: "Could not parse" }
);

assert.throws(
    () => parse('(foo bar'),
    { message: "Unbalanced parentheses" }
);

assert.throws(
    () => parse('(foo bar))'),
    { message: "Unbalanced parentheses" }
);

assert.throws(
    () => parse(')(foo bar'),
    { message: "Unbalanced parentheses" }
);

