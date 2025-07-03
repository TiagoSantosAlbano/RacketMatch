const paypal = require('@paypal/checkout-server-sdk');
const User = require('../models/User');

function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// 1. Rota para criar pagamento e devolver approvalUrl
exports.createPayment = async (req, res) => {
  const { userId } = req.body; // Envia isto do frontend
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "EUR",
        value: "3.99"
      }
    }],
    application_context: {
      return_url: `${process.env.PAYPAL_RETURN_URL}?userId=${userId}`,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    }
  });
  try {
    const order = await client().execute(request);
    const approvalUrl = order.result.links.find(link => link.rel === "approve").href;
    res.json({ approvalUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Rota chamada pelo PayPal após o pagamento (return_url)
exports.capturePayment = async (req, res) => {
  const { token, userId } = req.query;
  try {
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    await client().execute(request);

    // Marca o utilizador como premium!
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumSince: new Date()
    });

    // Redireciona de volta para o mobile ou mostra mensagem
    res.send("Pagamento efetuado! Podes fechar esta janela e voltar à app.");
  } catch (err) {
    res.status(500).send("Erro ao capturar pagamento.");
  }
};
