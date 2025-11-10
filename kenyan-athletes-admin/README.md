# Kenyan Athletes Admin Dashboard

This project is an admin dashboard for managing information related to Kenyan athletes, events, and achievements. It is built using Node.js, Express, EJS for templating, and utilizes a MySQL database for data storage.

## Project Structure

```
kenyan-athletes-admin
├── src
│   ├── server.js                # Entry point of the application
│   ├── db
│   │   ├── index.js             # Database connection and initialization
│   │   └── schema.sql           # SQL schema for creating necessary tables
│   ├── models
│   │   ├── userModel.js         # User model for user data interactions
│   │   ├── athleteModel.js      # Athlete model for athlete data interactions
│   │   ├── achievementModel.js   # Achievement model for achievement data interactions
│   │   ├── eventModel.js        # Event model for event data interactions
│   │   ├── consentModel.js      # Consent model for consent data interactions
│   │   ├── nutritionModel.js     # Nutrition model for nutrition tracking data interactions
│   │   └── exerciseModel.js      # Exercise model for exercise tracking data interactions
│   ├── controllers
│   │   └── adminController.js    # Controller for handling admin dashboard requests
│   ├── routes
│   │   └── admin.js              # Routes for the admin dashboard
│   ├── views
│   │   ├── layouts
│   │   │   └── main.ejs          # Main layout template
│   │   ├── partials
│   │   │   ├── header.ejs        # Header partial
│   │   │   └── footer.ejs        # Footer partial
│   │   ├── admin
│   │   │   ├── dashboard.ejs     # Dashboard view for admin
│   │   │   ├── athletes.ejs      # List of athletes view
│   │   │   ├── athlete-detail.ejs # Detailed athlete information view
│   │   │   ├── events.ejs        # List of events view
│   │   │   └── settings.ejs      # Application settings view
│   │   └── error.ejs             # Error message view
│   ├── public
│   │   ├── css
│   │   │   └── styles.css        # CSS styles for the application
│   │   └── js
│   │       └── admin.js          # JavaScript for admin dashboard interactions
│   └── utils
│       └── helpers.js            # Utility functions
├── config
│   └── default.json              # Configuration settings
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # npm configuration file
└── README.md                      # Project documentation
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd kenyan-athletes-admin
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up the database**:
   - Create a MySQL database and import the `src/db/schema.sql` file to create the necessary tables.

4. **Configure environment variables**:
   - Create a `.env` file in the root directory and add your database connection details.

5. **Run the application**:
   ```
   npm start
   ```

6. **Access the dashboard**:
   - Open your browser and navigate to `http://localhost:3000/admin/dashboard`.

## Features

- View and manage athletes, achievements, and events.
- Detailed athlete profiles with achievements and personal records.
- Admin settings for application configuration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.