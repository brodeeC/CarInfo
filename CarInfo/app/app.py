import csv
import json
import os
from flask import Flask, jsonify, render_template, request, send_from_directory # type: ignore
from flask_cors import CORS # type: ignore
import darkdetect # type: ignore 

def create_app(test_config=False, shared_server=False):
    app = Flask(__name__)
    app.config['TESTING'] = test_config
    app.config['SHARED_SERVER'] = shared_server
    global prepend
    prepend = '/CarInfo'
    if app.config['SHARED_SERVER']:
        prepend = '/CarInfo'

    return app

app = create_app()
cors = CORS(app)

@app.route(prepend + "/cars")
def cars():
    with open("/CarInfo/app/JSON/cars.JSON") as file:
        cars = json.load(file)
    return jsonify(cars)


# Load JSON data once at app startup
def load_car_data():
    with open("/CarInfo/app/JSON/cars.JSON") as json_file:
        return json.load(json_file)


app.config['CAR_DATA'] = load_car_data()

# Use path parameters in the URL instead of query parameters
@app.route(prepend + '/car/<country>/<brand>')
def car_info(country, brand):
  
    # Access car data from Flask config
    car_data = app.config['CAR_DATA']

    # Check if the country exists in car data
    if country in car_data:
        # Check if the brand exists in the specified country
        if brand in car_data[country]:
            selected_cars = car_data[country][brand]
            if 'logo' in selected_cars:
                logo = selected_cars.pop('logo')
            else: 
                lowBrand = brand.lower()
                logo = f"/static/img/Car Brand Logos/{lowBrand}-logo.png"

            is_dark_mode = darkdetect.isDark()

            if is_dark_mode: mode = "dark"
            else: mode = "light"

            return render_template("car_info.html", selected_cars=selected_cars, logo=logo,
                                   brand=brand, country=country, mode=mode), 200

        return page_not_found("Brand not found.")
    
    return page_not_found("Country not found.")
    
# Directory to save uploaded files
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

##Some of code sourced from class slides.
@app.route(prepend + '/contact', methods =['POST'])
def contact_us():
    try:
        fname = request.form.get("fname")
        lname = request.form.get("lname")
        country = request.form.get("country")
        subject = request.form.get("subject")

        #Handles if a image is uploaded
        uploaded_file = request.files.get("file")
        file_path = ""
        if uploaded_file and uploaded_file.filename != "":
            # Save file to the upload directory
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
            uploaded_file.save(file_path)
        

        row = [fname, lname, country, subject, file_path]

        with open('CSV/contact.csv', 'a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(row)
    
        # Redirect to the formsubmission.html template to show the form was submitted successfully.
        return render_template('formsubmission.html', file_path=file_path,)
    
    except Exception as e:
        return f"An error occurred: {e}", 500
    
#Route for the featured car of the month form
@app.route( prepend +'/featured', methods =['POST'])
def featured():
    try:
        fname = request.form.get("fname")
        lname = request.form.get("lname")
        country = request.form.get("country")
        subject = request.form.get("subject")

        #Handles if a image is uploaded
        uploaded_file = request.files.get("file")
        file_path = ""
        if uploaded_file and uploaded_file.filename != "":
            # Save file to the upload directory
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
            uploaded_file.save(file_path)
        

        row = [fname, lname, country, subject, file_path]

        with open('CSV/featured.csv', 'a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(row)
    
        # Redirect to the formsubmission.html template to show the form was submitted successfully.
        return render_template('formsubmission.html', file_path=file_path,)
    
    except Exception as e:
        return f"An error occurred: {e}", 500

#Ensures that the images can be viewed through an url: /uploads/filename  
@app.route(prepend + '/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
@app.route(prepend + '/search', methods=['POST'])
def search():
    data = request.get_json()

    value = data["val"]

    if value == "":
        return jsonify({"value":"All"})

    value = value.lower()
    
    car_data = load_car_data()

    for country in car_data.keys():
        countryLow = country.lower()
        if value == countryLow:
            return jsonify({"type":"country", "value":country}), 200
        
        for brand in car_data[country].keys():
            brandLow = brand.lower()
            if brandLow == value:
                return jsonify({"type":"brand", "url":f"/CarInfo/car/{country}/{brand}"})
            
            for car in car_data[country][brand].keys():
                carLow = car.lower()
                if carLow == value:
                    return jsonify({"type":"car", "url":f"/CarInfo/{country}/{brand}/{car}"})
        
    return jsonify({"value":"None"}), 200
    

@app.route(prepend + '/<country>/<brand>/<car>')
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

                return render_template("one_car.html", car=car, imgLink=imgLink,
                                   brand=brand, country=country, year=single_car["year"], 
                                   description=single_car["description"],), 200
            
            return page_not_found("Car not found.")
        
        return page_not_found("Brand not found.")
    
    return page_not_found("Country not found.")


#Custom 404 page not found
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', e=e, prepend=prepend), 404


#To ensure that my custom 404 page is ran and not flask's detailed page
if __name__ == '__main__':
    app.run(debug=True)