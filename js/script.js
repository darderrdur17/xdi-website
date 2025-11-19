// Search functionality
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Show/hide clear button
if (searchInput) {
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearBtn.style.display = 'block';
            filterMenuItems(this.value);
        } else {
            clearBtn.style.display = 'none';
            showAllMenuItems();
        }
    });
}

// Clear search
if (clearBtn) {
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        showAllMenuItems();
        searchInput.focus();
    });
}

// Filter menu items based on search
function filterMenuItems(searchTerm) {
    const term = searchTerm.toLowerCase();
    dropdownItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Show all menu items
function showAllMenuItems() {
    dropdownItems.forEach(item => {
        item.style.display = 'flex';
    });
}

// Highlight active menu item on hover
dropdownItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        dropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
    
    item.addEventListener('mouseleave', function() {
        this.classList.remove('active');
    });
});

// Form submission handling for Page 3 (Contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const content = formData.get('content');
        
        // Store content in sessionStorage for next page
        if (content) {
            sessionStorage.setItem('contactContent', content);
        }
        
        // Navigate to details page
        window.location.href = 'details.html';
    });
}

// Form submission handling for Details page
const detailsForm = document.getElementById('detailsForm');
if (detailsForm) {
    detailsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        
        // Store data in sessionStorage
        sessionStorage.setItem('contactName', name);
        sessionStorage.setItem('contactEmail', email);
        
        // Navigate to success page
        window.location.href = 'success.html';
    });
    
    // Handle back navigation warning
    const backLinks = document.querySelectorAll('.details-back-link, .details-close-link');
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if ((nameInput && nameInput.value) || (emailInput && emailInput.value)) {
                const confirmed = confirm('Are you sure you want to go back? Your inquiries will be removed.');
                if (!confirmed) {
                    e.preventDefault();
                } else {
                    // Clear form data
                    sessionStorage.removeItem('contactContent');
                    sessionStorage.removeItem('contactName');
                    sessionStorage.removeItem('contactEmail');
                }
            }
        });
    });
}

// Load stored content on details page if available
window.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('details.html')) {
        const storedContent = sessionStorage.getItem('contactContent');
        if (storedContent) {
            // Content is already stored, form is ready for name/email
        }
    }
});

function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    if (form) {
        const successHTML = `
            <div class="success-message">
                <h2>Thank You!</h2>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                <a href="index.html" class="back-button" style="margin-top: 1.5rem; display: inline-block;">Back to Home</a>
            </div>
        `;
        form.innerHTML = successHTML;
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

