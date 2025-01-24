### Welcome to PlentyCart Groceries!  

PlentyCart Groceries is designed to make grocery shopping convenient and enjoyable with a user-friendly interface. Currently, our online store offers products in three categories: **Fruits**, **Vegetables**, and **Personal Care**.  

While digital payment functionality is not yet available, the website includes several features to enhance your shopping experience. Below is an overview of the key functionalities and technical details:  

---

### 1. Application Features  

- **User Accounts**:  
  - Browse the store, add items to the cart, and check out as a **Guest** or a **Registered User**.  
  - Email and password validation is performed during sign-in/sign-up to ensure secure account creation.  
  - Passwords are securely stored as hashed values in the database.  

- **Product Details and Navigation**:  
  - View detailed product descriptions by clicking on product titles.  
  - Pagination displays up to 9 products per page for easy browsing.  

- **Search and Filter Options**:  
  - Search functionality supports both partial and full searches.  
  - Filter products by **category** and/or **price range**.  

- **Shopping Cart and Checkout**:  
  - Add or remove items from the cart.  
  - Enter shipping details during checkout.  

- **Order Management**:  
  - Place orders and store them in the database.  
  - Retrieve order history and cancel orders directly from the website.  

- **Admin Features**:  
  - Admin users can:  
    - Add new products with details like title, price, description, and images.  
    - Manage orders, users, and products.  
    - Search, edit, update, and soft-delete products.  

---

### 2. Database Design  

The project utilizes **MongoDB** with three primary data models:  

#### **1. User Model**  
Stores user account details, including:  
- Full name, phone number, email (lowercase), encrypted password (minimum 4 characters), and admin status.  
- Automatic timestamps for account creation and updates.  
- Additional fields for account status and password changes.  

#### **2. Product Model**  
Stores product details with the following attributes:  
- `imagePath`: Path to the product image (String).  
- `title`: Product title (String).  
- `price`: Product price (Number).  
- `price_description`: Detailed price information (optional, String).  
- `product_description`: Product details (String).  
- `category`: Product category (String).  
- `is_deleted`: Visibility flag for the product (default: `false`, Boolean).  

#### **3. Order Model**  
Tracks order details, including:  
- Unique `orderId`, user information (email, name, address, etc.), and order status (default: `Pending`).  
- Product details: Title, quantity, category, image path, and total price per product.  
- Total order amount, payment status, and order date/time.  

#### **4. Cart**  
Implements a session-based shopping cart for managing items, quantities, and pricing during user sessions.  

---

### 3. Technologies Used  

The project leverages the following technologies:  
- **Backend**: Node.js, Express.js  
- **Frontend**: Vue.js, JavaScript, Bootstrap  
- **Database**: MongoDB (with Mongoose for object modeling)  
- **Session Management**: express-session module  

With these features and technologies, PlentyCart Groceries aims to provide a seamless and enjoyable shopping experience for all users.




### Steps to Run the Project  

You can run the **PlentyCart Groceries** project in two ways:  

---

#### **1. Running Locally**  

Follow these steps to set up and run the project locally:  

1. **Clone the Repository**:  
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install Dependencies**:  
   Ensure you have **Node.js** and **npm** installed on your system. Then run:  
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:  
   Create a `.env` file in the root directory and configure the required variables:  
   ```env
   PORT=3030
   MONGO_URI=mongodb://localhost:27017/plentycart
   SESSION_SECRET=your_secret_key
   ```

4. **Start the Application**:  
   Run the following command to start the server:  
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3030`.

---

#### **2. Running with Docker**  

If you prefer to run the project using Docker, follow these steps:  

1. **Ensure Docker is Installed**:  
   Install Docker and Docker Compose on your system.  

2. **Build Project**:  
   From the project directory, run:  
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**:  
   The application will be available at `http://localhost:3030`.  

---

### Notes:  
- Make sure the **MongoDB database** is running and accessible. If needed, you can also use a Docker container for MongoDB by adding the following to a `docker-compose.yml` file: