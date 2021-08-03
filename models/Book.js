const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: { type: String, required: true, default: "", trim: true },
  author: { type: String, required: true, default: "", trim: true },
  description: { type: String, required: true, default: "", trim: true },
  coverImage: { type: Buffer, required: true },
  coverImageType: { type: String, required: true},
  booktype: { type: String },
  price: { type: Number, required: true },
  condition: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  seller: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
});

bookSchema.virtual('coverImagePath').get(function() {
  if( this.coverImage != null && this.coverImageType != null ){
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
  }
});

module.exports = mongoose.model("Book", bookSchema);