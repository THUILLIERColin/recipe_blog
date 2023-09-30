const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Définition de l'utilisateur

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true,
    },
    favorites: {
        type: Array,
        required: false,
    },
});

// Hashage du mot de passe avant de l'enregistrer dans la base de données

userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, function(error, encrypted) {
        user.password = encrypted;
        next();
    });
}
);

// Création du modèle User

module.exports = mongoose.model('User', userSchema);