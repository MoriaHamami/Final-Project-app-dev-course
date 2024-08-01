const productService = require('../services/products') // Import product service
const loginController = require('./login') // Import login controller
const Client = require('../models/clients') // Import Client model

// Function renders the products page
const getProducts = async (req, res) => {
  try {
    const username = req.session.username // Get logged-in username
    let favoriteProductIds = [] // Initialize favorite product IDs

    if (username) {
      const client = await Client.findOne({ username }) // Find client by username
      favoriteProductIds = client ? client.faveItems.map(item => item.toString()) : [] // Get favorite product IDs
    }

    const productsInfo = await productService.getProducts() // Get products info
    res.render('products.ejs', {
      products: productsInfo.products, // Render products
      maxPrice: productsInfo.maxPrice, // Maximum price
      minPrice: productsInfo.minPrice, // Minimum price
      cats: productsInfo.cat, // Categories
      sizes: productsInfo.sizes, // Sizes
      favoriteProductIds: JSON.stringify(favoriteProductIds), // Favorite product IDs
    })
  } catch (e) {
    console.log('Error rendering products page:', e) // Log any errors
    res.status(500).send('Internal Server Error') // Send 500 status code
  }
}

// Function sends back the fave product ids
const getFaveProductIds = async (req, res) => {
  try {
    const username = req.session.username // Get logged-in username
    let favoriteProductIds = [] // Initialize favorite product IDs

    if (username) {
      const client = await Client.findOne({ username }) // Find client by username
      favoriteProductIds = client ? client.faveItems.map(item => item.toString()) : [] // Get favorite product IDs
    }

    res.json(favoriteProductIds)
  } catch (e) {
    console.log('Error getting fave product ids:', e) // Log any errors
    res.status(500).send('Internal Server Error') // Send 500 status code
  }
}

// Function filters products by criteria
const getProductsByFilter = async (req, res) => {
  try {
    const priceFilter = req.query.filters?.price // Get price filter
    const titleFilter = req.query.filters?.title // Get title filter
    const catFilter = req.query.filters?.cat // Get category filter
    const sortVal = req.query.sort?.sortVal // Get sort value
    const isAsc = req.query.sort?.isAsc // Get sort order
    const productsInfo = await productService.getProducts(priceFilter, titleFilter, catFilter, sortVal, isAsc) // Get filtered products
    res.json(productsInfo.products) // Send products as JSON
  } catch (e) {
    console.log('Error filtering products:', e) // Log any errors
    res.status(500).json({ error: 'Internal Server Error' }) // Send 500 status code with error message
  }
}

// Function gets a product by ID
const getProduct = async (req, res) => {
  let product = null // Initialize product variable
  let cats = [] // Initialize categories variable
  try {
    cats = await productService.getDistinctCats() // Get distinct categories
  } catch (e) {
    console.log('Error fetching categories:', e) // Log any errors
    return res.status(500).send('Internal Server Error') // Send 500 status code
  }

  if (!req.params.id) return res.render('edit-product.ejs', { product, cats }) // Render edit page if no ID

  try {
    product = await productService.getProductById(req.params.id) // Get product by ID
  } catch (e) {
    console.log('Error fetching product by ID:', e) // Log any errors
    return res.status(500).send('Internal Server Error') // Send 500 status code
  }

  if (!product) {
    return res.status(404).json({ errors: ['Product not found'] }) // Return 404 if product not found
  } else if (req.path.includes('edit')) {
    res.render('edit-product.ejs', { product, cats }) // Render edit page if path includes 'edit'
  } else {
    try {
      const isManager = await loginController.getIsManager(req, res) // Check if user is manager
      res.render('product.ejs', { product, isManager }) // Render product page
    } catch (e) {
      console.log('Error checking manager status:', e) // Log any errors
      res.status(500).send('Internal Server Error') // Send 500 status code
    }
  }
}

// Function creates a new product
const createProduct = async (req, res) => {
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body // Destructure product details from request body
  try {
    const newProduct = await productService.createProduct(title, color, cat, price, gender, favePlayer, srcImg, sizes) // Create product
    res.json(newProduct) // Send new product as JSON
  } catch (e) {
    console.log('Error creating product:', e) // Log any errors
    res.status(500).json({ error: 'Internal Server Error' }) // Send 500 status code with error message
  }
}

// Function updates an existing product
const updateProduct = async (req, res) => {
  let id = req.params.id // Get product ID from request params
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body // Destructure product details from request body
  try {
    await productService.updateProduct(id, title, color, cat, price, gender, favePlayer, srcImg, sizes) // Update product
    res.json({ message: 'Product updated successfully' }) // Send success message
  } catch (e) {
    console.log('Error updating product:', e) // Log any errors
    res.status(500).json({ error: 'Internal Server Error' }) // Send 500 status code with error message
  }
}

// Function deletes a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id) // Delete product by ID
    if (!product) {
      return res.status(404).json({ errors: ['Product not found'] }) // Return 404 if product not found
    } else {
      res.json(product) // Send deleted product as JSON
    }
  } catch (e) {
    console.log('Error deleting product:', e) // Log any errors
    res.status(500).json({ error: 'Internal Server Error' }) // Send 500 status code with error message
  }
}

// Function toggles product in wishlist
const toggleWishlist = async (req, res) => {
  const { productId, isAdding } = req.body // Destructure product ID and action from request body
  const username = req.session.username // Get logged-in username

  if (!username) {
    return res.status(401).json({ success: false, message: 'You must log in first to add to favorites.' }) // Return 401 if not logged in
  }

  try {
    const client = await Client.findOne({ username }) // Find client by username

    if (isAdding) {
      if (!client.faveItems.includes(productId)) {
        client.faveItems.push(productId) // Add product to favorites if not already included
      }
    } else {
      client.faveItems = client.faveItems.filter(item => item.toString() !== productId) // Remove product from favorites
    }

    await client.save() // Save updated client

    res.json({ success: true }) // Send success response
  } catch (error) {
    console.error('Error toggling wishlist:', error) // Log any errors
    res.status(500).json({ success: false, error: 'Internal Server Error' }) // Return 500 if server error
  }
}

// Export functions
module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByFilter,
  toggleWishlist,
  getFaveProductIds
}
