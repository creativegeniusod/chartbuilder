var mongoose = require('mongoose');

var chartSchema = new mongoose.Schema({
  chartId: { type: String, unique: true, index: true },
  title: String,
  source: String,
  tags: String
});

module.exports = mongoose.model('Chart', chartSchema);
