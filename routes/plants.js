const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

const { ensureAuth } = require("../middleware/auth");

const Plants = require("../models/Plants");

//this is the show add page
//route GET /plants/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("plants/add");
});

//this will process the add form
//route POST /plants/add
router.post("/", ensureAuth, upload.single("img"), async (req, res) => {
  
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
    req.body.user = req.user.id;
    await Plants.create({
      plantName: req.body.plantName,
      body: req.body.body,
      cloudinary_id: cloudinaryResponse.public_id,
      imageurl: cloudinaryResponse.secure_url,
      status: req.body.status,
      user: req.user._id,
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//this is the show all plants page
//route GET /plants
router.get("/", ensureAuth, async (req, res) => {
  try {
    const plants = await Plants.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("plants/index", {
      plants,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show single plant
// @route   GET /plants/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let plants = await Plants.findById(req.params.id).populate("user").lean();

    if (!plants) {
      return res.render("error/404");
    }

    if (plants.user._id != req.user.id && plants.status == "private") {
      res.render("error/404");
    } else {
      res.render("plants/show", {
        plants,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

// @desc    Show edit page
// @route   GET /plants/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const plants = await Plants.findOne({
      _id: req.params.id,
    }).lean();

    if (!plants) {
      return res.render("error/404");
    }

    if (plants.user != req.user.id) {
      res.redirect("/plants");
    } else {
      res.render("plants/edit", {
        plants,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Update plant entry
// @route   PUT /plants/:id
router.post("/:id", ensureAuth, async (req, res) => {
  try {
    let plants = await Plants.findById(req.params.id).lean();

    if (!plants) {
      return res.render("error/404");
    }

    if (plants.user != req.user.id) {
      res.redirect("/plants");
    } else {
      plants = await Plants.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Delete plant
// @route   DELETE /plants/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let plants = await Plants.findById(req.params.id).lean();

    if (!plants) {
      return res.render("error/404");
    }

    if (plants.user != req.user.id) {
      res.redirect("/plants");
    } else {
      await Plants.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    User plants
// @route   GET /plants/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const plants = await Plants.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("plants/index", {
      plants,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
