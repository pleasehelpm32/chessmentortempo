#!/bin/bash

# Install dependencies
npm install

# Create a .env.production file with the necessary variables
echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env.production
echo "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" >> .env.production

# Build the project ignoring TypeScript errors
npm run build-no-errors
