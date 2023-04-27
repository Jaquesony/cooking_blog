require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const thai = await Recipe.find({'category':'Thai'}).limit(limitNumber);
        const american = await Recipe.find({'category':'American'}).limit(limitNumber);
        const chinese = await Recipe.find({'category':'Chinese'}).limit(limitNumber);

        const food = {latest,thai,american,chinese};
        res.render('index', { title: 'Cooking Blog - Home',categories, food});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"})
    }

}



/**
 * GET /categories
 * Categories
 */

exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber)
        res.render('categories', { title: 'Cooking Blog - ', categories});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"})
    }
}

/**
 * GET /categories/:id
 * Categories by Id
 */

exports.exploreCategoriesById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({'category':categoryId}).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categoryById});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"})
    }
}

/**
 * GET /recipe/:id
 * Recipe by Id
 */

exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Cooking Blog - Recipe',recipe});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"})

    }

}

/**
 * POST /Search
 * Search
 */

exports.searchRecipe = async (req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      const recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Cooking Blog - Search', recipe });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error Occured" });
    }
  };



/**
 * GET /explore latest
 * explore latest
 */

exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest',recipe});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"})

    }

}


/**
 * GET /explore-random
 * explore random
 */

exports.exploreRandom = async (req, res) => {
    try {
      const count = await Recipe.countDocuments();
      if (count === 0) {
        throw new Error("There are no recipes to explore.");
      }
      const randomIndex = Math.floor(Math.random() * count);
      const recipe = await Recipe.findOne().skip(randomIndex).exec();
      if (!recipe) {
        throw new Error("Could not find a recipe to explore.");
      }
      res.render('explore-random', { title: 'Cooking Blog - Explore Random', recipe });
    } catch (error) {
      res.status(500).send({ message: error.message || "Error occurred while exploring recipes." });
    }
  }
  

/**
 * GET /submit-recipe
 * submit recipe
 */

exports.submitRecipe = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Explore Random',infoErrorsObj,infoSubmitObj});
   
}

/**
 * POST /submit-recipe
 * submit recipe
 */

exports.submitRecipeOnPost = async (req, res) => {
    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files where upload.');
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./')+'/public/uploads/'+newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            })
        }


        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,
        });
        await newRecipe.save();

        req.flash('infoSubmit','Recipe has been added');
        res.redirect('/submit-recipe');
    }catch(error){
        // res.json(error);
        req.flash('infoSubmit',error);
        res.redirect('/submit-recipe');
    }

    
}



























// async function insertDymmuCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name":"Thai",
//                 "image":"thai-food.jpg",
//             },
//             {
//                 "name":"American",
//                 "image":"american-food.jpeg",
//             },
//             {
//                 "name":"Chinese",
//                 "image":"chinese-food.jpg",
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg",
//             },
//             {
//                 "name":"Indian",
//                 "image":"indian-food.jpg",
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg",
//             }
//         ]);
//     }catch(error){
//         console.log('err', error);

//     }
// }

// insertDymmuCategoryData();

// async function insertDymmuRecipeData(){
//     try{
//         await Recipe.insertMany([
         
//         ]);
//     }catch(error){
//         console.log('err', error);

//     }
// }

// insertDymmuRecipeData();