import {
  addCategoryTicketsCount,
  addRefundDeadline,
  buyTicketsFromMultipleEvents,
  buyTicketsFromSingleEvent,
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
  sendInvitation,
  setEventCashier,
  withdrawRefund,
} from "../src/index.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  DATES,
  mockedEventParams,
  mockedTicketMetadata,
  mockedMetadata,
  NFT_STORAGE_API_KEY,
  mockedCategoryMetadata,
  mockedContractData,
  errorMessages,
  EXAMPLE_ADDRESS,
} from "./config.js";
import { StatusCodes } from "http-status-codes";
import { expect } from "chai";
import { mockedCreateEvent, testSetUp } from "./utils.js";
import { spy } from "sinon";

describe("Visitor tests", () => {
  let mock;
  let diamondAddress;
  let eventFacet;
  let ticketControllerFacet;
  let firstEventTokenId;
  let secondEventTokenId;
  let imageBlob;
  let wallet;
  let visitorWallet;
  let signers;
  const spyFunc = spy();

  function checkFunctionInvocation() {
    if (spyFunc.callCount === 0) {
      setTimeout(checkFunctionInvocation, 100); // buddy ignore:line
    } else {
      expect(spyFunc.callCount).to.equal(1);
    }
  }

  before(async () => {
    mock = new MockAdapter(axios);
    ({ diamondAddress, eventFacet, ticketControllerFacet, imageBlob, signers, wallet } = await testSetUp(
      diamondAddress,
      eventFacet,
      ticketControllerFacet,
      imageBlob,
      signers,
      wallet,
    ));
    visitorWallet = signers[1];

    const maxTicketPerClient = 10;
    const startDate = DATES.EVENT_START_DATE;
    const endDate = DATES.EVENT_END_DATE;
    mockedMetadata.image = imageBlob;

    firstEventTokenId = await mockedCreateEvent(
      maxTicketPerClient,
      startDate,
      endDate,
      eventFacet,
      wallet,
      firstEventTokenId,
    );
    secondEventTokenId = await mockedCreateEvent(
      maxTicketPerClient + 1,
      startDate,
      endDate,
      eventFacet,
      wallet,
      secondEventTokenId,
    );
    // create ticket category
    const populatedTx = await createTicketCategory(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      mockedCategoryMetadata,
      mockedContractData,
      eventFacet,
    );
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const populatedTx2 = await createTicketCategory(
      NFT_STORAGE_API_KEY,
      secondEventTokenId,
      mockedCategoryMetadata,
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
    const categoryId = 1;
    const priceData = [
      {
        amount: 2,
        price: 10,
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

    mockedTicketMetadata.image = imageBlob;

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      categoryId,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    await tx.wait();

    const tickets = await getAddressTicketIdsByEvent(firstEventTokenId, visitorWallet.address, ticketControllerFacet);
    expect(tickets.length).to.equal(place.length);
  });

  it("Should revert buy multiple tickets from a category from one event when place is taken", async () => {
    const categoryId = 1;
    const priceData = [
      {
        amount: 2,
        price: 10,
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

    mockedTicketMetadata.image = imageBlob;

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      categoryId,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.placeIsTaken);
  });

  it("Should revert buy multiple tickets from a category from one event with category of another event", async () => {
    const categoryId = 2;
    const priceData = [
      {
        amount: 2,
        price: 10,
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

    mockedTicketMetadata.image = imageBlob;

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      categoryId,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(
      errorMessages.categoryIsFromAnotherEvent,
    );
  });

  it.skip("Should revert buy multiple tickets from a category from one event with diff priceData length", async () => {
    const categoryId = 1;
    const priceData = [
      {
        amount: 2,
        price: 12,
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

    mockedTicketMetadata.image = imageBlob;

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      categoryId,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.placeIsTaken);
  });

  it("Should revert buy multiple tickets from one event when params length isn't equal to tickets wanted", async () => {
    const categoryId = 1;
    const priceData = [
      {
        amount: 2,
        price: 10,
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

    mockedTicketMetadata.image = imageBlob;

    const ticketsMetadata = [mockedTicketMetadata];

    const populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      categoryId,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.parametersLengthNotEqual);
  });

  it("Should buy multiple tickets from multiple events and categories", async () => {
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
        price: 10,
      },
      {
        amount: 1,
        price: 10,
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

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromMultipleEvents(
      NFT_STORAGE_API_KEY,
      eventCategoryData,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    await tx.wait();

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
        price: 10,
      },
      {
        amount: 1,
        price: 10,
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

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromMultipleEvents(
      NFT_STORAGE_API_KEY,
      eventCategoryData,
      priceData,
      place,
      ticketsMetadata,
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
        price: 10,
      },
      {
        amount: 1,
        price: 10,
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

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromMultipleEvents(
      NFT_STORAGE_API_KEY,
      eventCategoryData,
      priceData,
      place,
      ticketsMetadata,
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
        price: 10,
      },
      {
        amount: 1,
        price: 10,
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

    const ticketsMetadata = [mockedTicketMetadata, mockedTicketMetadata];

    const populatedTx = await buyTicketsFromMultipleEvents(
      NFT_STORAGE_API_KEY,
      eventCategoryData,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.parametersLengthNotEqual);
  });

  it("Should revert add refund date when visitor calls it", async () => {
    const refundData = { date: DATES.EVENT_END_DATE, percentage: 100 };

    const populatedTx = await addRefundDeadline(firstEventTokenId, refundData, ticketControllerFacet);
    populatedTx.from = visitorWallet.address;
    await expect(visitorWallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.callerIsNotAdmin);
  });

  it("Should withdraw the refund", async () => {
    const ticketParams = { eventId: firstEventTokenId, categoryId: 1, ticketId: 1 };

    const populatedReturnTicketTx = await returnTicket(ticketParams, ticketControllerFacet);
    const returnTicketTx = await wallet.sendTransaction(populatedReturnTicketTx);
    await returnTicketTx.wait();

    const walletBalanceBefore = await visitorWallet.getBalance();
    console.log("walletBalanceBefore", walletBalanceBefore.toString());

    const populatedTx = await withdrawRefund(ticketParams.eventId, ticketParams.ticketId, ticketControllerFacet);
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    await tx.wait();

    const walletBalanceAfterRefund = await visitorWallet.getBalance();
    console.log("Wallet balance after withdraw refund: ", walletBalanceAfterRefund.toString());

    expect(walletBalanceAfterRefund).to.be.gt(walletBalanceBefore);
  });

  it("Should listen for bought ticket", async () => {
    listeners.listenForBoughtTicket(spyFunc, ticketControllerFacet);

    const categoryId = 1;
    const priceData = [
      {
        amount: 1,
        price: 10,
      },
    ];

    const place = [
      {
        row: 1,
        seat: 5,
      },
    ];

    mockedTicketMetadata.image = imageBlob;
    const ticketsMetadata = [mockedTicketMetadata];

    const populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      categoryId,
      priceData,
      place,
      ticketsMetadata,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for refunded ticket", async () => {
    listeners.listenForRefundedTicket(spyFunc, ticketControllerFacet);

    const ticketParams = { eventId: firstEventTokenId, categoryId: 1, ticketId: 1 };

    const populatedReturnTicketTx = await returnTicket(ticketParams, ticketControllerFacet);
    const returnTicketTx = await wallet.sendTransaction(populatedReturnTicketTx);
    await returnTicketTx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for locked ticket", async () => {
    listeners.listenForLockedTicked(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for unlocked ticket", async () => {
    listeners.listenForUnlockedTicket(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for ticket transfer", async () => {
    listeners.listenForTicketApproval(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for ticket approval", async () => {
    listeners.listenForTicketApproval(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for ticket approval for all", async () => {
    listeners.listenForTicketApprovalForAll(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for ticket consecutive transfer", async () => {
    listeners.listenForTicketConsecutiveTransfer(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for ticket consumed", async () => {
    listeners.listenForTicketConsumed(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for refund", async () => {
    listeners.listenForRefund(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new event Cashier", async () => {
    listeners.listenForNewEventCashier(spyFunc, ticketControllerFacet);

    const address = EXAMPLE_ADDRESS;
    const populatedTx = await setEventCashier(firstEventTokenId, address, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new category", async () => {
    listeners.listenForNewCategory(spyFunc, ticketControllerFacet);

    ///
    mockedContractData.saleStartDate = DATES.EVENT_START_DATE;
    mockedContractData.saleEndDate = DATES.EVENT_END_DATE;
    const populatedTx1 = await createTicketCategory(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      mockedCategoryMetadata,
      mockedContractData,
      eventFacet,
    );
    const tx1 = await wallet.sendTransaction(populatedTx1);
    await tx1.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new category update", async () => {
    listeners.listenForCategoryUpdate(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category deletion", async () => {
    listeners.listenForCategoryDelete(spyFunc, ticketControllerFacet);

    const categories = await fetchCategoriesByEventId(firstEventTokenId, eventFacet);
    const categoryId = categories[0].id;
    const populatedTx = await removeCategory(firstEventTokenId, categoryId, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category tickets added", async () => {
    listeners.listenForCategoryTicketsAdded(spyFunc, ticketControllerFacet);

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
    listeners.listenForCategoryTicketsRemoved(spyFunc, ticketControllerFacet);

    const categoriesBefore = await fetchCategoriesByEventId(secondEventTokenId, eventFacet);
    const lessTickets = 20;
    const categoryId = categoriesBefore[0].id;
    const populatedTx = await removeCategoryTicketsCount(secondEventTokenId, categoryId, lessTickets, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category sell changed", async () => {
    listeners.listenForCategorySellChanged(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for all categories sell changed", async () => {
    listeners.listenForAllCategorySellChanged(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for category sale dates update", async () => {
    listeners.listenForCategorySaleDatesUpdate(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new event refund date", async () => {
    listeners.listenForNewEventRefundDate(spyFunc, ticketControllerFacet);

    ///
    const refundData = { date: DATES.EVENT_END_DATE, percentage: 100 };

    const populatedTx = await addRefundDeadline(firstEventTokenId, refundData, ticketControllerFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for refund withdraw", async () => {
    listeners.listenForRefundWithdraw(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for event withdraw", async () => {
    listeners.listenForEventWithdraw(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for clipped tickets", async () => {
    listeners.listenForClipedTicket(spyFunc, ticketControllerFacet);

    const populatedTx = await clipTicket(firstEventTokenId, 1, ticketControllerFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for booked tickets", async () => {
    listeners.listenForBookedTickets(spyFunc, ticketControllerFacet);

    ///

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });

  it("Should listen for new ticket invitation", async () => {
    listeners.listenForNewTicketInvitation(spyFunc, ticketControllerFacet);

    ///
    const ticketIds = [4]; // buddy ignore:line
    const accounts = [EXAMPLE_ADDRESS];

    const populatedTx = await sendInvitation(firstEventTokenId, ticketIds, accounts, ticketControllerFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    checkFunctionInvocation();
    spyFunc.resetHistory();
  });
});
