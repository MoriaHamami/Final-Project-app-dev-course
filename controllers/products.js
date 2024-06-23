const productService = require('../services/products');

const getProducts = async (req, res) => {
  try {
    
    // Get products from DB using service file
    const productsInfo = await productService.getProducts()
    // Render products page and send the products from DB to it
      res.render('products.ejs', {
        products: productsInfo.products,
        maxPrice: productsInfo.maxPrice,
        minPrice: productsInfo.minPrice,
        cat: productsInfo.cat
      })    
  } catch (e) {
    console.log('e:', e)
  }
}
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
      res.json( productsInfo.products)
    
  } catch (e) {
    console.log('e:', e)
  }
}

const getProduct = async (req, res) => {
  let product = null
  // If the params in the path dont have and id, show the create new product page (dont send it a product)
  if (!req.params.id) return res.render('edit-product.ejs', { product })
  // Otherwise get the product from the DB using the id in the params
  try {
    product = await productService.getProductById(req.params.id)
  }
  catch (e) {
    console.log('e:', e)
  }
  if (!product) {
    // If no product was found in the DB, return error
    return res.status(404).json({ errors: ['Product not found'] })
  }
  else if (req.path.includes('edit'))
    // If a product exists in DB, and the path includes the word "edit", render the product's edit page
    res.render('edit-product.ejs', { product })
  else
    // If a product exists in DB, and the path doesnt include the word edit, render a single product view page
    res.render('product.ejs', { product })
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
    }else{
      res.json(product)
    }
  } catch (e) {
    res.json("Product wasn't deleted successfully" + e)
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByFilter
}
