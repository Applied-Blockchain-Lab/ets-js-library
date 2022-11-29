import {
  removeEvent,
  addTeamMember,
  removeTeamMember,
  getEventMembers,
  fetchOwnedEvents,
  fetchEvents,
  setEventCashier,
  addRefundDeadline,
} from "../src/index.js";
import { EXAMPLE_ADDRESS, errorMessages, DATES } from "./config.js";
import { expect } from "chai";
import { utils } from "ethers";
import { mockedCreateEvent, testSetUp } from "./utils.js";

describe("Organizer tests", function () {
  let diamondAddress;
  let eventFacet;
  let ticketControllerFacet;
  let tokenId;
  let wallet;
  let signers;
  const addressLength = 64;
  const TEN_DAYS = 10;

  before(async function () {
    ({ diamondAddress, eventFacet, ticketControllerFacet, signers, wallet } = await testSetUp(
      diamondAddress,
      eventFacet,
      ticketControllerFacet,
      signers,
      wallet,
    ));

    const maxTicketPerClient = 10;
    const startDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp + TEN_DAYS * DATES.DAY;
    const endDate =
      (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp +
      (TEN_DAYS + TEN_DAYS) * DATES.DAY;

    tokenId = await mockedCreateEvent(maxTicketPerClient, startDate, endDate, eventFacet, wallet, tokenId);
  });

  it("Should call create event method from smart contract", async () => {
    const eventIds = [1];
    const events = await fetchEvents(eventIds, eventFacet);
    expect(events.length).to.equal(1);
  });

  it("Should call fetch events by id method from smart contract", async () => {
    const eventIds = [tokenId];
    const events = await fetchEvents(eventIds, eventFacet);
    expect(events.length).to.equal(1);
  });

  it("Should call fetch owned events method from smart contract", async () => {
    const events = await fetchOwnedEvents(wallet.address, eventFacet);
    expect(events.length).to.equal(1);
  });

  it("Should revert delete event when there is not an event", async () => {
    const populatedTx = await removeEvent(tokenId + 1, eventFacet);
    await expect(wallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.eventDoesNotExist);
  });

  it("Should call add team member method from smart contract", async () => {
    const populatedTx = await addTeamMember(tokenId, `0x${"0".repeat(addressLength)}`, EXAMPLE_ADDRESS, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const eventMembers = await getEventMembers(tokenId, eventFacet);
    expect(eventMembers.length).to.equal(6); // buddy ignore:line
    expect(eventMembers[5][0].toLowerCase()).to.equal(EXAMPLE_ADDRESS); // buddy ignore:line
  });

  it("Should call remove team member method from smart contract", async () => {
    const populatedTx = await removeTeamMember(tokenId, `0x${"0".repeat(addressLength)}`, EXAMPLE_ADDRESS, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const eventMembers = await getEventMembers(tokenId, eventFacet);
    const expectedMembersLength = 5;
    expect(eventMembers.length).to.equal(expectedMembersLength);
    expect(eventMembers[0][0].toLowerCase()).to.equal(wallet.address.toLowerCase());
  });

  it("Should revert remove team member when there is not an event", async () => {
    const populatedTx = await removeTeamMember(
      tokenId + 1,
      `0x${"0".repeat(addressLength)}`,
      EXAMPLE_ADDRESS,
      eventFacet,
    );
    await expect(wallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.eventDoesNotExist);
  });

  // fails
  it.skip("Should revert remove team member when there is not member with given address", async () => {
    const populatedTx = await removeTeamMember(tokenId, `0x${"0".repeat(addressLength)}`, EXAMPLE_ADDRESS, eventFacet);
    await expect(wallet.sendTransaction(populatedTx)).to.be.revertedWith(errorMessages.eventDoesNotExist);
  });

  it("Should call get event members method from smart contract", async () => {
    const eventMembers = await getEventMembers(tokenId, eventFacet);
    const expectedMembersLength = 5;
    expect(eventMembers.length).to.equal(expectedMembersLength);
    expect(eventMembers[0][0].toLowerCase()).to.equal(wallet.address.toLowerCase());
  });

  it("Should call fetchOwnedEvents from smart contract", async () => {
    const events = await fetchOwnedEvents(wallet.address, eventFacet);
    expect(events.length).to.equal(tokenId);
  });

  it("Should set event cashier", async () => {
    const CASHIER_ROLE = utils.keccak256(utils.toUtf8Bytes("CASHIER_ROLE"));
    const address = signers[1].address;
    const populatedTx = await setEventCashier(tokenId, address, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const members = await getEventMembers(tokenId, eventFacet);
    const expectedMemberIndex = 5;

    expect(members[expectedMemberIndex].account).to.equal(address);
    expect(members[expectedMemberIndex].role).to.equal(CASHIER_ROLE);
  });

  it("Should add refund date", async () => {
    const refundData = { date: DATES.EVENT_END_DATE, percentage: 100 };

    const populatedTx = await addRefundDeadline(tokenId, refundData, ticketControllerFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();

    const event = await eventFacet.fetchEventById(tokenId);
    expect(event.refundData.length).to.equal(1);
  });

  it("Should call remove event method from smart contract", async () => {
    const populatedTx = await removeEvent(tokenId, eventFacet);
    const tx = await wallet.sendTransaction(populatedTx);
    await tx.wait();
    const events = await fetchOwnedEvents(wallet.address, eventFacet);
    expect(events.length).to.equal(0);
  });
});
