const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors()); // Utiliser le middleware CORS
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Définir le modèle Employé
const employeeSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateDeNaissance: Date,
  adresse: String,
  numeroDeTelephone: String,
  contrat: String,
  horaire: String,
  travaillé: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes CRUD

// Obtenir tous les employés
app.get('/employees', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Ajouter un employé
app.post('/employees', async (req, res) => {
  const employee = new Employee(req.body);
  await employee.save();
  res.status(201).json(employee);
});

// Modifier un employé
app.put('/employees/:id', async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(employee);
});

// Supprimer un employé
app.delete('/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
