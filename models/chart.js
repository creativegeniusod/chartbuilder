var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var chartSchema = new Schema({
  id: ObjectId,
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date},
  title: String,
  description: String,
  source: String,
  model: {},
  images:{},
  tags: { type: [String]},
  aspectRatio:String,
  isDraft: { type: Boolean, default: false },
  inFeeds: { type: Boolean, default: true },
  embeddable: { type: Boolean, default: true },
  imageDownloadable: { type: Boolean, default: true },
  dataDownloadable: { type: Boolean, default: true }
});

chartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chart', chartSchema);
