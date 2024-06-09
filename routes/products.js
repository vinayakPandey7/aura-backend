// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/review");

// Get all products
router.get("/product-list", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/product-detail/:productId", async (req, res) => {
  // http://localhost:3000/api/products/product-detail/666428b8e28e8b882578c2d1
  const { productId } = req.params;
  try {
    const productDetail = await Product.findOne({ _id: productId });
    const reviews = await Review.find({ productId: productId }).populate(
      "userId"
    );

    // const { userId, ...rest } = review.toObject(); // Convert Mongoose document to plain JS object and destructure
    // const reviews = { ...rest, userDetail: userId };

    let ratingFiveCount = 0,
      ratingFourCount = 0,
      ratingThreeCount = 0,
      ratingTwoCount = 0,
      ratingOneCount = 0;

    await reviews.map((reviewData) => {
      if (reviewData?.userRating === 5) {
        ratingFiveCount++;
      }
      if (reviewData?.userRating === 4) {
        ratingFourCount++;
      }
      if (reviewData?.userRating === 3) {
        ratingThreeCount++;
      }
      if (reviewData?.userRating === 2) {
        ratingTwoCount++;
      }
      if (reviewData?.userRating === 1) {
        ratingOneCount++;
      }
    });
    const totalRatingCount =
      ratingOneCount +
      ratingTwoCount +
      ratingThreeCount +
      ratingFourCount +
      ratingFiveCount;

    const overallReview = {
      reviewRatingData: {
        reviews,

        ratingFiveCount,
        ratingFourCount,
        ratingThreeCount,
        ratingTwoCount,
        ratingOneCount,
        totalRatingCount,
        overallRating:
          totalRatingCount !== 0
            ? (1 * ratingOneCount +
                2 * ratingTwoCount +
                3 * ratingThreeCount +
                4 * ratingFourCount +
                5 * ratingFiveCount) /
              totalRatingCount
            : 0,
        totalReviewCount: reviews?.length || 0,
      },
    };
    const productData = {
      productDetail,
      ...overallReview,
    };

    res.json({ success: true, data: productData });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new product
router.post("/add-product", async (req, res) => {
  // http://localhost:3000/api/products/add-product
  // {
  //   "imageUrl":
  //     "https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716508800&semt=ais_user",
  //   "productDiscount": 12,
  //   "productName": "Testing product added 1",
  //   "markedPrice": 2000,
  //   "currentPrice": 1600,
  //   "productImgs": [
  //   {
  //     "imgUrl":
  //       "https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716508800&semt=ais_user"
  //   },
  //   {
  //     "imgUrl":
  //       "https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716508800&semt=ais_user"
  //   },
  //   {
  //     "imgUrl":
  //       "https://img.freepik.com/free-photo/fresh-autumn-leaves-reveal-vibrant-organic-pattern-generated-by-ai_188544-15037.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1716508800&semt=ais_user"
  //   }
  // ],
  //   "productSpecs" :[ {
  //     "desc": "Unique Gift for Birthday, Anniversary, Wedding and any other occasion."
  //   },
  //   {
  //     "desc": "Beautifully Craved On Leaf"
  //   },
  //   { "desc": "Stay Forever Same" },
  //   { "desc": "Get it with Acrylic Frame" }]}

  const {
    imageUrl,
    productDiscount,
    productName,
    markedPrice,
    currentPrice,
    inStock,
    productDescription,
    productImgs,
    productSpecs,
  } = req.body;

  const newProduct = new Product({
    imageUrl,
    productDiscount,
    productName,
    markedPrice,
    currentPrice,
    inStock,
    productDescription,
    productImgs,
    productSpecs,
  });

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

// update product
router.put("/edit-product/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete("/delete-product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
