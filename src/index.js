/* eslint-disable no-useless-catch */

import { ethers } from "ethers";
import axios from "axios";
import {
  uploadDataToIpfs,
  uploadArrayToIpfs,
  fetchEventsMetadata,
  fetchSingleEventMetadata,
  deleteDataFromService,
  getIpfsUrl,
  makeGatewayUrl,
} from "#ipfs.utils";
import { calculateTotalValue } from "./utils/lib.js";
import { ETS_SERVER_URL, NET_RPC_URL, NET_RPC_URL_ID, TOKEN_NAME, NET_LABEL } from "#config";
import { eventsContract, ticketControllerContract, ticketsContract, ticketMarketplaceContract } from "#contract";
import * as listeners from "./listeners.js";

/* ========= IPFS FUNCTIONS ========== */
export async function uploadDataToIpfsNftStorage(nftStorageApiKey, metadata) {
  const url = await uploadDataToIpfs(nftStorageApiKey, metadata);

  return url;
}

export async function uploadArrayToIpfsNftStorage(nftStorageApiKey, ticketsMetadata) {
  const ticketUrls = await uploadArrayToIpfs(nftStorageApiKey, ticketsMetadata);

  return ticketUrls;
}

export async function deleteFromIpfs(nftStorageApiKey, ipfsUri) {
  try {
    await deleteDataFromService(nftStorageApiKey, ipfsUri);
  } catch (error) {
    throw error;
  }
}

export function createGatewayUrl(url) {
  try {
    const gatewayUrl = makeGatewayUrl(url);

    return gatewayUrl;
  } catch (error) {
    throw error;
  }
}

/* ========= SMART CONTRACT FUNCTIONS ========== */
export async function createEvent(ipfsUrl, contractData, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.createEvent(
      contractData.maxTicketPerClient,
      contractData.startDate,
      contractData.endDate,
      ipfsUrl,
    );

    return tx;
  } catch (error) {
    throw error;
  }
}

export async function fetchEvent(eventId, contract = eventsContract) {
  try {
    const data = await fetchSingleEventMetadata(eventId, contract);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchEvents(eventIds, contract = eventsContract) {
  try {
    const metadata = await fetchEventsMetadata(eventIds, contract);

    return metadata;
  } catch (error) {
    throw error;
  }
}

export async function fetchContractEvents(contract = eventsContract) {
  const events = await contract.fetchAllEvents();

  return events;
}

export async function fetchOwnedEvents(address, contract = eventsContract) {
  const signer = new ethers.VoidSigner(address, contract.provider);

  const eventIds = await contract.connect(signer).fetchOwnedEvents();
  const events = await fetchEvents(eventIds, contract);

  return events;
}

export async function removeEvent(eventId, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.removeEvent(eventId);

    return tx;
  } catch (error) {
    throw error;
  }
}

export async function updateEvent(ipfsUrl, eventId, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.updateEventTokenUri(eventId, ipfsUrl);

    return tx;
  } catch (error) {
    throw error;
  }
}

export async function getEventIpfsUri(eventId, contract = eventsContract) {
  const uri = await getIpfsUrl(eventId, contract);

  return uri;
}

export async function addTeamMember(eventId, role, address, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.addTeamMember(eventId, role, address);

    return tx;
  } catch (error) {
    throw error;
  }
}

export async function removeTeamMember(eventId, role, address, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.removeTeamMember(eventId, role, address);

    return tx;
  } catch (error) {
    throw error;
  }
}

