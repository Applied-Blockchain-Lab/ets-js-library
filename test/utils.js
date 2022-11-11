import eventSchema from "../config/EventFacet.json" assert { type: "json" };
import ticketControllerSchema from "../config/EventTicketControllerFacet.json" assert { type: "json" };
import { deployEventDiamond } from "../tasks/deployEventDiamond.js";
import fetch from "@web-std/fetch";
import { createEvent } from "../src/index.js";
import { mockedMetadata, NFT_STORAGE_API_KEY } from "./config.js";

async function testSetUp(diamondAddress, eventFacet, ticketControllerFacet, imageBlob, signers, wallet) {
  diamondAddress = await deployEventDiamond();

  eventFacet = await ethers.getContractAt(eventSchema.abi, diamondAddress);
  ticketControllerFacet = await ethers.getContractAt(ticketControllerSchema.abi, diamondAddress);
  const image = await fetch("https://www.blackseachain.com/assets/img/hero-section/hero-image-compressed.png");
  imageBlob = await image.blob();
  signers = await ethers.getSigners();
  wallet = signers[0];
  return { diamondAddress, eventFacet, ticketControllerFacet, imageBlob, signers, wallet };
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
