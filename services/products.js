const Product = require('../models/products') // Import Product model

// Function creates a new product
const createProduct = async (title = "", color = "", cat = "", price = 0, gender = "", favePlayer = "", srcImg = [], sizes = [], toDisplay = true) => {
  const product = new Product({
    title, // Set product title
    color, // Set product color
    cat, // Set product category
    srcImg, // Set product image sources
    favePlayer, // Set favorite player
    price, // Set product price
    gender, // Set product gender
    sizes, // Set product sizes
    toDisplay // Set display status
  })

  try {
    return await product.save() // Save product to database and return it
  } catch (e) {
    console.error('Error saving product:', e) // Log error
    throw new Error('Error saving product') // Throw a new error
  }
}

// Function gets distinct product categories
const getDistinctCats = async () => {
  try {
    // Check categories of products that are for display (not edited shirts for example)
    const filter = { toDisplay: { $ne: false } }
    return await Product.find(filter).distinct("cat") // Find distinct categories in products
  } catch (e) {
    console.error('Error fetching distinct categories:', e) // Log error
    throw new Error('Error fetching distinct categories') // Throw a new error
  }
}

// Function gets a product by ID
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id) // Find product by ID
    return product // Return the product
  } catch (e) {
    console.error('Error fetching product by ID:', e) // Log error
    throw new Error('Error fetching product by ID') // Throw a new error
  }
}

// Function gets products with optional filters and sorting
const getProducts = async (priceFilter = '', titleFilter = '', catFilter = '', sortVal = '', isAsc) => {
  const filter = { toDisplay: { $ne: false } } // Set default filter to exclude hidden products

  if (priceFilter && priceFilter != "null" && priceFilter > 0) {
    filter.price = { $lt: priceFilter } // Add price filter
  }
  if (titleFilter && titleFilter != "null") {
    filter.title = new RegExp(titleFilter, 'i') // Add title filter
  }
  if (catFilter && catFilter != "null") {
    filter.cat = { $in: catFilter } // Add category filter
  }

  try {
    let products = []
    if (sortVal && sortVal != "null") {
      isAsc = isAsc == "true" ? 1 : -1 // Set sort order
      const sortObj = {}
      sortObj[sortVal] = isAsc // Set sort field and order
      products = await Product.find(filter).collation({locale: "en"}).sort(sortObj) // Find and sort products
    } else {
      products = await Product.find(filter) // Find products without sorting
    }

    const productMaxPrice = await Product.find({}).sort({ "price": -1 }).limit(1) // Find product with highest price
    const maxPrice = productMaxPrice ? productMaxPrice[0].price : 10000 // Get max price or default

    const productMinPrice = await Product.find({}).sort({ "price": 1 }).limit(1) // Find product with lowest price
    const minPrice = productMinPrice ? productMinPrice[0].price : 0 // Get min price or default

    const cat = await getDistinctCats() // Get distinct categories

    const res = { maxPrice, minPrice, cat, products } // Combine results into an object
    return res // Return the results
  } catch (e) {
    console.error('Error fetching products:', e) // Log error
    throw new Error('Error fetching products') // Throw a new error
  }
}

// Function updates a product by ID
const updateProduct = async (id, title = "", color = "", cat = "", price = 0, gender = "", favePlayer = "", srcImg = [], sizes = [], toDisplay = true) => {
  try {
    const product = await getProductById(id) // Get product by ID
    if (!product) {
      throw new Error('Product not found') // Throw error if product not found
    }

    if (title) product.title = title // Update title if provided
    if (color) product.color = color // Update color if provided
    if (price) product.price = price // Update price if provided
    if (gender) product.gender = gender // Update gender if provided
    if (cat) product.cat = cat // Update category if provided
    if (favePlayer) product.favePlayer = favePlayer // Update favorite player if provided
    if (srcImg.length !== 0) product.srcImg = srcImg // Update image sources if provided
    if (sizes.length !== 0) product.sizes = sizes // Update sizes if provided
    product.toDisplay = toDisplay // Update display status

    await product.save() // Save updated product to database
    return product // Return the updated product
  } catch (e) {
    console.error('Error updating product:', e) // Log error
    throw new Error('Error updating product') // Throw a new error
  }
}

// Function deletes a product by ID
const deleteProduct = async (id) => {
  try {
    const product = await getProductById(id) // Get product by ID
    if (!product) {
      throw new Error('Product not found') // Throw error if product not found
    }

    await product.remove() // Remove product from database
    return product // Return the deleted product
  } catch (e) {
    console.error('Error deleting product:', e) // Log error
    throw new Error('Error deleting product') // Throw a new error
  }
}

// Function gets product stats by category
const getStats = async () => {
  try {
    // Mongoose groupby (aggregation)
    const data = await Product.aggregate([
      {
        $match: {
          "cat": {
            $exists: true, // Match products with existing categories
            $ne: null // Exclude null categories
          }
        }
      },
      {
        $group: {
          _id: '$cat', // Group by category
          count: { $sum: 1 } // Count products in each category
        }
      },
      {
        $sort: { "_id": 1 } // Sort categories alphabetically
      }
    ])

    return data // Return the aggregated data
  } catch (e) {
    console.error('Error fetching product stats:', e) // Log error
    throw new Error('Error fetching product stats') // Throw a new error
  }
}

// Export functions
module.exports = {
  createProduct, 
  getProductById, 
  getProducts, 
  updateProduct, 
  deleteProduct, 
  getDistinctCats, 
  getStats 
}