export async function getEventMembers(eventId, contract = eventsContract) {
  try {
    const members = await contract.getEventMembers(eventId);

    return members;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllEventIds(contract = eventsContract) {
  const allEventIdsBN = await contract.fetchAllEventIds();

  const allEventIds = allEventIdsBN.map((eventId) => eventId.toNumber());

  return allEventIds;
}

export async function setEventCashier(eventId, address, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.setEventCashier(eventId, address);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function createTicketCategory(ipfsUrl, eventId, contractData, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.createTicketCategory(
      eventId,
      ipfsUrl,
      contractData.saleStartDate,
      contractData.saleEndDate,
      contractData.ticketsCount,
      contractData.ticketPrice,
      contractData.discountsTicketsCount,
      contractData.discountsPercentage,
      contractData.downPayment,
    );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function updateCategory(ipfsUrl, eventId, categoryId, contractData, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.updateCategory(
      eventId,
      categoryId,
      ipfsUrl,
      contractData.ticketPrice,
      contractData.discountsTicketsCount,
      contractData.discountsPercentage,
      contractData.downPayment,
    );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function removeCategory(eventId, categoryId, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.removeCategory(eventId, categoryId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function addCategoryTicketsCount(eventId, categoryId, ticketsCount, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.addCategoryTicketsCount(eventId, categoryId, ticketsCount);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function removeCategoryTicketsCount(eventId, categoryId, ticketsCount, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.removeCategoryTicketsCount(eventId, categoryId, ticketsCount);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function manageCategorySelling(eventId, categoryId, value, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.manageCategorySelling(eventId, categoryId, value);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function manageAllCategorySelling(eventId, value, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.manageAllCategorySelling(eventId, value);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function fetchCategoriesByEventId(eventId, contract = eventsContract) {
  try {
    const categories = await contract.fetchCategoriesByEventId(eventId);
    return categories;
  } catch (error) {
    throw error;
  }
}

export async function updateCategorySaleDates(
  eventId,
  categoryId,
  saleStartDate,
  saleEndDate,
  contract = eventsContract,
) {
  try {
    const tx = await contract.populateTransaction.updateCategorySaleDates(
      eventId,
      categoryId,
      saleStartDate,
      saleEndDate,
    );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function buyTickets(
  ticketIpfsUrls,
  eventCategoryData,
  priceData,
  place,
  contract = ticketControllerContract,
) {
  const buyTicketsFromSingleEvent = "buyTickets(uint256,uint256,(uint256,uint256)[],(uint256,uint256)[],string[])";
  const buyTicketsFromMultipleEvents =
    "buyTickets((uint256,uint256)[],(uint256,uint256)[],(uint256,uint256)[],string[])";
  const value = calculateTotalValue(priceData);

  if (eventCategoryData.length === 1) {
    const tx = await contract.populateTransaction[buyTicketsFromSingleEvent](
      eventCategoryData[0].eventId,
      eventCategoryData[0].categoryId,
      priceData,
      place,
      ticketIpfsUrls,
      { value },
    );
    return tx;
  } else {
    const tx = await contract.populateTransaction[buyTicketsFromMultipleEvents](
      eventCategoryData,
      priceData,
      place,
      ticketIpfsUrls,
      { value },
    );
    return tx;
  }
}

export async function addRefundDeadline(eventId, refundData, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.addRefundDeadline(eventId, refundData);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function returnTicket(ticketParams, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.returnTicket(ticketParams);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function withdrawRefund(eventId, ticketId, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.withdrawRefund(eventId, ticketId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function withdrawContractBalance(eventId, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.withdrawContractBalance(eventId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function clipTicket(eventId, ticketId, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.clipTicket(eventId, ticketId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function bookTickets(ticketUrls, eventId, categoryData, place, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.bookTickets(eventId, categoryData, place, ticketUrls);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function sendInvitation(eventId, ticketIds, accounts, contract = ticketControllerContract) {
  try {
    const tx = await contract.populateTransaction.sendInvitation(eventId, ticketIds, accounts);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function getAddressTicketIdsByEvent(eventId, address, contract = ticketControllerContract) {
  try {
    const signer = new ethers.VoidSigner(address, contract.provider);
    const tickets = await contract.connect(signer).getAddressTicketIdsByEvent(eventId);
    return tickets;
  } catch (error) {
    throw error;
  }
}

export async function fetchTicketOwnerOf(ticketId, contract = ticketsContract) {
  const account = await contract.ownerOf(ticketId);

  return account;
}

export async function listTicket(ticketId, ticketPrice, contract = ticketMarketplaceContract) {
  try {
    const tx = await contract.populateTransaction.listTicket(ticketId, ticketPrice);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function updateListedTicketPrice(ticketId, ticketPrice, contract = ticketMarketplaceContract) {
  try {
    const tx = await contract.populateTransaction.updateListedTicketPrice(ticketId, ticketPrice);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function buyListedTickets(ticketIds, price, contract = ticketMarketplaceContract) {
  if (ticketIds.length === 1) {
    try {
      const tx = await contract.populateTransaction.buyListedTicket(ticketIds[0], { value: price });
      return tx;
    } catch (error) {
      throw error;
    }
  } else {
    try {
      const tx = await contract.populateTransaction.buyMultipleListedTickets(ticketIds, { value: price });
      return tx;
    } catch (error) {
      throw error;
    }
  }
}

export async function cancelListedTicket(ticketId, contract = ticketMarketplaceContract) {
  try {
    const tx = await contract.populateTransaction.cancelListedTicket(ticketId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function postponeEvent(eventId, time, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.postponeEvent(eventId, time);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function cancelEvent(eventId, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.cancelEvent(eventId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function withdrawFromCanceledEvent(eventId, contract = eventsContract) {
  try {
    const tx = await contract.populateTransaction.withdrawFromCanceledEvent(eventId);
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function getListedTicketById(ticketId, contract = ticketMarketplaceContract) {
  try {
    const ticket = await contract.getListedTicketById(ticketId);

    return ticket;
  } catch (error) {
    throw error;
  }
}

/* ========= EXPRESS SERVER FUNCTIONS ========== */
export async function fetchCountriesFromServer(serverUrl = ETS_SERVER_URL) {
  try {
    const response = await axios.get(`${serverUrl}/api/v1/countries`);

    return response;
  } catch (error) {
    throw error;
  }
}

export async function fetchPlacesFromServer(country, serverUrl = ETS_SERVER_URL) {
  try {
    const response = await axios.get(`${serverUrl}/api/v1/places?country=${country}`);

    return response;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllEventsFromServer(params, serverUrl = ETS_SERVER_URL) {
  try {
    const response = await axios.post(`${serverUrl}/api/v1/events`, params);

    return response;
  } catch (error) {
    throw error;
  }
}

export { NET_RPC_URL, NET_RPC_URL_ID, TOKEN_NAME, NET_LABEL, listeners };
