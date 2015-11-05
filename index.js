'use strict';

var VisitorKeys = {
    assert_invalid: [ 'module', 'failure' ],
    assert_return_nan: [ 'invoke' ],
    assert_return: [ 'invoke', 'expr' ],
    assert_trap: [ 'invoke', 'failure' ],
    binop: [ 'left', 'right' ],
    block: [ 'id', 'body' ],
    break: [ 'id', 'expr' ],
    call_import: [ 'id', 'expr' ],
    call_indirect: [ 'id', 'expr' ],
    call: [ 'id', 'expr' ],
    case: [ 'body' ],
    const: [],
    cvtop: [ 'expr' ],
    export: [],
    failure: [],
    func: [ 'id', 'param', 'result', 'local', 'body' ],
    get_local: [ 'id' ],
    grow_memory: [ 'expression' ],
    has_feature: [],
    identifier: [],
    if: [ 'test', 'consequent', 'alternate' ],
    import: [ 'id', 'params' ],
    invoke: [ 'body' ],
    item: [],
    label: [ 'id', 'body' ],
    literal: [],
    load: [ 'expr' ],
    local: [ 'items' ],
    loop: [ 'body', 'extra' ],
    memory_size: [],
    memory: [ 'segment' ],
    module: [ 'body' ],
    nop: [],
    page_size: [],
    param: [ 'items' ],
    relop: [ 'left', 'right' ],
    result: [],
    return: [ 'expr' ],
    script: [ 'body' ],
    segment: [],
    set_local: [ 'id', 'init' ],
    store: [ 'addr', 'data' ],
    switch: [ 'before', 'body', 'after' ],
    table: [ 'items' ],
    type: [ 'id' ],
    unop: [ 'expr' ]
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
