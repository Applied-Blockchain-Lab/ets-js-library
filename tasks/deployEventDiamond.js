/* global ethers */
/* eslint prefer-const: "off", no-console: "off" */

import { deployTicketDiamond } from "./deployTicketDiamond.js";
import { getSelectors, FacetCutAction } from "./libraries/diamond.js";
import eventDiamondCutSchema from "../config/EventDiamondCutFacet.json" assert { type: "json" };
import eventDiamondSchema from "../config/EventDiamond.json" assert { type: "json" };
import eventDiamondInitSchema from "../config/EventDiamondInit.json" assert { type: "json" };
import eventDiamondLoupeSchema from "../config/EventDiamondLoupeFacet.json" assert { type: "json" };
import eventOwnershipSchema from "../config/EventOwnershipFacet.json" assert { type: "json" };
import eventFacetSchema from "../config/EventFacet.json" assert { type: "json" };
import eventTicketControllerFacetSchema from "#contract.config/EventTicketControllerFacet.json" assert { type: "json" };
import ticketFacetSchema from "../config/TicketFacet.json" assert { type: "json" };
import iDiamondCutSchema from "../config/IDiamondCut.json" assert { type: "json" };

export async function deployEventDiamond() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];
  const ticketDiamondAddress = await deployTicketDiamond();

  // deploy DiamondCutFacet
  const EventDiamondCutFacet = await ethers.getContractFactory(
    eventDiamondCutSchema.abi,
    eventDiamondCutSchema.bytecode,
  );
  const eventDiamondCutFacet = await EventDiamondCutFacet.deploy();
  await eventDiamondCutFacet.deployed();

  // deploy Diamond
  const EventDiamond = await ethers.getContractFactory(eventDiamondSchema.abi, eventDiamondSchema.bytecode);
  const eventDiamond = await EventDiamond.deploy(
    contractOwner.address,
    eventDiamondCutFacet.address,
    "Events",
    "ET",
    ticketDiamondAddress,
  );
  await eventDiamond.deployed();
  console.log("EventDiamond deployed at: ", eventDiamond.address);

  // depeloy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variable
  // Read about how the diamondCut function works here:
  // https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const EventDiamondInit = await ethers.getContractFactory(eventDiamondInitSchema.abi, eventDiamondInitSchema.bytecode);
  const eventDiamondInit = await EventDiamondInit.deploy();
  await eventDiamondInit.deployed();

  const Facets = [eventDiamondLoupeSchema, eventOwnershipSchema, eventTicketControllerFacetSchema];
  const cut = [];

  for (const Facet of Facets) {
    const FacetContract = await ethers.getContractFactory(Facet.abi, Facet.bytecode);
    const facet = await FacetContract.deploy();
    await facet.deployed();
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }

  const EventFacet = await ethers.getContractFactory(eventFacetSchema.abi, eventFacetSchema.bytecode);
  const eventFacet = await EventFacet.deploy();
  await eventFacet.deployed();

  const ticketFacet = await ethers.getContractAt(ticketFacetSchema.abi, ticketDiamondAddress);
  const ticketTx = await ticketFacet.setEventDiamondAddress(eventDiamond.address);
  await ticketTx.wait();

  const funcSels = getSelectors(eventFacet);
  const erc165Index = funcSels.indexOf("0x01ffc9a7");
  if (erc165Index !== -1) {
    funcSels.splice(erc165Index, 1);
  }

  cut.push({
    facetAddress: eventFacet.address,
    action: 0,
    functionSelectors: funcSels,
  });

  const diamondCut = await ethers.getContractAt(iDiamondCutSchema.abi, eventDiamond.address);

  // call to init function
  const functionCall = eventDiamondInit.interface.encodeFunctionData("init");
  const tx = await diamondCut.diamondCut(cut, eventDiamondInit.address, functionCall);
  // console.log("Diamond cut tx: ", tx.hash);
  const receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }

  // console.log("Completed diamond cut");
  return { eventDiamondAddress: eventDiamond.address, ticketDiamondAddress };
}
