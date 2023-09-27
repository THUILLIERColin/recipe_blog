require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Home page.
*/
exports.homepage = async (req, res) => {
    try {
        
        const limitNumber = 15; 
        const limitNumberCategory = 5;
        const categories = await Category.find().sort({ _id: -1 }).limit(limitNumberCategory);
        const latest = await Recipe.find().sort({ _id: -1 }).limit(limitNumber);

        const food = { latest };
    
        res.render('index', { 
            title : 'Accueil',
            categories,
            food
        });
    } catch (error) {
        res.status(500).send({ message : error.message || "Erreur inconue"});
    }
}

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
        res.status(500).send({ message : error.message || "Erreur inconue"});
    }
}

/*
* GET /recipes/:id
* Recipes
*/
exports.myRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('recipe', { 
            title : 'Recette',
            recipe
        });
    } catch (error) {
        res.render('layouts/404');
        // res.status(500).send({ message : error.message || "Erreur inconue"});
    }
}

/**
 * GET /categories/:id
 * Categories By Id
 */

exports.exploreCategoriesById = async(req, res) => { 
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
        res.render('categories', { title: 'Catégories', categoryById, categoryId} );
    } catch (error) {
        res.render('layouts/404');
    }
}

/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async(req, res) => {
    try {
        const limitNumber = 20;
        const latest = await Recipe.find().sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', latest } );
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * GET /explore-random
 * Explore Random
 */
exports.randomRecipe = async(req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        const recipe = await Recipe.findOne().skip(random).exec();
        res.render('recipe', { title: 'Cooking Blog - Explore Random', recipe } );
    } catch (error) {
        res.status(500).json(error)
    }
}


/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async(req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        const categories = await Category.find();
        res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', categories, infoErrorsObj, infoSubmitObj } );
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * POST /submit-recipe
 * Submit Recipe Post
 */
exports.submitRecipePost = async(req, res) => {
    try {

        // On verifie si l'utilisateur a bien envoyé toutes les données requises
        if (!req.body.name || !req.body.description || !req.body.ingredients || !req.body.category) {
            req.flash('infoErrors', "Erreur : Veuillez remplir tous les champs obligatoires")
            return res.redirect('/submit-recipe');
        }

        let imageUploadFile;
        let uploadPath; 
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            req.flash('infoErrors', "Erreur : Aucun fichier n'a été envoyé")
            return res.redirect('/submit-recipe');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err) {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        }

        const newRecipe = new Recipe(
            {
                email: req.body.email,
                name: req.body.name,
                description: req.body.description,
                ingredients: req.body.ingredients,
                category: req.body.category,
                image: newImageName,
            }
        );

        await newRecipe.save();

        req.flash('infoSubmit', 'Votre recette a bien été soumise, elle sera publiée après validation par un administrateur. Merci !')
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoErrors', "Erreur : " +error.message)
        res.redirect('/submit-recipe');
    }
    
    
}

// Update Recipe
async function updateRecipe() {
    try {
        const res = await Recipe.updateOne({name: 'Stir-fried vegetables'}, {name: 'Stir-fried vegetables Updated'});
        res.n; // Number of documents matched
        res.nModified; // Number of documents modified
    }catch (error) {
        console.log('err', + error)
    }
}

// Delete Recipe
async function deleteRecipe() {
    try {
        const res = await Recipe.deleteOne({name: 'Stir-fried vegetables Updated'});
    }catch (error) {
        console.log('err', + error)
    }
}