"use strict";

const addCarForm = document.querySelector("#addCar"); //reference to add car form
const searchCarForm = document.querySelector("#searchCar");//reference to search car form
// array 
const cars = [];

// class made for cars
class Car {
    constructor(license, maker, model, owner, price, color, year) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.owner = owner;
        this.price = parseFloat(price); // parseFloat used because we want price in number form
        this.color = color;
        this.year = parseInt(year);// parseInt used because we want price in number/integer form
    }
    //get function to caculate the age of car
    getCarAge() {
        const currentYear = new Date().getFullYear();
        return currentYear - this.year; // subtracts manufacturing year from current year to get car's age
    }

    // used to calulate discount(15% off is given is car is older than 10 years as provided in description of task)
    getDiscountedPrice() {
        return this.getCarAge() > 10 ? this.price * 0.85 : this.price;
    }

    isEligibleForDiscount() {
        return this.getCarAge() > 10;
    } // checks if car is older than 10 years and hence eligible for discount

}

const addCar = (e) => {
    e.preventDefault();

    try {
        const license = document.querySelector("#license").value.trim(); //gets the vaule of license plate // trim removes the white spaces 
        const maker = document.querySelector("#maker").value.trim(); // gets the value of car's maker and trims white spaces
        const model = document.querySelector("#model").value.trim();// gets the value of car's model and trims white spaces
        const owner = document.querySelector("#owner").value.trim();// gets the value of car's owner and trims white spaces
        const price = parseFloat(document.querySelector("#price").value.trim());// gets car's price and trims white spaces
        const color = document.querySelector("#color").value.trim();// gets the car's color and trims white spaces
        const year = parseInt(document.querySelector("#year").value.trim());// gets the year of car's manufacturing and trims white spaces
        const currentYear = new Date().getFullYear(); //gets the current year

        if (!license || !maker || !model || !owner || isNaN(price) || !color || isNaN(year)) {
            throw new Error("All fields are required and must be valid.");  // if any of these fields is invalid then it throws an error
        }

        if (price <= 0) {
            throw new Error("Price must be a positive number."); // this will check if the price is a positive number 
        }

        if (year < 1886 || year > currentYear) {
            throw new Error(`Year must be between 1886 and ${currentYear}.`); // checks if year is between 1886 and current year
        }

        const newCar = new Car(license, maker, model, owner, price, color, year);  // new car object formed
        addCarForm.reset(); //form fields are reset
        cars.push(newCar);//newCar is added to array
        displayTable(); // table now displays new car

    } catch (error) {
        alert(error.message); // this shows error message
    }
};

// this function will display cars in table form
const displayTable = () => {
    const table = document.querySelector("#carsTable");

    table.innerHTML = table.rows[0].innerHTML; // only first row is kept, rest is cleared

    cars.forEach((car) => {
        const row = table.insertRow(-1); // this will insert new row at the end of table

        const { license, maker, model, owner, year, color, price } = car;

        const carDetails = [license, maker, model, owner, year, color]; //makes array of car details

        carDetails.forEach(detail => {
            row.insertCell(-1).textContent = detail ?? 'N/A';
        }); // new cell is inserted for each factor, N/A if it is empty for null

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`; // it keeps the price to two decimal points

        const discountedPrice = car.isEligibleForDiscount()
            ? `$${car.getDiscountedPrice().toFixed(2)}` // is discount applies then price is kept to two decimal points
            : "No Discount"; // no discount if car is not 10 or more years older
        row.insertCell(-1).textContent = discountedPrice; // this checks if car is eligible for discount
    });
};

// to search the car function is made
const searchCar = (e) => {
    e.preventDefault();
    const searchInput = document.querySelector("#search").value.trim();
    const foundCar = cars.find((car) => car.license.toLowerCase() === searchInput.toLowerCase()); // finds the car using license plate- it is not case sensitive

    const searchResult = document.querySelector("#searchResult");
    // incase the car is found
    if (foundCar) {
        const originalPrice = foundCar.price.toFixed(2); // gets the price and displays it to 2 decimal points
        const discountedPrice = foundCar.isEligibleForDiscount()// checks if car is eligible for discount
            ? `$${foundCar.getDiscountedPrice().toFixed(2)}`
            : "No Discount";

        searchResult.innerHTML = `
            <p>Maker: ${foundCar.maker}</p>
            <p>Model: ${foundCar.model}</p>
            <p>Owner: ${foundCar.owner}</p>
            <p>Year: ${foundCar.year}</p>
            <p>Original Price: $${originalPrice}</p>
            <p>Discounted Price: ${discountedPrice}</p>
            <p>Color: ${foundCar.color}</p> 
        `; // in the search result area, this will display the car's details 
    } else {
        searchResult.innerHTML = "<p>No car found with the given license plate.</p>"; // displayed if no car is found 
    }
};

addCarForm.addEventListener("submit", addCar);//event listener added to add car form
searchCarForm.addEventListener("submit", searchCar);//event listner added to search car form
