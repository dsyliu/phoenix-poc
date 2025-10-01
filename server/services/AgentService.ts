import { PersistenceService } from './PersistenceService';
import { Agent } from '../models/Agent';
import { Agent as IAgent, AgentFilters } from '../types';

export class AgentService extends PersistenceService {
  private agents: Map<string, Agent>;
  private readonly filename: string;

  constructor() {
    super();
    this.agents = new Map();
    this.filename = 'agents.json';
  }

  // Create default agents
  private createDefaultAgents(): Agent[] {
    return [
      new Agent({
        name: 'John Doe',
        email: 'john@company.com',
        role: 'frontline',
        department: 'Customer Service',
      }),
      new Agent({
        name: 'Jane Smith',
        email: 'jane@company.com',
        role: 'investigator',
        department: 'Technical Support',
      }),
      new Agent({
        name: 'Mike Johnson',
        email: 'mike@company.com',
        role: 'validator',
        department: 'Quality Assurance',
      }),
      new Agent({
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'admin',
        department: 'Administration',
      }),
    ];
  }

  // Load agents from file into memory
  public async loadAgents(): Promise<void> {
    try {
      const agentsData = await this.readJsonFile<IAgent[]>(this.filename);
      this.agents.clear();

      if (!agentsData) {
        // File doesn't exist, create with default agents
        console.log('Agents file not found, creating with default agents');
        const defaultAgents = this.createDefaultAgents();
        defaultAgents.forEach((agent) => this.agents.set(agent.id, agent));
        await this.saveAgents();
      } else if (agentsData.length === 0) {
        // File exists but is empty, populate with default agents
        console.log('Agents file is empty, populating with default agents');
        const defaultAgents = this.createDefaultAgents();
        defaultAgents.forEach((agent) => this.agents.set(agent.id, agent));
        await this.saveAgents();
      } else {
        // Load existing agents from file
        agentsData.forEach((agentData) => {
          const agentInstance = new Agent(agentData);
          this.agents.set(agentInstance.id, agentInstance);
        });
        console.log(`Loaded ${this.agents.size} agents from database`);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
      throw error;
    }
  }

  // Save agents from memory to file
  public async saveAgents(): Promise<void> {
    try {
      const agentsArray = Array.from(this.agents.values());
      await this.writeJsonFile(this.filename, agentsArray);
      console.log(`Saved ${agentsArray.length} agents to database`);
    } catch (error) {
      console.error('Error saving agents:', error);
      throw error;
    }
  }

  // Get all agents
  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  // Get agent by ID
  public getAgentById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  // Get agent by email
  public getAgentByEmail(email: string): Agent | undefined {
    return Array.from(this.agents.values()).find(agent => agent.email === email);
  }

  // Create new agent
  public async createAgent(agentData: Partial<IAgent> & { 
    name: string; 
    email: string; 
    role: IAgent['role']; 
    department: string; 
  }): Promise<Agent> {
    const newAgent = new Agent(agentData);
    this.agents.set(newAgent.id, newAgent);
    await this.saveAgents();
    return newAgent;
  }

  // Update agent
  public async updateAgent(id: string, updateData: Partial<IAgent>): Promise<Agent> {
    const agent = this.agents.get(id);
    if (!agent) {
      throw new Error('Agent not found');
    }

    Object.assign(agent, updateData);
    await this.saveAgents();
    return agent;
  }

  // Delete agent
  public async deleteAgent(id: string): Promise<boolean> {
    const deleted = this.agents.delete(id);
    if (deleted) {
      await this.saveAgents();
    }
    return deleted;
  }

  // Filter agents
  public filterAgents(filters: AgentFilters = {}): Agent[] {
    let filteredAgents = this.getAllAgents();

    if (filters.role) {
      filteredAgents = filteredAgents.filter(a => a.role === filters.role);
    }
    if (filters.isActive !== undefined) {
      filteredAgents = filteredAgents.filter(a => a.isActive === (filters.isActive === 'true'));
    }
    if (filters.department) {
      filteredAgents = filteredAgents.filter(a => a.department === filters.department);
    }

    return filteredAgents;
  }
}