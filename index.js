'use strict';

var spec = require('wast-spec');

function traverse (tree, visitors) {
    var enter, leave, VisitorKeys;

    VisitorKeys = spec.visitorKeys;

    function rec (node, parent, tail) {
        var i, ilen, j, jlen, keys, key, limb, nodeKind;
        nodeKind = node.kind;
        if (nodeKind) {
            enter(node, parent, tail);
            keys = VisitorKeys[nodeKind];
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

module.exports = traverse;
