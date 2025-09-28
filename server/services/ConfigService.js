const PersistenceService = require("./PersistenceService");

class ConfigService extends PersistenceService {
  constructor() {
    super();
    this.categoriesFile = "categories.json";
    this.prioritiesFile = "priorities.json";
    this.statusesFile = "statuses.json";
  }

  // Initialize configurations - ensure files exist
  async loadConfigurations() {
    try {
      await this.ensureFileExists(this.categoriesFile, []);
      await this.ensureFileExists(this.prioritiesFile, []);
      await this.ensureFileExists(this.statusesFile, []);
      console.log("All configuration files initialized");
    } catch (error) {
      console.error("Error initializing configurations:", error);
      throw error;
    }
  }

  // Direct database access methods - no caching
  async getCategories() {
    const categories = await this.readJsonFile(this.categoriesFile);
    return categories || [];
  }

  async getPriorities() {
    const priorities = await this.readJsonFile(this.prioritiesFile);
    return priorities || [];
  }

  async getStatuses() {
    const statuses = await this.readJsonFile(this.statusesFile);
    return statuses || [];
  }

  // Get all configurations from database
  async getAllConfigurations() {
    const [categories, priorities, statuses] = await Promise.all([
      this.getCategories(),
      this.getPriorities(),
      this.getStatuses(),
    ]);

    return {
      categories,
      priorities,
      statuses,
    };
  }

  // Validation helpers - load from database
  async getValidCategories() {
    const categories = await this.getCategories();
    return categories.map((cat) => cat.value);
  }

  async getValidPriorities() {
    const priorities = await this.getPriorities();
    return priorities.map((pri) => pri.value);
  }

  async getValidStatuses() {
    const statuses = await this.getStatuses();
    return statuses.map((status) => status.value);
  }

  // Validation functions - load from database
  async isValidCategory(category) {
    const validCategories = await this.getValidCategories();
    return validCategories.includes(category);
  }

  async isValidPriority(priority) {
    const validPriorities = await this.getValidPriorities();
    return validPriorities.includes(priority);
  }

  async isValidStatus(status) {
    const validStatuses = await this.getValidStatuses();
    return validStatuses.includes(status);
  }

  // Category management
  async addCategory(value, label) {
    const categories = await this.getCategories();
    const exists = categories.some((cat) => cat.value === value);
    if (exists) {
      throw new Error(`Category '${value}' already exists`);
    }

    categories.push({ value, label });
    await this.writeJsonFile(this.categoriesFile, categories);
    return categories;
  }

  async removeCategory(value) {
    const categories = await this.getCategories();
    const index = categories.findIndex((cat) => cat.value === value);
    if (index === -1) {
      throw new Error(`Category '${value}' not found`);
    }

    categories.splice(index, 1);
    await this.writeJsonFile(this.categoriesFile, categories);
    return categories;
  }

  async updateCategory(value, newLabel) {
    const categories = await this.getCategories();
    const category = categories.find((cat) => cat.value === value);
    if (!category) {
      throw new Error(`Category '${value}' not found`);
    }

    category.label = newLabel;
    await this.writeJsonFile(this.categoriesFile, categories);
    return categories;
  }

  // Priority management
  async addPriority(value, label) {
    const priorities = await this.getPriorities();
    const exists = priorities.some((pri) => pri.value === value);
    if (exists) {
      throw new Error(`Priority '${value}' already exists`);
    }

    priorities.push({ value, label });
    await this.writeJsonFile(this.prioritiesFile, priorities);
    return priorities;
  }

  async removePriority(value) {
    const priorities = await this.getPriorities();
    const index = priorities.findIndex((pri) => pri.value === value);
    if (index === -1) {
      throw new Error(`Priority '${value}' not found`);
    }

    priorities.splice(index, 1);
    await this.writeJsonFile(this.prioritiesFile, priorities);
    return priorities;
  }

  // Status management
  async addStatus(value, label) {
    const statuses = await this.getStatuses();
    const exists = statuses.some((status) => status.value === value);
    if (exists) {
      throw new Error(`Status '${value}' already exists`);
    }

    statuses.push({ value, label });
    await this.writeJsonFile(this.statusesFile, statuses);
    return statuses;
  }

  async removeStatus(value) {
    const statuses = await this.getStatuses();
    const index = statuses.findIndex((status) => status.value === value);
    if (index === -1) {
      throw new Error(`Status '${value}' not found`);
    }

    statuses.splice(index, 1);
    await this.writeJsonFile(this.statusesFile, statuses);
    return statuses;
  }

  // Reset to defaults - restore original configurations
  async resetToDefaults() {
    const defaultCategories = [
      { value: "billing", label: "Billing" },
      { value: "technical", label: "Technical Support" },
      { value: "product", label: "Product Issue" },
      { value: "service", label: "Service Quality" },
      { value: "other", label: "Other" },
    ];

    const defaultPriorities = [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "critical", label: "Critical" },
    ];

    const defaultStatuses = [
      { value: "open", label: "Open" },
      { value: "investigating", label: "Investigating" },
      { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ];

    await Promise.all([
      this.writeJsonFile(this.categoriesFile, defaultCategories),
      this.writeJsonFile(this.prioritiesFile, defaultPriorities),
      this.writeJsonFile(this.statusesFile, defaultStatuses),
    ]);

    return this.getAllConfigurations();
  }
}

module.exports = ConfigService;
