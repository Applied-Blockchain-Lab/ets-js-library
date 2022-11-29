import {
  addCategoryTicketsCount,
  addRefundDeadline,
  buyTickets,
  clipTicket,
  createTicketCategory,
  fetchAllEventsFromServer,
  fetchCategoriesByEventId,
  fetchCountriesFromServer,
  fetchPlacesFromServer,
  getAddressTicketIdsByEvent,
  listeners,
  removeCategory,
  removeCategoryTicketsCount,
  returnTicket,
  setEventCashier,
  updateCategory,
  updateCategorySaleDates,
  withdrawRefund,
} from "../src/index.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { DATES, mockedEventParams, mockedContractData, errorMessages, EXAMPLE_ADDRESS } from "./config.js";
import { StatusCodes } from "http-status-codes";
import { expect } from "chai";
import { mockedCreateEvent, testSetUp, categoryIpfsUrl, ticketIpfsUrl } from "./utils.js";
import { spy } from "sinon";

describe("Visitor tests", () => {
  let mock;
  let eventFacet;
  let ticketFacet;
  let ticketControllerFacet;
  let firstEventTokenId;
  let secondEventTokenId;
  let wallet;
  let visitorWallet;
  let signers;
  const spyFunc = spy();
  const ONE_DAY = 1;
  const THREE_DAYS = 3;
  const TEN_DAYS = 10;

  function checkFunctionInvocation() {
    if (spyFunc.callCount === 0) {
      setTimeout(checkFunctionInvocation, 100); // buddy ignore:line
    } else {
      expect(spyFunc.callCount).to.be.at.least(1);
    }
  }

  before(async () => {
    const maxTicketPerClient = 10;

    const startDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + TEN_DAYS * DATES.DAY;
    const endDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp +
      (TEN_DAYS + TEN_DAYS) * DATES.DAY;

    mock = new MockAdapter(axios);
    ({ eventFacet, ticketControllerFacet, ticketFacet, signers, wallet } = await testSetUp());
    visitorWallet = signers[1];

    firstEventTokenId = await mockedCreateEvent(maxTicketPerClient, startDate, endDate, eventFacet, wallet);
    secondEventTokenId = await mockedCreateEvent(maxTicketPerClient + 1, startDate, endDate, eventFacet, wallet);

    mockedContractData.saleStartDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + ONE_DAY * DATES.DAY;
    mockedContractData.saleEndDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + THREE_DAYS * DATES.DAY;

    // create ticket category
    const populatedTx = await createTicketCategory(categoryIpfsUrl, firstEventTokenId, mockedContractData, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const populatedTx2 = await createTicketCategory(
      categoryIpfsUrl,
      secondEventTokenId,
      mockedContractData,
      eventFacet,
    );
    const tx2 = await wallet.sendTransaction(populatedTx2);
    await tx2.wait();
  });

  afterEach(() => {
    mock.reset();
  });

  it("Gets all events from server", async () => {
    mock.onPost().reply(StatusCodes.OK, ["ipfs://metadataOfEvent1", "ipfs://metadataOfEvent2"]);

    const response = await fetchAllEventsFromServer(mockedEventParams);
    expect(response.data.toString()).to.equal("ipfs://metadataOfEvent1,ipfs://metadataOfEvent2");
  });

  it("Gets all countries from server", async () => {
    mock.onGet().reply(StatusCodes.OK, ["country1", "country2"]);

    const response = await fetchCountriesFromServer();
    expect(response.data.toString()).to.equal("country1,country2");
  });

  it("Gets all places from server", async () => {
    const country = "Bulgaria";
    mock.onGet().reply(StatusCodes.OK, ["place1", "place2"]);

    const response = await fetchPlacesFromServer(country);
    expect(response.data.toString()).to.equal("place1,place2");
  });

  it("Should buy multiple tickets from a category from one event", async () => {
    listeners.listenForBoughtTicket(spyFunc, ticketControllerFacet);

    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: 1,
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 1,
      },
      {
        row: 1,
        seat: 2,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [ONE_DAY * DATES.DAY]);

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();

    const tickets = await getAddressTicketIdsByEvent(firstEventTokenId, visitorWallet.address, ticketControllerFacet);
    expect(tickets.length).to.equal(place.length);
  });

  it("Should revert buy multiple tickets from a category from one event when place is taken", async () => {
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: 1,
      },
    ];
    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 1,
      },
      {
        row: 1,
        seat: 2,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [DATES.HOUR]);

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.placeIsTaken);
  });

  it("Should revert buy multiple tickets from a category from one event with category of another event", async () => {
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: 2,
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 3,
      },
      {
        row: 1,
        seat: 4,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [DATES.HOUR]);

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(
      errorMessages.categoryIsFromAnotherEvent,
    );
  });

  it.skip("Should revert buy multiple tickets from a category from one event with diff priceData length", async () => {
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: 1,
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("12", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 3,
      },
      {
        row: 1,
        seat: 4,
      },
    ];

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.placeIsTaken);
  });

  it("Should revert buy multiple tickets from one event when params length isn't equal to tickets wanted", async () => {
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: 1,
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 3,
      },
      {
        row: 1,
        seat: 4,
      },
    ];

    const populatedTx = await buyTickets([ticketIpfsUrl], eventCategoryData, priceData, place, ticketControllerFacet);
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.parametersLengthNotEqual);
  });

  it("Should buy multiple tickets from multiple events and categories", async () => {
    listeners.listenForUnlockedTicket(spyFunc, ticketFacet);
    const categoriesId = [1, 2]; // buddy ignore:line
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: categoriesId[0],
      },
      {
        eventId: secondEventTokenId,
        categoryId: categoriesId[1],
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
      {
        amount: 1,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 3,
      },
      {
        row: 1,
        seat: 4,
      },
      {
        row: 1,
        seat: 1,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [DATES.HOUR]);

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();

    const tickets = await getAddressTicketIdsByEvent(firstEventTokenId, visitorWallet.address, ticketControllerFacet);
    expect(tickets.length).to.equal(4); // buddy ignore:line

    const tickets2 = await getAddressTicketIdsByEvent(secondEventTokenId, visitorWallet.address, ticketControllerFacet);
    expect(tickets2.length).to.equal(1); // buddy ignore:line
  });

  it("Should revert when buying multiple tickets from multiple events with taken places", async () => {
    const categoriesId = [1, 2]; // buddy ignore:line
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: categoriesId[0],
      },
      {
        eventId: secondEventTokenId,
        categoryId: categoriesId[1],
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
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
      {
        row: 1,
        seat: 4,
      },
      {
        row: 1,
        seat: 1,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [DATES.HOUR]);

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.placeIsTaken);
  });

  it("Should revert buying multiple tickets from multiple events from event with category of other event", async () => {
    const categoriesId = [1, 2]; // buddy ignore:line
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: categoriesId[0],
      },
      {
        eventId: secondEventTokenId,
        categoryId: categoriesId[0],
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
      {
        amount: 1,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 3,
      },
      {
        row: 1,
        seat: 4,
      },
      {
        row: 1,
        seat: 1,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [DATES.HOUR]);

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(
      errorMessages.categoryIsFromAnotherEvent,
    );
  });

  it("Should revert buying tickets from multiple events when params length isn't equal to tickets wanted", async () => {
    const categoriesId = [1, 2]; // buddy ignore:line
    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: categoriesId[0],
      },
      {
        eventId: secondEventTokenId,
        categoryId: categoriesId[1],
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
      {
        amount: 1,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 1,
        seat: 3,
      },
      {
        row: 1,
        seat: 4,
      },
      {
        row: 1,
        seat: 1,
      },
    ];

    const populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.parametersLengthNotEqual);
  });

  it("Should revert add refund date when visitor calls it", async () => {
    const refundData = { date: DATES.EVENT_END_DATE, percentage: 100 };

    const populatedTx = await addRefundDeadline(firstEventTokenId, refundData, ticketControllerFacet);
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(
      errorMessages.callerIsNotAdminOrModerator,
    );
  });

  it("Should withdraw the refund and test the listeners", async () => {
    listeners.listenForRefundedTicket(spyFunc, ticketControllerFacet);
    listeners.listenForRefundWithdraw(spyFunc, ticketControllerFacet);

    let populatedTx;
    let res;

    const refundData = {
      date: (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + TEN_DAYS * DATES.DAY,
      percentage: 20,
    };

    populatedTx = await addRefundDeadline(firstEventTokenId, refundData, ticketControllerFacet);
    res = await wallet.sendTransaction(populatedTx);
    await res.wait();

    const eventCategoryData = [
      {
        eventId: firstEventTokenId,
        categoryId: 1,
      },
    ];

    const priceData = [
      {
        amount: 2,
        price: ethers.utils.parseUnits("10", "ether"),
      },
    ];

    const place = [
      {
        row: 4,
        seat: 5,
      },
      {
        row: 4,
        seat: 6,
      },
    ];

    await ethers.provider.send("evm_increaseTime", [DATES.HOUR]);

    populatedTx = await buyTickets(
      [ticketIpfsUrl, ticketIpfsUrl],
      eventCategoryData,
      priceData,
      place,
      ticketControllerFacet,
    );

    populatedTx.from = visitorWallet.address;
    res = await visitorWallet.sendTransaction(populatedTx);
    await res.wait();

    const ticketParams = { eventId: firstEventTokenId, categoryId: 1, ticketId: 6 };

    const populatedReturnTicketTx = await returnTicket(ticketParams, ticketControllerFacet);
    populatedReturnTicketTx.from = visitorWallet.address;
    const returnTicketTx = await visitorWallet.sendTransaction(populatedReturnTicketTx);
    res = await returnTicketTx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();

    const walletBalanceBefore = await visitorWallet.getBalance();

    populatedTx = await withdrawRefund(ticketParams.eventId, ticketParams.ticketId, ticketControllerFacet);
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    res = await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();

    const walletBalanceAfterRefund = await visitorWallet.getBalance();

    const gasUsed = res.gasUsed;
    const gasFees = res.effectiveGasPrice.mul(gasUsed);

    const bps = refundData.percentage * 100;
    const refundPrice = ethers.utils.parseUnits("10", "ether").mul(bps).div(10000); // buddy ignore:line

    expect(walletBalanceAfterRefund).to.equal(walletBalanceBefore.add(refundPrice).sub(gasFees));
  });

  it("Should listen for new event Cashier", async () => {
    listeners.listenForNewEventCashier(spyFunc, eventFacet);

    const address = EXAMPLE_ADDRESS;
    const populatedTx = await setEventCashier(firstEventTokenId, address, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new category", async () => {
    listeners.listenForNewCategory(spyFunc, eventFacet);

    mockedContractData.saleStartDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + ONE_DAY * DATES.DAY;
    mockedContractData.saleEndDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + THREE_DAYS * DATES.DAY;

    const populatedTx1 = await createTicketCategory(categoryIpfsUrl, firstEventTokenId, mockedContractData, eventFacet);
    const tx1 = await wallet.sendTransaction(populatedTx1);
    await tx1.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new category update", async () => {
    listeners.listenForCategoryUpdate(spyFunc, eventFacet);

    const categories = await fetchCategoriesByEventId(firstEventTokenId, eventFacet);
    const categoryId = categories[0].id;

    const populatedTx = await updateCategory(
      categoryIpfsUrl,
      firstEventTokenId,
      categoryId,
      mockedContractData,
      eventFacet,
    );

    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category deletion", async () => {
    listeners.listenForCategoryDelete(spyFunc, eventFacet);

    const categories = await fetchCategoriesByEventId(firstEventTokenId, eventFacet);
    const categoryId = categories[1].id;
    const populatedTx = await removeCategory(firstEventTokenId, categoryId, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category tickets added", async () => {
    listeners.listenForCategoryTicketsAdded(spyFunc, eventFacet);

    const categoriesBefore = await fetchCategoriesByEventId(secondEventTokenId, eventFacet);
    const moreTickets = 20;
    const categoryId = categoriesBefore[0].id;
    const populatedTx = await addCategoryTicketsCount(secondEventTokenId, categoryId, moreTickets, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category tickets removed", async () => {
    listeners.listenForCategoryTicketsRemoved(spyFunc, eventFacet);

    const categoriesBefore = await fetchCategoriesByEventId(secondEventTokenId, eventFacet);
    const lessTickets = 20;
    const categoryId = categoriesBefore[0].id;
    const populatedTx = await removeCategoryTicketsCount(secondEventTokenId, categoryId, lessTickets, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category sale dates update and update sale date", async () => {
    listeners.listenForCategorySaleDatesUpdate(spyFunc, eventFacet);

    const categories = await fetchCategoriesByEventId(secondEventTokenId, eventFacet);
    const categoryId = categories[0].id;

    const saleStartDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + ONE_DAY * DATES.DAY;
    const saleEndDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + THREE_DAYS * DATES.DAY;

    const populatedTx = await updateCategorySaleDates(
      secondEventTokenId,
      categoryId,
      saleStartDate,
      saleEndDate,
      eventFacet,
    );
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();

    const categoriesAfter = await fetchCategoriesByEventId(secondEventTokenId, eventFacet);
    expect(categoriesAfter[0].saleStartDate).to.equal(saleStartDate);
    expect(categoriesAfter[0].saleEndDate).to.equal(saleEndDate);
  });

  it("Should listen for new event refund date", async () => {
    listeners.listenForNewEventRefundDate(spyFunc, ticketControllerFacet);

    const refundData = { date: DATES.EVENT_END_DATE, percentage: 100 };
    const populatedTx = await addRefundDeadline(firstEventTokenId, refundData, ticketControllerFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for clipped tickets", async () => {
    listeners.listenForClipedTicket(spyFunc, ticketControllerFacet);

    await ethers.provider.send("evm_increaseTime", [TEN_DAYS * DATES.DAY]);

    const populatedTx = await clipTicket(firstEventTokenId, 1, ticketControllerFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });
});
