import { v4 as uuidv4 } from 'uuid';
import { Case as ICase, CaseNote } from '../types';

export class Case implements ICase {
  public id: string;
  public title: string;
  public description: string;
  public customerId: string;
  public customerName: string;
  public customerEmail: string;
  public priority: 'tier1' | 'tier2' | 'tier3';
  public status: 'open' | 'investigating' | 'blocked' | 'resolved' | 'closed';
  public category: string;
  public createdBy: string;
  public assignedTo?: string;
  public createdAt: string;
  public updatedAt: string;
  public closedAt?: string;
  public resolution?: string;
  public notes: CaseNote[];

  constructor(data: Partial<ICase> & { 
    title: string; 
    description: string; 
    customerName: string; 
    customerEmail: string; 
    category: string; 
    createdBy: string; 
  }) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.customerId = data.customerId || '';
    this.customerName = data.customerName;
    this.customerEmail = data.customerEmail;
    this.priority = data.priority || 'tier2';
    this.status = data.status || 'open';
    this.category = data.category;
    this.createdBy = data.createdBy;
    this.assignedTo = data.assignedTo;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.closedAt = data.closedAt || undefined;
    this.resolution = data.resolution || undefined;
    this.notes = data.notes || [];
  }

  public addNote(note: { content: string; agentId: string; agentName: string }): void {
    this.notes.push({
      id: uuidv4(),
      content: note.content,
      agentId: note.agentId,
      agentName: note.agentName,
      timestamp: new Date().toISOString()
    });
    this.updatedAt = new Date().toISOString();
  }

  public updateStatus(status: ICase['status'], agentId: string): void {
    this.status = status;
    this.updatedAt = new Date().toISOString();
    
    if (status === 'closed') {
      this.closedAt = new Date().toISOString();
    }
  }

  public assignTo(agentId: string): void {
    this.assignedTo = agentId;
    this.updatedAt = new Date().toISOString();
  }
}