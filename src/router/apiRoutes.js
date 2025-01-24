// src/router/apiRoutes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const products = require("../models/products");
const orders  = require("../models/orders");
const User  = require("../models/user");
const Cart = require("../models/cart");
const orderId = require("order-id")("mysecret");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { validateSignup, validateSignin } = require("../../config/passport");


// Function to ensure category directories exist
const ensureCategoryDirectories = () => {
    const baseDir = 'public/images';
    const categories = ['fruits', 'vegetables', 'personalcare', 'uncategorized'];
    
    // Create base directory
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    
    // Create category directories
    categories.forEach(category => {
      const categoryPath = path.join(baseDir, category);
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
      }
    });
  };
  
  // Create directories on server start
  ensureCategoryDirectories();
  
  // Multer configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Default to uncategorized, will move file later if needed
      const baseDir = 'public/images/uncategorized';
      cb(null, baseDir);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const cleanFileName = file.originalname
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace(/[^a-z0-9.-]/g, '');
      
      cb(null, `${timestamp}-${cleanFileName}`);
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
  

// Admin Product Management Routes
router.get("/admin/products", isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      status,
      sort = "title_asc",
    } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status === "active") {
      query.is_deleted = false;
    } else if (status === "inactive") {
      query.is_deleted = true;
    }

    // Sort configuration
    let sortConfig = {};
    switch (sort) {
      case "title_desc":
        sortConfig.title = -1;
        break;
      case "price_asc":
        sortConfig.price = 1;
        break;
      case "price_desc":
        sortConfig.price = -1;
        break;
      case "created_desc":
        sortConfig.created_at = -1;
        break;
      case "created_asc":
        sortConfig.created_at = 1;
        break;
      default: // title_asc
        sortConfig.title = 1;
    }

    const totalProducts = await products.countDocuments(query);
    const productList = await products
      .find(query)
      .sort(sortConfig)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      products: productList,
      total: totalProducts,
      page: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch products",
    });
  }
});

router.get("/admin/products/:id", isAdmin, async (req, res) => {
  try {
    const product = await products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch product",
    });
  }
});

// Product routes
router.post('/admin/products', isAdmin, upload.single('image'), async (req, res) => {
    try {
      const productData = JSON.parse(req.body.data);
      
      if (req.file) {
        // Move file to correct category folder
        const category = productData.category || 'uncategorized';
        const oldPath = req.file.path;
        const newPath = path.join('public', 'images', category, req.file.filename);
        
        // Move the file
        fs.renameSync(oldPath, newPath);
        
        // Update image path in product data
        productData.image_path = `images/${category}/${req.file.filename}`;
      }
  
      const newProduct = new products(productData);
      await newProduct.save();
  
      res.status(201).json({
        message: 'Product created successfully',
        product: newProduct
      });
    } catch (error) {
      // Clean up uploaded file if product creation fails
      if (req.file) {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      res.status(500).json({
        error: error.message,
        message: 'Failed to create product'
      });
    }
});

router.put('/admin/products/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
      const productData = JSON.parse(req.body.data);
      
      if (req.file) {
        // Delete old image if it exists
        const oldProduct = await products.findById(req.params.id);
        if (oldProduct && oldProduct.image_path) {
          const oldImagePath = path.join('public', oldProduct.image_path);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // Move new file to correct category folder
        const category = productData.category || 'uncategorized';
        const oldPath = req.file.path;
        const newPath = path.join('public', 'images', category, req.file.filename);
        
        // Move the file
        fs.renameSync(oldPath, newPath);
        
        // Update image path in product data
        productData.image_path = `images/${category}/${req.file.filename}`;
      }
  
      const updatedProduct = await products.findByIdAndUpdate(
        req.params.id,
        productData,
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      // Clean up uploaded file if update fails
      if (req.file) {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      res.status(500).json({
        error: error.message,
        message: 'Failed to update product'
      });
    }
});

router.patch("/admin/products/:id/toggle-status", isAdmin, async (req, res) => {
  try {
    const product = await products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.is_deleted = !product.is_deleted;
    await product.save();

    res.json({
      message: `Product ${
        product.is_deleted ? "deactivated" : "activated"
      } successfully`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to toggle product status",
    });
  }
});

router.delete("/admin/products/:id", isAdmin, async (req, res) => {
  try {
    const product = await products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated image
    if (product.image_path) {
      const image_path = path.join("public", product.image_path);
      if (fs.existsSync(image_path)) {
        fs.unlinkSync(image_path);

        // Remove empty category directory if no other images exist
        const categoryDir = path.dirname(image_path);
        const remainingFiles = fs.readdirSync(categoryDir);
        if (remainingFiles.length === 0) {
          fs.rmdirSync(categoryDir);
        }
      }
    }

    await products.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to delete product",
    });
  }
});
router.post("/auth/login", (req, res, next) => {
  console.log("Login attempt with:", req.body);

  passport.authenticate("local.login", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }

    if (!user) {
      console.log("Authentication failed:", info);
      return res.status(200).json({
        message: info.message || "Invalid credentials",
        status: info.status
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({
          message: "Error logging in",
          error: err.message,
        });
      }

      console.log("User logged in successfully:", user.email);
      return res.json({
        user: {
          id: user._id,
          email: user.email,
          is_admin: user.is_admin,
          full_name: user.full_name,
          phone_number: user.phone_number,
          password: user.password,
        },
        status : true,
        message: "Login successful",
      });
    });
  })(req, res, next);
});

