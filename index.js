const express = require('express');
const app = express();

// Шаардлагатай пакет
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');

// MongoDB холболт
const conexion = require('./database/db');
conexion.once('open', () => console.log('Mongo db opened'));
conexion.on('error', (error) => console.log('MongoDB connection error: ' + error));

// AdminBro (AdminJS) суулгах
const AdminBro = require('admin-bro');
const expressAdminBro = require('@admin-bro/express');
const mongooseAdminBro = require('@admin-bro/mongoose');

// Models
const User = require('./models/User');
const Post = require('./models/Post');
const Order = require('./models/Order');
const Product = require('./models/Product');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define where to store the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });
// AdminBro тохиргоо
AdminBro.registerAdapter(mongooseAdminBro);
const AdminBroOptions = {
  resources: [User, Post, Order, Product],
  branding: {
    companyName: 'My Company',
  }
};

const adminBro = new AdminBro(AdminBroOptions);
const router = expressAdminBro.buildRouter(adminBro);

// Express JSON parser - body data авах
app.use(express.json());

// Passport тохиргоо
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    // Нууц үг шалгах
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Session тохиргоо
app.use(session({
  secret: 'adminjs_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// AdminJS дээр аутентификац хийх
const routerWithAuth = expressAdminBro.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    }
    return null;
  },
  cookieName: 'adminjs',
  cookiePassword: 'somepassword',
});

app.use(adminBro.options.rootPath, routerWithAuth);

// Нэвтрэх хуудас
app.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login',
}));

app.post('/api/upload-product', upload.single('image'), async (req, res) => {
  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  // Create a new Product object with data from the form
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: `/uploads/${req.file.filename}`, // Store the file path in the database
  });

  try {
    await product.save(); // Save the product to the database
    res.status(200).send('Product uploaded successfully');
  } catch (error) {
    res.status(500).send('Error uploading product');
  }
});

app.get('/api/product/list', async (req, res) => {
  try {
    // Fetch all products from MongoDB
    const products = await Product.find();

    // If no products are found, return a 404 error
    if (!products || products.length === 0) {
      return res.status(404).send('No products found.');
    }

    // Format the products by ensuring the image URL is correct
    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      image: product.image.startsWith('http') 
        ? product.image  // If the image URL is already full, use it as is
        : `http://192.168.1.6:5000${product.image}`,  // If the image URL is relative, prepend the server's base URL
    }));

    // Send the formatted products back as a response
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Error retrieving products');
  }
});

// Define the route for getting product details by ID
app.get('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    // Fetch the product by ID from MongoDB
    const product = await Product.findById(id);

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Format the product by ensuring the image URL is correct
    const formattedProduct = {
      ...product.toObject(),
      image: product.image.startsWith('http')
        ? product.image  // If the image URL is already full, use it as is
        : `http://192.168.1.6:5000${product.image}`,  // If the image URL is relative, prepend the server's base URL
    };

    // Send the formatted product back as a response
    res.status(200).json(formattedProduct);
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).send('Error retrieving product');
  }
});

// Express серверийг эхлүүлэх
app.listen(5000, () => {
  console.log('Express started on http://localhost:5000');
});
