import json
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)



@app.route("/cars")
def cars():
    with open("cars.JSON") as file:
        cars = json.load(file)
    return jsonify(cars)


# Load JSON data once at app startup
def load_car_data():
    with open("cars.JSON") as json_file:
        return json.load(json_file)



@app.route("/shoutout/<someone>")
def shoutout(someone):
    return render_template("shoutout.html", page_title = "Hey, " + someone, someone =someone)

@app.route("/brands/<brand>")
def brands(brand):
    return render_template("brands.html", brand = brand)


# Load JSON data once at app startup
def load_car_data():
    with open("cars.JSON") as json_file:
        return json.load(json_file)


app.config['CAR_DATA'] = load_car_data()

# Use path parameters in the URL instead of query parameters
@app.route('/car/<country>/<brand>/<model>')
def car_info(country, brand):
  

    # Access car data from Flask config
    car_data = app.config['CAR_DATA']  
    
    print(f"Country: {country}, Brand: {brand}, Model: {model}")
    # Check if keys exist
    if country in car_data:
        if brand in car_data[country]:
            if model in car_data[country][brand]:
                selected_car = car_data[country][brand][model]
                print(f"Selected Car: {selected_car}")
                return render_template("car_info.html", car=selected_car, brand=car_data[country][brand])
            else:
                print("Model not found")
        else:
            print("Brand not found")
    else:
        print("Country not found")
    return "Car not found", 404





 
        
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