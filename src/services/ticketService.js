const ticketRepository = require('../repositories/ticketRepository');

class TicketService {
  async generateTicket(code, amount, purchaser) {
    return await ticketRepository.createTicket(code, amount, purchaser);
  }
}

module.exports = new TicketService();
