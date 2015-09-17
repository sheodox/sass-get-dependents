# SASS-GET-DEPENDENTS
*Return a list of files that depend on your SCSS/SASS partial.*

## Example:
```javascript
dependentFiles = require('sass-get-dependents');

var basePath = 'directory/to/search/within';

// Array of dependent files
var files = dependentFiles(src, basePath);
console.log(files);
```
## As a CLI
`npm install -g sass-get-dependents`

From within SASS Structure
```bash
$ getDependents --file=path/to/partial/file --basePath=path/to/search/in
```
