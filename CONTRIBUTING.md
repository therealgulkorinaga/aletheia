# Contributing to Aletheia

## Git Workflow

We use a **dev → main** branch strategy:

### Branch Structure
- **`main`** — Production-ready code, stable releases
- **`dev`** — Active development, integration branch

### Development Flow

1. **Clone the repository**
   ```bash
   git clone https://github.com/therealgulkorinaga/aletheia.git
   cd aletheia
   ```

2. **Work on dev branch**
   ```bash
   git checkout dev
   git pull origin dev
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

4. **Push to dev**
   ```bash
   # Use system git to avoid curl issues on macOS
   /usr/bin/git push origin dev
   ```

5. **Merge dev → main (when ready for release)**
   ```bash
   git checkout main
   git merge dev
   /usr/bin/git push origin main
   ```

### macOS Git Issue Workaround

If you see `Symbol not found: _curl_global_trace` error, use the system git:

```bash
/usr/bin/git push origin <branch>
```

This uses macOS system git instead of Homebrew git, avoiding curl compatibility issues.

## Code Standards

- **TypeScript**: All new code must be TypeScript
- **Components**: Use shadcn/ui components where possible
- **Styling**: Tailwind CSS only, no custom CSS files
- **Testing**: Test your changes with both demo and enterprise seed data
- **Documentation**: Update relevant .md files when adding features

## Running Locally

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Commit Message Format

```
<type>: <short description>

<detailed description if needed>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

**Questions?** Open an issue on GitHub.
