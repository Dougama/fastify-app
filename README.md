# fastify-app
TypeScript, Fastify, Prisma, and Monorepo

# Cloud Run Deployment Script and local setup

I chose **Google Cloud Run** because it provides a scalable and cost-effective way to deploy containerized applications. It automatically handles scaling based on traffic, requiring no manual intervention for server management. The serverless nature of Cloud Run ensures that resources are used efficiently, especially with the `MIN_INSTANCES=0` setting, which avoids charges when the application is idle. Additionally, integrating **GCP Secrets Manager** for sensitive data like the database URL enhances security while keeping the configuration flexible and manageable.

This script is used to deploy the **Fastify** application to **Google Cloud Run**, a fully managed serverless platform that allows you to run containerized applications. The script performs the following tasks:

## Key Steps in the Script

1. **Project Validation**  

   - It checks if the retrieved project ID matches the expected project ID.
  

2. **Setting Deployment Parameters**
   - **`MIN_INSTANCES` and `MAX_INSTANCES`**:
     - `MIN_INSTANCES=0` ensures no instances are running when there is no traffic (cost-effective).
     - `MAX_INSTANCES=1` limits the application to a single instance, suitable for testing purposes or low traffic scenarios.
   - **`TZ=America/Bogota`**: Sets the timezone for the application.
   - **`memory 1Gi`**: Allocates 1 GB of memory to the application.
   - **`DATABASE_URL`**: Uses GCP secrets to securely pass the database URL to the application.

3. **Deploying with `gcloud run deploy`**
   - **`--region=us-east1`**: Deploys the application in the `us-east1` region.
   - **`--allow-unauthenticated`**: Allows unauthenticated access to the application for public endpoints. All routes are protected by JWT authentication.
   - **`--source`**: Specifies the source code to deploy.


