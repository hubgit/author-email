import { efetch, esearch } from './eutils'

module.exports = {
  search: esearch('pmc'),
  fetch: efetch('pmc'),
  parse: doc => {
    const parseAuthor = author => ({
      name: {
        first: author.get('string(name/given-names)'),
        last: author.get('string(name/surname)'),
      },
      email: author.find('string(address/email)'), // TODO: can this be multiple?
    })

    const parseArticle = article => ({
      title: article.get('string(front/article-meta/title-group/article-title[1])'),
      authors: article.find('front/article-meta/contrib-group/contrib').map(parseAuthor)
    })

    return doc
      .find('/pmc-articleset/article')
      .map(parseArticle)
  }
}
