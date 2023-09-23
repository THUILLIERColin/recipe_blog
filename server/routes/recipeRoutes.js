const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js');

/** 
 * App Routes
*/
router.get('/', recipeController.homepage);
// router.get('/recipes/', recipeController.exploreRecipes);
router.get('/recipe/:id', recipeController.myRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);


module.exports = router;