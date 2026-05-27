document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars if they are in view
                if (entry.target.classList.contains('skills-container')) {
                    const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    
    // ScrollSpy and Smooth Scrolling for Active Theme
    const isHuman = document.getElementById('human-theme-root') && document.getElementById('human-theme-root').style.display !== 'none';
    const activeRoot = isHuman ? document.getElementById('human-theme-root') : document.getElementById('ai-theme-root');
    
    if (activeRoot) {
        const sections = activeRoot.querySelectorAll('section[id]');
        const navLinks = activeRoot.querySelectorAll('nav a[href^="#"]');

        // Smooth Scrolling
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                // Allow normal links to work, only smooth scroll hashes
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        e.preventDefault();
                        const offsetTop = targetSection.offsetTop - 70; // Adjust for navbar
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // ScrollSpy
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.parentElement && link.parentElement.classList.contains('nav-item')) {
                    link.parentElement.classList.remove('active');
                }
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    if (link.parentElement && link.parentElement.classList.contains('nav-item')) {
                        link.parentElement.classList.add('active');
                    }
                }
            });
        });
    }

    
    // Theme Toggle Logic for Both Themes
    const themeToggles = document.querySelectorAll('.dark-mode-toggle');
    const rootElement = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('dark-mode');

    function applyDarkMode(isDark) {
        if (isDark) {
            rootElement.classList.add('dark-theme');
            rootElement.classList.remove('light-theme');
            themeToggles.forEach(btn => {
                const icon = btn.querySelector('i');
                if(icon) {
                    if (icon.classList.contains('fas') || icon.classList.contains('fa-moon')) {
                        icon.className = 'fas fa-sun';
                    } else {
                        icon.className = 'fa fa-sun-o';
                    }
                }
            });
            localStorage.setItem('dark-mode', 'dark');
        } else {
            rootElement.classList.add('light-theme');
            rootElement.classList.remove('dark-theme');
            themeToggles.forEach(btn => {
                const icon = btn.querySelector('i');
                if(icon) {
                    if (icon.classList.contains('fas') || icon.classList.contains('fa-sun')) {
                        icon.className = 'fas fa-moon';
                    } else {
                        icon.className = 'fa fa-moon-o';
                    }
                }
            });
            localStorage.setItem('dark-mode', 'light');
        }
    }

    if (savedDarkMode === 'dark' || (!savedDarkMode && systemPrefersDark)) {
        applyDarkMode(true);
    } else {
        applyDarkMode(false);
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isCurrentlyDark = rootElement.classList.contains('dark-theme');
            applyDarkMode(!isCurrentlyDark);
        });
    });

    // Custom Theme Dropdown Logic
    const themeDropdownBtns = document.querySelectorAll('.theme-dropdown-btn');
    themeDropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = btn.nextElementSibling;
            document.querySelectorAll('.theme-dropdown-content').forEach(c => {
                if(c !== content) c.style.display = 'none';
            });
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.theme-dropdown-content').forEach(c => c.style.display = 'none');
    });

    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const theme = e.currentTarget.getAttribute('data-theme');
            localStorage.setItem('portfolio-theme', theme);
            window.location.reload();
        });
    });


    
    // 2. Fetch GitHub Projects
    const aiProjectsGrid = document.getElementById('projects-grid');
    const humanProjectsGrid = document.getElementById('human-projects-grid');
    const githubUsername = 'Shreyas-Ashtamkar';

    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=20`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const repos = await response.json();
            
            if (aiProjectsGrid) aiProjectsGrid.innerHTML = '';
            if (humanProjectsGrid) humanProjectsGrid.innerHTML = '';
            
            const excludedRepos = ['bijlee-chat', 'Bits-HD-Study-Material', 'ledger-waddle', 'Shreyas-Ashtamkar.github.io', 'Shreyas-Ashtamkar'];
            const filteredRepos = repos
                .filter(repo => !excludedRepos.includes(repo.name) && repo.stargazers_count > 0)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 6);
            
            filteredRepos.forEach((repo, index) => {
                const tags = repo.topics && repo.topics.length > 0 
                    ? repo.topics.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('')
                    : `<span class="project-tag">${repo.language || 'Project'}</span>`;

                // Add to AI grid
                if (aiProjectsGrid) {
                    const card = document.createElement('a');
                    card.href = repo.html_url;
                    card.target = '_blank';
                    card.className = 'glass project-card animate-on-scroll';
                    card.style.transitionDelay = `${index * 0.1}s`;
                    
                    card.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available.'}</p>
                        <div class="project-meta">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <div class="project-tags">${tags}</div>
                        </div>
                    `;
                    aiProjectsGrid.appendChild(card);
                    observer.observe(card);
                }

                // Add to Human grid
                if (humanProjectsGrid) {
                    const card = document.createElement('div');
                    card.className = 'col-lg-4 col-md-6 mb-4';
                    card.innerHTML = `
                        <div class="card h-100 shadow-sm text-center" style="padding: 30px; border-radius: 8px; border: none;">
                            <div class="icon" style="font-size: 40px; margin-bottom: 20px;"><i class="fa fa-github" aria-hidden="true" style="color: #4fbfa8;"></i></div>
                            <h3 class="heading mb-3 text-400" style="color: #4fbfa8;">
                                <a href="${repo.html_url}" target="_blank" style="color: #4fbfa8; text-decoration: none;">${repo.name}</a>
                            </h3>
                            <p class="description text-justify" style="color: var(--text-secondary, #666);">${repo.description || 'No description available.'}</p>
                            <div style="margin-top: 15px;">
                                <span style="color: #888; font-size: 0.9em;"><i class="fa fa-star"></i> ${repo.stargazers_count}</span>
                            </div>
                        </div>
                    `;
                    humanProjectsGrid.appendChild(card);
                }
            });
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            if(aiProjectsGrid) aiProjectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Failed to load projects. Please visit my GitHub profile.</p>';
            if(humanProjectsGrid) humanProjectsGrid.innerHTML = '<p class="text-center w-100">Failed to load projects. Please visit my GitHub profile.</p>';
        }
    }

    fetchGitHubProjects();

});