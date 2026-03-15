# UI Components — Agent Rules

## shadcn/ui Only

All UI elements in this app **must** use [shadcn/ui](https://ui.shadcn.com) components. Do not create custom low-level components (buttons, dialogs, inputs, cards, etc.) when a shadcn/ui primitive exists.

## Adding Components

Add new shadcn/ui components via the CLI:

```bash
npx shadcn@latest add <component>
```

Components are installed into `components/ui/` and can be imported with the `@/components/ui` alias.

## Configuration

- **Style:** `radix-nova`
- **Icon library:** `lucide`
- **RSC support:** enabled — components work in server components by default. Add `"use client"` only when the component needs browser interactivity (event handlers, hooks, etc.).
- **Tailwind CSS v4** with CSS variables for theming.

## Guidelines

- Use the `cn()` helper from `@/lib/utils` to merge class names.
- Compose pages from shadcn/ui primitives. If a needed component is not yet installed, add it with the CLI before use.
- Do not wrap shadcn/ui components in unnecessary abstraction layers. Import and use them directly.
- Do not install alternative component libraries (e.g., Material UI, Chakra, Ant Design).
- Style overrides should use Tailwind utility classes or CSS variables, not inline styles or separate CSS modules.
