const Category = require("../models/category");
const formidable = require("formidable");
const _ = require("lodash");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "CATEGORY NOT FOUND IN DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "CATEGORY CANNOT BE SAVED IN DB",
      });
    }

    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO CATEGORY FOUND",
      });
    }

    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  const category = req.category;
  category.name = req.body.name;
  // console.log(category.name);

  form.parse(req, (err, fields, file) => {
    const { name } = fields;
    let category = req.category;
    category = _.extend(category, fields);
    category.save((err, updatedCategory) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO UPDATE THE CATEGORY",
        });
      }
      res.json(updatedCategory);
    });
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  Category.findOneAndRemove({ name: category.name }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED TO DELETE THE CATEGORY",
      });
    }
    //console.log(category);
    res.json({
      message: `SUCCESSFULLY DELETED THE CATEGORY ${category.name}`,
    });
  });
};
