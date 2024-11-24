# Cryptocurrency Capstone Project

This project is a cryptocurrency web application built with Node.js, Express.js, and APIs like Stripe and Blockchain. It enables users to view live cryptocurrency data and seamlessly complete checkout processes for products or services using traditional payment methods through Stripe.
Explore and interact with live market data for various cryptocurrencies.

## Features

- Live Cryptocurrency Data: Fetches real-time cryptocurrency prices and trends using the Blockchain API.
- Responsive UI: A clean and user-friendly interface.
- Session Management: Securely retrieves payment sessions and their associated data.
- Error Handling: Provides detailed error messages for debugging and user-friendly notifications.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Payment Integration**: Stripe API
- **Cryptocurrency Data**: Blockchain API
- **Frontend**: EJS templates, HTML, CSS
- **Environment Variables**: Managed via .env file

## Installation

### Prerequisites
- Node.js and npm installed

Follow these steps to set up the project on your local machine:

1. Clone the repository:
```bash
git clone https://github.com/your-username/cryptocurrency-capstone.git
```
2. Navigate to the project directory:
```bash
cd cryptocurrency-capstone
```
3. Install dependencies:
```bash
npm install
npm init -y
npm install express ejs dotenv stripe axios
```
4. Create a .env file in the project root and add the following environment variables:
STRIPE_SECRET_KEY = your_stripe_secret_key
BLOCKCHAIN_API_KEY = your_blockchain_api_key
BASE_URL = http://localhost:3000

6. Start the development server:
npm start

## Usage

1. Run the Application: Start the server and navigate to http://localhost:3000 in your browser.
    - View Live Cryptocurrency Data:
2. The homepage displays current cryptocurrency prices and trends, fetched from the Blockchain API.
3. Create a Checkout Session:
    - Add products to the cart.
    - Click on "Checkout" to initiate the Stripe payment flow.
4. Payment Success:
    - After payment, the user is redirected to the /success page to view payment details.
    - The session ID and line items are retrieved using the Stripe API.
5. Payment Cancelation:
    - If the payment is canceled, the user is redirected to the /cancel page.

### Navigate to the Site
[Click here to visit the site](https://cryptocurrency-capstone.onrender.com)