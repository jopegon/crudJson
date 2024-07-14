const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.set('view engine', 'ejs');


const port = 3000;
const filePath = './data.json';


// Helper function to read the JSON file
const readJSONFile = () => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper function to write to the JSON file
const writeJSONFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


// Serve the home page
app.get('/', (req, res) => {
  res.render('index');
});


// Serve the form  HTML file
app.get('/form', (req, res) => {
  res.render('alta');
    //res.sendFile(path.join(__dirname, './views/alta.html'));
  });


// Create
app.post('/items', (req, res) => {
  const data = readJSONFile();
  const newItem = req.body;
  data.push(newItem);
  writeJSONFile(data);
  res.status(201).send(newItem);
});

// Read All
app.get('/listar', (req, res) => {
  //const data = readJSONFile();
  //res.send(data);

  const data = readJSONFile();
  res.render('lista', { items: data });

});

// Read One
app.get('/items/:ip', (req, res) => {
  const data = readJSONFile();
  const item = data.find(i => i.ip == req.params.ip);
  if (item) {
    //console.log(item["description"]);
    //res.send(item);
    res.render('update', { item: item })
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});


// Update
app.put('/items/:ip', (req, res) => {

  const data = readJSONFile();
  const index = data.findIndex(i => i.ip == req.params.ip);
  if (index !== -1) {
    const updatedItem = { ...data[index], ...req.body };
    data[index] = updatedItem;
    writeJSONFile(data);
    res.send(updatedItem);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});



// Delete
app.delete('/items/:ip', (req, res) => {
  console.log("is entra "+ req.params.ip)
  let data = readJSONFile();
  const index = data.findIndex(i => i.ip == req.params.ip);
  if (index !== -1) {
    const deletedItem = data.splice(index, 1);
    writeJSONFile(data);
    res.send(deletedItem);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

app.listen(port, () => {
  console.log(`CRUD app listening at http://localhost:${port}`);
});
