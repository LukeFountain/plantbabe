const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Plants = require("../models/Plants");

// const Story = require('../models/Plants')

//this is the show add page
//route GET /plants/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("plants/add");
});

//this will process the add form
//route POST /plants/add
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Plants.create(req.body);
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

// //this is the show the edit page
// //route GET /plants/edit/:id
// router.get("/edit/:id", ensureAuth, async (req, res) => {
//   const plants = await Plants.findOne({
//     _id: req.params.id,
//   }).lean();

//   if (!plants) {
//     return res.render("error/404");
//   }
//   if (plants.user != req.user.id) {
//     res.redirect("/plants");
//   } else {
//     res.render("plants/edit", {
//       plants,
//     });
//   }
// });

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const plants = await Plants.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!plants) {
        return res.render('error/404')
      }
  
      if (plants.user != req.user.id) {
        res.redirect('/plants')
      } else {
        res.render('plants/edit', {
          plants,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

// //this is the Update plants
// //route PUT /plants/:id
// router.put("/:id", ensureAuth, async (req, res) => {
//   let plants = await Plants.findById(req.params.id).lean();

//   if (!plants) {
//     return res.render("error/404");
//   }
//   if (plants.user != req.user.id) {
//     res.redirect("/plants");
//   } else {
//     plants = await Plants.findOneAndUpdate({ _id: req.params.id }, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.redirect("/dashboard");
//   }
// });

// @desc    Update story
// @route   PUT /stories/:id
router.post('/:id', ensureAuth, async (req, res) => {
    try {
      let plants = await Plants.findById(req.params.id).lean()
  
      if (!plants) {
        return res.render('error/404')
      }
  
      if (plants.user != req.user.id) {
        res.redirect('/plants')
      } else {
        plants = await Plants.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  

module.exports = router;
