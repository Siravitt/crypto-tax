const fs = require("fs");
// console.log(fs);

// const data = fs.readFile("crypto_tax.txt", "utf8", (err, data) => {
//   return data;
// });

const taxCal = async () => {
  try {
    const data = await fs.readFileSync("crypto_tax.txt", { encoding: "utf8" }).split(" \n");
    const transaction = data.map(el => {
        const [action, name, price, quantity] = el.split(" ")
        return {action, name, price: Number(price), qunatity: Number(quantity)}
    })

    console.log(transaction);
    

  } catch (err) {
    console.log(err);
  }
};

taxCal();
