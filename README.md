# UI Wizard

A modern web application that uses AI to convert natural language descriptions into clean, semantic HTML/CSS/JS code. Built with React, TypeScript, and OpenAI's GPT-4.

## Features

- 🎨 Convert text descriptions into functional UI components
- 💬 Interactive chat interface with real-time feedback
- 🔄 Retry mechanism for failed messages
- 📱 Responsive design with modern UI/UX
- 🚀 Real-time preview of generated UI components
- 🎯 Semantic HTML output with accessibility in mind
- 🎨 Clean CSS with modern best practices
- 📝 Well-structured JavaScript with proper event handling

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for fast development
  - TanStack Query for data fetching
  - Tailwind CSS for styling
  - Radix UI for accessible components
  - ShadcnUI for beautiful UI components

- **Backend**:
  - Node.js with Express
  - OpenAI GPT-4 for UI generation
  - TypeScript for type safety
  - JSON storage for messages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key and endpoint URL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Chintan-Karki/ui-wizard.git
   cd ui-wizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure the following environment variables:
     ```env
     # Environment
     NODE_ENV='development'  # or 'production'

     # Site Configuration
     VITE_SITE_URL=''       # Your site URL
     VITE_SITE_NAME=''      # Your site name

     # OpenAI Configuration
     VITE_OPENAI_API_KEY=your-openai-api-key
     VITE_LLM_URL=your-openai-LLM-url-key
     VITE_LLM_MODEL=your-openai-model-name  # e.g. gpt-3.5-turbo
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a natural language description of the UI you want to create
2. Press "Send" or use Cmd/Ctrl + Enter to submit
3. The AI will generate HTML, CSS, and JavaScript code
4. Click "Preview Generated UI" to see the result
5. Use the retry button if needed for failed messages

## Project Structure

```
AIUIBuilder/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/                # Backend Express server
│   ├── routes/           # API routes
│   └── openai.ts         # OpenAI integration
└── shared/               # Shared types and utilities
```

## Development Features

- **Error Handling**:
  - Failed message retry mechanism
  - Input preservation on failure
  - Clear error feedback

- **UI/UX**:
  - Keyboard shortcuts
  - Loading states
  - Tooltips for better guidance
  - Responsive design
  - Auto-scroll to latest message

- **Code Quality**:
  - TypeScript for type safety
  - Environment variable validation
  - Consistent code style
  - Component-based architecture

### Scripts

```bash
# Development
npm run dev         # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run preview    # Preview production build

# Code Quality
npm run lint       # Run ESLint
npm run format     # Run Prettier
npm run type-check # Check TypeScript types

# Testing
npm test          # Run tests
npm run coverage  # Generate coverage report
```

## Contributing

### Getting Started

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - Configure other environment variables as needed

### Submitting Changes

1. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
2. Push to your fork:
   ```bash
   git push origin feature/AmazingFeature
   ```
3. Open a Pull Request

### Pull Request Guidelines

1. Describe your changes in detail
2. Link any related issues
3. Ensure all tests pass
4. Update relevant documentation
5. Follow the existing code style
6. Keep changes focused and atomic

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Radix UI for accessible component primitives
- ShadcnUI for beautiful component designs
- TanStack Query for powerful data fetching
- Vite for fast development and building
- TypeScript for type safety
- ESLint and Prettier for code quality
