# Deployment Instructions for Anxiety Tracker

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `anxiety-tracker` (or your preferred name)
   - **Description**: "Stillpoint - Anxiety tracking web application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you setup instructions. Run these commands in your terminal:

```bash
cd "/Users/joshua/joshuahaynes@gmail.com/Manual Library/Unicorn.Land/anxiety-tracker"

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/anxiety-tracker.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Note**: If your repository name is different from `anxiety-tracker`, make sure to:
1. Update the `base` path in `vite.config.ts` to match your repository name
2. Use your repository name in the remote URL above

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** (top menu bar)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch**: `main` (or `master` if that's your branch name)
   - **Folder**: `/ (root)` or `/docs` if you prefer
5. Click **"Save"**

## Step 4: Configure GitHub Actions for Automatic Deployment

Since this is a Vite app, you'll need to build it before deploying. Create a GitHub Actions workflow:

1. In your repository, click **"Actions"** tab
2. Click **"New workflow"**
3. Click **"set up a workflow yourself"**
4. Name the file: `deploy.yml`
5. Replace the content with:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or 'master' if that's your default branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

6. Click **"Start commit"** → **"Commit new file"**

## Step 5: Update GitHub Pages Settings

After creating the workflow:

1. Go back to **Settings** → **Pages**
2. Under **"Source"**, change it to:
   - **Source**: `GitHub Actions`
3. Click **"Save"**

## Step 6: Access Your Deployed Site

After the GitHub Actions workflow completes (usually takes 1-2 minutes):

1. Go to **Settings** → **Pages**
2. You'll see your site URL at the top: `https://YOUR_USERNAME.github.io/anxiety-tracker/`
3. Click the link to visit your deployed app!

**Note**: It may take a few minutes for the first deployment to complete. You can check the progress in the **"Actions"** tab.

## Troubleshooting

### If assets don't load correctly:
- Make sure `vite.config.ts` has `base: '/anxiety-tracker/'` (or your repo name)
- Rebuild and push: `npm run build && git add dist && git commit -m "Update build" && git push`

### If the site shows 404:
- Check that GitHub Pages is enabled in Settings → Pages
- Verify the source is set to "GitHub Actions" (not "Deploy from a branch")
- Wait a few minutes for the deployment to complete

### To update the site:
Simply push new changes to your main branch:
```bash
git add .
git commit -m "Your commit message"
git push
```
GitHub Actions will automatically rebuild and redeploy!

## Manual Deployment (Alternative)

If you prefer not to use GitHub Actions, you can deploy manually:

1. Build the app locally:
   ```bash
   npm run build
   ```

2. Create a `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   git rm -rf .
   git commit -m "Remove source files"
   ```

3. Copy dist contents to root:
   ```bash
   cp -r dist/* .
   git add .
   git commit -m "Deploy v1.0.1"
   git push origin gh-pages
   ```

4. In GitHub Settings → Pages, set source to `gh-pages` branch

Then switch back to main:
```bash
git checkout main
```
