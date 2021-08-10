const mongoose = require("mongoose");

const OtherSchema = mongoose.Schema({
  productName: { type: String, required: true, default: "", trim: true },
  description: { type: String, required: true, default: "", trim: true },
  Image: { type: Buffer, required: true },
  ImageType: { type: String, required: true},
  price: { type: Number, required: true },
  condition: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  seller: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
});

OtherSchema.virtual('ImagePath').get(function() {
  if( this.Image != null && this.ImageType != null ){
    return `data:${this.ImageType};charset=utf-8;base64,${this.Image.toString('base64')}`;
  }
});

module.exports = mongoose.model("Other", OtherSchema);