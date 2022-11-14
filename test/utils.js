import eventSchema from "../config/EventFacet.json" assert { type: "json" };
import ticketControllerSchema from "../config/EventTicketControllerFacet.json" assert { type: "json" };
import ticketFacetSchema from "../config/TicketFacet.json" assert { type: "json" };
import { deployEventDiamond } from "../tasks/deployEventDiamond.js";
import fetch from "@web-std/fetch";
import { createEvent } from "../src/index.js";
import { mockedMetadata, NFT_STORAGE_API_KEY } from "./config.js";

async function testSetUp() {
  const { eventDiamondAddress, ticketDiamondAddress } = await deployEventDiamond();

  const eventFacet = await ethers.getContractAt(eventSchema.abi, eventDiamondAddress);
  const ticketControllerFacet = await ethers.getContractAt(ticketControllerSchema.abi, eventDiamondAddress);
  const ticketFacet = await ethers.getContractAt(ticketFacetSchema.abi, ticketDiamondAddress);
  const image = await fetch("https://www.blackseachain.com/assets/img/hero-section/hero-image-compressed.png");
  const imageBlob = await image.blob();
  const signers = await ethers.getSigners();
  const wallet = signers[0];
  return { eventFacet, ticketControllerFacet, ticketFacet, imageBlob, signers, wallet };
}

async function mockedCreateEvent(maxTicketPerClient, startDate, endDate, eventFacet, wallet, tokenId) {
  const populatedTx = await createEvent(
    NFT_STORAGE_API_KEY,
    mockedMetadata,
    { maxTicketPerClient, startDate, endDate },
    eventFacet,
  );

  const eventTx = await wallet.sendTransaction(populatedTx);
  const eventTxResponse = await eventTx.wait();
  const tokenIdInHex = eventTxResponse.logs[0].data.slice(2, 66); // buddy ignore:line
  const radix = 16;
  tokenId = parseInt(tokenIdInHex, radix);
  console.log("New event: ", tokenId);
  return tokenId;
}

export { testSetUp, mockedCreateEvent };
