document.addEventListener('DOMContentLoaded', () => {
    // Fetches the JSON data from 'resume-data.json'
    fetch('./assets/data/resume-data.json')
        .then(response => {
            // Checks if the response was successful (status code 200-299)
            if (!response.ok) {
                // If not successful, throws an error with the status
                throw new Error(`HTTP error! Status: ${response.status} - Could not load resume-data.json`);
            }
            // Parses the JSON body of the response
            return response.json();
        })
        .then(data => {
            // If data is successfully fetched and parsed, call populateResume function
            populateResume(data);
        })
        .catch(error => {
            // Catches any errors during the fetch or JSON parsing and logs them
            console.error('Error loading resume data:', error);
            // Display a user-friendly message on the page if data fails to load
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="text-align: center; padding: 50px; background-color: #ffe0e0; border: 1px solid #ff0000; border-radius: 8px; color: #ff0000; margin: 20px;">
                        <h2 style="margin-bottom: 15px;">Failed to load resume data! 😔</h2>
                        <p style="font-size: 1.1em;">Please check your file paths and JSON syntax.</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">Error details: ${error.message}</p>
                    </div>
                `;
            }
        });
});

/**
 * Populates the HTML elements with data from the resumeData object.
 * @param {object} resumeData - The JSON object containing all resume information.
 */
function populateResume(resumeData) {
    // Destructures the main sections from the resumeData for easier access
    const { basics, contactInfo, socials, services, testimonials, clients, education, experience, skills, portfolio, blogPosts, achievements } = resumeData;

    // --- Populate Basic Info (Sidebar) ---
    const resumeName = document.getElementById('resume-name');
    if (resumeName) {
        resumeName.textContent = basics.name;
        resumeName.setAttribute('title', basics.name);
    }

    const resumeLabel = document.getElementById('resume-label');
    if (resumeLabel) {
        resumeLabel.textContent = basics.label;
    }

    const resumeAvatar = document.getElementById('resume-avatar');
    if (resumeAvatar) {
        resumeAvatar.src = basics.image;
        resumeAvatar.alt = basics.name;
    }

    // --- Populate About section text ---
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
        aboutSection.innerHTML = basics.about.map(p => `<p>${p}</p>`).join('');
    }

    // --- Populate Contact List (Sidebar) ---
    const contactsList = document.getElementById('contacts-list');
    if (contactsList) {
        contactsList.innerHTML = contactInfo.map(contact => {
            let linkHtml = `<p class="contact-title">${contact.title}</p>`;
            if (contact.link) {
                linkHtml += `<a href="${contact.link}" class="contact-link">${contact.value}</a>`;
            } else if (contact.title === 'Birthday' && contact.value) {
                // Formats birthday for <time> element's datetime attribute
                const dateParts = contact.value.split(', '); // "June 23, 1982" -> ["June 23", "1982"]
                const year = dateParts[1];
                const monthDay = dateParts[0];
                const monthMap = {
                    'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
                    'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
                };
                const month = monthMap[monthDay.split(' ')[0]];
                const day = monthDay.split(' ')[1];
                const datetimeValue = `${year}-${month}-${day}`;
                linkHtml += `<time datetime="${datetimeValue}">${contact.value}</time>`;
            } else {
                linkHtml += `<address>${contact.value}</address>`;
            }
            return `
                <li class="contact-item">
                    <div class="icon-box">
                        <ion-icon name="${contact.icon}"></ion-icon>
                    </div>
                    <div class="contact-info">
                        ${linkHtml}
                    </div>
                </li>
            `;
        }).join('');
    }

    // --- Populate Social List (Sidebar) ---
    const socialList = document.getElementById('social-list');
    if (socialList) {
        socialList.innerHTML = socials.map(social => `
            <li class="social-item">
                <a href="${social.url}" class="social-link">
                    <ion-icon name="${social.icon}"></ion-icon>
                </a>
            </li>
        `).join('');
    }

    // --- Populate Services Section ---
    const serviceList = document.getElementById('service-list');
    if (serviceList) {
        serviceList.innerHTML = services.map(service => `
            <li class="service-item">
                <div class="service-icon-box">
                    <img src="${service.icon}" alt="${service.title} icon" width="40">
                </div>
                <div class="service-content-box">
                    <h4 class="h4 service-item-title">${service.title}</h4>
                    <p class="service-item-text">${service.description}</p>
                </div>
            </li>
        `).join('');
    }

    // --- Populate Testimonials Section ---
    const testimonialsList = document.getElementById('testimonials-list');
    if (testimonialsList) {
        if (testimonials && testimonials.length > 0) {
            testimonialsList.innerHTML = testimonials.map(testimonial => `
                <li class="testimonials-item">
                    <div class="content-card" data-testimonials-item>
                        <figure class="testimonials-avatar-box">
                            <img src="${testimonial.avatar}" alt="${testimonial.name}" width="60" data-testimonials-avatar>
                        </figure>
                        <h4 class="h4 testimonials-item-title" data-testimonials-title>${testimonial.name}</h4>
                        <div class="testimonials-text" data-testimonials-text>
                            <p>${testimonial.quote || testimonial.text || 'A great collaborator.'}</p>
                        </div>
                    </div>
                </li>
            `).join('');
        } else {
            // Placeholder for no testimonials
            testimonialsList.innerHTML = `
                <li class="testimonials-item">
                    <div class="content-card">
                        <p class="text-gray-500">Testimonials will be added soon!</p>
                    </div>
                </li>
            `;
        }
    }


    // --- Populate Clients Section ---
    const clientsList = document.getElementById('clients-list');
    if (clientsList) {
        if (clients && clients.length > 0) {
            clientsList.innerHTML = clients.map(client => `
                <li class="clients-item">
                    <a href="#">
                        <img src="${client.logo}" alt="${client.alt || client.name || 'Client logo'}">
                    </a>
                </li>
            `).join('');
        } else {
            // Placeholder for no clients
            clientsList.innerHTML = `
                <li class="clients-item">
                    <div class="p-4 bg-white rounded-lg shadow-sm text-gray-500 text-center">Clients will be updated soon!</div>
                </li>
            `;
        }
    }


    // --- Populate Education Section ---
    const educationList = document.getElementById('education-list');
    if (educationList) {
        educationList.innerHTML = education.map(edu => `
            <li class="timeline-item">
                <h4 class="h4 timeline-item-title">${edu.title}</h4>
                <span>${edu.dates}</span>
                <p class="timeline-text">${edu.description}</p>
            </li>
        `).join('');
    }

    // --- Populate Experience Section ---
    const experienceList = document.getElementById('experience-list');
    if (experienceList) {
        experienceList.innerHTML = experience.map(exp => `
            <li class="timeline-item">
                <h4 class="h4 timeline-item-title">${exp.title}</h4>
                <span>${exp.dates}</span>
                <p class="timeline-text">${exp.description}</p>
            </li>
        `).join('');
    }

    // --- Populate Achievements Section (NEW) ---
    const achievementsList = document.getElementById('achievements-list');
    if (achievementsList && achievements) {
        achievementsList.innerHTML = achievements.map(achievement => `
            <li class="timeline-item">
                <h4 class="h4 timeline-item-title">${achievement.title}</h4>
                <p class="timeline-text">${achievement.description}</p>
            </li>
        `).join('');
    }

    // --- Populate Skills Section ---
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        skillsList.innerHTML = skills.map(skill => `
            <li class="skills-item">
                <div class="title-wrapper">
                    <h5 class="h5">${skill.title}</h5>
                    <data value="${skill.percentage}">${skill.percentage}%</data>
                </div>
                <div class="skill-progress-bg">
                    <div class="skill-progress-fill" style="width: ${skill.percentage}%;"></div>
                </div>
            </li>
        `).join('');
    }

    // --- Populate Portfolio Section ---
    const portfolioList = document.getElementById('portfolio-list');
    if (portfolioList) {
        portfolioList.innerHTML = portfolio.map(item => {
            const category = item.category || 'development';
            const title = item.name || item.title || 'Project';
            const img = item.image || './images/project-1.jpg';
            return `
                <li class="project-item active" data-filter-item data-category="${category}">
                    <a href="${item.url && item.url !== 'Updated Soon' ? item.url : '#'}" ${item.url && item.url !== 'Updated Soon' ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                        <figure class="project-img">
                            <div class="project-item-icon-box">
                                <ion-icon name="eye-outline"></ion-icon>
                            </div>
                            <img src="${img}" alt="${title}" loading="lazy">
                        </figure>
                        <h3 class="project-title">${title}</h3>
                        <p class="project-category">${category.charAt(0).toUpperCase() + category.slice(1)}</p>
                    </a>
                </li>
            `;
        }).join('');
    }

    // --- Populate Blog Posts Section ---
    const blogList = document.getElementById('blog-list');
    if (blogList) {
        if (blogPosts && blogPosts.length > 0) {
            blogList.innerHTML = blogPosts.map(post => {
                // Format date for display (e.g., "Feb 23, 2022")
                const postDate = new Date(post.date);
                const formattedDate = postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(',', '');

                const category = post.category || 'tech';
                const alt = post.alt || post.title || 'Blog Post';
                const text = post.text || post.description || 'Read more about it...';

                return `
                    <li class="blog-post-item">
                        <a href="#">
                            <figure class="blog-banner-box">
                                <img src="${post.image}" alt="${alt}" loading="lazy">
                            </figure>
                            <div class="blog-content">
                                <div class="blog-meta">
                                    <p class="blog-category">${category}</p>
                                    <span class="dot"></span>
                                    <time datetime="${post.date}">${formattedDate}</time>
                                </div>
                                <h3 class="h3 blog-item-title">${post.title}</h3>
                                <p class="blog-text">${text}</p>
                            </div>
                        </a>
                    </li>
                `;
            }).join('');
        } else {
            // Placeholder for no blog posts
            blogList.innerHTML = `
                <li class="blog-post-item">
                    <div class="p-4 bg-white rounded-lg shadow-sm text-gray-500 text-center">Blog posts will be updated soon!</div>
                </li>
            `;
        }
    }
}
