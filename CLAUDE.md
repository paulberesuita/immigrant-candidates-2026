# Claude Code Guidelines

## Branch Rules

### For Brenda's Claude Code Session
- **ONLY commit changes to the `brenda` branch**
- Do NOT create new branches
- Do NOT push to `main` directly
- Do NOT merge branches without explicit permission from Paul

### Git Best Practices
- Keep commits small and focused
- Write clear commit messages
- Always pull before pushing to avoid conflicts
- Do NOT force push
- Do NOT rebase shared branches
- Do NOT create complex branch trees or nested branches

### Before Making Changes
1. Ensure you are on the correct branch (`brenda`)
2. Pull latest changes: `git pull`
3. Make your changes
4. Commit and push to the same branch

### Workflow
```bash
git checkout brenda
git pull
# make changes
git add .
git commit -m "description of changes"
git push
```
