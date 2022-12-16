/* eslint-disable no-useless-catch */
import { NFTStorage } from "nft.storage";
import axios from "axios";
import { IPFS_GATEWAY_PROVIDER_URL } from "#config";
import { eventsContract } from "#contract";

function makeGatewayUrl(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, IPFS_GATEWAY_PROVIDER_URL);
}

async function uploadDataToIpfs(nftStorageApiKey, metadata) {
  const client = new NFTStorage({ token: nftStorageApiKey });

  const cid = await client.store(metadata);

  return cid.url;
}

async function uploadArrayToIpfs(nftStorageApiKey, metadataArray) {
  const UrisArray = [];

  for (let i = 0; i < metadataArray.length; i++) {
    UrisArray.push(await uploadDataToIpfs(nftStorageApiKey, metadataArray[i]));
  }

  return UrisArray;
}

async function deleteDataFromService(nftStorageApiKey, eventUri) {
  const cid = eventUri.split("/")[2]; // buddy ignore:line

  const client = new NFTStorage({ token: nftStorageApiKey });

  await client.delete(cid);
}

async function getIpfsUrl(eventId, contract = eventsContract) {
  const eventUri = await contract.tokenURI(eventId);

  return eventUri;
}

async function fetchEventsMetadata(eventIds, contract = eventsContract) {
  const eventsMetadata = [];

  for (const eventId of eventIds) {
    try {
      const eventMetadata = await fetchSingleEventMetadata(eventId, contract);

      eventsMetadata.push(eventMetadata);
    } catch (error) {
      throw error;
    }
  }

  return eventsMetadata;
}

async function fetchSingleEventMetadata(eventId, contract = eventsContract) {
  try {
    const eventUri = await contract.tokenURI(eventId);

    const url = makeGatewayUrl(eventUri);

    const eventMetadata = await axios.get(url);
    const contractData = await contract.fetchEventById(eventId);

    eventMetadata.data.eventId = eventId;
    eventMetadata.data.cid = eventUri;
    Object.assign(eventMetadata.data, contractData);
    eventMetadata.data.image = makeGatewayUrl(eventMetadata.data.image);

    switch (eventMetadata.data.status) {
      case 0: // buddy ignore:line
        eventMetadata.data.status = "normal";
        break;
      case 1: // buddy ignore:line
        eventMetadata.data.status = "postponed";
        break;
      case 2: // buddy ignore:line
        eventMetadata.data.status = "canceled";
        break;
    }

    return eventMetadata.data;
  } catch (error) {
    throw error;
  }
}

async function fetchCategoriesMetadata(categories) {
  const categoriesMetadata = [];

  for (const category of categories) {
    try {
      const categoryMetadata = await fetchSingleCategoryMetadata(category);

      categoriesMetadata.push(categoryMetadata);
    } catch (error) {
      throw error;
    }
  }

  return categoriesMetadata;
}

async function fetchSingleCategoryMetadata(category) {
  try {
    const url = makeGatewayUrl(category.cid);
    const response = await axios.get(url);
    const metadata = response.data;
    Object.assign(metadata, category);
    metadata.image = makeGatewayUrl(metadata.image);
    return metadata;
  } catch {
    return category;
  }
}

async function fetchSingleTicketMetadata(ticket) {
  try {
    const url = makeGatewayUrl(ticket.tokenUri);
    const response = await axios.get(url);
    const metadata = response.data;
    Object.assign(metadata, ticket);
    metadata.image = makeGatewayUrl(metadata.image);
    return metadata;
  } catch {
    return ticket;
  }
}

export {
  uploadDataToIpfs,
  uploadArrayToIpfs,
  deleteDataFromService,
  fetchEventsMetadata,
  fetchSingleEventMetadata,
  getIpfsUrl,
  makeGatewayUrl,
  fetchCategoriesMetadata,
  fetchSingleTicketMetadata,
};