4. **Deploying in Your Own GCP Account**  
   - **Steps to Configure**:
     1. **Enable Required APIs**:  
        Run the following commands to enable required GCP APIs:  
        ```bash
        gcloud auth login
        gcloud services enable run.googleapis.com
        gcloud services enable secretmanager.googleapis.com
        gcloud config configurations create [CONFIG_NAME]
        gcloud config activate [CONFIG_NAME]
        gcloud config set project [PROJECT_ID]


        ```
     2. **Grant Permissions**:  
        - Grant storage permissions:  
          ```bash
          gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
            --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
            --role="roles/storage.admin"
          ```
        - Grant Secret Manager permissions:  
          ```bash
          gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
            --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
            --role="roles/secretmanager.secretAccessor"
          ```
     3. **Set Up Secrets**:  
        Create a secret for the database URL:  
        ```bash
        echo "postgresql://user:password@host:port/database" | \
        gcloud secrets create DATABASE_URL --data-file=-
        ```
        At this point, you might need a free PostgreSQL database. I recommend using Render, which offers an easy and reliable way to host a PostgreSQL database for free . [render](https://render.com/)
     4. **Deploy the Application**:  
        After completing these steps, simply run:  
        ```bash
        ./ci-scripts/deploy
        ```

 ## Running Locally
   - **Development Setup**:  
     To run the application locally, execute:  
     ```bash
     yarn dev
     ```
     This requires a **PostgreSQL server** running locally.  

   - **PostgreSQL Example with Docker Compose**:  
     Use the following `docker-compose.yml` to set up a local PostgreSQL server:  
     ```yaml
     version: '3.8'
     services:
       postgres:
         image: postgres:latest
         container_name: postgres
         ports:
           - "5432:5432"
         environment:
           POSTGRES_USER: user
           POSTGRES_PASSWORD: password
           POSTGRES_DB: database
     ```
     Start the PostgreSQL server with:  
     ```bash
     docker-compose up -d
     ```

   - **Connection URL Example**:  
     Based on the above configuration, use the following connection URL:  
     ```
     DATABASE_URL=postgresql://user:password@localhost:5432/database
     ```
     Set this in your `.env` file or pass it as an environment variable.


# 1) Monorepo Architecture Overview

This is a monorepo architecture built using **Yarn Workspaces** and **TypeScript**. It consists of three main packages: **api**, **services**, and **utils**, organized under the `packages` directory. Each package has its own `src` folder for source code, a `tsconfig.json` for TypeScript configuration, and follows a standardized structure.

## Key Features

### 1. Workspaces and Dependency Management
- The root `package.json` defines `workspaces` to include all packages under `packages/*`.
- Shared dependencies and scripts are managed at the root level.
- Yarn commands like `yarn build` or `yarn clean` use the `foreach` functionality to execute scripts across all workspaces.

### 2. TypeScript Configurations
- Each package contains its own `tsconfig.json`, extending the root configuration.
- The root `tsconfig.json` specifies:
  - Shared `compilerOptions` like `paths` for module aliases (`@app/services`, `@app/utils`).
  - `references` for managing inter-package dependencies.
- The `api` and `services` packages reference the `utils` package for shared utility functions.

### 3. Folder Structure
- **api**: Contains backend logic and references both `services` and `utils`.
- **services**: Includes service-specific implementations and references `utils`.
- **utils**: Provides shared utility functions for reuse across other packages.
- Each package outputs compiled files to a `build` directory specified by the `outDir` option.

# Package Descriptions

## 1. API Package
The **API package** follows the **MVC (Model-View-Controller)** architecture pattern and includes additional design considerations like the **Repository** pattern. It is structured as follows:

### Key Components
- **Controllers**:  
  Handles HTTP requests and responses. This layer interacts with the services layer to process business logic and returns results to the client.
  
- **Middleware**:  
  Contains reusable middleware functions for handling tasks like authentication, logging, and validation.

- **Models**:  
  Defines data structures and interacts with the Prisma ORM for database operations.

- **Plugins**:  
  Implements extensions or integrations, such as adding Fastify plugins or custom server features.

- **Repositories**:  
  Encapsulates database queries to provide an abstraction layer, ensuring separation of concerns between business logic and data access.

- **Routes**:  
  Defines API endpoints and connects them to the appropriate controllers.

- **Services**:  
  Contains the business logic of the application. This is the layer where core application workflows are implemented.

### Considerations
The **Repository** pattern is used for modular database interaction, and the **Services** layer centralizes the application’s business logic. This ensures scalability, maintainability, and testability.

---

## 2. Services Package
The **Services package** focuses on managing external service integrations and asynchronous communication.

### Key Components
- **PubSub (Notifications)**:  
  Defines PubSub clients to handle notifications for actions like:
  - Creating a user.
  - Updating user profiles.
  - Creating posts.
  Notifications are sent via PubSub for better decoupling and scalability.

- **Storage (GCP Storage)**:  
  Implements a client for managing the storage of profile images in **Google Cloud Storage**. Includes methods for saving, retrieving, and deleting images.

- **Index**:  
  Provides a centralized entry point for initializing and exporting service clients.

### Considerations
This package focuses on external service integrations and promotes separation of concerns by isolating notification and storage handling from the core application logic.

---

## 3. Utils Package
The **Utils package** provides shared utilities and helpers used across the entire monorepo.

### Key Components
- **Basic Authentication**:  
  Implements reusable utilities for handling basic authentication workflows.

- **JWT**:  
  Contains functions for generating and validating JSON Web Tokens.

- **Schemas**:  
  Defines shared validation schemas (e.g., for input validation) that can be reused in other packages.

- **Logger**:  
  Provides a utility for consistent logging throughout the application.

- **Index**:  
  Serves as an entry point for exporting all utilities.

### Considerations
This package ensures reusability and centralization of commonly used functionality, reducing duplication and improving consistency.


# 2) Advanced Server Setup 

- This Fastify configuration sets up a modular and robust server with logging, plugins, and route registration. The Fastify instance is initialized with a custom logger configuration using pino-pretty for non-production environments, enabling formatted and human-readable logs with timestamp translation while ignoring specific fields like process ID and hostname. The logging level defaults to the environment variable LOG_LEVEL or falls back to info.

- The configuration integrates middleware and plugins in a modular way. The cors plugin is registered for handling cross-origin requests, and Swagger is set up for API documentation using the configureSwagger plugin. Routes are organized and registered under prefixes, ensuring a clean and structured API design. The routes include health checks, user management, authentication, profile handling, and post management.

- The startServer function ensures error handling, logging any issues during the startup process and throwing errors to avoid silent failures. 

# 3) Advanced Database Integration with Prisma and
PostgreSQL

- The Prisma ORM is configured to connect to a PostgreSQL database using the **`DATABASE_URL`** environment variable. The Prisma client is generated and used to interact with the database, ensuring type-safe database operations.

- The Prisma schema defines the database models, including User, Profile, and Post, with relationships established between them. The schema includes data types, constraints, and relationships, allowing for a clear and organized database structure.

- The Prisma client is generated and used to interact with the database, ensuring type-safe database operations. The schema defines the database models, including User, Profile, and Post, with relationships established between them. The schema includes data types, constraints, and relationships, allowing for a clear and organized database structure.

# 4) Advanced Authentication and Authorization

- In this implementation, JSON Web Tokens (JWT) are generated only after successful authentication using a valid username and password. When a new user is created, their password is hashed using the SHA-256 algorithm before being stored in the database. This ensures that sensitive information like passwords is not stored in plain text, providing an additional layer of security.

- To generate a JWT, the server signs a payload object with a secret key and additional configuration options, such as the expiration time and algorithm, using the jsonwebtoken library. The generated token is then sent to the client for use in authenticated requests.

- Token verification ensures the integrity and validity of the JWT by decoding it using the same secret key and verifying it against the defined algorithm. If the token is invalid or expired, an error is thrown, requiring re-authentication. This secure approach ensures only authorized users can access protected resources.

# 5) Advanced API Features

### Base64 Image Upload to Google Cloud Storage

The `publicImageUrl` method processes a Base64-encoded image, converts it to binary, and uploads it to **Google Cloud Storage (GCS)**.

## Workflow

1. **Input Validation**  
   - Checks if a Base64 string is provided.  
   - Logs a warning and returns `null` if the string is missing.  
   - Uses a regular expression to validate that the Base64 string represents a valid image.

2. **Extract Metadata**  
   - Extracts the image type (e.g., `png`, `jpeg`) and the actual Base64 content using a regex match.  
   - Logs a warning and exits if the format is invalid.

3. **Convert and Upload**  
   - Converts the Base64 content into a binary buffer.  
   - Generates a unique file name using the `userId`.  
   - Initializes a GCS client and uploads the file to the bucket (`fastify-app`) with appropriate metadata (e.g., content type).

4. **Return Public URL**  
   - After a successful upload, the method returns the public URL of the stored image.

This method ensures secure storage in GCS while providing a publicly accessible URL for future use.



### Pub/Sub Notifications in GCP

The project uses **Google Cloud Pub/Sub** for decoupled, event-driven notifications, enabling seamless communication between microservices.

### Workflow

1. **Publishing Events**  
   - Events like a user's profile update are published to specific Pub/Sub topics (e.g., `user-profile-updated`).  
   - The message includes relevant data such as the user ID and updated information.

2. **Subscription Mechanism**  
   - Microservices or cloud functions subscribe to topics to handle specific events.  
     - Example: A **notifications service** subscribed to `profile-updated` could send an email confirmation.  
     - Example: A logging service could track the event for auditing.

3. **Event Handling**  
   - Subscribing endpoints process messages independently, ensuring scalability and flexibility.  
   - External systems, like email services or cloud functions, can handle tasks such as sending notifications.


This approach supports scalable and efficient notifications, such as profile updates, while integrating external systems for tasks like email notifications.


# 6) Testing and Documentation


### API Documentation with Swagger
 

The documentation for this API is based on a centralized **OpenAPI** specification defined in a `swagger.yaml` file. This approach was chosen over inline documentation at each endpoint to maintain a single source of truth, ensuring consistency and simplifying updates.

## Implementation

1. **Loading the OpenAPI Specification**  
   - The `swagger.yaml` file is parsed using the `js-yaml` library and loaded into the application as a JavaScript object.  
   - This file contains all the API route definitions, request/response schemas, and other metadata.

2. **Integrating Swagger with Fastify**  
   - The `fastifySwagger` plugin is registered to serve the OpenAPI document.  
   - The `fastifySwaggerUi` plugin is used to provide an interactive Swagger UI, making it easy to explore and test the API.

3. **UI Configuration**  
   - The Swagger UI is served at `/documentation`, with configurations for a full document expansion, no deep linking, and enhanced security with `staticCSP`.

## Testing with Jest

For testing purposes, only **unit tests** were written for the user routes, using **Jest** as the testing framework. These tests ensure the core functionality of user-related endpoints, focusing on accuracy and reliability during the test phase.

