# HTMLExtractor
Parse and extract data from HTML pages recursively using CSS selectors

# How to use this library?
Import the library, create a 'schema' object describing how to process the HTML and call ``extract()``.

Schema object takes the following form:
```
{
  // Specify a CSS selector:
  select: string,                 // select first matching element (aka document.querySelector())
  // -- OR --
  selectAll: string,              // select all matching elements (aka document.querySelectorAll())
  
  name: string,                   // key in the resulting object
  transform: function(element),   // function that processes the matched element
  skip: function(element),        // if this function returns true, don't processing this element or any of it's children
  children: [ ... ]               // schema objects to be run on all elements matched by select/selectAll
}
```
## Basic Example
Please check `schemas.js` and `server.js` for a more complete example on how to use this library.
```
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
