/**
 * XDi Website - Main JavaScript
 * Handles search functionality, form validation, and navigation
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show error message for form field
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear error message for form field
 */
function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Set loading state on button
 */
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

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

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            clearBtn.style.display = 'none';
            showAllMenuItems();
            this.blur();
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

/**
 * Filter menu items based on search term
 */
function filterMenuItems(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    let hasResults = false;

    dropdownItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'flex';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Announce results to screen readers
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownContent) {
        dropdownContent.setAttribute('aria-label', 
            hasResults ? `${dropdownItems.length} results found` : 'No results found');
    }
}

/**
 * Show all menu items
 */
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

    // Keyboard navigation
    item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const contentInput = document.getElementById('content');
    const submitBtn = contactForm.querySelector('.page-3-submit-btn');

    // Real-time validation
    if (contentInput) {
        contentInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 0 && value.length < 10) {
                showError('content', 'Please provide at least 10 characters');
            } else {
                clearError('content');
            }
        });

        contentInput.addEventListener('blur', function() {
            validateContactForm();
        });
    }

    /**
     * Validate contact form
     */
    function validateContactForm() {
        const content = contentInput.value.trim();
        let isValid = true;

        clearError('content');

        if (!content) {
            showError('content', 'Please enter your message');
            isValid = false;
        } else if (content.length < 10) {
            showError('content', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateContactForm()) {
            contentInput.focus();
            return;
        }

        setLoadingState(submitBtn, true);

        try {
            // Get form data
            const formData = new FormData(this);
            const content = formData.get('content').trim();

            // Store content in sessionStorage for next page
            if (content) {
                sessionStorage.setItem('contactContent', content);
            }

            // Simulate API call delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Navigate to details page
            window.location.href = 'details.html';
        } catch (error) {
            console.error('Form submission error:', error);
            showError('content', 'An error occurred. Please try again.');
            setLoadingState(submitBtn, false);
        }
    });
}

// ============================================
// DETAILS FORM HANDLING
// ============================================

const detailsForm = document.getElementById('detailsForm');
if (detailsForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const submitBtn = detailsForm.querySelector('.details-submit-btn');

    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 0 && value.length < 2) {
                showError('name', 'Name must be at least 2 characters');
            } else {
                clearError('name');
            }
        });

        nameInput.addEventListener('blur', function() {
            validateDetailsForm();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value && !isValidEmail(value)) {
                showError('email', 'Please enter a valid email address');
            } else {
                clearError('email');
            }
        });

        emailInput.addEventListener('blur', function() {
            validateDetailsForm();
        });
    }

    /**
     * Validate details form
     */
    function validateDetailsForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        let isValid = true;

        clearError('name');
        clearError('email');

        if (!name) {
            showError('name', 'Please enter your name');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    // Form submission
    detailsForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateDetailsForm()) {
            // Focus first invalid field
            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                nameInput.focus();
            } else if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
                emailInput.focus();
            }
            return;
        }

        setLoadingState(submitBtn, true);

        try {
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();

            // Store data in sessionStorage
            sessionStorage.setItem('contactName', name);
            sessionStorage.setItem('contactEmail', email);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Navigate to success page
            window.location.href = 'success.html';
        } catch (error) {
            console.error('Form submission error:', error);
            showError('email', 'An error occurred. Please try again.');
            setLoadingState(submitBtn, false);
        }
    });

    // Handle back navigation warning
    const backLinks = document.querySelectorAll('.details-back-link, .details-close-link');
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if ((nameInput && nameInput.value.trim()) || (emailInput && emailInput.value.trim())) {
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

// ============================================
// PAGE INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', function() {
    // Check if user came from contact page
    if (window.location.pathname.includes('details.html')) {
        const storedContent = sessionStorage.getItem('contactContent');
        if (!storedContent) {
            // Redirect to contact page if no content stored
            window.location.href = 'contact.html';
        }
    }

    // Add fade-in animation to page content
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

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

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can add error reporting here
});
