# Twitter Mock Full Stack App

## Overview
- This project is a small-scale Twitter mock, designed and developed as a full-stack application. It enables users to sign up, log in, create posts, like and comment on posts, create communities, and perform various other actions typical of a social media platform.

## Technologies Used
- **Frontend**:
  - Next.js 14
  - TypeScript
  - Redux Toolkit
  - Sass
  - Moment.js
- **Backend**:
  - Express.js
  - Mongoose
  - bcrypt
  - express-session
  - cors
  - cookie-parser
  - passport.js
  - Joi (for validations)
  - dotenv (for environment variables)

## Features
- **User Authentication**:
  - Users can sign up and log in securely using bcrypt for password hashing.
  - express-session and Passport.js are employed for authentication and session management.

- **Posting and Interaction**:
  - Users can create posts, like, and comment on other posts.
  - The application supports complex interactions such as creating and joining communities.
  - Community admins have additional privileges like editing community details, removing users, and managing posts within the community.

- **Responsive Design**:
  - The web app is fully responsive, providing a seamless experience across devices.
  - It offers theme options with the ability to switch between dark and light themes.

- **Profile Pages**:
  - Each user has a profile page showcasing their posts, comments, likes, followers, and followings.
  - Hovering over user avatars displays a modal with additional user information.

- **Additional Actions**:
  - Admins may encounter additional buttons allowing actions such as deleting others posts, deleting others accounts, and other administrative tasks.
  - If a guest user attempts to perform actions requiring authentication, a modal prompting them to log in or sign up will appear.

- **Search Functionality**:
  - The search page enables users to search for users, communities, comments, and posts.

## Backend Implementation Details
- **Mongoose and Aggregation**:
  - Mongoose is used for MongoDB object modeling, providing a schema-based solution to model application data.
  - Complex aggregation pipelines are employed to fetch and construct data objects sent to the client.

## Usage
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables using a `.env` file.
4. Run the server using `npm start`.
5. Access the application through your browser.


## .env.local

  MONGODB_URI=mongodb://localhost:27017/social-media

  NEXT_PUBLIC_GITHUB_CLIENT_ID=f0dba04b3ba423579339
  NEXT_PUBLIC_GITHUB_CLIENT_SECRET=0877badedecf042c2ed8e3e10d4cc6365f3508f5
  NEXT_PUBLIC_GITHUB_CLIENT_SECRET=http://localhost:4000/auth/github/callback
  
  GOOGLE_CLIENT_ID=433814194215-cqism8qqj6p8fj74v1bj56ft25qt6r0n.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=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
  NEXT_PUBLIC_GOOGLE_CALLBACK_URI=http://localhost:3000/auth/google/callback

  NEXT_PUBLIC_SERVER_URL=http://localhost:4000
