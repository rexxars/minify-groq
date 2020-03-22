const minify = require('../src/minify-groq')

test('handles empty strings', () => {
  const input = ``
  const expected = ``
  expect(minify(input)).toEqual(expected)
})

test('does not strip whitespace from double string', () => {
  const input = `"foo bar\tbaz\nzing  multi space"`
  const expected = input
  expect(minify(input)).toEqual(expected)
})

test('does not strip whitespace from single string', () => {
  const input = `'foo bar\tbaz\nzing  multi space'`
  const expected = input
  expect(minify(input)).toEqual(expected)
})

test('handles escaped double strings', () => {
  const input = `"it's \\"escaped\\", ok?"`
  const expected = input
  expect(minify(input)).toEqual(expected)
})

test('handles escaped single strings', () => {
  const input = `'it\\'s "escaped", ok?'`
  const expected = input
  expect(minify(input)).toEqual(expected)
})

test('handles full query', () => {
  const input = `
    {
      "basic test": 'works',
      "test \\"escaped\\"": '\\'works\\'',
      "draft": *[_id in path("drafts.**")] [ 0 ],

      'it\\'s\n\t"aliased"': * [ _type ==  "author"   ] {
        ... ,
        name,
        "cat \\"C:\\test\\\\\\"spaced file.txt\\\\\\"": awards[ @ == "Noe  \\"optimistisk\\"" ]
      }  |  order( _createdAt desc ) [ 0 ]  [ 0  ...  2 ]  ,

      "static": 'value   \n   with spacing'
    }
  `

  expect(minify(input)).toMatchSnapshot()
})

test('handles multiple pipes', () => {
  const input = `
    * [ _type == "author" && birthYear > 1950] {
      name,
      birthYear,
      "books": books[]->{
        title
      }
    } | order(birthYear asc) | [ 0 ... 50 ]
  `

  expect(minify(input)).toMatchSnapshot()
})

test('handles selects, newlined pipes', () => {
  const input = `
  * [ _type == "author" && birthYear > 1950]
    | order(
      birthYear
      asc
    )
    | [ 0 ... 50 ]
    | {
      name,
      birthYear,

      "popularity": select(
        popularity > 20 => "high",
        popularity > 10 => "medium",
        popularity <= 10 => "low"
      ),

      "works": works[]->{
        _type == "book" => {
          title
        },
        _type == "manuscript" => {
          title,
          kind
        }
      }
    }
  `

  expect(minify(input)).toMatchSnapshot()
})

test('can be used as template literal', () => {
  expect(minify`{  "foo": "\tbar" } `).toEqual(`{ "foo": "\tbar" }`)

  const type = 'book'
  const year = 1950
  const categoryIds = [13, 15]
  expect(
    minify`*[
      _type == ${type} &&
      releaseYear == ${year} &&
      categoryId in ${categoryIds}
    ] {
      title,
      releaseYear,
    }`
  ).toMatchSnapshot()
})
