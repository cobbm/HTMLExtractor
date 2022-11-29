# HTMLExtractor
Parse and extract data from HTML pages recursively using CSS selectors.

This node.js library uses [jsdom](https://github.com/jsdom/jsdom) to parse HTML documents.

## How to use this library
Import the library, create a 'schema' object describing how to process the HTML and call ``extract(html, schema)``.

Schema objects take the following form:
```js
{
  // Specify a CSS selector:
  select: string | null,                 // select first matching element (aka document.querySelector())
  // -- OR --
  selectAll: string | null,              // select all matching elements (aka document.querySelectorAll())
  
  name: string | null,                   // key in the resulting object
  transform: function(element) | null,   // function that processes the matched element
  skip: function(element) | null,        // if this function returns true, don't processing this element or any of it's children
  children: [ ... ] | null               // schema objects to be run on all elements matched by select/selectAll
}
```
All fields in the schema object are optional, however either `select` or `selectAll` *must* be defined
## Basic Example
Please check `schemas.js` and `server.js` for a more complete example on how to use this library.
```js
const extractor = require("HTMLExtractor");

const schema = {
  select: "body",
  name: "whatever",
  children: [
    select: ".some-class",
    name: "extractedText"
    transform: (el) => {
      return el.textContent;
    },
    //chilren:[...]
  ]
};

const html = `<html>
  <head></head>
  <body>
    <div class="some-class">
      Hello World!
    </div>
  </body>
</html>`;

var data = extractor.extract(html, schema);
// returns:
//  {
//    whatever: {
//      extractedText: "Hello World!"
//    }
//  }
```
