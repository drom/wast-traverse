'use strict';

var VisitorKeys = {
    assert_invalid: [ 'module', 'failure' ],
    assert_return_nan: [ 'invoke' ],
    assert_return: [ 'invoke', 'expr' ],
    assert_trap: [ 'invoke', 'failure' ],
    binop: [ 'left', 'right' ],
    block: [ 'body' ],
    br_if: [ 'id', 'test', 'expr' ],
    br: [ 'id', 'expr' ],
    call_import: [ 'id', 'expr' ],
    call_indirect: [ 'id', 'expr' ],
    call: [ 'id', 'expr' ],
    case: [ 'body' ],
    const: [],
    cvtop: [ 'expr' ],
    export: [],
    failure: [],
    func: [ 'id', 'param', 'result', 'body' ],
    get_local: [ 'id' ],
    grow_memory: [ 'expression' ],
    has_feature: [],
    identifier: [],
    if_else: [ 'test', 'consequent', 'alternate' ],
    if: [ 'test', 'consequent' ],
    import: [ 'id', 'params' ],
    invoke: [ 'body' ],
    item: [],
    label: [ 'id', 'body' ],
    literal: [],
    load: [ 'expr' ],
    local: [ 'items' ],
    loop: [ 'body', 'extra', 'body' ],
    memory_size: [],
    memory: [ 'segment' ],
    module: [ 'body' ],
    nop: [],
    param: [ 'items' ],
    relop: [ 'left', 'right' ],
    result: [],
    return: [ 'expr' ],
    script: [ 'body' ],
    segment: [],
    select: [ 'test', 'consequent', 'alternate' ],
    set_local: [ 'id', 'init' ],
    store: [ 'addr', 'data' ],
    table: [ 'items' ],
    tableswitch: [ 'id', 'test', 'table', 'body' ],
    type: [ 'id' ],
    unop: [ 'expr' ],
    unreachable: []
};

function traverse (tree, visitors) {
    var enter, leave;

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
