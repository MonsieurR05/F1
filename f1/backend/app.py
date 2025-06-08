from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from models import db, Driver, Constructor, Race, Result, Qualifying, DriverStanding, ConstructorStanding

app = Flask(__name__)

# Make sure the data directory exists
os.makedirs('data', exist_ok=True)

# Configuration - use absolute path to avoid path issues
DB_PATH = os.path.abspath('data/f1_2024.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app)

# API Routes

@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    """Get all drivers"""
    try:
        drivers = Driver.query.all()
        return jsonify([driver.to_dict() for driver in drivers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/drivers/<driver_id>', methods=['GET'])
def get_driver(driver_id):
    """Get specific driver by ID"""
    try:
        driver = Driver.query.get_or_404(driver_id)
        return jsonify(driver.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/constructors', methods=['GET'])
def get_constructors():
    """Get all constructors"""
    try:
        constructors = Constructor.query.all()
        return jsonify([constructor.to_dict() for constructor in constructors])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/constructors/<constructor_id>', methods=['GET'])
def get_constructor(constructor_id):
    """Get specific constructor by ID"""
    try:
        constructor = Constructor.query.get_or_404(constructor_id)
        return jsonify(constructor.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/races', methods=['GET'])
def get_races():
    """Get all races"""
    try:
        races = Race.query.order_by(Race.round).all()
        return jsonify([race.to_dict() for race in races])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/races/<int:race_id>', methods=['GET'])
def get_race(race_id):
    """Get specific race by ID"""
    try:
        race = Race.query.get_or_404(race_id)
        return jsonify(race.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/races/<int:race_id>/results', methods=['GET'])
def get_race_results(race_id):
    """Get results for a specific race"""
    try:
        results = Result.query.filter_by(race_id=race_id).order_by(Result.position).all()
        return jsonify([result.to_dict() for result in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/races/<int:race_id>/qualifying', methods=['GET'])
def get_race_qualifying(race_id):
    """Get qualifying results for a specific race"""
    try:
        qualifying = Qualifying.query.filter_by(race_id=race_id).order_by(Qualifying.position).all()
        return jsonify([q.to_dict() for q in qualifying])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/standings/drivers', methods=['GET'])
def get_driver_standings():
    """Get driver championship standings"""
    try:
        standings = DriverStanding.query.order_by(DriverStanding.position).all()
        return jsonify([standing.to_dict() for standing in standings])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/standings/constructors', methods=['GET'])
def get_constructor_standings():
    """Get constructor championship standings"""
    try:
        standings = ConstructorStanding.query.order_by(ConstructorStanding.position).all()
        return jsonify([standing.to_dict() for standing in standings])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/results', methods=['GET'])
def get_all_results():
    """Get all race results"""
    try:
        results = Result.query.join(Race).order_by(Race.round, Result.position).all()
        return jsonify([result.to_dict() for result in results])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/qualifying', methods=['GET'])
def get_all_qualifying():
    """Get all qualifying results"""
    try:
        qualifying = Qualifying.query.join(Race).order_by(Race.round, Qualifying.position).all()
        return jsonify([q.to_dict() for q in qualifying])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'F1 2024 API is running',
        'endpoints': [
            '/api/drivers',
            '/api/drivers/<driver_id>',
            '/api/constructors',
            '/api/constructors/<constructor_id>',
            '/api/races',
            '/api/races/<race_id>',
            '/api/races/<race_id>/results',
            '/api/races/<race_id>/qualifying',
            '/api/standings/drivers',
            '/api/standings/constructors',
            '/api/results',
            '/api/qualifying'
        ]
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    print(f"Database path: {DB_PATH}")
    print(f"Database directory exists: {os.path.exists(os.path.dirname(DB_PATH))}")
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
    
    print("🏁 F1 2024 API Server Starting...")
    print("📊 Available endpoints:")
    print("   - GET /api/drivers")
    print("   - GET /api/drivers/<driver_id>")
    print("   - GET /api/constructors")
    print("   - GET /api/constructors/<constructor_id>")
    print("   - GET /api/races")
    print("   - GET /api/races/<race_id>")
    print("   - GET /api/races/<race_id>/results")
    print("   - GET /api/races/<race_id>/qualifying")
    print("   - GET /api/standings/drivers")
    print("   - GET /api/standings/constructors")
    print("   - GET /api/results")
    print("   - GET /api/qualifying")
    print("   - GET /api/health")
    print("\n🚀 Server running on http://localhost:5000/api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
