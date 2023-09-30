require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * GET /
 * Home page.
*/
exports.homepage = async (req, res) => {
    try {
        
        const limitNumber = 10; 
        const limitNumberCategory = 5;
        const categories = await Category.find().sort({ _id: -1 }).limit(limitNumberCategory);
        const latest = await Recipe.find().sort({ _id: -1 }).limit(limitNumber);

        const food = { latest };

        if(req.session.user) {
            const user = await User.findOne({ name: req.session.name });
            console.log('user', user);
            // On récupère les recettes favorites de l'utilisateur
            const favorites = await Recipe.find({ _id: { $in: user.favorites } }).limit(limitNumber);
            food.favorites = favorites;
        }

        res.render('index', { 
            title : 'Accueil',
            categories,
            food, 
            session: req.session
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
            categories,
            session: req.session
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
            recipe,
            session: req.session
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
        res.render('categories', { title: 'Catégories', categoryById, categoryId, session: req.session } );
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
    res.render('search', { title: 'Cooking Blog - Search', recipe, session: req.session } );
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
        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', latest, session: req.session } );
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
        res.render('recipe', { title: 'Cooking Blog - Explore Random', recipe, session: req.session } );
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
        if(req.session.user === false) {
            req.flash('infoErrors', "Erreur : Vous devez être connecté pour soumettre une recette")
            return res.redirect('/login');
        }
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        const categories = await Category.find();
        console.log('session.user', req.session.user)
        console.log('session.name', req.session.name)
        res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', categories, infoErrorsObj, infoSubmitObj, session: req.session } );
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
        if(req.session.user === false) {
            req.flash('infoErrors', "Erreur : Vous devez être connecté pour soumettre une recette")
            return res.redirect('/login');
        }
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

/**
 * GET /register
 * Register
 */
exports.register = async(req, res) => {
    try {
        if(!req.session.user) {
            return res.redirect('/');
        }
        const infoErrorsObj = req.flash('infoErrorsRegister');
        const infoSubmitObj = req.flash('infoSubmitRegister');
        res.render('register', { title: 'Cooking Blog - Register', infoErrorsObj, infoSubmitObj, session: req.session } );
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * GET /login
 * Login
 */
exports.login = async(req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrorsLogin');
        const infoSubmitObj = req.flash('infoSubmitLogin');
        res.render('login', { title: 'Cooking Blog - Login', infoErrorsObj, infoSubmitObj, session: req.session } );
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * POST /register
 * Register
 */
exports.submitRegister = async(req, res) => {
    try {

        // On verifier que l'utilisateur est connecté pour bloquer l'accès à la page
        if(!req.session.user) {
            return res.redirect('/');
        }

        // On verifie si l'utilisateur a bien envoyé toutes les données requises
        if (!req.body.name || !req.body.email || !req.body.password) {
            req.flash('infoErrorsRegister', "Erreur : Veuillez remplir tous les champs")
            return res.redirect('/register');
        }

        // On verifie si l'utilisateur existe déjà
        if(await User.findOne({ name: req.body.name })) {
            req.flash('infoErrorsRegister', "Erreur : Un utilisateur existe déjà avec ce nom")
            return res.redirect('/register');
        }

        const newUser = new User(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }
        );        
        await newUser.save();
            
        req.flash('infoSubmitRegister', 'Votre compte a bien été créé, vous pouvez maintenant vous connecter')
        res.redirect('/register');
    } catch (error) {
        req.flash('infoErrorsRegister', "Erreur : " +error.message)
        res.redirect('/register');
    }
}

/**
 * POST /login
 * Login
 */
exports.submitLogin = async(req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            req.flash('infoErrorsLogin', "Erreur : Aucun utilisateur trouvé avec cet email")
            return res.redirect('/login');
        }
        if (! await bcrypt.compare(req.body.password, user.password)) {
            req.flash('infoErrorsLogin', "Erreur : Mot de passe incorrect")
            return res.redirect('/login');
        }
        req.session.user = true;
        req.session.name = user.name;
        req.session.favorites = user.favorites;
        return res.redirect('/');
    } catch (error) {
        req.flash('infoErrorsLogin', "Erreur : " +error.message)
        return res.redirect('/login');
    }
}

/**
 * GET /logout
 * Logout
 */
exports.logout = async(req, res) => {
    try {
        req.session.user = false;
        req.session.name = null;
        res.redirect('/');
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * POST /add-to-favorites/:id
 * Add to favorites
 */
exports.addToFavorites = async(req, res) => {
    try {
        if(!req.session.user) {
            return res.redirect('/login');
        }
        const recipe = await Recipe.findById(req.params.id);
        // On verifie si la recette existe et on l'ajoute aux favoris de l'utilisateur
        if(recipe) {
            const user = await User.findOne({ name: req.session.name });
            user.favorites.push(recipe._id);
            await user.save();
            return res.redirect('/recipe/' + req.params.id);
        }

    } catch (error) {
        res.render('layouts/404');
        // res.status(500).send({ message : error.message || "Erreur inconue"});
    }
}

// Add user 
// async function addUser() {
//     try {
//         const newUser = new User(
//             {
//                 name:'tmp',
//                 password: 'tmp',
//             }
//         );
//         await newUser.save();
//         console.log('Utilisateur ajouté');
//     }
//     catch (error) {
//         console.log('err', + error)
//     }
// }
// addUser();