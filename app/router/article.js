module.exports = app => {
  const article = app.controller.v1.article
  const articleCategory = app.controller.v1.articleCategory
  const articleComment = app.controller.v1.articleComment
  const tag = app.controller.v1.tag

  app.router.resources('/api/v1/article', article)
  app.router.resources('/api/v1/articleCategory', articleCategory)
  app.router.resources('/api/v1/articleComment', articleComment)
  app.router.resources('/api/v1/tag', tag)
}
