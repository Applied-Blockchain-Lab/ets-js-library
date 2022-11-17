/* global ethers */
/* eslint prefer-const: "off", no-console: "off" */

import { getSelectors } from "./libraries/diamond.js";
import ticketDiamondCutSchema from "../config/TicketDiamondCutFacet.json" assert { type: "json" };
import ticketDiamondSchema from "../config/TicketDiamond.json" assert { type: "json" };
import ticketDiamondInitSchema from "../config/TicketDiamondInit.json" assert { type: "json" };
import ticketDiamondLoupeSchema from "../config/TicketDiamondLoupeFacet.json" assert { type: "json" };
import ticketOwnershipSchema from "../config/TicketOwnershipFacet.json" assert { type: "json" };
import ticketFacetSchema from "../config/TicketFacet.json" assert { type: "json" };
import iDiamondCutSchema from "../config/IDiamondCut.json" assert { type: "json" };
import ticketMarketplaceSchema from "../config/TicketMarketplace.json" assert { type: "json" };

export async function deployTicketDiamond() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  // deploy DiamondCutFacet
  const TicketDiamondCutFacet = await ethers.getContractFactory(
    ticketDiamondCutSchema.abi,
    ticketDiamondCutSchema.bytecode,
  );
  const ticketDiamondCutFacet = await TicketDiamondCutFacet.deploy();
  await ticketDiamondCutFacet.deployed();

  // deploy Diamond
  const TicketDiamond = await ethers.getContractFactory(ticketDiamondSchema.abi, ticketDiamondSchema.bytecode);
  const ticketDiamond = await TicketDiamond.deploy(
    contractOwner.address,
    ticketDiamondCutFacet.address,
    "EventTickets",
    "EVT",
  );
  await ticketDiamond.deployed();
  console.log("TicketDiamond deployed at: ", ticketDiamond.address);

  // depeloy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variable
  // Read about how the diamondCut function works here:
  // https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const TicketDiamondInit = await ethers.getContractFactory(
    ticketDiamondInitSchema.abi,
    ticketDiamondInitSchema.bytecode,
  );
  const ticketDiamondInit = await TicketDiamondInit.deploy();
  await ticketDiamondInit.deployed();

  const cut = [];

  const TicketDiamondLoupeFacet = await ethers.getContractFactory(
    ticketDiamondLoupeSchema.abi,
    ticketDiamondLoupeSchema.bytecode,
  );
  const ticketDiamondLoupeFacet = await TicketDiamondLoupeFacet.deploy();
  await ticketDiamondLoupeFacet.deployed();

  cut.push({
    facetAddress: ticketDiamondLoupeFacet.address,
    action: 0,
    functionSelectors: getSelectors(ticketDiamondLoupeFacet),
  });

  const TicketOwnershipFacet = await ethers.getContractFactory(
    ticketOwnershipSchema.abi,
    ticketOwnershipSchema.bytecode,
  );
  const ticketOwnershipFacet = await TicketOwnershipFacet.deploy();
  await ticketOwnershipFacet.deployed();

  cut.push({
    facetAddress: ticketOwnershipFacet.address,
    action: 0,
    functionSelectors: getSelectors(ticketOwnershipFacet),
  });

  const TicketMarketplaceFacet = await ethers.getContractFactory(
    ticketMarketplaceSchema.abi,
    ticketMarketplaceSchema.bytecode,
  );
  const ticketMarketplaceFacet = await TicketMarketplaceFacet.deploy();
  await ticketMarketplaceFacet.deployed();

  cut.push({
    facetAddress: ticketMarketplaceFacet.address,
    action: 0,
    functionSelectors: getSelectors(ticketMarketplaceFacet),
  });

  const TicketFacet = await ethers.getContractFactory(ticketFacetSchema.abi, ticketFacetSchema.bytecode);
  const ticketFacet = await TicketFacet.deploy();
  await ticketFacet.deployed();

  const funcSels = getSelectors(ticketFacet);
  const erc165Index = funcSels.indexOf("0x01ffc9a7");
  if (erc165Index !== -1) {
    funcSels.splice(erc165Index, 1);
  }

  cut.push({
    facetAddress: ticketFacet.address,
    action: 0,
    functionSelectors: funcSels,
  });

  const diamondCut = await ethers.getContractAt(iDiamondCutSchema.abi, ticketDiamond.address);
  let tx;
  let receipt;
  // call to init function
  let functionCall = ticketDiamondInit.interface.encodeFunctionData("init");
  tx = await diamondCut.diamondCut(cut, ticketDiamondInit.address, functionCall);

  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }

  return ticketDiamond.address;
}

// exports.deployTicketDiamond = deployTicketDiamond;
