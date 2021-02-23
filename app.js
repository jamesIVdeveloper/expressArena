const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});

app.get("/burgers", (req, res) => {
  res.send("We have juicy cheese burgers!");
});

app.get("/pizza/pepperoni", (req, res) => {
  res.send("Your pizza is on the way!");
});

app.get("/pizza/pineapple", (req, res) => {
  res.send("We don't serve that here.  Never call again!");
});

app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        Stale: ${req.stale}
        IP: ${req.ip}
    `;
  res.send(responseText);
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end();
});

app.get("/greetings", (req, res) => {
  const name = req.query.name;
  const race = req.query.race;

  if (!race) {
    return res.status(400).send("Please provide a race");
  }

  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  res.send(greeting);
});

app.get("/pickles", (req, res) => {
  res.send("I'm Pickle Rick!!");
});

app.get("/sum", (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  const sum = a + b;

  if (!a) {
    return res.status(400).send("Please provide a");
  }

  if (!b) {
    return res.status(400).send("Please provide b");
  }

  res.send(`The sum of ${a} and ${b} is ${sum}`);
});

app.get("/cipher", (req, res) => {
  const text = req.query.text;
  const shift = req.query.shift;

  if (!text) {
    return res.status(400).send("Please provide text");
  }

  if (!shift) {
    return res.status(400).send("Please provide shift");
  }

  const numShift = parseFloat(shift);

  if (Number.isNaN(numShift)) {
    return res.status(400).send("shift must be a number");
  }

  const base = "A".charCodeAt(0);

  const cipher = text
    .toUpperCase()
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code < base || code > base + 26) {
        return char;
      }

      let diff = code - base;
      diff = diff + numShift;
      diff = diff % 26;
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join("");

  res.status(200).send(cipher);
});

app.get("/lotto", (req, res) => {
  const numbers = req.query.numbers;

  if (!numbers) {
    return res.status(400).send("numbers is required");
  }

  if (!Array.isArray(numbers)) {
    return res.status(400).send("Numbers must be an array");
  }

  const luckyNums = numbers
    .map((n) => parseInt(n))
    .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 20);

  if (luckyNums.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 numbers between 1 and 20");
  }

  const numPool = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  const winningNums = [];

  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * numPool.length);
    winningNums.push(numPool[ran]);
    numPool.splice(ran, 1);
  }

  let diff = winningNums.filter((n) => !luckyNums.includes(n));

  let responseText;

  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the mega millions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulations! You win a free ticket!";
      break;
    default:
      responseText = "Sorry, you lose.";
  }

  res.send(responseText);
});
