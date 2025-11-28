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

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const form = document.getElementById('contactForm');
    const formContainer = form.parentElement;

    // Hide form and show success message
    form.style.display = 'none';

    const successDiv = document.createElement('div');
    successDiv.className = 'contact-success-message';
    successDiv.innerHTML = `
        <div class="success-checkmark">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
        </div>
        <h3>Message Sent Successfully!</h3>
        <p>${message}</p>
        <button onclick="resetContactForm()" class="reset-btn">Send Another Message</button>
    `;

    formContainer.appendChild(successDiv);
}

/**
 * Reset contact form
 */
function resetContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.querySelector('.contact-success-message');

    if (successMessage) {
        successMessage.remove();
    }

    form.style.display = 'block';
    form.reset();

    // Clear session storage
    sessionStorage.removeItem('contactContent');
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const contentInput = document.getElementById('content');
    const submitBtn = contactForm.querySelector('.contact-submit-btn');

    // Real-time validation
    if (contentInput) {
        contentInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 0 && value.length < 3) {
                showError('content', 'Please provide at least 3 characters');
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
        } else if (content.length < 3) {
            showError('content', 'Message must be at least 3 characters long');
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

        if (submitBtn) {
            setLoadingState(submitBtn, true);
        }

        try {
            // Get form data
            const formData = new FormData(this);
            const content = formData.get('content').trim();

            // Simulate API call delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show success message
            showSuccessMessage('Thank you! We\'ll be in touch within 24 hours.');
        } catch (error) {
            console.error('Form submission error:', error);
            showError('content', 'An error occurred. Please try again.');
            if (submitBtn) {
                setLoadingState(submitBtn, false);
            }
        }
    });
}


// ============================================
// PAGE INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', function() {
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
