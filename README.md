# minify-groq

[![npm version](http://img.shields.io/npm/v/minify-groq.svg?style=flat-square)](https://www.npmjs.com/package/minify-groq)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/minify-groq.svg?style=flat-square)](https://bundlephobia.com/result?p=minify-groq)[![Build Status](http://img.shields.io/travis/rexxars/minify-groq/master.svg?style=flat-square)](https://travis-ci.org/rexxars/minify-groq)

Minifies a [GROQ-query](https://groq.dev/) by reducing unnecessary whitespace.

**Note:** This module is not using full GROQ-parser, so it doesn't know where whitespace is "required".
Thus, it can only _reduce_ the amount of whitespace, not fully remove it.
It does however make sure to not minify whitespace inside of GROQ strings.

## Disclaimer

Still early days - please report any bugs you find.

## Installation

```bash
$ npm install --save minify-groq
```

## Usage

You can either use this module as a tagged template literal, or as a function.
Placeholders used inside of a template will be JSON-encoded automatically.

```js
import groq from 'minify-groq'

const tag = 'fantasy'
const query = groq`
  *[_type == "book" && ${tag} in tags] {
    title,
    publishDate
  }
`

// Output (roughly speaking):
// *[_type == "book" && "fantasy" in tags] { title, publishDate }
```

... or, as a function:

```js
import minifyGroq from 'minify-groq'

const query = minifyGroq(`
  *[
    _type == "author" &&
    birthYear > 1950
  ] {
    name,
    birthYear,
    "books": books[]->{
      title
    }
  } | order (birthYear asc) | [ 0 ... 50 ]
`)

console.log(query)
// Output (roughly speaking):
// *[ _type == "author" && birthYear > 1950] { name, birthYear, "books": books[]->{ title } } | order(birthYear asc) | [0 ... 50]
```

## Browser support

Internet Explorer 9 and up!

## License

MIT licensed. See LICENSE.
