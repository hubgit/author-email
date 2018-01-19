const axios = require('axios')
const libxmljs = require('libxmljs')

// axios.interceptors.request.use(config => {
//   console.log(config)
//   return config
// }, error => {
//   console.log(error)
//   return Promise.reject(error)
// })
//
// axios.interceptors.response.use(config => {
//   console.log(config)
//   return config
// }, error => {
//   console.log(error)
//   return Promise.reject(error)
// })

const request = (util, params) => {
  return axios(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/${util}.fcgi`, { params })
    .then(response => response.data)
}

const esearch = db => options => request('esearch', {
  db,
  usehistory: 'y',
  retmax: 0,
  retmode: 'json',
  ...options,
})

const efetch = db => options => ({ esearchresult }) => request('efetch', {
  db,
  webenv: esearchresult.webenv,
  query_key: esearchresult.querykey,
  retmode: 'xml',
  ...options,
}).then(libxmljs.parseXml)

module.exports = { esearch, efetch }
