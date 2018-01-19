const express = require('express')
const cors = require('cors')

const pubmed = require('./pubmed')
const pmc = require('./pmc')

const app = express()
app.set('json spaces', 2)
app.use(cors())

app.use('/author', (req, res) => {
  const { term, position } = req.query

  if (position === undefined || term === undefined) {
    return res.json({
      error: 'term and position are required'
    })
  }

  const authorByPosition = results => {
    if (!results.length) return null

    const { source, id, title, authors } = results[0]

    if (!authors[position]) throw new Error('Position not found')

    const { name, email } = authors[position]

    return { source, id, title, author: { name, email } }
  }

  Promise.all([
    pubmed.search({ term })
      .then(pubmed.fetch({ retmax: 1 }))
      .then(pubmed.parse)
      .then(authorByPosition),

    pmc.search({ term })
      .then(pmc.fetch({ retmax: 1 }))
      .then(pmc.parse)
      .then(authorByPosition)
  ]).then(output => {
      res.json(output.filter(item => item))
    })
    .catch(e => {
      res.json({
        error: e.message
      })
    })
})

const server = app.listen(3000, () => {
  console.log('Listening on port ' + server.address().port)
})
