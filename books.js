const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {type: String, required: true, unique: true},
  comments: {type: [String], default: []}
},{
  timestamps: true
})

const Books = mongoose.model('Book', bookSchema);
module.exports = Books;