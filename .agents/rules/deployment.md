# Automatic Deployment Rule

After completing any change, edit, or bug fix:
1. Verify the project builds locally without errors:
   `cmd.exe /c "npm run build"`
2. Stage all changed files:
   `git add .`
3. Commit with a concise descriptive commit message:
   `git commit -m "<type>: <concise description>"`
4. Push to `origin main`:
   `git push origin main`
5. The push to `main` automatically triggers Vercel production deployment at `https://tarot-x-official.vercel.app`.
