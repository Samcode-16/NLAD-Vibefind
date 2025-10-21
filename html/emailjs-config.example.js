// Rename this file to emailjs-config.js and update with your EmailJS credentials
window.EMAILJS_CONFIG = {
    // Your EmailJS public key (User ID)
    USER_ID: "YOUR_PUBLIC_KEY",
    
    // Your EmailJS service ID
    SERVICE_ID: "YOUR_SERVICE_ID",
    
    // Your EmailJS template ID
    TEMPLATE_ID: "YOUR_TEMPLATE_ID",

    // Template parameters mapping (update if your template uses different variable names)
    TEMPLATE_PARAMS: {
        from_name: "#contact-name",        // Maps to the name input field
        from_email: "#contact-email",      // Maps to the email input field
        message: "#contact-message",        // Maps to the message input field
        subject: "#contact-subject"         // Maps to the subject input field
    }
};