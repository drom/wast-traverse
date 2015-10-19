#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path'),
    jsof = require('jsof'),
    traverse = require('../'),
    union = require('lodash.union'),
    merge = require('lodash.merge'),
    parser = require('wast-parser');

var total = {};

function runner (fileName) {
    return function (err, data) {
        var tree, res;
        console.log(fileName);
        tree = jsof.p(data);
        res = {};
        traverse(tree, {
            enter: function (node, parent, tail) {
                if (parent) {
                    if (tail) {
                        if (res[parent.kind] === undefined) {
                            res[parent.kind] = [];
                        }
                        res[parent.kind] = union(res[parent.kind], [tail]);
                    }
                }
                // console.log(node.kind);
            }
        });
        merge(total, res);
        console.log(res);
        console.log(total);
    };
}

var src = path.resolve(__dirname, '../wast-parser/results/');

var jsofFileNames = fs.readdirSync(src);

jsofFileNames.forEach(function (jsofFileName) {
    var matchArr = jsofFileName.match('^(.*).js$');
    if (matchArr) {
        fs.readFile(
            path.resolve(src, jsofFileName),
            'utf8',
            runner(jsofFileName)
        );
    }
});