router.post("/auth/register", validateSignup, (req, res, next) => {
  passport.authenticate("local.signup", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: info.message || "Registration failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.json({ user: user.toJSON() });
    });
  })(req, res, next);
});
router.post("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the next middleware
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Order Routes
router.get("/admin/orders", isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, dateFilter } = req.query;

    let query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Date filter
    if (dateFilter) {
      const today = new Date();
      const oneWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const oneYear = new Date(today.getFullYear(), 0, 1);

      switch (dateFilter) {
        case 'today':
          query.date = { $gte: today.toISOString().slice(0, 10) };
          break;
        case 'week':
          query.date = { $gte: oneWeek.toISOString().slice(0, 10) };
          break;
        case 'month':
          query.date = { $gte: oneMonth.toISOString().slice(0, 10) };
          break;
        case 'year':
          query.date = { $gte: oneYear.toISOString().slice(0, 10) };
          break;
      }
    }

    const totalOrders = await orders.countDocuments(query);
    const orderList = await orders
      .find(query)
      .sort({ date: -1, time: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      orders: orderList,
      total: totalOrders,
      page: Number(page),
      totalPages: Math.ceil(totalOrders / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch orders",
    });
  }
});

router.patch("/admin/orders/:id/status", isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to update order status",
    });
  }
});

router.post("/admin/orders/:id/refund", isAdmin, async (req, res) => {
  try {
    const order = await orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Implement logic to process the refund
    // This could involve integration with a payment processor

    order.status = "refunded";
    await order.save();

    res.json({
      message: "Order refunded successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to refund order",
    });
  }
});

// User Management Routes
router.get("/admin/users", isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, dateFilter } = req.query;

    let query = {};

    // Role filter
    if (role) {
      query.role = role;
    }

    // Date filter
    if (dateFilter) {
      const today = new Date();
      const oneWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const oneYear = new Date(today.getFullYear(), 0, 1);

      switch (dateFilter) {
        case 'today':
          query.created_at = { $gte: today.toISOString().slice(0, 10) };
          break;
        case 'week':
          query.created_at = { $gte: oneWeek.toISOString().slice(0, 10) };
          break;
        case 'month':
          query.created_at = { $gte: oneMonth.toISOString().slice(0, 10) };
          break;
        case 'year':
          query.created_at = { $gte: oneYear.toISOString().slice(0, 10) };
          break;
      }
    }

    const totalUsers = await User.countDocuments(query);
    const userList = await User
      .find(query)
      .sort({ created_at: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      users: userList,
      total: totalUsers,
      page: Number(page),
      totalPages: Math.ceil(totalUsers / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch users",
    });
  }
});

router.get("/auth/me", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Session expired" });
  }
  res.json({ user: req.user });
});

