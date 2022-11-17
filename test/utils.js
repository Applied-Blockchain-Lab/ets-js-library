import eventSchema from "../config/EventFacet.json" assert { type: "json" };
import ticketControllerSchema from "../config/EventTicketControllerFacet.json" assert { type: "json" };
import ticketFacetSchema from "#contract.config/TicketFacet.json" assert { type: "json" };
import { deployEventDiamond } from "../tasks/deployEventDiamond.js";
import { createEvent } from "../src/index.js";

const eventIpfsUrl = "ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json";
const categoryIpfsUrl = "ipfs://bafyreidmj42viflxmr426ychlw4bhf6pqwiorn7wybqby7groqrkbsf3sa/metadata.json";
const updatedCategoryIpfsUrl = "ipfs://bafyreifedps2dxsdlaunheg3xl3on6uv3gycb4h653mscploxwsyrg2pym/metadata.json";
const ticketIpfsUrl = "ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json";

async function testSetUp() {
  const { eventDiamondAddress, ticketDiamondAddress } = await deployEventDiamond();

  const eventFacet = await ethers.getContractAt(eventSchema.abi, eventDiamondAddress);
  const ticketControllerFacet = await ethers.getContractAt(ticketControllerSchema.abi, eventDiamondAddress);
  const ticketFacet = await ethers.getContractAt(ticketFacetSchema.abi, ticketDiamondAddress);
  const signers = await ethers.getSigners();
  const wallet = signers[0];
  return { eventFacet, ticketControllerFacet, ticketFacet, signers, wallet };
}

async function mockedCreateEvent(maxTicketPerClient, startDate, endDate, eventFacet, wallet) {
  const populatedTx = await createEvent(eventIpfsUrl, { maxTicketPerClient, startDate, endDate }, eventFacet);

  const eventTx = await wallet.sendTransaction(populatedTx);
  const eventTxResponse = await eventTx.wait();
  const tokenIdInHex = eventTxResponse.logs[0].data.slice(2, 66); // buddy ignore:line
  const radix = 16;
  const tokenId = parseInt(tokenIdInHex, radix);
  console.log("New event: ", tokenId);
  return tokenId;
}

export { testSetUp, mockedCreateEvent, eventIpfsUrl, categoryIpfsUrl, ticketIpfsUrl, updatedCategoryIpfsUrl };
