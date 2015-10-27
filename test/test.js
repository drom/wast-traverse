'use strict';

var fs = require('fs'),
    path = require('path'),
    // expect = require('chai').expect,
    jsof = require('jsof'),
    traverse = require('../');

var src = path.resolve(__dirname, '../wast-parser/results/');

var astFileNames = fs.readdirSync(src);

describe('parse', function () {
    astFileNames.forEach(function (name) {
        it(name, function (done) {
            if (name.match('^(.*)js$')) {
                fs.readFile(
                    path.resolve(src, name),
                    'utf8',
                    function (err, jsData) {
                        var ast;
                        if (err) { throw err; }
                        ast = jsof.p(jsData);
                        var res = [];
                        traverse(ast, {
                            enter: function (node) {
                                if (node.kind === 'func') {
                                    res.push(node.id);
                                }
                            }
                        });
                        console.log(res);
                        done();
                    }
                );
            } else {
                done();
            }
        });
    });
});
