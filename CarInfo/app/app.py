import json
from flask import Flask, jsonify, render_template # type: ignore
from flask_cors import CORS # type: ignore
import darkdetect

app = Flask(__name__)
cors = CORS(app)



@app.route("/cars")
def cars():
    with open("JSON/cars.JSON") as file:
        cars = json.load(file)
    return jsonify(cars)


@app.route("/brands/<brand>")
def brands(brand):
    return render_template("brands.html", brand = brand)


# Load JSON data once at app startup
def load_car_data():
    with open("JSON/cars.JSON") as json_file:
        return json.load(json_file)


app.config['CAR_DATA'] = load_car_data()

# Use path parameters in the URL instead of query parameters
@app.route('/car/<country>/<brand>')
def car_info(country, brand):
  
    # Access car data from Flask config
    car_data = app.config['CAR_DATA']

    # Check if the country exists in car data
    if country in car_data:
        # Check if the brand exists in the specified country
        if brand in car_data[country]:
            selected_cars = car_data[country][brand]
            logo = selected_cars.pop('logo')
            print(logo)
            data = load_car_data()

            is_dark_mode = darkdetect.isDark()

            if is_dark_mode: mode = "dark"
            else: mode = "light"

            return render_template("car_info.html", selected_cars = selected_cars, logo = logo,
                                   brand = brand, country = country, mode = mode), 200

        else:
            print("Brand not found in specified country")
            return "Brand not found in the specified country", 404
    else:
        print("Country not found in car data")
        return "Country not found in car data", 404