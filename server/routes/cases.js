const express = require('express');
const router = express.Router();
const { caseService, agentService, configService } = require('../services');

// Get case constants (categories, priorities, statuses)
router.get('/constants', async (req, res) => {
  try {
    const config = await configService.getAllConfigurations();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load case constants' });
  }
});

// Get all cases
router.get('/', (req, res) => {
  const { status, assignedTo, priority, category } = req.query;
  const filteredCases = caseService.filterCases({ status, assignedTo, priority, category });
  res.json(filteredCases);
});

// Get case by ID
router.get('/:id', (req, res) => {
  const caseItem = caseService.getCaseById(req.params.id);
  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json(caseItem);
});

// Create new case
router.post('/', async (req, res) => {
  try {
    const agent = agentService.getAgentById(req.body.createdBy);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    if (!agent.canCreateCases()) {
      return res.status(403).json({ error: 'Only frontline agents can create cases' });
    }
    if (!agent.canModifyCases()) {
      return res.status(403).json({ error: 'Admin users have read-only access to cases' });
    }

    // Validate category and priority
    if (req.body.category && !(await configService.isValidCategory(req.body.category))) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    if (req.body.priority && !(await configService.isValidPriority(req.body.priority))) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    const newCase = await caseService.createCase(req.body);
    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// Update case status
router.patch('/:id/status', async (req, res) => {
  try {
    const caseItem = caseService.getCaseById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const { status, agentId } = req.body;
    const agent = agentService.getAgentById(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!agent.canModifyCases()) {
      return res.status(403).json({ error: 'Admin users have read-only access to cases' });
    }

    // Validate status
    if (!(await configService.isValidStatus(status))) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Validate permissions
    if (status === 'closed' && !agent.canCloseCases()) {
      return res.status(403).json({ error: 'Only validator agents can close cases' });
    }

    // Auto-assign case to investigator when status changes to "investigating"
    if (status === 'investigating' && agent.canInvestigate()) {
      caseItem.assignTo(agentId);
    }

    caseItem.updateStatus(status, agentId);
    await caseService.saveCases();
    
    res.json(caseItem);
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ error: 'Failed to update case status' });
  }
});

// Assign case to agent
router.patch('/:id/assign', async (req, res) => {
  try {
    const caseItem = caseService.getCaseById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const { agentId, requestingAgentId } = req.body;
    const agent = agentService.getAgentById(agentId);
    const requestingAgent = agentService.getAgentById(requestingAgentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!requestingAgent) {
      return res.status(404).json({ error: 'Requesting agent not found' });
    }

    if (!requestingAgent.canModifyCases()) {
      return res.status(403).json({ error: 'Admin users have read-only access to cases' });
    }

    caseItem.assignTo(agentId);
    await caseService.saveCases();
    
    res.json(caseItem);
  } catch (error) {
    console.error('Error assigning case:', error);
    res.status(500).json({ error: 'Failed to assign case' });
  }
});

// Add note to case
router.post('/:id/notes', async (req, res) => {
  try {
    const caseItem = caseService.getCaseById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const { content, agentId } = req.body;
    const agent = agentService.getAgentById(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!agent.canModifyCases()) {
      return res.status(403).json({ error: 'Admin users have read-only access to cases' });
    }

    caseItem.addNote({
      content,
      agentId,
      agentName: agent.name
    });

    await caseService.saveCases();
    res.json(caseItem);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

module.exports = router;