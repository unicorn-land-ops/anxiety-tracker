# Troubleshooting GitHub Pages 404 Error

If you're seeing a 404 error at `https://unicorn-land-ops.github.io/anxiety-tracker/`, follow these steps:

## Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/unicorn-land-ops/anxiety-tracker
2. Click **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **"Build and deployment"**:
   - **Source**: Select **"GitHub Actions"** (NOT "Deploy from a branch")
   - Click **Save**

## Step 2: Enable Pages Permissions (if needed)

If GitHub Pages still doesn't work, you may need to enable Pages permissions:

1. Go to **Settings** → **Actions** → **General**
2. Scroll down to **"Workflow permissions"**
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"** (optional)
5. Click **Save**

## Step 3: Check GitHub Actions Workflow

1. Go to the **Actions** tab in your repository
2. Check if the workflow "Deploy to GitHub Pages" has run
3. If it hasn't run:
   - Click on **"Deploy to GitHub Pages"** workflow
   - Click **"Run workflow"** button (top right)
   - Select branch: **main**
   - Click **"Run workflow"**
4. If it has run but failed:
   - Click on the failed run
   - Check the error messages
   - Common issues:
     - Build errors (check the "Build" step)
     - Permission errors (see Step 2 above)

## Step 4: Verify Deployment Status

1. Go to **Settings** → **Pages**
2. You should see:
   - **"Your site is live at..."** message with the URL
   - Recent deployment activity
   - If you see "No deployments yet", the workflow hasn't completed successfully

## Step 5: Wait for Deployment

- After enabling GitHub Pages and running the workflow, wait 1-2 minutes
- The site URL will be: `https://unicorn-land-ops.github.io/anxiety-tracker/`
- You can check deployment status in **Settings** → **Pages**

## Common Issues and Solutions

### Issue: "No deployments yet"
**Solution**: The workflow hasn't run or completed. Manually trigger it (Step 3).

### Issue: Workflow fails with permission errors
**Solution**: Enable Pages permissions (Step 2).

### Issue: Workflow succeeds but site still shows 404
**Solution**: 
- Verify the base path in `vite.config.ts` matches your repository name (`/anxiety-tracker/`)
- Clear your browser cache
- Wait a few more minutes for DNS propagation

### Issue: Assets (CSS/JS) don't load
**Solution**: The base path in `vite.config.ts` must match your repository name exactly.

## Manual Workflow Trigger

If you need to manually trigger a deployment:

1. Go to **Actions** tab
2. Click **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** dropdown (top right)
4. Select branch: **main**
5. Click green **"Run workflow"** button

## Verify Configuration

Make sure these files are correct:

- `vite.config.ts` should have: `base: '/anxiety-tracker/'`
- `.github/workflows/deploy.yml` should exist and be committed
- `package.json` should have build script: `"build": "tsc && vite build"`

## Still Having Issues?

If none of the above works:

1. Check the Actions tab for error messages
2. Verify you have admin access to the repository
3. Try pushing a small change to trigger the workflow:
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push
   ```
