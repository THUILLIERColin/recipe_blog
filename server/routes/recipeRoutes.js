const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js');

/** 
 * App Routes
*/
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.myRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/random-recipe', recipeController.randomRecipe);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipePost);
router.get('/login', recipeController.login);
router.get('/register', recipeController.register);
router.post('/register', recipeController.submitRegister);
router.post('/login', recipeController.submitLogin);
router.get('/logout', recipeController.logout);

// Erreur 404 chargement de la page 404.ejs

router.use((req, res) => {
    res.status(404).render('layouts/404', {title: 'Page not found', session: req.session});
});

module.exports = router;