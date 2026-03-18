---
description: Read this file before implementing or modifying any authentication-related code in the project. It defines the rules and best practices for using Clerk as the auth provider.
---

# LLM Auth Guide

## Auth Provider

Clerk is the **only** auth provider. Do not introduce any other authentication method, custom login flow, or third-party auth library.

## Route Protection

- `/dashboard` is a protected route. Require a signed-in user before rendering any content.If a not signed user trying to go to `/dashboard`, redirect them to the homepage. Use Clerk middleware to enforce this.
- If a signed-in user visits the homepage (`/`), redirect them to `/dashboard`.

## Sign In & Sign Up

- Always use Clerk's **modal** mode for sign-in and sign-up. Never redirect users to a separate `/sign-in` or `/sign-up` page.
- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` (or equivalent Clerk components) to trigger auth modals.

## Server-Side Auth

- Use Clerk server helpers (`auth()`, `currentUser()`) for server-side auth checks in server components, server actions, and route handlers.
- Gate data mutations and reads behind `auth()` — do not rely solely on client-side checks.

## Client-Side Auth

- Use Clerk hooks (`useUser`, `useAuth`) and UI components only in client components that require interactive auth state.
- Prefer server-side auth when possible.

## General Rules

- Do not store or manage passwords, tokens, or sessions outside of Clerk.
- Do not expose Clerk secret keys to the client. Only `NEXT_PUBLIC_CLERK_*` vars are safe for client use.
