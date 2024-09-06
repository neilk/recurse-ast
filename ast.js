#!/usr/bin/env node

const { readFileSync } = require('fs');

function* getTokenIterator(program) {
    let start = 0;
    let end = 0;
    while (start < program.length) {
        if (program[start].match(/[\s\n\r]/)) {
            start++;
            continue;
        }
        end = start;
        if (program[start].match(/[()]/)) {
            end++;
        } else {
            while (end < program.length && program[end].match(/\S/) && !program[end].match(/[()]/)) {
                end++;
            }
        }
        if (start === end) {
            break;
        }
        yield program.slice(start, end);
        start = end;
    }
}

function parse(tokenIterator) {
    // TODO this wraps a list around the whole program; fix it
    let args;
    let token, done;
    while ({value: token, done} = tokenIterator.next()) {
        if (done) {
            break;
        }
        console.dir(token);
        if (token === '(') {
            if (!Array.isArray(args)) {
                args = [];
            }
            args.push(parse(tokenIterator));
        } else if (token === ')') {
            break;
        } else {
            if (!Array.isArray(args)) {
                args = [];
            }
            args.push(token);
        }
    }
    return args;
}

function main() {
    // or /dev/stdin ...
    const program = readFileSync('/dev/stdin').toString();
    const tokenIterator = getTokenIterator(program);
    const ast = parse(tokenIterator);
    console.dir(ast, { depth: null });
}

main();
