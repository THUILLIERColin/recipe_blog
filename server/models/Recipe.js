const mongoose = require('mongoose');
const Category = require('./Category');

async function getUniqueCategories() {
  try {
    const categories = await Category.distinct('name').exec();
    return categories;
  } catch (err) {
    console.error('Erreur lors de la récupération des catégories :', err);
    throw err;
  }
}

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false, 
  },
  email: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    enum: [], // Utilisez la fonction pour obtenir les catégories
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Définissez les valeurs de l'énumération une fois que vous avez les catégories
(async () => {
  try {
    const categories = await getUniqueCategories();
    for(i=0; i<categories.length; i++){
      recipeSchema.path('category').enum(categories[i]);
    }
    
    // Créez le modèle Recipe après avoir défini l'énumération
    const Recipe = mongoose.model('Recipe', recipeSchema);
    
  } catch (err) {
    console.error('Une erreur s\'est produite :', err);
  } 
})();

recipeSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);