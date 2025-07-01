// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// exports.createPaymentIntent = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'eur',
//       payment_method_types: ['card'],
//     });

//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error('Stripe Error:', error);
//     res.status(500).json({ error: error.message });
//   }
// };
