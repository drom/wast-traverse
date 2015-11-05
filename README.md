# WebAssembly AST traversal tool
[![NPM](https://badge.fury.io/js/wast-traverse.svg)](http://badge.fury.io/js/wast-traverse)  [![Travis](https://travis-ci.org/drom/wast-traverse.svg)](https://travis-ci.org/drom/wast-traverse)  [![appVeyor](https://ci.appveyor.com/api/projects/status/c2ustebsirnhostl?svg=true)](https://ci.appveyor.com/project/drom/wast-traverse)


Inspired by [estraverse](https://github.com/estools/estraverse)

## Use

### Node.js

```sh
npm i wast-traverse --save
```

```js
var traverse = require('wast-traverse');
var count = 0;
traverse(tree, {
    enter: function (node, parent) {
        if (node.kind === 'func') {
          count++;
        }
    },
    leave: function (node, parent) {
      ...
    }
});
```

## Testing
`npm test`

## License
MIT [LICENSE](https://github.com/drom/wast-traverse/blob/master/LICENSE).
