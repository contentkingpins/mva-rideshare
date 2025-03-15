# MVA Ride Share

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- AWS DynamoDB integration
- Form handling with react-hook-form and zod
- Framer Motion for animations

## Security Features

- Rate limiting middleware
- Secure headers configuration
- Content Security Policy (CSP)
- Bot protection
- AWS credential rotation

## Monitoring and Performance

- Custom logging system
- Performance monitoring
- Error boundaries
- Rate limiting hooks
- Automated testing

## Development Tools

- ESLint with strict TypeScript rules
- Prettier for code formatting
- Jest for testing
- Husky for Git hooks
- Automated pre-commit checks

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run validate` - Run all checks (lint, type-check, test)

## Code Quality

The project uses several tools to maintain code quality:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Jest for testing
- Husky for Git hooks
- lint-staged for running checks on staged files

## Security

Security measures include:

- HTTP security headers
- Rate limiting
- Bot protection
- Content Security Policy
- AWS credential rotation

## Monitoring

The project includes:

- Custom logging system
- Performance monitoring
- Error tracking
- Rate limiting
- Error boundaries

## Contributing

1. Create a feature branch
2. Make your changes
3. Run validation: `npm run validate`
4. Submit a pull request

## License

This project is private and confidential. 