# Contributing to Emirates Sport Club

Thank you for your interest in contributing to Emirates Sport Club! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you are expected to uphold a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with the following information:

- A clear and descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Any relevant error messages

### Suggesting Features

We welcome feature suggestions! Please open an issue with:

- A clear description of the feature
- The problem it would solve
- Any examples or mockups (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the existing code style
   - Write clear commit messages
   - Add comments for complex logic
   - Ensure TypeScript types are correct

3. **Test your changes**:
   ```bash
   npm run check
   npm run dev
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "Add: description of your changes"
   ```
   
   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes
   - `Style:` for styling changes

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Provide a clear description of your changes
   - Reference any related issues
   - Add screenshots for UI changes

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow Svelte best practices
- Use Tailwind CSS utility classes
- Keep components modular and reusable
- Write self-documenting code

### File Naming

- Components: `PascalCase.svelte` (e.g., `VideoCard.svelte`)
- Utilities: `camelCase.ts` (e.g., `gsap.ts`)
- Stores: `camelCase.ts` (e.g., `preloader.ts`)

### Component Structure

```svelte
<script lang="ts">
  // Imports
  // Types/Interfaces
  // State variables
  // Functions
  // Lifecycle hooks
</script>

<!-- Template -->
```

### Testing

Before submitting a PR, ensure:

- [ ] Code passes TypeScript checks (`npm run check`)
- [ ] No console errors in development
- [ ] Responsive design works on mobile and desktop
- [ ] Animations work smoothly
- [ ] No accessibility issues

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   ├── stores/         # Svelte stores
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
└── routes/             # Page routes
```

## Getting Help

If you have questions or need help:

1. Check existing issues and discussions
2. Open a new issue with the `question` label
3. Provide as much context as possible

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Emirates Sport Club! 🎉

