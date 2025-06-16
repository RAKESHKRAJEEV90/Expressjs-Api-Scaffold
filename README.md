# Express.js Backend Scaffold

A production-ready, modular Express.js backend scaffold built with TypeScript, following Clean Architecture principles. This scaffold provides a solid foundation for building scalable and maintainable backend applications.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/yourusername)

## 🚀 Features

- **Clean Architecture** implementation with clear separation of concerns
- **TypeScript** support with strict type checking
- **Modular Design** allowing easy feature toggling
- **Multiple Database Support**:
  - MongoDB
  - PostgreSQL
  - MySQL
  - SQL Server
  - Redis (for caching and pub/sub)
- **Authentication & Authorization**:
  - JWT-based authentication
  - Role-based access control
  - API key support
- **API Features**:
  - RESTful API support
  - GraphQL integration (optional)
  - API versioning
  - Swagger/OpenAPI documentation
- **Security**:
  - Helmet for security headers
  - CORS configuration
  - Rate limiting
  - Request validation
- **File Upload**:
  - Local storage
  - S3 integration
- **Logging & Monitoring**:
  - Winston logger
  - Health check endpoints
  - Prometheus metrics
- **Testing**:
  - Jest configuration
  - Unit and integration test setup
- **Development Tools**:
  - ESLint + Prettier
  - Hot reloading
  - CLI tools for scaffolding

## 📁 Project Structure

```
src/
├── app/           # Express app setup and DI
├── config/        # Environment and app configuration
├── routes/        # REST API routes
├── graphql/       # GraphQL schema and resolvers
├── controllers/   # HTTP request handlers
├── usecases/      # Business logic
├── repositories/  # Data access layer
│   ├── mongo/
│   ├── postgres/
│   ├── mysql/
│   └── sqlserver/
├── models/        # Database models
├── services/      # Shared services
├── middlewares/   # Express middlewares
├── events/        # Event handling
├── utils/         # Helper functions
├── tests/         # Test files
├── cli/           # CLI tools
└── server.ts      # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd express-backend-scaffold
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`

5. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Setup

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. The API will be available at `http://localhost:3000`

## 🔧 Configuration

The scaffold is highly configurable through environment variables. Key configurations include:

- Database connections
- Feature toggles
- Security settings
- Logging options
- API settings

See `.env.example` for all available options.

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

When enabled, API documentation is available at:

- REST API: `http://localhost:3000/docs`
- GraphQL Playground: `http://localhost:3000/graphql`

## 🚀 Deployment

The scaffold includes Docker configuration for easy deployment:

```bash
# Build the Docker image
docker build -t your-app-name .

# Run the container
docker run -p 3000:3000 your-app-name
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📫 Support

For support, please open an issue in the GitHub repository. 