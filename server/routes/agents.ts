import { Router, Request, Response } from 'express';
import { agentService } from '../services';
import { Agent, AgentFilters } from '../types';

const router = Router();

// Get all agents
router.get('/', async (req: Request<{}, Agent[], {}, AgentFilters>, res: Response<Agent[]>) => {
  try {
    const filters = req.query;
    const agents = agentService.filterAgents(filters);
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' } as any);
  }
});

// Get agent by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response<Agent | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const agent = agentService.getAgentById(id);
    
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Create new agent
router.post('/', async (req: Request<{}, Agent | { error: string }, Partial<Agent> & { name: string; email: string; role: Agent['role']; department: string }>, res: Response<Agent | { error: string }>): Promise<void> => {
  try {
    const agentData = req.body;
    
    // Check if email already exists
    const existingAgent = agentService.getAgentByEmail(agentData.email);
    if (existingAgent) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    
    const newAgent = await agentService.createAgent(agentData);
    res.status(201).json(newAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update agent
router.put('/:id', async (req: Request<{ id: string }, Agent | { error: string }, Partial<Agent>>, res: Response<Agent | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedAgent = await agentService.updateAgent(id, updateData);
    res.json(updatedAgent);
  } catch (error: any) {
    console.error('Error updating agent:', error);
    if (error.message === 'Agent not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete agent
router.delete('/:id', async (req: Request<{ id: string }>, res: Response<{ success: boolean } | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await agentService.deleteAgent(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

export default router;