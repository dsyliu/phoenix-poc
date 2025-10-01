import { Router, Request, Response } from 'express';
import { configService, caseService, agentService } from '../services';
import { ConfigOption, DatabaseStats } from '../types';

const router = Router();

// Get all configurations
router.get('/', async (req: Request, res: Response<{ categories: ConfigOption[]; priorities: ConfigOption[]; statuses: ConfigOption[] }>) => {
  try {
    const configurations = configService.getAllConfigurations();
    res.json(configurations);
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ error: 'Failed to fetch configurations' } as any);
  }
});

// Get database statistics
router.get('/stats', async (req: Request, res: Response<DatabaseStats>) => {
  try {
    const cases = caseService.getAllCases();
    const agents = agentService.getAllAgents();
    
    const stats: DatabaseStats = {
      totalCases: cases.length,
      totalAgents: agents.length,
      casesByStatus: {},
      casesByPriority: {},
      agentsByRole: {}
    };
    
    // Count cases by status
    cases.forEach(case_ => {
      stats.casesByStatus[case_.status] = (stats.casesByStatus[case_.status] || 0) + 1;
    });
    
    // Count cases by priority
    cases.forEach(case_ => {
      stats.casesByPriority[case_.priority] = (stats.casesByPriority[case_.priority] || 0) + 1;
    });
    
    // Count agents by role
    agents.forEach(agent => {
      stats.agentsByRole[agent.role] = (stats.agentsByRole[agent.role] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' } as any);
  }
});

// Categories endpoints
router.get('/categories', async (req: Request, res: Response<ConfigOption[]>) => {
  try {
    const categories = configService.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' } as any);
  }
});

router.post('/categories', async (req: Request<{}, { success: boolean } | { error: string }, ConfigOption>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const category = req.body;
    await configService.addCategory(category);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

router.put('/categories/:value', async (req: Request<{ value: string }, { success: boolean } | { error: string }, ConfigOption>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const { value } = req.params;
    const newCategory = req.body;
    await configService.updateCategory(value, newCategory);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:value', async (req: Request<{ value: string }>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const { value } = req.params;
    await configService.removeCategory(value);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing category:', error);
    res.status(500).json({ error: 'Failed to remove category' });
  }
});

// Priorities endpoints
router.get('/priorities', async (req: Request, res: Response<ConfigOption[]>) => {
  try {
    const priorities = configService.getPriorities();
    res.json(priorities);
  } catch (error) {
    console.error('Error fetching priorities:', error);
    res.status(500).json({ error: 'Failed to fetch priorities' } as any);
  }
});

router.post('/priorities', async (req: Request<{}, { success: boolean } | { error: string }, ConfigOption>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const priority = req.body;
    await configService.addPriority(priority);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding priority:', error);
    res.status(500).json({ error: 'Failed to add priority' });
  }
});

router.delete('/priorities/:value', async (req: Request<{ value: string }>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const { value } = req.params;
    await configService.removePriority(value);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing priority:', error);
    res.status(500).json({ error: 'Failed to remove priority' });
  }
});

// Statuses endpoints
router.get('/statuses', async (req: Request, res: Response<ConfigOption[]>) => {
  try {
    const statuses = configService.getStatuses();
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ error: 'Failed to fetch statuses' } as any);
  }
});

router.post('/statuses', async (req: Request<{}, { success: boolean } | { error: string }, ConfigOption>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const status = req.body;
    await configService.addStatus(status);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding status:', error);
    res.status(500).json({ error: 'Failed to add status' });
  }
});

router.delete('/statuses/:value', async (req: Request<{ value: string }>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const { value } = req.params;
    await configService.removeStatus(value);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing status:', error);
    res.status(500).json({ error: 'Failed to remove status' });
  }
});

// Reset configurations to defaults
router.post('/reset', async (req: Request, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    await configService.resetToDefaults();
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting configurations:', error);
    res.status(500).json({ error: 'Failed to reset configurations' });
  }
});

export default router;