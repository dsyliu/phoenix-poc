import { v4 as uuidv4 } from 'uuid';
import { Agent as IAgent } from '../types';

export class Agent implements IAgent {
  public id: string;
  public name: string;
  public email: string;
  public role: 'frontline' | 'investigator' | 'validator' | 'admin';
  public department: string;
  public isActive: boolean;
  public createdAt: string;

  constructor(data: Partial<IAgent> & { name: string; email: string; role: IAgent['role']; department: string }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.department = data.department;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  public canCreateCases(): boolean {
    return this.role === 'frontline';
  }

  public canInvestigate(): boolean {
    return this.role === 'investigator' || this.role === 'validator';
  }

  public canCloseCases(): boolean {
    return this.role === 'validator';
  }

  public canResolveCases(): boolean {
    return this.role === 'investigator' || this.role === 'validator';
  }

  // Admin permissions
  public canViewAllData(): boolean {
    return this.role === 'admin';
  }

  public canManageConfigurations(): boolean {
    return this.role === 'admin';
  }

  // Read-only access for admin
  public hasReadOnlyAccess(): boolean {
    return this.role === 'admin';
  }

  // Check if agent can modify cases (admin cannot)
  public canModifyCases(): boolean {
    return this.role !== 'admin';
  }

  // Check if agent can modify agents (admin cannot)
  public canModifyAgents(): boolean {
    return this.role !== 'admin';
  }
}