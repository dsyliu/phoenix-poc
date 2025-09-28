const express = require('express');
const router = express.Router();
const { agentService } = require('../services');

// Get all agents
router.get('/', (req, res) => {
  const { role, isActive, department } = req.query;
  const filteredAgents = agentService.filterAgents({ role, isActive, department });
  res.json(filteredAgents);
});

// Get agent by ID
router.get('/:id', (req, res) => {
  const agent = agentService.getAgentById(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

module.exports = router;