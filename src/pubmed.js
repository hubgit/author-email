import { esearch, efetch } from './eutils'

module.exports = {
  search: esearch('pubmed'),
  fetch: efetch('pubmed'),
  parse: doc => {
    const parseAffiliation = affiliation => affiliation.text()

    const parseAuthor = author => ({
      name: {
        first: author.get('string(FirstName)'),
        initials: author.get('string(Initials)'),
        last: author.get('string(LastName)'),
      },
      affiliations: author.find('AffiliationInfo/Affiliation').map(parseAffiliation)
    })

    const parseArticle = article => ({
      title: article.get('string(ArticleTitle)'),
      authors: article.find('AuthorList/Author').map(parseAuthor)
    })

    return doc
      .find('/PubmedArticleSet/PubmedArticle/MedlineCitation/Article')
      .map(parseArticle)
  }
}
