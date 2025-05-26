# Full-Stack MERN Developer Technical Assessment

This project is a technical assessment for a Full-Stack MERN Developer role. It implements a B2B marketplace search and discovery engine with dynamic faceting.

## Tech Stack

*   **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS
*   **Backend:** Next.js API Routes, Node.js, Express.js (implicitly via Next.js)
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Runtime:** tsx (for seeding script)

## Prerequisites

*   Node.js (v18 or newer recommended)
*   npm or yarn
*   Docker and Docker Compose (for MongoDB service)
*   Git

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd fullstack-mern-assessment
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Create environment file:**
    Copy `.env.example` to `.env.local` (if an example is provided) or create `.env.local` with the following content:
    ```env
    DATABASE_URL=mongodb://admin:password@localhost:27017/mern_assessment_db?authSource=admin
    NEXT_PUBLIC_API_URL=http://localhost:3000 
    ```

4.  **Start MongoDB service using Docker Compose:**
    In the project root directory, run:
    ```bash
    docker-compose up -d
    ```
    This will start a MongoDB instance in the background.

5.  **Seed the database:**
    Run the seeder script to populate the database with initial categories and listings:
    ```bash
    npm run seed
    ```
    You should see console logs indicating successful seeding.

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.
    The main search page will be `http://localhost:3000/search`. It's recommended to start with a category selected, e.g., `http://localhost:3000/search?category=televisions`.

    To run everything with one command (after initial setup and Docker daemon running):
    ```bash
    npm run dev:full 
    ```
    (This script in `package.json` combines `docker-compose up -d`, `npm run seed`, and `npm run dev`. The seed script exits, so you might need to run `npm run dev` in a separate terminal if `&&` causes issues, or adjust the script.)
    *Note: The `npm run seed` command will exit after completion. `npm run dev` will keep running.* A better combined script would be `docker-compose up -d && npm run seed && npm run dev`.

## API Documentation

### `GET /api/search`

Retrieves product listings based on search criteria, category, and filters. Also returns dynamic facet information.

**Query Parameters:**

*   `q` (string, optional): Full-text search query keyword. Matches against product title and description.
*   `category` (string, **required**): The slug of the category to search within (e.g., `televisions`, `running-shoes`). This determines the available facets.
*   `filters` (string, optional): A URL-encoded JSON string representing active filters.
    *   Example: `encodeURIComponent(JSON.stringify({ "brand": "Samsung", "size": "55" }))`
    *   For multi-select checkbox filters, the value can be an array: `encodeURIComponent(JSON.stringify({ "color": ["Red", "Blue"] }))`
*   `page` (number, optional, default: `1`): The page number for pagination.
*   `limit` (number, optional, default: `10`): The number of items per page.

**Successful Response (200 OK):**

```json
{
  "data": {
    "results": [
      // Array of product listing objects
      {
        "_id": "listingId",
        "title": "Example Product",
        "description": "...",
        "price": 199.99,
        "location": "City",
        "category": "categoryId",
        "attributes": { "key1": "value1", "key2": "value2" },
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalResults": 48,
      "limit": 10
    },
    "facets": [
      {
        "name": "Brand", // Human-readable facet name
        "attributeKey": "brand", // Key in product.attributes
        "type": "checkbox", // UI hint ('checkbox', 'dropdown')
        "options": [
          { "value": "Samsung", "label": "Samsung", "count": 15, "selected": false },
          { "value": "LG", "label": "LG", "count": 10, "selected": true }
          // ... more options
        ]
      }
      // ... more facets
    ]
  }
}