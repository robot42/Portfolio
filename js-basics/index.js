'use strict'

let firstName = 'Mosh';
console.log(firstName);

const interestRate = 0.3;
console.log(interestRate);

let name = 'Mosh';
let age = 30;
let isApproved = true;
let unknown = undefined;
let lastName = null;

let person = {
    name: 'Mosh',
    age: 30
}

person.name = 'John';

const propertyNameToChange = 'name';
person[propertyNameToChange] = 'Nick';

console.log(person.name);

let selectedColors = ['red', 'blue'];
selectedColors[2] = 1;
selectedColors[0] = true;
console.log(selectedColors);

function greet(name, lastName) {
    console.log('Hello ' + name + ' ' + lastName);
}

greet('Enrico', '1345');
greet('Torsten', 'abcde');

function square(number) {
    if (number > 2) {
        return 'not supported';
    }

    return number * number;
}

console.log(square(2));
console.log(square(20));





const numbers = [1, 2, 3, 4, 5, 6];
const addTwo = (number) => number + 2;
const isEven = (number) => number % 2 == 0;
const sum = (oldVal, number) => oldVal + number;

const result = numbers.filter(isEven).map(addTwo).reduce(sum);

console.log(result);