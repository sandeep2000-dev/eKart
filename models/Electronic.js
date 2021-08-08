const mongoose = require("mongoose");

const ElectronicSchema = mongoose.Schema({
  productName: { type: String, required: true, default: "", trim: true },
  description: { type: String, required: true, default: "", trim: true },
  Image: { type: Buffer, required: true },
  ImageType: { type: String, required: true},
  type: { type: String },
  price: { type: Number, required: true },
  condition: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  seller: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
});

ElectronicSchema.virtual('ImagePath').get(function() {
  if( this.Image != null && this.ImageType != null ){
    return `data:${this.ImageType};charset=utf-8;base64,${this.Image.toString('base64')}`;
  }
});

module.exports = mongoose.model("Electronic", ElectronicSchema);