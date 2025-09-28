const { v4: uuidv4 } = require('uuid');

class Case {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.customerId = data.customerId;
    this.customerName = data.customerName;
    this.customerEmail = data.customerEmail;
    this.priority = data.priority || 'medium'; // low, medium, high, critical
    this.status = data.status || 'open'; // open, investigating, resolved, closed
    this.category = data.category;
    this.createdBy = data.createdBy; // agent ID
    this.assignedTo = data.assignedTo; // current agent handling the case
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.closedAt = data.closedAt || null;
    this.resolution = data.resolution || null;
    this.notes = data.notes || [];
  }

  addNote(note) {
    this.notes.push({
      id: uuidv4(),
      content: note.content,
      agentId: note.agentId,
      agentName: note.agentName,
      timestamp: new Date().toISOString()
    });
    this.updatedAt = new Date().toISOString();
  }

  updateStatus(status, agentId) {
    this.status = status;
    this.updatedAt = new Date().toISOString();
    
    if (status === 'closed') {
      this.closedAt = new Date().toISOString();
    }
  }

  assignTo(agentId) {
    this.assignedTo = agentId;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Case;