'use strict';

var VisitorKeys = {
    assert_invalid: [ 'module', 'failure' ],
    assert_return: [ 'invoke', 'expr' ],
    assert_return_nan: [ 'invoke' ],
    assert_trap: [ 'invoke', 'failure' ],
    binop: [ 'left', 'right' ],
    block: [ 'body' ],
    br: [ 'id', 'expr' ],
    br_if: [ 'id', 'test', 'expr' ],
    br_table: [ 'expr', 'body' ],
    call: [ 'id', 'expr' ],
    call_import: [ 'id', 'expr' ],
    call_indirect: [ 'id', 'expr' ],
    const: [  ],
    cvtop: [ 'expr' ],
    else: [ 'id', 'body' ],
    export: [ 'name', 'id' ],
    func: [ 'id', 'param', 'result', 'body' ],
    get_local: [ 'id' ],
    grow_memory: [ 'expr' ],
    identifier: [  ],
    if: [ 'test', 'consequent', 'alternate' ],
    import: [ 'id', 'name1', 'name2', 'params' ],
    invoke: [ 'body' ],
    item: [  ],
    literal: [  ],
    load: [ 'expr' ],
    local: [ 'items' ],
    loop: [ 'body', 'extra' ],
    memory: [ 'segment' ],
    memory_size: [  ],
    module: [ 'body' ],
    nop: [  ],
    param: [ 'items' ],
    relop: [ 'left', 'right' ],
    result: [  ],
    return: [ 'expr' ],
    script: [ 'body' ],
    segment: [ 'name' ],
    select: [ 'test', 'consequent', 'alternate' ],
    set_local: [ 'id', 'init' ],
    start: [ 'id' ],
    store: [ 'addr', 'data' ],
    table: [ 'items' ],
    then: [ 'id', 'body' ],
    type: [ 'id' ],
    unop: [ 'expr' ],
    unreachable: [  ]
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
