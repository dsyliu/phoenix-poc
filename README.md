# Complaint Case Management System

A comprehensive case management system for handling customer complaints with role-based access control for different types of agents.

## Features

- **Role-based Access Control**: Four agent types with different permissions
  - **Frontline Agents**: Create new cases
  - **Investigator Agents**: Investigate cases and mark as "resolved" when complete
  - **Validator Agents**: Review resolved cases and close them
  - **Admin Users**: Manage system configurations (read-only access to cases)

- **Case Lifecycle Management**: Complete workflow from creation to closure
- **Real-time Updates**: Add notes and track case progress
- **Filtering & Search**: Filter cases by status, priority, and assignment
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vue.js 3, Vue Router, Pinia (state management)
- **Backend**: Node.js, Express.js
- **Data Storage**: In-memory (easily replaceable with database)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:3000
   - Frontend development server on http://localhost:5173

3. **Access the application**:
   Open http://localhost:5173 in your browser

### Demo Accounts

The system comes with four pre-configured demo accounts:

- **Frontline Agent**: john@company.com
- **Investigator Agent**: jane@company.com  
- **Validator Agent**: mike@company.com
- **Admin User**: admin@company.com

## Usage

### Creating Cases (Frontline Agents)
1. Login with a frontline agent account
2. Click "Create New Case" 
3. Fill in customer details and case information
4. Submit to create the case

### Investigating Cases (Investigator Agents)
1. Login with an investigator account
2. View cases in "Open" status
3. Click on a case to view details
4. Change status to "Investigating"
5. Add notes and updates during investigation
6. Mark as "Resolved" when investigation is complete

### Validating & Closing Cases (Validator Agents)
1. Login with a validator account
2. View cases in "Resolved" status
3. Review the case and investigation notes
4. Validate the resolution is satisfactory
5. Change status to "Closed" to finalize the case

### Administration (Admin Users)
1. Login with an admin account
2. Access the "Admin Panel" from navigation
3. View database statistics and overview
4. Manage configurations (categories, priorities, statuses)
5. Add, remove, or modify configuration options
6. Reset configurations to defaults
7. **Note**: Admin users have read-only access to cases and agents

## API Endpoints

### Authentication
- `POST /api/auth/login` - Agent login

### Cases
- `GET /api/cases` - Get all cases (with filters)
- `GET /api/cases/constants` - Get case configuration (categories, priorities, statuses)
- `GET /api/cases/:id` - Get specific case
- `POST /api/cases` - Create new case
- `PATCH /api/cases/:id/status` - Update case status
- `PATCH /api/cases/:id/assign` - Assign case to agent
- `POST /api/cases/:id/notes` - Add note to case

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get specific agent

### Configuration
- `GET /api/config` - Get all configurations
- `GET /api/config/categories` - Get categories
- `GET /api/config/priorities` - Get priorities  
- `GET /api/config/statuses` - Get statuses
- `POST /api/config/categories` - Add new category
- `PUT /api/config/categories/:value` - Update category
- `DELETE /api/config/categories/:value` - Remove category
- `POST /api/config/priorities` - Add new priority
- `DELETE /api/config/priorities/:value` - Remove priority
- `POST /api/config/statuses` - Add new status
- `DELETE /api/config/statuses/:value` - Remove status
- `POST /api/config/reset` - Reset to default configuration

## Project Structure

```
├── server/                 # Backend Node.js/Express
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   │   ├── PersistenceService.js  # Base persistence operations
│   │   ├── CaseService.js         # Case management
│   │   ├── AgentService.js        # Agent management
│   │   ├── ConfigService.js       # Configuration management
│   │   └── index.js               # Service initialization
│   ├── database/          # JSON database storage
│   │   ├── agents.json    # Agent data
│   │   ├── cases.json     # Case data
│   │   ├── categories.json # Case categories
│   │   ├── priorities.json # Case priorities
│   │   └── statuses.json  # Case statuses
│   └── index.js           # Server entry point
├── client/                # Frontend Vue.js
│   ├── src/
│   │   ├── views/         # Page components
│   │   ├── stores/        # Pinia stores
│   │   ├── styles/        # CSS stylesheets
│   │   ├── constants/     # Frontend constants
│   │   ├── router/        # Vue Router config
│   │   └── main.js        # App entry point
│   └── package.json

└── package.json           # Root package.json
```

## Development

### Running Individual Services

**Backend only**:
```bash
npm run server
```

**Frontend only**:
```bash
npm run client
```

### Adding Database Support

The current implementation uses in-memory storage. To add database support:

1. Replace the data store in `server/data/store.js`
2. Add database connection and models
3. Update the route handlers to use database operations

## License

MIT License