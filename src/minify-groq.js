function buildQuery(parts, args) {
  const len = parts.length
  let query = ''
  for (let i = 0; i < len; i++) {
    query += parts[i]
    if (i < len - 1) {
      query += JSON.stringify(args[i])
    }
  }

  return query
}

function charIsWhiteSpace(char) {
  return char === ' ' || char === '\n' || char === '\t'
}

function minify(groqQuery, ...args) {
  const query = Array.isArray(groqQuery) ? buildQuery(groqQuery, args) : groqQuery
  const len = query.length
  if (len === 0) {
    return ''
  }

  let out = ''
  let pos = 0
  let inSingle = false
  let inDouble = false

  do {
    const prev = query[pos - 1]
    const char = query[pos]
    const isWhiteSpace = charIsWhiteSpace(char)
    const prevWasWhiteSpace = charIsWhiteSpace(prev)
    pos++

    if (char === '"' && prev !== '\\') {
      inDouble = !inDouble
      out += char
      continue
    }

    if (char === "'" && prev !== '\\') {
      inSingle = !inSingle
      out += char
      continue
    }

    if (inSingle || inDouble) {
      out += char
      continue
    }

    if (isWhiteSpace && prevWasWhiteSpace) {
      continue
    }

    out += char
  } while (pos < len)

  return out.trim()
}

module.exports = minify
