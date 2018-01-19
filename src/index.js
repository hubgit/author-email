const express = require('express')
const cors = require('cors')
const eutils = require('./pmc')

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
    if (!results.length) throw new Error('No matches')

    const { title, authors } = results[0]

    if (!authors[position]) throw new Error('Position not found')

    const { name, email } = authors[position]

    return { title, name, email }
  }

  eutils.search({ term })
    .then(eutils.fetch({ retmax: 1 }))
    .then(eutils.parse)
    .then(authorByPosition)
    .then(output => {
      res.json(output)
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
