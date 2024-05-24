#!/bin/bash

# Generate Prisma Client
npx prisma generate

# Migrate Prisma Schema
npx prisma migrate deploy --preview-feature

# Exit script with success
exit 0
