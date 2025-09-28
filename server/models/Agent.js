const { v4: uuidv4 } = require('uuid');

class Agent {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.email = data.email;
    this.role = data.role; // frontline, investigator, validator, admin
    this.department = data.department;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  canCreateCases() {
    return this.role === 'frontline';
  }

  canInvestigate() {
    return this.role === 'investigator' || this.role === 'validator';
  }

  canCloseCases() {
    return this.role === 'validator';
  }

  // Admin permissions
  canViewAllData() {
    return this.role === 'admin';
  }

  canManageConfigurations() {
    return this.role === 'admin';
  }

  // Read-only access for admin
  hasReadOnlyAccess() {
    return this.role === 'admin';
  }

  // Check if agent can modify cases (admin cannot)
  canModifyCases() {
    return this.role !== 'admin';
  }

  // Check if agent can modify agents (admin cannot)
  canModifyAgents() {
    return this.role !== 'admin';
  }
}

module.exports = Agent;