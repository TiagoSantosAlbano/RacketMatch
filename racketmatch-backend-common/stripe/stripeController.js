// stripe/stripeController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const YOUR_IP = '31.97.177.93'; // <- Teu IP público fixo
    const PORT = 5000;              // Ou o que usares no backend

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Plano Premium',
            },
            unit_amount: 500, // €5,00 (em cêntimos)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://${YOUR_IP}:${PORT}/sucesso`,    // <- Usa o IP aqui
      cancel_url: `http://${YOUR_IP}:${PORT}/pagamento/cancelado`, // <- Usa o IP aqui
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
