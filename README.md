# Express.js Backend Scaffold

A production-ready, modular Express.js backend scaffold built with TypeScript, following Clean Architecture principles. This scaffold provides a solid foundation for building scalable and maintainable backend applications.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/rk_dev)

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
  - Log rotation via env:
    - `LOG_DIR` (default `logs`)
    - `LOG_DATE_PATTERN` (default `YYYY-MM-DD`)
    - `LOG_MAX_SIZE` (default `20m`)
    - `LOG_RETENTION_DAYS` (default `3d`)
    - `LOG_ZIP_ARCHIVE` (default `true`)
- API settings

See `.env.example` for all available options.

## 🧪 Testing

This scaffold includes sample unit and integration tests using Jest and supertest.

- **Unit tests** cover controllers and services (e.g., user creation, file upload, Redis cache).
- **Integration test** covers the user creation API endpoint.

### Running Tests

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

Test files are located in `src/tests/`.

## 🛠️ CLI Scaffolding

This project ships with a CLI to scaffold modules, routes, and GraphQL resolvers.

- Run locally in dev: `npm run cli -- <command>`

Commands:

- `module <name>`: Creates controller, use-cases, repository stub, and a versioned route, and mounts it.
  - Options: `-v, --version <version>` (default `v1`), `-p, --path <basePath>` (default `/<name>`)
  - Example: `npm run cli -- module product -v v1 -p /products`

- `route <name>`: Creates a versioned route file and mounts it in `src/routes/<version>/index.ts`.
  - Options: `-v, --version <version>` (default `v1`), `-p, --path <basePath>`
  - Example: `npm run cli -- route reports -v v1 -p /reports`

- `graphql <name>`: Creates a GraphQL module at `src/graphql/modules/<name>/index.ts` with `typeDefs` and `resolvers`.
  - Example: `npm run cli -- graphql catalog`

GraphQL modules are auto-loaded when GraphQL is enabled.

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

## 🗄️ Database Support

This scaffold supports MongoDB, PostgreSQL, MySQL, and SQL Server. Each database connection and repository is implemented and can be toggled on or off via the `.env` file:

- `MONGO_ENABLED=true` to enable MongoDB
- `POSTGRES_ENABLED=true` to enable PostgreSQL
- `MYSQL_ENABLED=true` to enable MySQL
- `SQLSERVER_ENABLED=true` to enable SQL Server

Each database has its own connection utility and base repository class. Example `UserRepository` implementations are provided for each database. 

## 🧩 Redis Cache & Event Bus Usage

### Redis Cache Service

You can use the Redis cache service for general caching (sessions, query results, etc.):

```typescript
import { cacheSet, cacheGet, cacheDel } from './src/services/redisCacheService';

// Set a value
await cacheSet('mykey', { foo: 'bar' }, 60); // TTL 60 seconds

// Get a value
const value = await cacheGet('mykey');

// Delete a value
await cacheDel('mykey');
```

### Redis Event Bus

You can use the Redis event bus for pub/sub event-driven architecture:

```typescript
import { publish, subscribe } from './src/events/RedisEventBus';

// Subscribe to a channel
subscribe('user:created', (msg) => {
  console.log('Received user:created event:', msg);
});

// Publish an event
await publish('user:created', { id: 1, name: 'Alice' });
```

Both features are only active if `REDIS_ENABLED=true` in your `.env`. 

## 📦 File Upload Usage

This scaffold supports file uploads to either local storage or AWS S3, controlled by the `UPLOAD_PROVIDER` variable in your `.env`:

- `UPLOAD_PROVIDER=local` (default): Files are saved to the `uploads/` directory.
- `UPLOAD_PROVIDER=s3`: Files are uploaded to your configured S3 bucket.

### Example Usage

Send a POST request to `/api/v1/upload` with a file field named `file`:

```bash
curl -F "file=@/path/to/your/file.jpg" http://localhost:3000/api/v1/upload
```

- If using S3, the response will include the S3 URL and key.
- If using local, the response will include the filename and path.

**.env example:**
```
UPLOAD_PROVIDER=local # or s3
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
``` 

## 📣 Event-Driven Architecture Example

This scaffold supports event-driven patterns using either in-memory events or Redis pub/sub (if `REDIS_ENABLED=true`).

### UserCreatedEvent Example

- When a user is created (via `/api/v1/user`), a `UserCreatedEvent` is emitted.
- Listeners can subscribe to this event and perform actions (e.g., send a welcome email).
- If Redis is enabled, the event is published/subscribed via Redis; otherwise, it uses in-memory events.

**Sample usage:**

```typescript
// Emit the event (e.g., after user creation)
import { emitUserCreatedEvent } from './src/events/UserCreatedEvent';
emitUserCreatedEvent({ id: 1, username: 'alice', email: 'alice@example.com' });

// Listen for the event
import { onUserCreated } from './src/events/UserCreatedEvent';
onUserCreated((user) => {
  console.log('UserCreatedEvent received:', user);
  // e.g., send welcome email
});
```

**API Example:**
- POST `/api/v1/user` with `{ "username": "alice", "email": "alice@example.com" }` will emit the event. 