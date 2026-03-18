---
description: Read the file to understand how to fetch data in the project.
applyTo: **/*.js, **/*.ts, **/*.jsx, **/*.tsx
---

# Data Fetching Instructions

This document outlines the best practices and guidelines for fetching data in our project. It covers various methods and tools that can be used to retrieve data from APIs, databases, or other sources.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS use Server Components for data fetching. NEVER use Client Components to fetch data. This allows you to fetch data on the server side, which can improve performance and reduce the amount of JavaScript sent to the client.

## 2. Data Fetching Methods

ALWAYS use the helper functions in /data directory to fetch data. NEVER fetch directly in the components.

ALL helper functions in the /data directory should use drizzle ORM to fetch data from the database. This ensures consistency and maintainability across the codebase.
