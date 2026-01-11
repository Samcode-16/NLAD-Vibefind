// Header elements are injected dynamically; header interactions are bound in include-header.js
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const closeButtons = document.querySelectorAll('.close');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const contactForm = document.getElementById('contact-form');
const faqItems = document.querySelectorAll('.faq-item');

// CAPTCHA elements
const captchaText = document.getElementById('captcha-text');
const refreshCaptchaBtn = document.getElementById('refresh-captcha');
const captchaInput = document.getElementById('captcha-input');

// Current CAPTCHA value
let currentCaptcha = '';

// Generate CAPTCHA
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = captcha;
    if (captchaText) {
        captchaText.textContent = captcha;
    }
    return captcha;
}

// Check if user is logged in
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.querySelectorAll('header #login-btn, header #signup-btn');
    const profileDropdown = document.querySelector('header .profile-dropdown');

    if (user) {
        authButtons.forEach(btn => btn.style.display = 'none');
        if (profileDropdown) {
            profileDropdown.style.display = 'block';
        }

        const profileImage = document.getElementById('profile-image');
        if (profileImage && user.profileImage) {
            profileImage.src = user.profileImage;
        }
    } else {
        authButtons.forEach(btn => btn.style.display = 'inline-block');
        if (profileDropdown) {
            profileDropdown.style.display = 'none';
            profileDropdown.classList.remove('open');
        }
    }

    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');

        if (nameInput) {
            nameInput.value = user && user.name ? user.name : '';
        }

        if (emailInput) {
            emailInput.value = user && user.email ? user.email : '';
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Open modal
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    if (captchaText) {
        generateCaptcha();
    }
    
    // FAQ toggle
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

window.addEventListener('authStatusChanged', () => {
    checkAuthStatus();
});

window.addEventListener('headerLoaded', () => {
    checkAuthStatus();
});

// Contact form submit
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Helper: send via server POST (fallback)
        const sendViaServer = () => {
            return fetch((window.FEEDBACK_ENDPOINT || 'http://localhost:3001') + '/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(async (res) => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || 'Failed to send feedback');
                }
                return res.json();
            });
        };

        // If EmailJS config is provided on window, prefer EmailJS (client-side, no server required)
        // window.EMAILJS_CONFIG should be set in HTML before this script loads, e.g.:
        // <script>window.EMAILJS_CONFIG = { serviceId: 'service_xxx', templateId: 'template_xxx', publicKey: 'your_public_key' };</script>
        const emailJsCfg = window.EMAILJS_CONFIG;
        if (emailJsCfg && emailJsCfg.serviceId && emailJsCfg.templateId && emailJsCfg.publicKey) {
            // Load EmailJS SDK dynamically if needed
            const ensureEmailJSSDK = () => {
                if (window.emailjs && typeof window.emailjs.send === 'function') return Promise.resolve();
                return new Promise((resolve, reject) => {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.emailjs.com/dist/email.min.js';
                    s.onload = () => {
                        if (window.emailjs && typeof window.emailjs.init === 'function') {
                            window.emailjs.init(emailJsCfg.publicKey);
                            resolve();
                        } else {
                            reject(new Error('EmailJS SDK failed to load'));
                        }
                    };
                    s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
                    document.head.appendChild(s);
                });
            };

            ensureEmailJSSDK()
            .then(() => {
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message
                };

                return window.emailjs.send(emailJsCfg.serviceId, emailJsCfg.templateId, templateParams);
            })
            .then(() => {
                showNotification('Your message has been sent! We\'ll get back to you soon.');
                contactForm.reset();
            })
            .catch(err => {
                console.error('EmailJS send error:', err);
                // Fallback to server POST
                sendViaServer()
                .then(() => {
                    showNotification('Your message has been sent via fallback server.');
                    contactForm.reset();
                })
                .catch((err2) => {
                    console.error('Fallback send error:', err2);
                    showNotification('Unable to send message right now. Please try again later.');
                });
            });

            return;
        }

        // Otherwise, use the server POST
        sendViaServer()
        .then(() => {
            showNotification('Your message has been sent! We\'ll get back to you soon.');
            contactForm.reset();
        })
        .catch((err) => {
            console.error('Feedback send error:', err);
            showNotification('Unable to send message right now. Please try again later.');
            console.info('If you want to receive emails, either configure EmailJS via window.EMAILJS_CONFIG or run the feedback server in /server and set SMTP env vars. See server/.env.example');
        });
    });
}

// Header login/signup buttons are handled by include-header.js after the header is injected.

// Close buttons
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Switch between login and signup
if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
        generateCaptcha();
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeModal(loginModal);
    }
    if (e.target === signupModal) {
        closeModal(signupModal);
    }
});

// Refresh CAPTCHA
if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener('click', () => {
        generateCaptcha();
    });
}

// Login form submit
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login successful
            localStorage.setItem('currentUser', JSON.stringify(user));
            closeModal(loginModal);
            checkAuthStatus();
            showNotification('Login successful!');
        } else {
            // Login failed
            alert('Invalid email or password!');
        }
    });
}

// Signup form submit
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const captchaInput = document.getElementById('captcha-input').value;
        
        // Validate CAPTCHA
        if (captchaInput !== currentCaptcha) {
            alert('Invalid CAPTCHA! Please try again.');
            generateCaptcha();
            return;
        }
        
        // Validate passwords
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            alert('Email already exists! Please use a different email.');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            savedEvents: [],
            createdEvents: []
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save users to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Log in the new user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Close modal and update UI
        closeModal(signupModal);
        checkAuthStatus();
        showNotification('Account created successfully!');
    });
}

// Logout is handled centrally in include-header.js

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: bottom 0.3s ease;
    z-index: 1000;
}

.notification.show {
    bottom: 20px;
}
`;
document.head.appendChild(style);
