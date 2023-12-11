const mongoose = require("mongoose");

const ticketCollecion = "products"

const ticketSchema = new mongoose.Schema({
  code: {type: String, max: 30, unique: true, required: true},
  purchase_datatime: {type: Date, defauklt: Date.now},
  amount: {type: Number},
  purcharser: {type: String, max: 15, required: true},
})

const ticketModel = mongoose.model(ticketCollecion, ticketSchema)

module.exports = ticketModel