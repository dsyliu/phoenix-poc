const express = require('express');
const router = express.Router();
const { configService, agentService } = require('../services');

// Helper function to check admin permissions
const checkAdminPermissions = (req, res) => {
  const { agentId } = req.body;
  if (!agentId) {
    res.status(400).json({ error: 'Agent ID is required' });
    return null;
  }

  const agent = agentService.getAgentById(agentId);
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return null;
  }

  if (!agent.canManageConfigurations()) {
    res.status(403).json({ error: 'Only admin users can manage configurations' });
    return null;
  }

  return agent;
};

// Get current configuration
router.get('/', async (req, res) => {
  try {
    const config = await configService.getAllConfigurations();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Get specific configuration type
router.get('/categories', async (req, res) => {
  try {
    const categories = await configService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

router.get('/priorities', async (req, res) => {
  try {
    const priorities = await configService.getPriorities();
    res.json(priorities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load priorities' });
  }
});

router.get('/statuses', async (req, res) => {
  try {
    const statuses = await configService.getStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load statuses' });
  }
});

// Add new category
router.post('/categories', async (req, res) => {
  try {
    const { value, label, agentId } = req.body;
    if (!value || !label) {
      return res.status(400).json({ error: 'Value and label are required' });
    }

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!agent.canManageConfigurations()) {
      return res.status(403).json({ error: 'Only admin users can manage configurations' });
    }

    const categories = await configService.addCategory(value, label);
    res.json({ message: 'Category added successfully', categories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove category
router.delete('/categories/:value', async (req, res) => {
  try {
    const { agentId } = req.body;
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!agent.canManageConfigurations()) {
      return res.status(403).json({ error: 'Only admin users can manage configurations' });
    }

    const categories = await configService.removeCategory(req.params.value);
    res.json({ message: 'Category removed successfully', categories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update category
router.put('/categories/:value', async (req, res) => {
  try {
    const { label, agentId } = req.body;
    if (!label) {
      return res.status(400).json({ error: 'Label is required' });
    }

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    const agent = agentService.getAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!agent.canManageConfigurations()) {
      return res.status(403).json({ error: 'Only admin users can manage configurations' });
    }

    const categories = await configService.updateCategory(req.params.value, label);
    res.json({ message: 'Category updated successfully', categories });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add new priority
router.post('/priorities', async (req, res) => {
  try {
    const agent = checkAdminPermissions(req, res);
    if (!agent) return;

    const { value, label } = req.body;
    if (!value || !label) {
      return res.status(400).json({ error: 'Value and label are required' });
    }

    const priorities = await configService.addPriority(value, label);
    res.json({ message: 'Priority added successfully', priorities });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove priority
router.delete('/priorities/:value', async (req, res) => {
  try {
    const agent = checkAdminPermissions(req, res);
    if (!agent) return;

    const priorities = await configService.removePriority(req.params.value);
    res.json({ message: 'Priority removed successfully', priorities });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add new status
router.post('/statuses', async (req, res) => {
  try {
    const agent = checkAdminPermissions(req, res);
    if (!agent) return;

    const { value, label } = req.body;
    if (!value || !label) {
      return res.status(400).json({ error: 'Value and label are required' });
    }

    const statuses = await configService.addStatus(value, label);
    res.json({ message: 'Status added successfully', statuses });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove status
router.delete('/statuses/:value', async (req, res) => {
  try {
    const agent = checkAdminPermissions(req, res);
    if (!agent) return;

    const statuses = await configService.removeStatus(req.params.value);
    res.json({ message: 'Status removed successfully', statuses });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset to default configuration
router.post('/reset', async (req, res) => {
  try {
    const agent = checkAdminPermissions(req, res);
    if (!agent) return;

    const config = await configService.resetToDefaults();
    res.json({ message: 'Configuration reset to defaults', config });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset configuration' });
  }
});

module.exports = router;