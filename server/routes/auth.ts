import { Router, Request, Response } from 'express';
import { agentService } from '../services';
import { LoginRequest, LoginResponse } from '../types';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request<{}, LoginResponse | { error: string }, LoginRequest>, res: Response<LoginResponse | { error: string }>): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const agent = agentService.getAgentByEmail(email);
    if (!agent) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!agent.isActive) {
      res.status(401).json({ error: 'Account is inactive' });
      return;
    }

    res.json({ agent });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;