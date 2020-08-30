const Product = require("../models/product");
const router = require("../routes/auth");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "PRODUCT WAS NOT FOUND!!",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable({ keepExtensions: true });

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "PROBLEM WITH IMAGE",
      });
    }

    //TODO: RESTRICTION ON FIELDS
    const { name, description, price, category, stock } = fields;

    //VALIDATION
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "PLEASE MENTION ALL THE REQUIRED FIELDS",
      });
    }

    let product = new Product(fields);

    //HANDLE FILE
    if (file.photo.size > 3000000) {
      //HANDLE FILE SIZE
      return res.status(400).json({
        error: "IMAGE SIZE SHOULD BE LESS THAN 3MB",
      });
    }

    product.photo.data = fs.readFileSync(file.photo.path); //SET PATH
    product.photo.contentType = file.photo.type;
    //SAVE TO DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO SAVE TSHIRT IN DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  res.json(req.product);
};

//MIDDLEWARE
exports.getPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    //SAFETY CHECK IF THERE IS DATA ONLY THEN SEND IT
    res.set("Content-Type", req.product.photo.contentType); //TELLS SERVER WHAT TYPE OF DATA IT SHOULD EXPECT
    return res.send(req.product.photo.data);
  }
  next();
};

//DELETE PRODUCT
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product"
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedProduct
    });
  });
};

//UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(product);
    });
  });
};

//GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8; //Query from front end is sent as a string
  let sort = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") //not selecting photo for faster execution
    .limit(limit)
    .sort([[sort, "asc"]])
    .populate("category")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO PRODUCTS FOUND",
        });
      }
      res.json(products);
    });
};

//UPDATE INVENTORY
exports.updateStock = (req, res, next) => {
  const myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "BULK OPERATIONS FAILED",
      });
    }
  });
  next();
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "CANNOT GET UNIQUE CATEGORIES",
      });
    }
    res.json(category);
  });
};