router.patch("/users/:id/update-profile", async (req, res) => {
  try {
    const { full_name, phone_number } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.full_name = full_name;
    user.phone_number = phone_number;
    user.updated_at = new Date();
    await user.save();

    res.json({
      message: `Password updated successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to update user role",
    });
  }
});

// New password update route
router.patch("/users/:id/update-password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the password
    user.password = newPassword;
    user.password_changed_at = new Date();
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to update user password",
    });
  }
});

router.post("/admin/users/:id/reset-password", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Implement logic to reset the user's password
    // This could involve generating a new password and sending it to the user

    res.json({
      message: "User password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to reset user password",
    });
  }
});

router.patch("/admin/users/:id/suspend", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.active = !user.active;
    await user.save();

    res.json({
      message: `User account ${user.active ? 'activated' : 'suspended'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to suspend/activate user",
    });
  }
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 9, category, search } = req.query;
    let query = { is_deleted: false };
    if (category && category !== "all") {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Fetch all products on the first load
    if (page === 1 && !category && !search) {
      const productList = await products.find(query);
      const categories = await products.distinct("category");

      return res.json({
        products: productList,
        total: productList.length,
        pages: Math.ceil(productList.length / limit),
        page: 1,
        categories: [
          { id: "all", name: "All" },
          ...categories.map((cat) => ({ id: cat, name: cat })),
        ],
      });
    }

    // Apply pagination on subsequent requests
    const totalCount = await products.countDocuments(query);
    const productList = await products
      .find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const categories = await products.distinct("category");

    res.json({
      products: productList,
      total: totalCount,
      pages: Math.ceil(totalCount / Number(limit)),
      page: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cart Routes
router.get("/cart", (req, res) => {
  if (!req.session.cart) {
    return res.json({ items: [], total: 0 });
  }
  const cart = new Cart(req.session.cart.items);
  res.json({
    items: cart.lookupItems(),
    total: parseFloat(cart.totalPrice).toFixed(2),
  });
});

router.post("/cart/add", async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = new Cart(req.session.cart ? req.session.cart.items : {});
    const product = await products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    cart.add(product, productId, quantity);
    req.session.cart = cart;
    res.json({ message: "Product added to cart", cart: cart.lookupItems() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New Cart Item Routes
router.put("/cart/items/:itemId", (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    if (!req.session.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = new Cart(req.session.cart.items);
    cart.updateQuantity(itemId, quantity);
    req.session.cart = cart;

    res.json({
      message: "Cart item updated",
      cart: cart.lookupItems(),
      total: parseFloat(cart.totalPrice).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In apiRoutes.js
router.post("/cart/clear", (req, res) => {
  // Clear the cart from session
  delete req.session.cart;
  res.json({ message: "Cart cleared successfully" });
});

router.delete("/cart/items/:itemId", (req, res) => {
  const { itemId } = req.params;

  try {
    if (!req.session.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = new Cart(req.session.cart.items);
    cart.removeItem(itemId);
    req.session.cart = cart;

    res.json({
      message: "Cart item removed",
      cart: cart.lookupItems(),
      total: parseFloat(cart.totalPrice).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Routes
router.post("/orders", async (req, res) => {
  if (!req.session.cart) {
    return res.status(400).json({ message: "No items in cart" });
  }

  try {
    const {
      user_email,
      user_name,
      products,
      user_address,
      user_zipcode,
      user_country,
      user_state,
      total_price,
      payment_status,
      date,
      time,
      payment_method,
    } = req.body;

    const orderDetails = {
      order_id: orderId.generate(), // This is already set up in your imports
      user_email,
      user_name,
      products,
      user_address,
      user_zipcode,
      user_country,
      user_state,
      total_price,
      payment_status,
      date,
      time,
      payment_method,
      order_status: 'Pending' // Default status when order is created
    };

    const newOrder = new orders(orderDetails);
    await newOrder.save();

    // Clear the cart after successful order
    delete req.session.cart;

    res.json({
      message: "Order created successfully",
      order: newOrder,
      order_id: newOrder.order_id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to create order",
    });
  }
});

// Cancel Order Route
router.post("/orders/:order_id/cancel", isAuthenticated, async (req, res) => {
  try {
    const order = await orders.findOne({ 
      order_id: req.params.order_id, 
      user_email: req.user.email 
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation of pending orders
    if (order.order_status !== 'Pending') {
      return res.status(400).json({ 
        message: "Order cannot be cancelled. It may have already been processed." 
      });
    }

    order.order_status = 'Cancelled';
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to cancel order",
    });
  }
});

router.get("/orders/:email", async (req, res) => {
  try {
    const userOrders = await orders.find({ user_email: req.params.email });
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders for authenticated user
router.get("/orders", isAuthenticated, async (req, res) => {
  try {
    const userOrders = await orders
      .find({ user_email: req.user.email })
      .sort({ date: -1, time: -1 }); // Sort by date and time, newest first
    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch orders",
    });
  }
});

// Get specific order details by order_id
router.get("/orders/detail/:order_id", isAuthenticated, async (req, res) => {
  try {
    let query = { order_id: req.params.order_id };
    
    // Add user_email check only for non-admin users
    if (!req.user.is_admin) {
      query.user_email = req.user.email;
    }

    const order = await orders.findOne(query);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to fetch order details",
    });
  }
});

// Update existing route to remove email parameter and use authentication
// Replace the existing /orders/:email route with this:
router.get("/orders/user", isAuthenticated, async (req, res) => {
  try {
    const userOrders = await orders
      .find({ user_email: req.user.email })
      .sort({ date: -1, time: -1 });
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

module.exports = router;
