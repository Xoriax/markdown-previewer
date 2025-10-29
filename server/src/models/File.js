const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('File', FileSchema);