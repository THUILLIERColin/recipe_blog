const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js');

/** 
 * App Routes
*/
router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCategories);
// router.get('/recipes/', recipeController.exploreRecipes);
router.get('/recipe/:id', recipeController.myRecipe);


module.exports = router;