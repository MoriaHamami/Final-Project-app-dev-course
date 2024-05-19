const productService = require('../services/products');

const createProduct = async (req, res) => {
  // console.log('here:', req.body)
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body
  try{
    const newProduct = await productService.createProduct(title, color, cat, price, gender, favePlayer, srcImg, sizes)
    // res.redirect("/products/product/"+newProduct._id);
    res.json(newProduct)
    // console.log('product.id:', newProduct._id)
// console.log('redirect:')
  }
  catch(e){
    // return e
    res.json(e)
    // return res.json("Product wasn't added successfully"+ e)
  }
  // res.json(newProduct);
  
}

const getProducts = async (req, res) => {
  const products = await productService.getProducts();
  // res.json(products);
  res.render('products.ejs', { products })
}

const getProduct = async (req, res) => {
  if (!req.params.id) return res.render('edit-product.ejs', { product: null })
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ errors: ['Product not found'] });
  }
  else if (req.path.includes('edit'))
    res.render('edit-product.ejs', { product })
  else
    res.render('product.ejs', { product })
  // console.log('req:', req)
  // res.json(product);
}

const updateProduct = async (req, res) => {
// const i = req.body
// console.log('i:', i)
let id = req.params.id;
  // if (!req.body.title) {
  //   return res.status(400).json({
  //     message: "title is required",
  //   })
  // }
  const { title, color, cat, price, gender, favePlayer, srcImg, sizes } = req.body
try{

  const product = await productService.updateProduct(id, title, color, cat, price, gender, favePlayer, srcImg, sizes)
  // console.log('product:', product)
}catch(e){
  res.json("Product wasn't saved successfully"+ e)
}
  // if (!product) {
  //   return res.status(404).json({ errors: ['Product not found'] });
  // }

  // res.json(product)
}

const deleteProduct = async (req, res) => {
  try{
// console.log('req.params.id:', req.params.id)
    const product = await productService.deleteProduct(req.params.id)
    // console.log('product:', product)
    if (!product) {
      return res.status(404).json({ errors: ['Product not found'] })
    } 
    else{
      res.json(product)
    }
    // else{
    //   return product
    // }
    // res.redirect("/")
    // window.location.reload()
    // req.method = 'GET'
   
  } catch(e){
    res.json("Product wasn't deleted successfully"+ e)
  }


  // res.send()
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}
