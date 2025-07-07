const paypal = require('@paypal/checkout-server-sdk');
const Match = require('../models/Match');
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


exports.createPayment = async (req, res) => {
  const { matchId, userId, amount } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: "EUR",
        value: amount.toFixed(2)
      }
    }],
    application_context: {
      return_url: `${process.env.PAYPAL_RETURN_URL}?matchId=${matchId}&userId=${userId}`,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    }
  });
  try {
    const order = await client().execute(request);
    const approvalUrl = order.result.links.find(link => link.rel === "approve").href;
    res.json({ orderId: order.result.id, approvalUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.capturePayment = async (req, res) => {
  const { orderId, matchId, userId } = req.query;
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    await client().execute(request);


    const match = await Match.findById(matchId);
    if (!match.paidPlayers.includes(userId)) {
      match.paidPlayers.push(userId);
      await match.save();
    }


    if (match.paidPlayers.length === match.players.length) {
    }

    res.json({ success: true, message: "Pagamento efetuado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao capturar pagamento." });
  }
};
