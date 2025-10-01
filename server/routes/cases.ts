import { Router, Request, Response } from 'express';
import { caseService, agentService, configService } from '../services';
import { Case, CaseFilters, CreateCaseRequest, UpdateCaseStatusRequest, AssignCaseRequest, AddNoteRequest, ConfigOption } from '../types';

const router = Router();

// Get case constants (categories, priorities, statuses)
router.get('/constants', async (req: Request, res: Response<{ categories: ConfigOption[]; priorities: ConfigOption[]; statuses: ConfigOption[] }>) => {
  try {
    const configurations = configService.getAllConfigurations();
    res.json(configurations);
  } catch (error) {
    console.error('Error fetching constants:', error);
    res.status(500).json({ error: 'Failed to fetch constants' } as any);
  }
});

// Get all cases
router.get('/', async (req: Request<{}, Case[], {}, CaseFilters>, res: Response<Case[]>) => {
  try {
    const filters = req.query;
    const cases = caseService.filterCases(filters);
    res.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' } as any);
  }
});

// Get case by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response<Case | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const case_ = caseService.getCaseById(id);
    
    if (!case_) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    
    res.json(case_);
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Create new case
router.post('/', async (req: Request<{}, Case | { error: string }, CreateCaseRequest>, res: Response<Case | { error: string }>): Promise<void> => {
  try {
    const caseData = req.body;
    
    // Validate required fields
    if (!caseData.title || !caseData.description || !caseData.customerName || !caseData.customerEmail || !caseData.category || !caseData.createdBy) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    // Validate agent exists
    const agent = agentService.getAgentById(caseData.createdBy);
    if (!agent) {
      res.status(400).json({ error: 'Invalid agent ID' });
      return;
    }
    
    const newCase = await caseService.createCase(caseData);
    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Update case status
router.patch('/:id/status', async (req: Request<{ id: string }, Case | { error: string }, UpdateCaseStatusRequest>, res: Response<Case | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, agentId } = req.body;
    
    const case_ = caseService.getCaseById(id);
    if (!case_) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    
    // Validate agent exists
    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      res.status(400).json({ error: 'Invalid agent ID' });
      return;
    }
    
    // Check permissions for resolving cases
    if (status === 'resolved' && !agent.canResolveCases()) {
      res.status(403).json({ error: 'Only investigator and validator agents can mark cases as resolved' });
      return;
    }
    
    // Check permissions for closing cases
    if (status === 'closed' && !agent.canCloseCases()) {
      res.status(403).json({ error: 'Only validator agents can close cases' });
      return;
    }
    
    case_.updateStatus(status, agentId);
    await caseService.saveCases();
    
    res.json(case_);
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ error: 'Failed to update case status' });
  }
});

// Assign case to agent
router.patch('/:id/assign', async (req: Request<{ id: string }, Case | { error: string }, AssignCaseRequest>, res: Response<Case | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    
    const case_ = caseService.getCaseById(id);
    if (!case_) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    
    // Validate agent exists
    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      res.status(400).json({ error: 'Invalid agent ID' });
      return;
    }
    
    case_.assignTo(agentId);
    await caseService.saveCases();
    
    res.json(case_);
  } catch (error) {
    console.error('Error assigning case:', error);
    res.status(500).json({ error: 'Failed to assign case' });
  }
});

// Add note to case
router.post('/:id/notes', async (req: Request<{ id: string }, Case | { error: string }, AddNoteRequest>, res: Response<Case | { error: string }>): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, agentId } = req.body;
    
    const case_ = caseService.getCaseById(id);
    if (!case_) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    
    // Validate agent exists
    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      res.status(400).json({ error: 'Invalid agent ID' });
      return;
    }
    
    case_.addNote({
      content,
      agentId,
      agentName: agent.name
    });
    await caseService.saveCases();
    
    res.json(case_);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

export default router;