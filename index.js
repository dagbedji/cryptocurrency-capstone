import dotenv from 'dotenv'; // Import the dotenv module
dotenv.config(); // Load the environment variables 
import Stripe from 'stripe';// Import the Stripe module
import express from "express";// Import the express module
import path from "path";
import { fileURLToPath } from 'url';
import axios from "axios";



const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3000;
const crypapp = [
  { fname : "BTC", link:"bitcoins", name : "Bitcoin", logo: "/pictures/1.png", price: "", taux: "" },
  { fname : "ETH", link:"ethereum", name : "Ethereum", logo: "/pictures/etherum.png", price: "", taux: "" },
  { fname : "LTC", link:"litecoin", name : "LTC", logo: "/pictures/bnb.png", price: "", taux: "" },
  { fname : "SOL", link:"solana", name : "Solana", logo: "/pictures/sol.png", price: "", taux: "" },
];
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const crypt= ["LTC-EUR", "SOL-USDT", "BTC-USD", "ETH-USD" ];

const API_URL = "https://api.blockchain.com/v3/exchange/tickers";
//add express.json() middleware to parse the request body

//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));




app.get('/', async (req, res) => {
  try {
    // Fetch data from the Blockchain API
    const { data } = await axios.get('https://api.blockchain.com/v3/exchange/tickers');
    crypt.forEach(symbol =>{
      const cryptoData = data.find(item => item.symbol === symbol); 
      //pour chaque element dans crypt, cherche dans data(API) symbol correspondant.
      //find ici cherche le prend le array et l'affecte a cryptoData
      console.log("cryptoData:", cryptoData);
      
      // ici crypt array = symbol du API, prend tout les array qui correspond
      if (cryptoData){
        let cryptoPrice = cryptoData.last_trade_price; //dans le array on va chercher le prix(ceci retourne tout les valeur prix)
        let formattedPrice = new Intl.NumberFormat().format(cryptoPrice); //conversion en une valeur monetaire
        console.log(formattedPrice);
        let roundedVolume = (cryptoData.volume_24h).toFixed(2); // on affecte ici le pourcentage a cette variable
        console.log(roundedVolume)

      //affectation des valeur precedente a crypapp
      const cryptoIndex = crypapp.findIndex(item => item.fname === symbol.split('-')[0]); //findindex permet de retrouver l'index.
      //compare la valeur BTC de (symbole) par example a celui de fname dans cryptapp)
      //si la valeur correspond, il trouve son index dans le crypapp dans notre cas BTC
      // a pour index 0 dans crypapp et affecte cette valeur a cryptoindex.
      console.log(`Symbol: ${symbol.split('-')[0]}, Found Index: ${cryptoIndex}`);
      if (cryptoIndex !== -1){ //si la valeur de l'index existe
        crypapp[cryptoIndex].price = `${formattedPrice}`; //on execute ce code afin d'affecter la valeur a la position adequate
        crypapp[cryptoIndex].taux = `${roundedVolume}`;
      };
    }
  
    });
    // Pass the data to the EJS template
    res.render('index',{crypapp : crypapp});
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Error fetching cryptocurrency data');

    //update the corresponding entry
    
  };
});

  app.get("/store/:link", (req, res) => { // Store route with dynamic parameter (link) which is the name of the page 
    const name = req.params.link; //recupere le nom de la page dans le url et le stock dans name 
    const find = crypapp.find(element => element.link === name); //cherche dans crypapp le nom qui correspond a name
    console.log("name:", name);
    console.log("find:", find);
    if (find){
      res.render("store.ejs", {store: find});

    }
    else{
      res.status(404).send('Item not found');
    };
  });


// Checkout route
app.post('/checkout', async (req, res) => {
  const { amount, quantity, storeName} = req.body;
  console.log('Amount:', amount);  // Debugging
  console.log('Quantity:', quantity)
  
  if (!amount) {
      return res.status(400).send('Amount is required.');
  }

  try {
      const session = await stripe.checkout.sessions.create({ // Create a new Stripe session
          payment_method_types: ['card'],
          line_items: [
              {
                  price_data: {
                    currency: 'usd', // Currency code
                      product_data: {
                        name: 'Achetez ' + quantity + ' ' + storeName + ' et rejoignez la révolution numérique !', // Product name
                      },
                      unit_amount: Math.round(amount * 100), // Amount in cents
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect to this page after payment
          cancel_url: `${process.env.BASE_URL}/cancel`,
      });

      res.json({ url: session.url }); // Send the checkout URL to the client
  } catch (error) {
      console.error('Error creating Stripe session:', error);
      res.status(500).send('Failed to create Stripe session.');
  }
});

app.get('/success', async (req, res) => { // Success route
  const result = Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {expand: ['payment_intent.payment_method']}), // Retrieve the session
    console.log(req.query.session_id),
    stripe.checkout.sessions.listLineItems(req.query.session_id) // Retrieve the line items
  ]);
  //console.log(JSON.stringify(await result));
  res.render('succes');
});


app.get('/cancel', (req, res) => { // Cancel route
  res.redirect('/');
});
  
app.listen(port, () =>{
    console.log(`Server is listen on port ${port}`);
  });
