# DocChat

<p align="center">
  <img src="client/public/screenshot-1.png" width="32%" />
  <img src="client/public/screenshot-2.png" width="32%" />
  <img src="client/public/screenshot-3.png" width="32%" />
</p>

DocChat is a modern, neo-brutalist web application that transforms static PDFs into interactive knowledge bases. Built with cutting-edge AI, it allows students, researchers, and professionals to seamlessly extract insights, summarize dense texts, and query specific clauses without manually skimming through pages.

## Features

- **AI-Powered Extraction**: Powered by Google's Gemini LLM, DocChat understands the semantic context of your questions and pulls exact answers directly from the source material.
- **Lightning Fast Search**: Utilizes Pinecone vector search for milliseconds-fast document querying and context retrieval.
- **Secure Storage**: Documents are securely managed. Authentication is handled robustly via Clerk.
- **Neo-Brutalist UI**: Features a striking, high-contrast, premium design system built with Tailwind CSS, custom Google Fonts (Poppins), and smooth Lottie animations.

## Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS v4
- Clerk (Authentication)
- Lottie-player
- Lucide React (Icons)
- React Dropzone

**Backend:**
- Node.js & Express
- Prisma (ORM) with PostgreSQL (Neon/Supabase)
- Google Generative AI (Gemini-1.5-flash)
- Pinecone (Vector Database)
- Multer & pdf-parse (File processing)

**DevOps & Deployment:**
- Docker & Docker Compose
- Vercel (Zero-Config Serverless)
- GitHub Actions (CI Pipeline)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Postgres Database
- Pinecone API Key & Environment
- Google Gemini API Key
- Clerk Publishable & Secret Keys

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saneajayy/DocChat.git
   cd DocChat
   ```

2. **Install dependencies:**
   You will need to install dependencies for both the client and the server.
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in both the `server` and `client` directories using their respective `.env.example` templates.

   **Server (`server/.env`):**
   ```env
   DATABASE_URL="your_postgres_url"
   GEMINI_API_KEY="your_google_genai_key"
   PINECONE_API_KEY="your_pinecone_key"
   PINECONE_ENVIRONMENT="your_pinecone_env"
   PINECONE_INDEX="docchat"
   CLERK_SECRET_KEY="your_clerk_secret"
   PORT=5000
   ```

   **Client (`client/.env`):**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   VITE_API_URL="http://localhost:5000"
   ```

4. **Initialize Database:**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Application Locally:**
   Run both the client and server development scripts in separate terminals:
   
   *Terminal 1 (Backend):*
   ```bash
   cd server
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   cd client
   npm run dev
   ```

## Deployment

### 🐳 Docker (Recommended)
The easiest way to run the entire application stack locally or on a VPS is using Docker Compose.

1. Ensure you have created a `.env` file in the root `DocChat/` directory containing your build arguments:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   VITE_API_URL="http://localhost:5000"
   ```
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
3. The frontend will be available at `http://localhost` (Port 80) and the backend at `http://localhost:5000`.

### ▲ Vercel
The application is pre-configured for Vercel deployment.

- **Frontend (`client/`)**: Import the repository into Vercel, set the Framework Preset to **Vite**, and the Root Directory to `client`.
- **Backend (`server/`)**: Import the repository again, set the Framework Preset to **Other**, and the Root Directory to `server`. Vercel's zero-config setup will automatically detect the `server/api/index.js` file and deploy your Express app as a Serverless Function! *(Note: The repository includes a `server/.npmrc` file to bypass strict peer dependency issues during Vercel builds).*

## CI/CD Pipeline
This project includes a **GitHub Actions** workflow (`.github/workflows/ci.yml`) that automatically triggers on every push and pull request to the `main` branch. It executes parallel jobs to validate and build both the frontend and backend environments, ensuring code integrity before any deployments.

## License
MIT License
