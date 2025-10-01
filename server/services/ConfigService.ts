import { PersistenceService } from './PersistenceService';
import { ConfigOption } from '../types';

export class ConfigService extends PersistenceService {
  private categories: ConfigOption[];
  private priorities: ConfigOption[];
  private statuses: ConfigOption[];

  constructor() {
    super();
    this.categories = [];
    this.priorities = [];
    this.statuses = [];
  }

  // Default configurations
  private getDefaultCategories(): ConfigOption[] {
    return [
      { value: 'fraud', label: 'Fraud' },
      { value: 'billing', label: 'Billing' },
      { value: 'technical', label: 'Site Issue' },
      { value: 'service', label: 'Service Quality' },
      { value: 'other', label: 'Other' }
    ];
  }

  private getDefaultPriorities(): ConfigOption[] {
    return [
      { value: 'tier1', label: 'Tier 1' },
      { value: 'tier2', label: 'Tier 2' },
      { value: 'tier3', label: 'Tier 3' }
    ];
  }

  private getDefaultStatuses(): ConfigOption[] {
    return [
      { value: 'open', label: 'Open' },
      { value: 'investigating', label: 'Investigating' },
      { value: 'blocked', label: 'Blocked' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'closed', label: 'Closed' }
    ];
  }

  // Load configurations from files
  public async loadConfigurations(): Promise<void> {
    try {
      // Load categories
      await this.ensureFileExists('categories.json', this.getDefaultCategories());
      const categoriesData = await this.readJsonFile<ConfigOption[]>('categories.json');
      this.categories = categoriesData || this.getDefaultCategories();

      // Load priorities
      await this.ensureFileExists('priorities.json', this.getDefaultPriorities());
      const prioritiesData = await this.readJsonFile<ConfigOption[]>('priorities.json');
      this.priorities = prioritiesData || this.getDefaultPriorities();

      // Load statuses
      await this.ensureFileExists('statuses.json', this.getDefaultStatuses());
      const statusesData = await this.readJsonFile<ConfigOption[]>('statuses.json');
      this.statuses = statusesData || this.getDefaultStatuses();

      console.log('Configurations loaded successfully');
    } catch (error) {
      console.error('Error loading configurations:', error);
      throw error;
    }
  }

  // Get all configurations
  public getAllConfigurations(): { categories: ConfigOption[]; priorities: ConfigOption[]; statuses: ConfigOption[] } {
    return {
      categories: this.categories,
      priorities: this.priorities,
      statuses: this.statuses
    };
  }

  // Categories
  public getCategories(): ConfigOption[] {
    return this.categories;
  }

  public async addCategory(category: ConfigOption): Promise<void> {
    if (!this.categories.find(c => c.value === category.value)) {
      this.categories.push(category);
      await this.writeJsonFile('categories.json', this.categories);
    }
  }

  public async updateCategory(oldValue: string, newCategory: ConfigOption): Promise<void> {
    const index = this.categories.findIndex(c => c.value === oldValue);
    if (index !== -1) {
      this.categories[index] = newCategory;
      await this.writeJsonFile('categories.json', this.categories);
    }
  }

  public async removeCategory(value: string): Promise<void> {
    this.categories = this.categories.filter(c => c.value !== value);
    await this.writeJsonFile('categories.json', this.categories);
  }

  // Priorities
  public getPriorities(): ConfigOption[] {
    return this.priorities;
  }

  public async addPriority(priority: ConfigOption): Promise<void> {
    if (!this.priorities.find(p => p.value === priority.value)) {
      this.priorities.push(priority);
      await this.writeJsonFile('priorities.json', this.priorities);
    }
  }

  public async removePriority(value: string): Promise<void> {
    this.priorities = this.priorities.filter(p => p.value !== value);
    await this.writeJsonFile('priorities.json', this.priorities);
  }

  // Statuses
  public getStatuses(): ConfigOption[] {
    return this.statuses;
  }

  public async addStatus(status: ConfigOption): Promise<void> {
    if (!this.statuses.find(s => s.value === status.value)) {
      this.statuses.push(status);
      await this.writeJsonFile('statuses.json', this.statuses);
    }
  }

  public async removeStatus(value: string): Promise<void> {
    this.statuses = this.statuses.filter(s => s.value !== value);
    await this.writeJsonFile('statuses.json', this.statuses);
  }

  // Reset to defaults
  public async resetToDefaults(): Promise<void> {
    this.categories = this.getDefaultCategories();
    this.priorities = this.getDefaultPriorities();
    this.statuses = this.getDefaultStatuses();

    await Promise.all([
      this.writeJsonFile('categories.json', this.categories),
      this.writeJsonFile('priorities.json', this.priorities),
      this.writeJsonFile('statuses.json', this.statuses)
    ]);
  }
}