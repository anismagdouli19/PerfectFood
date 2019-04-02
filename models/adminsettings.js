var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SettingsSchema = new Schema({
  // id: { type: Schema.Types.ObjectId, required: true },
  header: { type: String, required: true },
  sub_header: { type: String, required: true },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  twitter: { type: String, required: true },
  youtube: { type: String, required: true },
  linkedin: { type: String, required: true },
  copyright: { type: String, required: true },
  logo:{type:String},
  header_banner:{type:String}
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('settings', SettingsSchema);
