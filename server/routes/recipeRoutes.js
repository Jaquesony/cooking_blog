const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/** 
 * App Routes
 */
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.get('/explore-latest', recipeController.exploreLatest);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);

module.exports = router