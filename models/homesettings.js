var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var homeSettingsSchema = new Schema({
  // id: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  content1: { type: String, required: true },
  content2: { type: String, required: true },
  content3: { type: String, required: true },
  app_store: { type: String, required: true },
  google_play: { type: String, required: true },
  bottomimage: { type: String, required: true }  
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('homesettings', homeSettingsSchema);
