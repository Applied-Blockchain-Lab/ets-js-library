import {
  addRefundDeadline,
  buyTicketsFromMultipleEvents,
  buyTicketsFromSingleEvent,
  createTicketCategory,
  fetchAllEventsFromServer,
  fetchCountriesFromServer,
  fetchPlacesFromServer,
  getAddressTicketIdsByEvent,
  returnTicket,
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
} from "./config.js";
import { StatusCodes } from "http-status-codes";
import { expect } from "chai";
import { mockedCreateEvent, testSetUp } from "./utils.js";

describe("Visitor tests", () => {
  const maxTicketPerClient = 10;
  const startDate = DATES.EVENT_START_DATE;
  const endDate = DATES.EVENT_END_DATE;

  let mock;
  let eventFacet;
  let ticketControllerFacet;
  let firstEventTokenId;
  let secondEventTokenId;
  let imageBlob;
  let wallet;
  let visitorWallet;
  let signers;

  before(async () => {
    mock = new MockAdapter(axios);
    ({ eventFacet, ticketControllerFacet, imageBlob, signers, wallet } = await testSetUp());
    visitorWallet = signers[1];

    mockedMetadata.image = imageBlob;
    mockedCategoryMetadata.image = imageBlob;

    firstEventTokenId = await mockedCreateEvent(maxTicketPerClient, startDate, endDate, eventFacet, wallet);
    secondEventTokenId = await mockedCreateEvent(maxTicketPerClient + 1, startDate, endDate, eventFacet, wallet);
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
      // eventFacet,
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
      // eventFacet,
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
      // eventFacet,
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
      // eventFacet,
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
      // eventFacet,
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
      // eventFacet,
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
      // eventFacet,
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

  it("Should withdraw the refund", async () => {
    let populatedTx;
    let res;
    const refundData = { date: DATES.EVENT_END_DATE, percentage: 20 };

    populatedTx = await addRefundDeadline(firstEventTokenId, refundData, ticketControllerFacet);
    res = await wallet.sendTransaction(populatedTx);
    await res.wait();

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

    populatedTx = await buyTicketsFromSingleEvent(
      NFT_STORAGE_API_KEY,
      firstEventTokenId,
      1,
      priceData,
      place,
      ticketsMetadata,
      // eventFacet,
      ticketControllerFacet,
    );
    populatedTx.from = visitorWallet.address;
    res = await visitorWallet.sendTransaction(populatedTx);
    await res.wait();

    const ticketParams = { eventId: firstEventTokenId, categoryId: 1, ticketId: 1 };

    const populatedReturnTicketTx = await returnTicket(ticketParams, ticketControllerFacet);
    populatedReturnTicketTx.from = visitorWallet.address;
    const returnTicketTx = await visitorWallet.sendTransaction(populatedReturnTicketTx);
    await returnTicketTx.wait();

    const walletBalanceBefore = await visitorWallet.getBalance();
    console.log(walletBalanceBefore);

    populatedTx = await withdrawRefund(ticketParams.eventId, ticketParams.ticketId, ticketControllerFacet);
    populatedTx.from = visitorWallet.address;
    const tx = await visitorWallet.sendTransaction(populatedTx);
    res = await tx.wait();

    const walletBalanceAfterRefund = await visitorWallet.getBalance();
    console.log(walletBalanceAfterRefund);
    console.log(walletBalanceBefore.sub(walletBalanceAfterRefund));

    const gasUsed = res.gasUsed;
    const gasFees = res.effectiveGasPrice.mul(gasUsed);

    console.log(gasFees);

    const bps = refundData.percentage * 100;
    const refundPrice = ethers.utils.parseUnits("10", "ether").mul(bps).div(10000); // buddy ignore:line

    console.log("r", refundPrice);
    expect(walletBalanceAfterRefund).to.equal(walletBalanceBefore.add(refundPrice).sub(gasFees));
  });
});
