require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Home page.
*/
exports.homepage = async (req, res) => {
    try {
        
        const limitNumber = 5; 
        const categories = await Category.find().limit(limitNumber);
        const latest = await Recipe.find().sort({ _id: -1 }).limit(limitNumber);

        const italien = await Recipe.find({ category: 'Italien' }).sort({ _id: -1 }).limit(limitNumber);
        const american = await Recipe.find({ category: 'American' }).sort({ _id: -1 }).limit(limitNumber);
        const chinese = await Recipe.find({ category: 'Chinese' }).sort({ _id: -1 }).limit(limitNumber);

        const food = { latest , italien, american, chinese };
    
        res.render('index', { 
            title : 'Accueil',
            categories,
            food
        });
    } catch (error) {
        res.satus(500).send({ message : error.message || "Erreur inconue"});
    }
};

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20; 
        const categories = await Category.find().limit(limitNumber);
        res.render('categories', { 
            title : 'Catégories',
            categories
        });
    } catch (error) {
        res.satus(500).send({ message : error.message || "Erreur inconue"});
    }
};

/*
* GET /recipes/:id
* Recipes
*/
exports.myRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('recipe', { 
            recipe
        });
    } catch (error) {
        res.satus(500).send({ message : error.message || "Erreur inconue"});
    }
};






















/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();

/*
 async function insertDymmyRecipeData(){
   try {
     await Recipe.insertMany([
       { 
         "name": "Recipe Name Goes Here",
         "description": `Recipe Description Goes Here`,
         "email": "recipeemail@raddy.co.uk",
         "ingredients": [
           "1 level teaspoon baking powder",
           "1 level teaspoon cayenne pepper",
           "1 level teaspoon hot smoked paprika",
         ],
         "category": "American", 
         "image": "southern-friend-chicken.jpg"
       },
       { 
         "name": "Recipe Name Goes Here",
         "description": `Recipe Description Goes Here`,
         "email": "recipeemail@raddy.co.uk",
         "ingredients": [
           "1 level teaspoon baking powder",
           "1 level teaspoon cayenne pepper",
           "1 level teaspoon hot smoked paprika",
         ],
         "category": "American", 
         "image": "southern-friend-chicken.jpg"
       },
     ]);
     console.log('Recipe Data Inserted');
   } catch (error) {
     console.log('err', + error)
   }
 }

 insertDymmyRecipeData();*/