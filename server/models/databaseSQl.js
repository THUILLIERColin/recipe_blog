const mysql = require('mysql');

// Créez une connexion à votre base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost', // Adresse du serveur MySQL
  user: 'votre_utilisateur_mysql', // Nom d'utilisateur MySQL
  password: 'votre_mot_de_passe_mysql', // Mot de passe MySQL
  database: 'nom_de_votre_base_de_donnees' // Nom de la base de données à laquelle vous souhaitez vous connecter
});

// Établissez la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données MySQL :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Vous pouvez maintenant exécuter des requêtes SQL et interagir avec la base de données

// Exemple : exécution d'une requête SELECT
connection.query('SELECT * FROM ma_table', (err, results) => {
  if (err) {
    console.error('Erreur lors de l\'exécution de la requête SELECT :', err);
  } else {
    console.log('Résultats de la requête SELECT :', results);
  }
});

// N'oubliez pas de fermer la connexion lorsque vous avez fini
connection.end();