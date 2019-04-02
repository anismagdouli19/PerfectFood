var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PagesSchema = new Schema({
  // id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  featured: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  lang:{type: String, required: true},
  parent_id:{type: String, required: true}
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('pages', PagesSchema);
