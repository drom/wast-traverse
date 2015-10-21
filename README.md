# WebAssembly traversal tool

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
