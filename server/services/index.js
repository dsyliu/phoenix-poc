// Service instances - singleton pattern
const CaseService = require('./CaseService');
const AgentService = require('./AgentService');
const ConfigService = require('./ConfigService');

// Create service instances
const caseService = new CaseService();
const agentService = new AgentService();
const configService = new ConfigService();

// Initialize all services
const initializeServices = async () => {
  try {
    console.log('Initializing services...');
    await configService.loadConfigurations();
    await agentService.loadAgents();
    await caseService.loadCases();
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    throw error;
  }
};

// Export service instances and initialization function
module.exports = {
  caseService,
  agentService,
  configService,
  initializeServices
};