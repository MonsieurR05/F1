# F1 2024 Season Data Explorer

A comprehensive web application for exploring the 2024 Formula 1 season data, built with Flask backend and Astro + React frontend. This project provides detailed analytics, driver profiles, team information, race results, and real-time standings with a modern, responsive interface.

## 🏁 Features

### Backend Features
- **SQLite Database**: Normalized F1 data with 7 relational tables
- **Flask REST API**: Comprehensive endpoints with SQLAlchemy ORM
- **Real-time Data**: Fetched from the official Ergast Developer API
- **CORS Support**: Enabled for seamless frontend integration
- **Error Handling**: Robust error handling and validation
- **Jupyter Integration**: Interactive notebooks for data exploration

### Frontend Features
- **Modern UI**: Built with Astro + React + Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Interactive Components**: Real-time data exploration and filtering
- **Search Functionality**: Advanced search across drivers, teams, and races
- **Circuit Visualizations**: High-quality track layouts with Wikipedia SVG integration
- **Performance Analytics**: Detailed statistics and championship standings

### Data Coverage
- **20+ Drivers**: Complete 2024 F1 driver roster with profiles
- **10 Teams**: All constructor teams with detailed information
- **24 Races**: Full race calendar with results and qualifying data
- **Circuit Details**: Track layouts, lap records, and technical specifications
- **Championship Standings**: Real-time driver and constructor standings

## 📁 Project Structure

\`\`\`
f1-2024-project/
├── backend/
│   ├── notebooks/
│   │   ├── 01_database_setup.ipynb    # Database creation and population
│   │   └── 02_api_tester.ipynb        # API endpoint testing
│   ├── data/
│   │   └── f1_2024.db                 # SQLite database (auto-generated)
│   ├── models.py                      # SQLAlchemy database models
│   ├── app.py                         # Flask application and API routes
│   ├── requirements.txt               # Python dependencies
│   ├── setup_database.py              # Alternative database setup script
│   └── test_api.py                    # Alternative API testing script
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChampionCard.jsx        # Championship leaders display
    │   │   ├── ConstructorsList.jsx    # Teams listing and details
    │   │   ├── DriverDetail.jsx        # Individual driver profiles
    │   │   ├── DriversList.jsx         # Drivers listing with search
    │   │   ├── RacesList.jsx           # Race calendar and circuit details
    │   │   ├── StandingsView.jsx       # Championship standings
    │   │   └── StatsCard.jsx           # Season statistics overview
    │   ├── layouts/
    │   │   └── Layout.astro            # Main layout with navigation
    │   └── pages/
    │       ├── index.astro             # Homepage
    │       ├── drivers.astro           # Drivers page
    │       ├── drivers/[driver_id].astro # Dynamic driver pages
    │       ├── constructors.astro      # Teams page
    │       ├── races.astro             # Races page
    │       └── standings.astro         # Standings page
    ├── public/
    │   └── drivers/                    # Driver portrait images
    ├── astro.config.mjs                # Astro configuration
    ├── package.json                    # Node.js dependencies
    └── tailwind.config.mjs             # Tailwind CSS configuration
\`\`\`

## 🗄️ Database Schema

The SQLite database contains 7 normalized tables with proper relationships:

### Core Tables
- **`drivers`** - Driver information (name, nationality, number, etc.)
- **`constructors`** - Team/constructor information
- **`races`** - Race calendar with circuit details

### Results Tables
- **`results`** - Race results with points, positions, and timing
- **`qualifying`** - Qualifying session results (Q1, Q2, Q3)
- **`driver_standings`** - Championship standings for drivers
- **`constructor_standings`** - Championship standings for constructors

### Relationships
- Foreign key constraints ensure data integrity
- Many-to-many relationships between drivers, constructors, and races
- Proper indexing for optimal query performance

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control

### Backend Setup

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install Python dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. **Set up the database (Choose one method):**

   **Option A: Using Jupyter Notebook (Recommended)**
   \`\`\`bash
   jupyter notebook notebooks/01_database_setup.ipynb
   \`\`\`
   Execute all cells to create and populate the database.

   **Option B: Using Python Script**
   \`\`\`bash
   python setup_database.py
   \`\`\`

4. **Start the Flask API server:**
   \`\`\`bash
   python app.py
   \`\`\`
   The API will be available at `http://localhost:5000`

5. **Test the API (Optional):**
   \`\`\`bash
   # Using Jupyter
   jupyter notebook notebooks/02_api_tester.ipynb
   
   # Or using Python script
   python test_api.py
   \`\`\`

### Frontend Setup

1. **Navigate to frontend directory:**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install Node.js dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The frontend will be available at `http://localhost:3000`

## 🔌 API Endpoints

