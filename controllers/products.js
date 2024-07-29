const productService = require('../services/products');
const loginController = require('./login');
const Client = require('../models/clients');

const getProducts = async (req, res) => {
  try {
    const username = req.session.username;
    let favoriteProductIds = []; // הגדרת המשתנה

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
      favoriteProductIds,
    });
  } catch (e) {
    console.log('e:', e);
  }
};



const getProductsByFilter = async (req, res) => {
  try {
    const { price, title, cat, sortVal, isAsc } = req.query.filters || {};
    const productsInfo = await productService.getProducts(price, title, cat, sortVal, isAsc);
    res.json(productsInfo.products);
  } catch (e) {
    console.log('e:', e);
  }
};

const getProduct = async (req, res) => {
  let product = null;
  let cats = [];
  try {
    cats = await productService.getDistinctCats();
  } catch (e) {
    console.log('e:', e);
  }

  if (!req.params.id) return res.render('edit-product.ejs', { product, cats });

  try {
    product = await productService.getProductById(req.params.id);
  } catch (e) {
    console.log('e:', e);
  }

  if (!product) {
    return res.status(404).json({ errors: ['Product not found'] });
  } else if (req.path.includes('edit')) {
    res.render('edit-product.ejs', { product, cats });
  } else {
    try {
      const isManager = await loginController.getIsManager(req, res);
      res.render('product.ejs', { product, isManager });
    } catch (e) {
      console.log('e:', e);
    }
  }
};

const createProduct = async (req, res) => {
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body;
  try {
    const newProduct = await productService.createProduct(title, color, cat, price, gender, favePlayer, srcImg, sizes);
    res.json(newProduct);
  } catch (e) {
    res.json(e);
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body;
  try {
    await productService.updateProduct(id, title, color, cat, price, gender, favePlayer, srcImg, sizes);
    res.json("Product was updated successfully");
  } catch (e) {
    res.json("Product wasn't updated successfully" + e);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      res.status(404).json({ errors: ['Product not found'] });
    } else {
      res.json(product);
    }
  } catch (e) {
    res.json("Product wasn't deleted successfully" + e);
  }
};

const toggleWishlist = async (req, res) => {
  const { productId, isAdding } = req.body;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ success: false, message: 'עליך להתחבר תחילה כדי להוסיף למועדפים.' });
  }

  try {
    const client = await Client.findOne({ username });

    if (isAdding) {
      if (!client.faveItems.includes(productId)) {
        client.faveItems.push(productId);
      }
    } else {
      client.faveItems = client.faveItems.filter(item => item.toString() !== productId);
    }

    await client.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByFilter,
  toggleWishlist
};
