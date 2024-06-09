const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");

// get review listing
router.get("/review-list", async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.json({ success: true, Users: reviews });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a review to a product
router.post("/create-review", async (req, res) => {
  const { productId, userId, reviewTitle, reviewDetail, userRating } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newReview = new Review({
      productId,
      userId,
      reviewerName: user.name,
      reviewTitle,
      reviewDetail,
      userRating,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// {
//     "productId": "6664282894110ef5878b6a90",
//     "userId": "66643403a7b235d4e86d90e3",
//     "reviewTitle":"Very good product",
//     "reviewDetail" : "I have purchased a product which is so awesome that I can continue to enjoy it",
//     "userRating" : "4.5"

// }