### Driver Endpoints
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/<driver_id>` - Get specific driver details

### Constructor Endpoints
- `GET /api/constructors` - Get all constructors/teams
- `GET /api/constructors/<constructor_id>` - Get specific constructor details

### Race Endpoints
- `GET /api/races` - Get all races in the calendar
- `GET /api/races/<race_id>` - Get specific race details
- `GET /api/races/<race_id>/results` - Get race results
- `GET /api/races/<race_id>/qualifying` - Get qualifying results

### Standings Endpoints
- `GET /api/standings/drivers` - Get driver championship standings
- `GET /api/standings/constructors` - Get constructor championship standings

### Utility Endpoints
- `GET /api/results` - Get all race results
- `GET /api/qualifying` - Get all qualifying results
- `GET /api/health` - API health check

### Example API Response
\`\`\`json
{
  "driver_id": "verstappen",
  "permanent_number": 1,
  "code": "VER",
  "given_name": "Max",
  "family_name": "Verstappen",
  "full_name": "Max Verstappen",
  "date_of_birth": "1997-09-30",
  "nationality": "Dutch",
  "url": "http://en.wikipedia.org/wiki/Max_Verstappen"
}
\`\`\`

## 🎨 Frontend Features

### Pages and Components

#### Homepage (`/`)
- Season overview with key statistics
- Current championship leaders
- Quick navigation to all sections
- Responsive hero section with gradient design

#### Drivers Page (`/drivers`)
- Complete driver roster with search functionality
- Driver portraits and basic information
- Links to detailed driver profiles
- Nationality flags and racing numbers

#### Driver Detail Pages (`/drivers/[driver_id]`)
- Comprehensive driver profiles
- 2024 season performance statistics
- Race-by-race results
- Team information and championship position

#### Teams Page (`/constructors`)
- All 10 F1 teams with logos and information
- Team colors and branding
- Constructor championship standings
- Team driver lineups

#### Races Page (`/races`)
- Complete 2024 race calendar
- Circuit layouts with Wikipedia SVG integration
- Race results and qualifying data
- Circuit statistics (lap records, lengths, etc.)

#### Standings Page (`/standings`)
- Real-time championship standings
- Driver and constructor championships
- Points breakdown and win counts
- Interactive tabs for different standings

### Design Features
- **Dark Theme**: Modern dark UI with red F1 accents
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: CSS transitions and hover effects
- **Professional Typography**: Inter and Poppins font families
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🛠️ Development

### Adding New Features

1. **Backend Changes:**
   - Add new endpoints in `app.py`
   - Update models in `models.py` if needed
   - Test with the API tester notebook

2. **Frontend Changes:**
   - Create new components in `src/components/`
   - Add new pages in `src/pages/`
   - Update navigation in `Layout.astro`

### Database Updates

To update the database with new data:
\`\`\`bash
# Re-run the setup notebook or script
python setup_database.py
\`\`\`

### Testing

**Backend Testing:**
\`\`\`bash
# Test all API endpoints
python test_api.py

# Or use the interactive notebook
jupyter notebook notebooks/02_api_tester.ipynb
\`\`\`

**Frontend Testing:**
\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## 📊 Data Source

All Formula 1 data is sourced from the **[Ergast Developer API](http://ergast.com/mrd/)**, which provides:
- Comprehensive F1 data from 1950 to present
- Real-time race results and standings
- Historical data and statistics
- Reliable and well-documented API

## 🔧 Technologies Used

### Backend Stack
- **Python 3.8+** - Core programming language
- **Flask** - Lightweight web framework
- **SQLAlchemy** - Object-relational mapping
- **SQLite** - Embedded database
- **Pandas** - Data manipulation and analysis
- **Requests** - HTTP library for API calls
- **Flask-CORS** - Cross-origin resource sharing
- **Jupyter** - Interactive development environment

### Frontend Stack
- **Astro** - Modern static site generator
- **React 18** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features
- **Responsive Design** - Mobile-first approach

### Development Tools
- **npm** - Package management
- **Jupyter Notebooks** - Data exploration
- **VS Code** - Recommended IDE

## 🚀 Deployment

### Backend Deployment
1. Set up a Python environment on your server
2. Install dependencies: `pip install -r requirements.txt`
3. Set up the database: `python setup_database.py`
4. Configure environment variables
5. Run with a production WSGI server (e.g., Gunicorn)


## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Ergast Developer API** for providing comprehensive F1 data
- **Formula 1** for the amazing sport and data
- **Tailwind CSS** for the excellent utility framework
- **Astro** and **React** communities for great documentation

## 📞 Support

If you encounter any issues or have questions:

1. Check the [API documentation](http://ergast.com/mrd/)
2. Review the setup instructions above
3. Test API endpoints using the provided notebooks
4. Ensure all dependencies are properly installed
5. Check that both backend and frontend servers are running

---

**Built for Formula 1 fans and data enthusiasts**
