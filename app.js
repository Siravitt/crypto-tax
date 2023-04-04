const { error } = require("console");
const fs = require("fs");

const taxCal = async () => {
  try {
    const data = await fs
      .readFileSync("crypto_tax.txt", { encoding: "utf8" })
      .split(" \n");

    const transactions = data.map((el) => {
      const [action, name, price, quantity] = el.split(" ");
      return { action, name, price: Number(price), quantity: Number(quantity) };
    });

    // console.log(transactions);

    const wallet = {};
    let profits = 0;

    for (const transaction of transactions) {
      const { action, name, price, quantity } = transaction;
      if (!wallet[name]) {
        wallet[name] = [];
      }
      if (action === "B") {
        wallet[name].push({ price, quantity });
      } else if (action === "S") {
        let soldQuantity = quantity;
        while (soldQuantity > 0 && wallet[name].length > 0) {
          const { price: buyPrice, quantity: buyQuantity } = wallet[name][0];
          
          const sellQuantity = Math.min(soldQuantity, buyQuantity);

          if (
            sellQuantity >
            wallet[name].reduce(
              (total, transaction) => total + transaction.quantity,
              0
            )
          ) {
            throw new Error(
              `Error: cannot sell more ${name} than currently held`
            );
          }

          const profit = (price - buyPrice) * sellQuantity;
          profits += profit;
          soldQuantity -= sellQuantity;
          wallet[name][0].quantity -= sellQuantity;
          if (wallet[name][0].quantity === 0) {
            wallet[name].shift();
          }
        }
        if (soldQuantity > 0) {
          throw new Error(
            `Error: cannot sell more ${name} than currently held`
          );
        }
      }
    }

    console.log(profits.toFixed(2));
  } catch (err) {
    console.log(err);
  }
};

taxCal();
