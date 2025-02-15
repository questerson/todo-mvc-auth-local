const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    require:false
  },
  image: {
    type: String, 
    required:false
  },
  searchFail: {
    type: String, 
    required:false
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
