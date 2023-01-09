import { withdrawFees, setTicketFeePercentage, createTicketCategory, buyTickets } from "../src/index.js";
import { mockedContractData, DATES } from "./config.js";
import { expect } from "chai";
import { mockedCreateEvent, testSetUp, categoryIpfsUrl, ticketIpfsUrl } from "./utils.js";

const ONE_DAY = 1;

describe("Contract owner tests", function () {
  let eventFacet;
  let ticketControllerFacet;
  let eventId;
  let wallet;
  let signers;
  const onlyWhiteListedUsers = false;

  before(async function () {
    const result = await testSetUp();
    eventFacet = result.eventFacet;
    ticketControllerFacet = result.ticketControllerFacet;
    wallet = result.wallet;
    signers = result.signers;

    const maxTicketPerClient = 10;
    const startDate = DATES.EVENT_START_DATE;
    const endDate = DATES.EVENT_END_DATE;

    eventId = await mockedCreateEvent(
      maxTicketPerClient,
      startDate,
      endDate,
      onlyWhiteListedUsers,
      eventFacet,
      wallet,
      eventId,
    );

    // create ticket category
    const populatedTx = await createTicketCategory(categoryIpfsUrl, eventId, mockedContractData, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();
  });

  it("Should set fee for buying tickets and withdraw", async () => {
    const ticketBuyer = signers[2]; // buddy ignore:line

    const feePercentage = 3;
    const populatedTx = await setTicketFeePercentage(feePercentage, ticketControllerFacet);
    populatedTx.from = wallet.address;

    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const eventCategoryData = [
      {
        eventId,
        categoryId: 1,
      },
    ];

    const priceData = [
      {
        amount: 1,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 1,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [ONE_DAY * DATES.DAY]);

    const populatedTx2 = await buyTickets([ticketIpfsUrl], eventCategoryData, priceData, place, ticketControllerFacet);
    populatedTx2.from = ticketBuyer.address;
    const tx2 = await ticketBuyer.sendTransaction(populatedTx2);
    await tx2.wait();

    const feeFromSale = priceData[0].price.mul(feePercentage).div(100); // buddy ignore:line

    const contractOwnerBalanceBefore = await wallet.getBalance();

    const populatedTx3 = await withdrawFees(ticketControllerFacet);
    populatedTx3.from = wallet.address;
    const tx3 = await wallet.sendTransaction(populatedTx3);
    const res = await tx3.wait();

    const gasUsed = res.gasUsed;
    const gasFees = res.effectiveGasPrice.mul(gasUsed);

    const contractOwnerBalanceAfter = await wallet.getBalance();

    expect(contractOwnerBalanceAfter).to.equal(contractOwnerBalanceBefore.sub(gasFees).add(feeFromSale));
  });
});
