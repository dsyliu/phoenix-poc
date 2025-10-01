// Service instances - singleton pattern
import { CaseService } from './CaseService';
import { AgentService } from './AgentService';
import { ConfigService } from './ConfigService';

// Create service instances
export const caseService = new CaseService();
export const agentService = new AgentService();
export const configService = new ConfigService();

// Initialize all services
export const initializeServices = async (): Promise<void> => {
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