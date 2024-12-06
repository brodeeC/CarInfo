import csv
import json
from flask import Flask, jsonify, render_template, request, redirect # type: ignore
from flask_cors import CORS # type: ignore
import darkdetect # type: ignore

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

            is_dark_mode = darkdetect.isDark()

            if is_dark_mode: mode = "dark"
            else: mode = "light"

            if country == "SouthKorea":
                countryName = "South Korea"

            else: 
                countryName = country

            return render_template("car_info.html", selected_cars=selected_cars, logo=logo,
                                   brand=brand, country=country, mode=mode, countryName=countryName), 200

        else:
            print("Brand not found in specified country")
            return "Brand not found in the specified country", 404
    else:
        print("Country not found in car data")
        return "Country not found in car data", 404
    
##Some of code sourced from class slides.
@app.route('/contact', methods =['POST'])
def contact_us():
    try:
        fname = request.form.get("fname")
        lname = request.form.get("lname")
        country = request.form.get("country")
        subject = request.form.get("subject")

        row = [fname, lname, country, subject]

        with open('CSV/contact.csv', 'a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(row)
    
        # Redirect to the formsubmission.html template to show the form was submitted successfully.
        return render_template('formsubmission.html')
    
    except Exception as e:
        return f"An error occurred: {e}", 500
    

@app.route('/<country>/<brand>/<car>')
def one_car(country, brand, car):
    # Access car data from Flask config
    car_data = app.config['CAR_DATA']

    # Check if the country exists in car data
    if country in car_data:
        # Check if the brand exists in the specified country
        if brand in car_data[country]:
            
            if car in car_data[country][brand]:
                single_car = car_data[country][brand][car]

                is_dark_mode = darkdetect.isDark()

                if is_dark_mode:
                    imgLink = single_car["dark"]
                else: 
                    imgLink = single_car["light"]

                #TODO
                if country == "SouthKorea": country = "South Korea"

                return render_template("one_car.html", car=car, imgLink=imgLink,
                                   brand=brand, country=country, year=single_car["year"]), 200

            else:
                return "Car not found in the specified brand.", 404

        else:
            return "Brand not found in the specified country.", 404
    else:
        return "Country not found in car data.", 404


#Custom 404 page not found
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


#To ensure that my custom 404 page is ran and not flask's detailed page
if __name__ == '__main__':
    app.run(debug = False)
