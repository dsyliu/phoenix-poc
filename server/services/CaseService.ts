import { PersistenceService } from './PersistenceService';
import { Case } from '../models/Case';
import { Case as ICase, CaseFilters, CreateCaseRequest } from '../types';

export class CaseService extends PersistenceService {
  private cases: Map<string, Case>;
  private readonly filename: string;

  constructor() {
    super();
    this.cases = new Map();
    this.filename = 'cases.json';
  }

  // Load cases from file into memory
  public async loadCases(): Promise<void> {
    try {
      await this.ensureFileExists(this.filename, []);
      const casesData = await this.readJsonFile<ICase[]>(this.filename);
      
      if (casesData) {
        this.cases.clear();
        casesData.forEach((caseData) => {
          const caseInstance = new Case(caseData);
          this.cases.set(caseInstance.id, caseInstance);
        });
        console.log(`Loaded ${this.cases.size} cases from database`);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
      throw error;
    }
  }

  // Save cases from memory to file
  public async saveCases(): Promise<void> {
    try {
      const casesArray = Array.from(this.cases.values());
      await this.writeJsonFile(this.filename, casesArray);
      console.log(`Saved ${casesArray.length} cases to database`);
    } catch (error) {
      console.error('Error saving cases:', error);
      throw error;
    }
  }

  // Get all cases
  public getAllCases(): Case[] {
    return Array.from(this.cases.values());
  }

  // Get case by ID
  public getCaseById(id: string): Case | undefined {
    return this.cases.get(id);
  }

  // Create new case
  public async createCase(caseData: CreateCaseRequest): Promise<Case> {
    const newCase = new Case(caseData);
    this.cases.set(newCase.id, newCase);
    await this.saveCases();
    return newCase;
  }

  // Update case
  public async updateCase(id: string, updateData: Partial<ICase>): Promise<Case> {
    const caseItem = this.cases.get(id);
    if (!caseItem) {
      throw new Error('Case not found');
    }

    Object.assign(caseItem, updateData);
    caseItem.updatedAt = new Date().toISOString();
    await this.saveCases();
    return caseItem;
  }

  // Delete case
  public async deleteCase(id: string): Promise<boolean> {
    const deleted = this.cases.delete(id);
    if (deleted) {
      await this.saveCases();
    }
    return deleted;
  }

  // Filter cases
  public filterCases(filters: CaseFilters = {}): Case[] {
    let filteredCases = this.getAllCases();

    if (filters.status) {
      filteredCases = filteredCases.filter(c => c.status === filters.status);
    }
    if (filters.assignedTo) {
      filteredCases = filteredCases.filter(c => c.assignedTo === filters.assignedTo);
    }
    if (filters.priority) {
      filteredCases = filteredCases.filter(c => c.priority === filters.priority);
    }
    if (filters.category) {
      filteredCases = filteredCases.filter(c => c.category === filters.category);
    }

    return filteredCases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}