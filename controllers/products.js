const productService = require('../services/products');
const loginController = require('./login');
const Client = require('../models/clients'); // ייבוא נכון של המודל


const getProducts = async (req, res) => {
  try {
    const username = req.session.username;
    let favoriteProductIds = [];

    if (username) {
      const client = await Client.findOne({ username });
      favoriteProductIds = client ? client.faveItems.map(item => item.toString()) : [];
    }

    const productsInfo = await productService.getProducts();
    res.render('products.ejs', {
      products: productsInfo.products,
      maxPrice: productsInfo.maxPrice,
      minPrice: productsInfo.minPrice,
      cats: productsInfo.cat,
      sizes: productsInfo.sizes,
      favoriteProductIds, // Add favoriteProductIds to the render context
    });
  } catch (e) {
    console.log('e:', e);
  }
};


const getProductsByFilter = async (req, res) => {
  try {
    const priceFilter = req.query.filters?.price
    const titleFilter = req.query.filters?.title
    const catFilter = req.query.filters?.cat
    const sortVal = req.query.sort?.sortVal
    const isAsc = req.query.sort?.isAsc
    // const sortVal = req.body?.sort
    // const isAsc = req.body?.asc
    // const {asc: isAsc , sort: sortVal  } = req.body
    // console.log('sortVal:', sortVal)
    // console.log('req:', req)
    // Get products from DB using service file
    const productsInfo = await productService.getProducts(priceFilter, titleFilter, catFilter, sortVal, isAsc)
    // Render products page and send the products from DB to it
    res.json(productsInfo.products)

  } catch (e) {
    console.log('e:', e)
  }
}

const getProduct = async (req, res) => {
  let product = null
  let cats = []
  try {
    // Get the list of categories, in order to let manager select which category the new or existing product will have
    cats = await productService.getDistinctCats()

  }
  catch (e) {
    console.log('e:', e)
  }
  // If the params in the path dont have and id, show the create new product page ( send an empty product)
  if (!req.params.id) return res.render('edit-product.ejs', { product, cats })
  // Otherwise get the product from the DB using the id in the params
  try {
    product = await productService.getProductById(req.params.id)
  }
  catch (e) {
    console.log('e:', e)
  }
  console.log('req.path:', req.path)
  if (!product) {
    // If no product was found in the DB, return error
    return res.status(404).json({ errors: ['Product not found'] })
  }
  else if (req.path.includes('edit')){
console.log('here:')
    // If a product exists in DB, and the path includes the word "edit", render the product's edit page
    res.render('edit-product.ejs', { product, cats })
  }
  else {
    try {
      // Check if manager is logged in for edit product option
      const isManager = await loginController.getIsManager(req, res)
      // If a product exists in DB, and the path doesnt include the word edit, render a single product view page
      res.render('product.ejs', { product, isManager })
    } catch (e) {
      console.log('e:', e)
    }
  }
}

const createProduct = async (req, res) => {
  // Initialize the following variables, recieved from the body (in this case, from the ajax req)
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body
  try {
    // Send the variables to the product service. There, it will add it to the DB.
    const newProduct = await productService.createProduct(title, color, cat, price, gender, favePlayer, srcImg, sizes)
    // Send back to the ajax req, a res with the new product (including the new id given to it automatically)
    res.json(newProduct)
  }
  catch (e) {
    res.json(e)
  }
}

const updateProduct = async (req, res) => {
  // Save the id from the params in the website path
  let id = req.params.id
  // Initialize the following variables, recieved from the body (in this case, from the ajax req)
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body
  try {
    // Send the variables to the product service. There, it will update it in the DB.
    await productService.updateProduct(id, title, color, cat, price, gender, favePlayer, srcImg, sizes)
  } catch (e) {
    res.json("Product wasn't saved successfully" + e)
  }
}

const deleteProduct = async (req, res) => {
  try {
    // Get the products id from the params in the web path 
    // and send it to the service file 9there it will delete the product in DB)
    const product = await productService.deleteProduct(req.params.id)
    // If the product wasnt found in DB show an error
    if (!product) {
      res.status(404).json({ errors: ['Product not found'] })
    } else {
      res.json(product)
    }
  } catch (e) {
    res.json("Product wasn't deleted successfully" + e)
  }
}

function toggleWishlist(event, button, productId) {
  event.preventDefault();
  event.stopPropagation();

  const icon = button.querySelector('i');
  const isAdding = !icon.classList.contains('bi-heart-fill');

  $.ajax({
      url: `/products/toggle-wishlist`,
      method: 'POST',
      data: JSON.stringify({ productId, isAdding }),
      contentType: 'application/json',
      success: function (response) {
          if (response.success) {
              icon.classList.toggle('bi-heart');
              icon.classList.toggle('bi-heart-fill');
              button.classList.toggle('wishlist-active');
              const message = isAdding ? 'Item successfully added to wishlist' : 'Item removed from wishlist';
              showNotice(message, false);
          } else {
              if (response.message) {
                  showNotice(response.message, false); // הצגת הודעת השגיאה
              } else {
                  console.error('Error toggling wishlist:', response.error);
                  showNotice('Error: ' + response.error, false);
              }
          }
      },
      error: function (error) {
          if (error.status === 401) {
              showNotice('You must log in first to add to wishlist.', true); // הצגת הודעת החיבור
          } else {
              console.error('Error toggling wishlist:', error);
              showNotice('Error: ' + error.responseText, false);
          }
      }
  });
}





module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByFilter,
  toggleWishlist // הוספנו את הפונקציה החדשה לייצוא
};



