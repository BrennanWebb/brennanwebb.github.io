document.addEventListener('DOMContentLoaded', () => {
    // Set the current year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // GitHub API configuration
    const GITHUB_USERNAME = 'BrennanWebb';
    const REPO_COUNT_LIMIT = 9;
    const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPO_COUNT_LIMIT}`;

    // --- NEW: List of repositories to exclude ---
    // Add the exact name of any repositories you want to hide here.
    const excludeRepos = ['Python', 'learnGit','brennanwebb.github.io'];

    const projectGrid = document.getElementById('project-grid');

    async function fetchGitHubRepos() {
        if (!projectGrid) {
            console.error('Project grid element not found.');
            return;
        }

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`GitHub API returned a ${response.status} status.`);
            }
            const repos = await response.json();

            // --- NEW: Filter the repositories ---
            const filteredRepos = repos.filter(repo => !excludeRepos.includes(repo.name));

            // Clear the "Loading..." message
            projectGrid.innerHTML = '';

            if (filteredRepos.length === 0) {
                projectGrid.innerHTML = '<p>No public repositories to display.</p>';
                return;
            }

            // Create and append a card for each *filtered* repository
            filteredRepos.forEach(repo => {
                const card = document.createElement('a');
                card.href = repo.html_url;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.className = 'project-card';

                const description = repo.description || 'No description provided.';
                const language = repo.language ? `<span class="language">${repo.language}</span>` : '';

                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${description}</p>
                    ${language}
                `;
                projectGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Failed to fetch GitHub repositories:', error);
            projectGrid.innerHTML = '<p>Could not load projects. Please try again later.</p>';
        }
    }

    fetchGitHubRepos();
});