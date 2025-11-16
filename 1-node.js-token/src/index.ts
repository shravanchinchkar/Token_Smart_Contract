import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());

type Address = string;

let balances: { [address: Address]: number } = {}; // Its an object where the key is of type Address and its value is of type number,basically its a inmemory database that tell how much balance everyone have.
/*
example of the above object
{
    "user1":10,000
    "user2":2500
}
*/

// The following is an object that tell how much amount the user has allowed another user to spend on behalf of the user
/*
{
    "user1":{
        "user2":10,000,
        "user3":5000
    }
}
*/
let allowances: {
  [address: Address]: {
    [address: Address]: number;
  };
} = {};

app.post("/create", (req, res) => {
  const { userId, initialBalance } = req.body;
  if (balances[userId]) {
    return res.status(400).send("Account already exists!");
  }
  balances[userId] = initialBalance;
  console.log("Balances of the users:", balances);
  res.send(`Account for ${userId} created with balance: ${initialBalance}`);
});

app.post("/transfer", (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;
  if (!balances[fromUserId] || !balances[toUserId]) {
    return res.status(400).send(`Account doesn't exist!`);
  }
  if (balances[fromUserId] < amount) {
    return res.status(400).send("Insufficient funds!");
  }
  balances[fromUserId] -= amount;
  balances[toUserId] += amount;
  res.send(`Transferred ${amount} tokens from ${fromUserId} to ${toUserId}`);
});

// allowance endpoint.
app.post("/approve", (req, res) => {
  const { ownerId, spenderId, amount } = req.body;
  if (!balances[ownerId]) {
    return res.status(400).send(`Account ${balances[ownerId]} doesn't exist!`);
  }

  if (!balances[spenderId]) {
    return res
      .status(400)
      .send(`Account ${balances[spenderId]} doesn't exist!`);
  }

  if (!allowances[ownerId]) {
    allowances[ownerId] = {};
  }

  allowances[ownerId][spenderId] = amount;
  res.send(
    `${ownerId} has approved ${spenderId} to spend ${amount} tokens on their behalf.`
  );
});

app.post("/transferFrom", (req, res) => {
  const { fromUserId, toUserId, spenderId, amount } = req.body;
  if (!balances[fromUserId] || !balances[toUserId]) {
    return res.status(400).send("Account doesn't exist!");
  }

  const allowedAmount =
    allowances[fromUserId] && allowances[fromUserId][spenderId];

  if (!allowedAmount || allowedAmount < amount) {
    return res.status(400).send("Insufficient allowance!");
  }
  if (balances[fromUserId] < amount) {
    return res.status(400).send("Insufficient funds!");
  }

  balances[fromUserId] -= amount;
  balances[toUserId] += amount;
  allowances[fromUserId][spenderId] -= amount;

  res.send(
    `${spenderId} transferred ${amount} tokens from account ${fromUserId} to account ${toUserId}`
  );
});

app.get("/balance/:userId", (req, res) => {
  const balance = balances[req.params.userId];
  if (balance === undefined) {
    return res.status(404).send("Account not found!");
  }
  res.send(`Balance of ${req.params.userId}: ${balance}`);
});

app.listen(port, () => {
  console.log(`Token simulator app listening on http://localhost:${port}`);
});
