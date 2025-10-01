import { promises as fs } from 'fs';
import * as path from 'path';

export class PersistenceService {
  protected databasePath: string;

  constructor() {
    this.databasePath = path.join(__dirname, '../database');
  }

  // Generic file operations
  protected async readJsonFile<T = any>(filename: string): Promise<T | null> {
    try {
      const filePath = path.join(this.databasePath, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`File ${filename} not found`);
        return null;
      }
      throw error;
    }
  }

  protected async writeJsonFile<T = any>(filename: string, data: T): Promise<boolean> {
    try {
      const filePath = path.join(this.databasePath, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved data to ${filename}`);
      return true;
    } catch (error) {
      console.error(`Error saving to ${filename}:`, error);
      throw error;
    }
  }

  protected async ensureFileExists<T = any>(filename: string, defaultData: T = [] as any): Promise<void> {
    const filePath = path.join(this.databasePath, filename);
    try {
      await fs.access(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await this.writeJsonFile(filename, defaultData);
      }
    }
  }
}