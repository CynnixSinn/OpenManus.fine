# OpenManus - AI-Powered App Building Agent

OpenManus is an autonomous AI-powered app-building agent inspired by Manus AI. This system functions as a personal AI software engineer that can create, iterate, and manage web apps and software projects on demand.

## Features

- **AI-Powered App Development**: Build full-stack web applications based on user prompts
- **Autonomous Execution**: Automate coding, testing, debugging, and deployment
- **Project Planning**: Break down complex requirements into actionable tasks
- **Interactive Development**: Refine and improve outputs through an interactive loop
- **Project Memory**: Remember past projects, decisions, and user preferences
- **Deployment Pipeline**: Support for various deployment options

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **State Management**: React Context API with useReducer
- **Database**: SQLite (via Fine SDK)
- **Authentication**: Fine Auth
- **LLM Integration**: DeepSeek (via OpenRouter)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/openmanus.git
cd openmanus
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
openmanus/
├── fine/                  # Fine SDK configuration and migrations
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   ├── project/       # Project-specific components
│   │   └── ui/            # UI components (shadcn/ui)
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and services
│   ├── pages/             # Page components
│   └── main.tsx           # Application entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Database Schema

The application uses the following database schema:

### Projects
- `id`: Unique identifier
- `userId`: Reference to user
- `name`: Project name
- `description`: Project description
- `requirements`: Detailed requirements text
- `status`: Current project status (planning, coding, testing, deployed)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Tasks
- `id`: Unique identifier
- `projectId`: Reference to project
- `description`: Task description
- `type`: Task type (planning, frontend, backend, testing, deployment)
- `status`: Task status (pending, in-progress, completed, failed)
- `dependencies`: Array of task IDs that must be completed first
- `output`: Result of the task (could be code, logs, etc.)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Executions
- `id`: Unique identifier
- `taskId`: Reference to task
- `command`: Command executed
- `status`: Execution status
- `output`: Command output
- `error`: Error message if any
- `startedAt`: Timestamp
- `completedAt`: Timestamp

### Deployments
- `id`: Unique identifier
- `projectId`: Reference to project
- `platform`: Deployment platform
- `url`: Deployed application URL
- `status`: Deployment status
- `logs`: Deployment logs
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Usage

1. **Create a New Project**:
   - Navigate to the dashboard
   - Click "New Project"
   - Fill in the project details and requirements
   - Submit the form to create your project

2. **Interact with the AI Agent**:
   - Open your project
   - Use the command input to create tasks or give instructions
   - View the AI's responses in the console
   - Examine generated code in the code editor

3. **Deploy Your Application**:
   - Once your project is ready, use the deployment options
   - Choose your preferred hosting platform
   - The AI will handle the deployment process

## Development

### Adding New Features

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git commit -m "Add your feature"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Create a pull request

### Running Tests

```bash
npm run test
# or
pnpm test
```

## Production Build

To create a production build:

```bash
npm run build
# or
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

The application can be deployed to various platforms:

### Vercel

```bash
vercel
```

### Netlify

```bash
netlify deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Manus AI
- Built with React, Vite, and Tailwind CSS
- UI components from shadcn/ui
- Icons from Lucide React