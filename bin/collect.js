#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    path = require('path'),
    jsof = require('jsof'),
    union = require('lodash.union'),
    merge = require('lodash.merge');

// blind traverse
function traverse (tree, visitors) {
    var enter, leave;

    function rec (node, parent, tail) {
        var i, ilen, j, jlen, keys, key, limb, nodeKind;
        nodeKind = node.kind;
        if (nodeKind) {
            enter(node, parent, tail);
            keys = Object.keys(node);
            for (i = 0, ilen = keys.length; i < ilen; i++) {
                key = keys[i];
                limb = node[key];
                if (limb && typeof limb === 'object') {
                    if (limb instanceof Array) {
                        for (j = 0, jlen = limb.length; j < jlen; j++) {
                            rec(limb[j], node, key);
                        }
                    } else {
                        rec(limb, node, key);
                    }
                }
            }
            leave(node, parent, tail);
        }
    }

    enter = visitors.enter || function () {};
    leave = visitors.leave || function () {};
    rec(tree, undefined, undefined);
};

var total = {};

function runner (fileName) {
    return function (err, data) {
        var tree, res;
        console.log(fileName);
        tree = jsof.p(data);
        res = {};
        traverse(tree, {
            enter: function (node, parent, tail) {
                if (res[node.kind] === undefined) {
                    res[node.kind] = [];
                }
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
