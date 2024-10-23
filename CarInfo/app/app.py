import json
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route("/csc342groups")
def csc_342_groups():
    groups = {1: {'Content Specialist': ['Julia Hogg'],
            'Designer': ['Sage DeVore'],
            'Programmer(s)': ['Miles Dame', 'Hanna King']},
            2: {'Content Specialist': ['Brady Fleuette'],
            'Designer': ['David Lash'],
            'Programmer(s)': ['Kyler Bailey', 'Brodee Clontz']},
            3: {'Content Specialist': ['AJ Leary'],
            'Designer': ['Khalid Ismail'],
            'Programmer(s)': ['Matt Keller', 'Moultrie Dangerfield']},
            4: {'Content Specialist': ['Collin Riddle'],
            'Designer': ['Case Riddle'],
            'Programmer(s)': ['Ellie Johnson', 'Jack Roberts']},
            5: {'Content Specialist': ['Olivia Longsworth'],
            'Designer': ['Flynn Nisbet'],
            'Programmer(s)': ['Mengsrun Nit']},
            6: {'Content Specialist': ['Jack Patterson'],
            'Designer': ['Charlie Fink'],
            'Programmer(s)': ['Emirhan Gencer']}}

    return jsonify(groups)

@app.route("/cars")
def cars():
    with open("cars.JSON") as file:
        cars = json.load(file)

    return jsonify(cars)

@app.route("/shoutout/<someone>")
def shoutout(someone):
    return render_template("shoutout.html", page_title = "Hey, " + someone, someone =someone)

@app.route("/brands/<brand>")
def brands(brand):
    return render_template("brands.html", brand = brand)
        
