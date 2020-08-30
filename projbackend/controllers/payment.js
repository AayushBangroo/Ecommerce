var braintree = require("braintree");
const express = require("express");
const router = express.Router();

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "69bmfsbxnh47fgg2",
  publicKey: "32qx8myxj969mqc7",
  privateKey: "9f2aca4babd60e9f36ae296364317e43",
});

exports.getToken = (req,res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      //console.log(response);
      res.send(response);
    }
  });
};

exports.processPayment = (req,res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
};
