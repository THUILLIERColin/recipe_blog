require('../models/database');
const Category = require('../models/Category');

/**
 * GET /
 * Home page.
*/
exports.homepage = async (req, res) => {
    try {
        
        const limitNumber = 5; 
        const categories = await Category.find().limit(limitNumber);

        res.render('index', { 
            title : 'Accueil',
            categories
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