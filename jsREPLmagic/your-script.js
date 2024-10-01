// Get the app container
const app = d.getElementById('app');

// Create a new div element
const myDiv = neld('myDiv');

// Set some styles
myDiv.sc(200, 100, rcol(), 'white');
myDiv.s.padding = '10px';
myDiv.s.margin = '10px';

// Set some text
myDiv.tx('Hello, REPLmagic!');

// Append to the app container
app.a(myDiv);

// Create a button
const myButton = nelb('myButton');
myButton.tx('Click me!');
myButton.sc(100, 30, 'blue', 'white');
myButton.s.border = 'none';
myButton.s.borderRadius = '5px';
myButton.s.cursor = 'pointer';

// Add click event
myButton.onclick = () => {
    myDiv.s.b(rcol()); // Change background color on click
};

// Append button to app
app.a(myButton);

// Create a grid of colored divs
body_add_divs_grid(400, 200, 4, 3);
