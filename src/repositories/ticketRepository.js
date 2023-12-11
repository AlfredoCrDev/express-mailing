const Ticket = require('../models/ticket.model');

class TicketRepository {
  async createTicket(code, amount, purchaser) {
    const ticket = new Ticket({ code, amount, purchaser });
    return await ticket.save();
  }
}

module.exports = new TicketRepository();