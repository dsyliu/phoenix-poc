const express = require('express');
const router = express.Router();
const { agentService } = require('../services');

// Simple auth - login with agent email
router.post('/login', (req, res) => {
  const { email } = req.body;
  const agent = agentService.getAgentByEmail(email);
  
  if (!agent) {
    return res.status(401).json({ error: 'Agent not found' });
  }

  if (!agent.isActive) {
    return res.status(401).json({ error: 'Agent account is inactive' });
  }

  res.json({
    agent: {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
      department: agent.department
    }
  });
});

module.exports = router;