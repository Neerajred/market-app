# Fresh-Mart - E-commerce Application

A modern, fully responsive e-commerce web application built with React, featuring a complete shopping experience from browsing to order tracking.

## 🚀 Features

### Core Features
- **Product Catalog**: Browse 100+ products across 9 categories
- **Shopping Cart**: Add, remove, and manage quantities
- **User Authentication**: Login and registration with email validation
- **Complete Checkout Flow**: 
  - Shipping information
  - Multiple payment methods (Credit/Debit Card, UPI, Cash on Delivery)
  - Order confirmation
  - Order tracking
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Real-time Cart Updates**: Live cart count in header
- **Category Navigation**: Easy filtering by product categories

### Technical Features
- Environment variable configuration
- Centralized API service layer
- Reusable utility functions and constants
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Axios for HTTP requests
- React Router for navigation

## 📱 Pages

1. **Home** - Browse products by category
2. **Cart** - Review and manage cart items
3. **Login** - User authentication
4. **Register** - New user registration
5. **Checkout** - Enter shipping information
6. **Payment** - Select payment method and complete purchase
7. **Order Confirmation** - View order details
8. **Order Tracking** - Track order status

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **State Management**: React Hooks

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd market-app-main

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=https://market-app-backend-1.onrender.com
REACT_APP_NAME=Fresh-Mart
```

## 📁 Project Structure

```
market-app-main/
├── public/
│   ├── index.html
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── Components/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Header/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Navbar/
│   │   ├── OrderConfirmation/
│   │   ├── OrderTracking/
│   │   ├── Payment/
│   │   ├── Profile/
│   │   └── RegisterPage/
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── utils/
│   │   ├── constants.js        # App constants
│   │   └── helpers.js          # Utility functions
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── ProductsList.js
├── .env                        # Environment variables
├── .env.example               # Environment template
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Hamburger menu for navigation
- Touch-optimized buttons
- Collapsible sidebar
- Optimized product cards
- Mobile-friendly forms

## 🔐 API Integration

All API calls are centralized in `src/services/api.js`:

```javascript
import { authAPI, orderAPI } from './services/api';

// Login
await authAPI.login(email, password);

// Register
await authAPI.register(userData);

// Create Order
await orderAPI.createOrder(orderData);
```

## 🎯 Key Improvements

### From Previous Version

1. **Environment Configuration**: API URLs now use environment variables
2. **Responsive Design**: Complete mobile and desktop optimization
3. **Checkout Flow**: Added 4 new pages for complete purchase journey
4. **Better UX**: Improved animations, transitions, and user feedback
5. **Code Organization**: Separated concerns with services and utilities
6. **API Layer**: Centralized HTTP requests with Axios interceptors
7. **Modern UI**: Gradient backgrounds, shadows, and hover effects
8. **Accessibility**: Better focus states and keyboard navigation

## 🚦 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation!**

## 📝 Usage Guide

### Shopping Flow

1. **Browse Products**: Select a category from the sidebar
2. **Add to Cart**: Click "Add to Cart" on desired products
3. **View Cart**: Click cart icon in header
4. **Checkout**: Click "Proceed to Checkout"
5. **Enter Shipping**: Fill in delivery information
6. **Payment**: Choose payment method and complete
7. **Confirmation**: View order details and tracking information

### User Authentication

1. **Register**: Click "Register" → Fill form → Submit
2. **Login**: Click "Login" → Enter credentials → Submit
3. **Profile**: Click profile icon → View info or logout

## 🐛 Known Issues

- Some product images in Beverages, Spices, and Breakfast categories use placeholder URLs
- Backend API validation may need to be adjusted based on your server configuration

## 🔮 Future Enhancements

- [ ] Product search functionality
- [ ] Wishlist feature
- [ ] Product reviews and ratings
- [ ] Order history page
- [ ] Multiple delivery addresses
- [ ] Coupon/discount codes
- [ ] Real-time inventory updates
- [ ] Email notifications
- [ ] Social media integration
- [ ] Product recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@freshmart.com or open an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Icons for the icon library
- All contributors and users of this project

---

Built with ❤️ using React and Tailwind CSS
