const fs = require("fs").promises;
const path = require("path");

class PersistenceService {
  constructor() {
    this.databasePath = path.join(__dirname, "../database");
  }

  // Generic file operations
  async readJsonFile(filename) {
    try {
      const filePath = path.join(this.databasePath, filename);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`File ${filename} not found`);
        return null;
      }
      throw error;
    }
  }

  async writeJsonFile(filename, data) {
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

  async ensureFileExists(filename, defaultData = []) {
    const filePath = path.join(this.databasePath, filename);
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.writeJsonFile(filename, defaultData);
      }
    }
  }
}

module.exports = PersistenceService;