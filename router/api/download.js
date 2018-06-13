module.exports = function(router) {

  router.get('/download/:file', function(req, res) {
    let file = `./public/uploads/${req.params.file}`;
    res.download(file)
  });

}