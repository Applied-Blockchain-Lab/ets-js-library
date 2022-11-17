import { BigNumber } from "ethers";

function calculateTotalValue(priceData) {
  let value = BigNumber.from(0);

  for (let i = 0; i < priceData.length; i++) {
    value = value.add(priceData[i].price.mul(priceData[i].amount));
  }

  return value;
}

export { calculateTotalValue };
