# 🎉 VibeFind - Event Discovery Platform

VibeFind is a dynamic web application that helps users discover and manage local events, from cultural festivals to business networking opportunities.

## 🚀 Features

- **Event Discovery**: Browse through various categories of events
- **Event Creation**: Create and manage your own events
- **Wishlist**: Save events you're interested in
- **User Profiles**: Personalized user experience
- **Contact System**: Direct communication with event organizers
- **Responsive Design**: Seamless experience across all devices

## 💻 Technologies Used

### Frontend
- HTML5
- CSS3 (Custom styling without frameworks)
- JavaScript (Vanilla JS)
- EmailJS for contact form functionality

### Backend
- Node.js
- Express.js
- SMTP/Nodemailer for email functionality

### Data Management
- CSV-based data storage
- Client-side data manipulation

### Version Control
- Git
- GitHub

## 🛠️ Technical Skills Demonstrated

- **Frontend Development**
  - Semantic HTML structure
  - Advanced CSS styling and animations
  - DOM manipulation
  - Event handling
  - Form validation
  - Responsive design principles

- **Backend Development**
  - RESTful API design
  - Server-side email processing
  - File system operations
  - Error handling

- **Software Engineering**
  - MVC architecture
  - Code organization
  - Version control
  - Documentation
  - Error handling and debugging

- **Web Security**
  - Form validation
  - Secure credential management
  - Email service integration

## 📁 Project Structure

```
assets/
  images/         # Event images and UI assets
css/             # Stylesheets for each page component
  about.css      # About page styles
  contact.css    # Contact form styles
  events.css     # Event listing styles
  index.css      # Homepage styles
  ...
data/
  events.csv     # Event database storage
html/            # Page templates and configurations
  emailjs-config.example.js  # Email configuration template
js/              # Frontend JavaScript functionality
  contact.js     # Contact form handling with EmailJS
  events.js      # Event management logic
  ...
server/          # Backend server (optional)
  .env.example   # Server environment template
  README.md      # Server setup instructions
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Samcode-16/NLAD-Vibefind.git
   cd NLAD-Vibefind
   ```

2. Set up the contact form email service:
   - Option 1 (Recommended): EmailJS Setup
     1. Create an account at [EmailJS](https://www.emailjs.com/)
     2. Copy `html/emailjs-config.example.js` to `html/emailjs-config.js`
     3. Update the configuration with your EmailJS credentials

   - Option 2 (Alternative): Server Setup
     1. Navigate to the server directory:
        ```bash
        cd server
        ```
     2. Install server dependencies:
        ```bash
        npm install
        ```
     3. Create a `.env` file based on `.env.example`
     4. Configure your email credentials in the `.env` file
     5. Start the server:
        ```bash
        npm start
        ```

3. Open the website:
   - Simply open `html/index.html` in your web browser
   - Or use a local development server like Live Server in VS Code

## 📧 Email Configuration

The project supports two methods for handling contact form submissions:
1. EmailJS (Primary method)
2. Node.js/SMTP server (Fallback method)

See the server documentation for detailed setup instructions.

## 🔮 Future Plans

### Real-time Event Management
- Live event updates and notifications
- Real-time attendee count and capacity tracking
- Dynamic event status updates (Upcoming, Live, Full, Ended)

### Enhanced User Experience
- User authentication and personalized profiles
- Event recommendations based on user preferences
- Social sharing integration
- Interactive event calendar view
- Mobile app development

### Community Features
- Event reviews and ratings system
- Event organizer verification
- User-to-user messaging
- Community groups and event categories
- Event photo galleries

### Technical Improvements
- Migration to a proper database system (MongoDB/PostgreSQL)
- Real-time updates using WebSocket
- Payment gateway integration for paid events
- Progressive Web App (PWA) implementation
- Advanced search filters and geolocation features
- API development for third-party integrations

### Analytics and Insights
- Event performance metrics
- Attendance analytics
- Popular categories tracking
- User engagement statistics
- Automated reporting system

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please check the [Issues page](https://github.com/Samcode-16/NLAD-Vibefind/issues) for any open issues or feature requests.

## 📝 License

All rights reserved.

---
Made by [Samcode-16](https://github.com/Samcode-16)