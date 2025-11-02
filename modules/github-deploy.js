/**
 * GitHub Pages Deployment Module
 * Deploys Reveal.js presentations to user's GitHub Pages
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

/**
 * Deploy presentation to GitHub Pages
 * @param {string} username - GitHub username
 * @param {string} token - GitHub Personal Access Token
 * @param {string} repoName - Repository name
 * @param {string} distPath - Path to built presentation
 * @returns {Object} - Deployment result with URL
 */
async function deployToGitHubPages(username, token, repoName, distPath) {
  console.log(`🚀 Deploying to GitHub Pages...`);
  console.log(`   User: ${username}`);
  console.log(`   Repo: ${repoName}`);

  const octokit = new Octokit({ auth: token });

  try {
    // Step 1: Create or update repository
    await createOrUpdateRepo(octokit, username, repoName);

    // Step 2: Upload files to gh-pages branch
    await uploadFiles(octokit, username, repoName, distPath);

    // Step 3: Enable GitHub Pages
    await enableGitHubPages(octokit, username, repoName);

    const url = `https://${username}.github.io/${repoName}`;
    console.log(`✅ Deployed successfully to: ${url}`);

    return {
      success: true,
      url,
      username,
      repoName,
      branch: 'gh-pages'
    };

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw new Error(`GitHub deployment failed: ${error.message}`);
  }
}

/**
 * Create repository or verify it exists
 */
async function createOrUpdateRepo(octokit, username, repoName) {
  try {
    // Try to get existing repo
    await octokit.repos.get({
      owner: username,
      repo: repoName
    });

    console.log(`✓ Repository ${repoName} exists`);
    return { created: false, repoName };

  } catch (error) {
    if (error.status === 404) {
      // Create new repo
      console.log(`📦 Creating repository: ${repoName}...`);

      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'AI-generated presentation created with AI Slides Generator',
        auto_init: true,
        private: false
      });

      console.log(`✨ Created repository: ${repoName}`);

      // Wait a bit for repo to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      return { created: true, repoName };
    }

    throw error;
  }
}

/**
 * Upload all files from dist directory to gh-pages branch
 */
async function uploadFiles(octokit, username, repoName, distPath) {
  console.log(`📤 Uploading files to gh-pages branch...`);

  // Read all files recursively
  const files = await readDirRecursive(distPath);
  console.log(`   Found ${files.length} files to upload`);

  // Ensure gh-pages branch exists
  await ensureGhPagesBranch(octokit, username, repoName);

  // Upload each file
  for (const file of files) {
    const content = await fs.readFile(file.absolutePath);
    const base64Content = content.toString('base64');

    try {
      // Try to get existing file SHA
      let sha;
      try {
        const { data } = await octokit.repos.getContent({
          owner: username,
          repo: repoName,
          path: file.relativePath,
          ref: 'gh-pages'
        });
        sha = data.sha;
      } catch (error) {
        // File doesn't exist yet, that's okay
        sha = null;
      }

      // Create or update file
      await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: repoName,
        path: file.relativePath,
        message: sha ? `Update ${file.relativePath}` : `Add ${file.relativePath}`,
        content: base64Content,
        branch: 'gh-pages',
        ...(sha && { sha })
      });

      console.log(`  ✓ ${file.relativePath}`);

    } catch (error) {
      console.warn(`  ⚠️  Error uploading ${file.relativePath}:`, error.message);
    }
  }

  console.log(`✅ All files uploaded`);
}

/**
 * Ensure gh-pages branch exists
 */
async function ensureGhPagesBranch(octokit, username, repoName) {
  try {
    // Check if branch exists
    await octokit.repos.getBranch({
      owner: username,
      repo: repoName,
      branch: 'gh-pages'
    });

    console.log(`✓ gh-pages branch exists`);

  } catch (error) {
    if (error.status === 404) {
      console.log(`📝 Creating gh-pages branch...`);

      // Get default branch reference
      const { data: repo } = await octokit.repos.get({
        owner: username,
        repo: repoName
      });

      const { data: ref } = await octokit.git.getRef({
        owner: username,
        repo: repoName,
        ref: `heads/${repo.default_branch}`
      });

      // Create gh-pages branch from default branch
      await octokit.git.createRef({
        owner: username,
        repo: repoName,
        ref: 'refs/heads/gh-pages',
        sha: ref.object.sha
      });

      console.log(`✨ Created gh-pages branch`);
    } else {
      throw error;
    }
  }
}

/**
 * Enable GitHub Pages on the repository
 */
async function enableGitHubPages(octokit, username, repoName) {
  try {
    await octokit.repos.createPagesSite({
      owner: username,
      repo: repoName,
      source: {
        branch: 'gh-pages',
        path: '/'
      }
    });

    console.log(`✓ GitHub Pages enabled`);

  } catch (error) {
    // Pages might already be enabled
    if (error.status === 409 || error.status === 422) {
      console.log(`✓ GitHub Pages already enabled`);
    } else {
      console.warn(`⚠️  Could not enable GitHub Pages:`, error.message);
    }
  }
}

/**
 * Read directory recursively
 */
async function readDirRecursive(dir, baseDir = dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const absolutePath = path.join(dir, item.name);

    if (item.isDirectory()) {
      const subFiles = await readDirRecursive(absolutePath, baseDir);
      files.push(...subFiles);
    } else {
      files.push({
        absolutePath,
        relativePath: path.relative(baseDir, absolutePath)
      });
    }
  }

  return files;
}

/**
 * Validate GitHub credentials
 */
async function validateGitHubCredentials(username, token) {
  const octokit = new Octokit({ auth: token });

  try {
    const { data } = await octokit.users.getAuthenticated();

    if (data.login.toLowerCase() !== username.toLowerCase()) {
      throw new Error(`Token belongs to ${data.login}, not ${username}`);
    }

    return {
      valid: true,
      username: data.login,
      name: data.name,
      publicRepos: data.public_repos
    };

  } catch (error) {
    throw new Error(`Invalid GitHub credentials: ${error.message}`);
  }
}

/**
 * Get authenticated user info
 */
async function getAuthenticatedUser(token) {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.users.getAuthenticated();
  return data.login;
}

module.exports = {
  deployToGitHubPages,
  validateGitHubCredentials,
  getAuthenticatedUser
};
