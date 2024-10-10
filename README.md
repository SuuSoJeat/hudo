![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)
![Lighthouse Performance](https://img.shields.io/badge/Performance-100-green)
![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-92-green)
![Lighthouse Best Practices](https://img.shields.io/badge/Best%20Practices-100-green)
![Lighthouse SEO](https://img.shields.io/badge/SEO-100-green)

# HuDo

HuDo is a collaborative task management application designed for advancing human knowledge. It provides a simple and intuitive interface for managing todos with real-time updates.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://hudo.vercel.app/)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Firestore Data Schema](#firestore-data-schema)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- Display, add, edit, and delete todos
- Real-time updates using Firebase Firestore
- Filter todos by status (completed/incomplete)
- Responsive design for mobile and desktop

## Technologies Used

- Next.js 14 (App Router)
- React
- TypeScript
- Firebase Firestore
- Tailwind CSS
- Shadcn UI
- Zod for schema validation
- Vitest for testing

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/SuuSoJeat/hudo.git
   cd hudo
   ```

2. Install dependencies:
   ```sh
   bun install
   ```

3. Set up environment variables:
   - Copy the `.env.local.example` file to `.env.local`
   - Fill in the required environment variables in `.env.local` with your Firebase configuration:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. Set up Firebase:
   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore in your Firebase project
   - Add a web app to your Firebase project and copy the configuration
   - The Firebase configuration is automatically loaded from the environment variables in `src/lib/firebase.ts`

## Running the Application

1. Start the development server:
   ```sh
   bun run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/SuuSoJeat/hudo/tree/main)

## Firestore Data Schema

Our Firestore database is structured as follows:

### Todos Collection

- Document ID: Auto-generated
- Fields:
  - `title`: string
  - `description`: string (optional)
  - `status`: string (enum: 'completed' or 'incomplete')

## Testing

To run the tests:

```sh
bun run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
