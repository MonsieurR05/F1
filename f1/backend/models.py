from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Driver(db.Model):
    __tablename__ = 'drivers'
    
    driver_id = db.Column(db.String(50), primary_key=True)
    permanent_number = db.Column(db.Integer)
    code = db.Column(db.String(3))
    given_name = db.Column(db.String(50))
    family_name = db.Column(db.String(50))
    date_of_birth = db.Column(db.String(20))
    nationality = db.Column(db.String(50))
    url = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'driver_id': self.driver_id,
            'permanent_number': self.permanent_number,
            'code': self.code,
            'given_name': self.given_name,
            'family_name': self.family_name,
            'full_name': f"{self.given_name} {self.family_name}",
            'date_of_birth': self.date_of_birth,
            'nationality': self.nationality,
            'url': self.url
        }

class Constructor(db.Model):
    __tablename__ = 'constructors'
    
    constructor_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100))
    nationality = db.Column(db.String(50))
    url = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'constructor_id': self.constructor_id,
            'name': self.name,
            'nationality': self.nationality,
            'url': self.url
        }

class Race(db.Model):
    __tablename__ = 'races'
    
    race_id = db.Column(db.Integer, primary_key=True)
    season = db.Column(db.Integer)
    round = db.Column(db.Integer)
    race_name = db.Column(db.String(100))
    circuit_id = db.Column(db.String(50))
    circuit_name = db.Column(db.String(100))
    locality = db.Column(db.String(50))
    country = db.Column(db.String(50))
    date = db.Column(db.String(20))
    time = db.Column(db.String(20))
    url = db.Column(db.String(200))
    
    def to_dict(self):
        return {
            'race_id': self.race_id,
            'season': self.season,
            'round': self.round,
            'race_name': self.race_name,
            'circuit_id': self.circuit_id,
            'circuit_name': self.circuit_name,
            'locality': self.locality,
            'country': self.country,
            'date': self.date,
            'time': self.time,
            'url': self.url
        }

class Result(db.Model):
    __tablename__ = 'results'
    
    result_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    race_id = db.Column(db.Integer, db.ForeignKey('races.race_id'))
    driver_id = db.Column(db.String(50), db.ForeignKey('drivers.driver_id'))
    constructor_id = db.Column(db.String(50), db.ForeignKey('constructors.constructor_id'))
    number = db.Column(db.Integer)
    grid = db.Column(db.Integer)
    position = db.Column(db.Integer)
    position_text = db.Column(db.String(10))
    points = db.Column(db.Float)
    laps = db.Column(db.Integer)
    time = db.Column(db.String(20))
    milliseconds = db.Column(db.Integer)
    fastest_lap = db.Column(db.Integer)
    rank = db.Column(db.Integer)
    fastest_lap_time = db.Column(db.String(20))
    fastest_lap_speed = db.Column(db.String(20))
    status_id = db.Column(db.Integer)
    status = db.Column(db.String(50))
    
    # Relationships
    driver = db.relationship('Driver', backref='results')
    constructor = db.relationship('Constructor', backref='results')
    race = db.relationship('Race', backref='results')
    
    def to_dict(self):
        return {
            'result_id': self.result_id,
            'race_id': self.race_id,
            'driver_id': self.driver_id,
            'constructor_id': self.constructor_id,
            'driver_name': f"{self.driver.given_name} {self.driver.family_name}" if self.driver else None,
            'constructor_name': self.constructor.name if self.constructor else None,
            'number': self.number,
            'grid': self.grid,
            'position': self.position,
            'position_text': self.position_text,
            'points': self.points,
            'laps': self.laps,
            'time': self.time,
            'milliseconds': self.milliseconds,
            'fastest_lap': self.fastest_lap,
            'rank': self.rank,
            'fastest_lap_time': self.fastest_lap_time,
            'fastest_lap_speed': self.fastest_lap_speed,
            'status': self.status
        }

class Qualifying(db.Model):
    __tablename__ = 'qualifying'
    
    qualifying_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    race_id = db.Column(db.Integer, db.ForeignKey('races.race_id'))
    driver_id = db.Column(db.String(50), db.ForeignKey('drivers.driver_id'))
    constructor_id = db.Column(db.String(50), db.ForeignKey('constructors.constructor_id'))
    number = db.Column(db.Integer)
    position = db.Column(db.Integer)
    q1 = db.Column(db.String(20))
    q2 = db.Column(db.String(20))
    q3 = db.Column(db.String(20))
    
    # Relationships
    driver = db.relationship('Driver', backref='qualifying_results')
    constructor = db.relationship('Constructor', backref='qualifying_results')
    race = db.relationship('Race', backref='qualifying_results')
    
    def to_dict(self):
        return {
            'qualifying_id': self.qualifying_id,
            'race_id': self.race_id,
            'driver_id': self.driver_id,
            'constructor_id': self.constructor_id,
            'driver_name': f"{self.driver.given_name} {self.driver.family_name}" if self.driver else None,
            'constructor_name': self.constructor.name if self.constructor else None,
            'number': self.number,
            'position': self.position,
            'q1': self.q1,
            'q2': self.q2,
            'q3': self.q3
        }

class DriverStanding(db.Model):
    __tablename__ = 'driver_standings'
    
    standing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    race_id = db.Column(db.Integer, db.ForeignKey('races.race_id'))
    driver_id = db.Column(db.String(50), db.ForeignKey('drivers.driver_id'))
    constructor_id = db.Column(db.String(50), db.ForeignKey('constructors.constructor_id'))
    position = db.Column(db.Integer)
    position_text = db.Column(db.String(10))
    points = db.Column(db.Float)
    wins = db.Column(db.Integer)
    
    # Relationships
    driver = db.relationship('Driver', backref='standings')
    constructor = db.relationship('Constructor', backref='driver_standings')
    race = db.relationship('Race', backref='driver_standings')
    
    def to_dict(self):
        return {
            'standing_id': self.standing_id,
            'race_id': self.race_id,
            'driver_id': self.driver_id,
            'constructor_id': self.constructor_id,
            'driver_name': f"{self.driver.given_name} {self.driver.family_name}" if self.driver else None,
            'constructor_name': self.constructor.name if self.constructor else None,
            'position': self.position,
            'position_text': self.position_text,
            'points': self.points,
            'wins': self.wins
        }

class ConstructorStanding(db.Model):
    __tablename__ = 'constructor_standings'
    
    standing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    race_id = db.Column(db.Integer, db.ForeignKey('races.race_id'))
    constructor_id = db.Column(db.String(50), db.ForeignKey('constructors.constructor_id'))
    position = db.Column(db.Integer)
    position_text = db.Column(db.String(10))
    points = db.Column(db.Float)
    wins = db.Column(db.Integer)
    
    # Relationships
    constructor = db.relationship('Constructor', backref='standings')
    race = db.relationship('Race', backref='constructor_standings')
    
    def to_dict(self):
        return {
            'standing_id': self.standing_id,
            'race_id': self.race_id,
            'constructor_id': self.constructor_id,
            'constructor_name': self.constructor.name if self.constructor else None,
            'position': self.position,
            'position_text': self.position_text,
            'points': self.points,
            'wins': self.wins
        }
