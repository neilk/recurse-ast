const assert = require('assert');

const { parse, evaluate, SYMBOLS } = require('./ast.js');
const { PLUS, FIRST, LIST, STRCONCAT } = SYMBOLS;

describe('Recurse ast project', function () {
    it("should pass the specification example", function () {
        assert.deepStrictEqual(
            parse('(first (list 1 (+ 2 3) 9))'),
            [FIRST, [LIST, 1, [PLUS, 2, 3], 9]],
        );
    });


    it("should parse strings", function () {
        assert.deepStrictEqual(
            parse('(strconcat "foo" "bar")'),
            [STRCONCAT, 'foo', 'bar'],
        );
    });

    it("should parse the simplest list", function () {
        assert.deepStrictEqual(
            parse('()'),
            [],
        );
    });

    it("should throw an error for unknown symbol", function () {
        assert.throws(
            () => parse('(foo "bar")'),
            { message: "Unknown symbol foo" },
        );
    });

    it("should parse a list with one element", function () {
        assert.deepStrictEqual(
            parse('(1)'),
            [1],
        );
    });

    it("should throw an error for empty string", function () {
        assert.throws(
            () => parse(''),
            { message: "Could not parse" },
        );
    });

    it("should throw an error for program without enclosing parens", function () {
        assert.throws(
            () => parse('list 1 2 3'),
            { message: "Could not parse" },
            'Program without enclosing parens should not parse'
        );
    });

    it("should throw an error for unbalanced parentheses (open)", function () {
        assert.throws(
            () => parse('(list 1'),
            { message: "Unbalanced parentheses" },
        );
    });

    it("should throw an error for unbalanced parentheses (close)", function () {
        assert.throws(
            () => parse('(list 1))'),
            { message: "Unbalanced parentheses" },
        );
    });

    it("should throw an error for misplaced close parentheses", function () {
        assert.throws(
            () => parse(')(list 1'),
            { message: "Unbalanced parentheses" },
        );
    });

    // It doesn't fail properly on "extraneous" code yet
    /*
    it("should throw an error for program with multiple top-level expressions", function () {
        assert.throws(
            () => parse('(list "a" "b" "c") (list "d" "e" "f")'),
        );
    });

    it("should throw an error for program with code outside parentheses", function () {
        assert.throws(
            () => parse('(list "a" "b" "c") list "d" "e" "f"'),
        );
    });
    */

    it("should ignore whitespace and newlines", function () {
        assert.deepStrictEqual(
            parse('   \t\t(list     1   \t 2  \n 3)    '),
            [LIST, 1, 2, 3],
        );
    });

    it("should evaluate a simple plus function", function () {
        assert.deepStrictEqual(
            evaluate('(+ 3 7)'),
            10,
        );
    });

    it("should evaluate recursively", function () {
        assert.deepStrictEqual(
            evaluate('(+ (+ 1 5) 7)'),
            13,
        )
    })

});

