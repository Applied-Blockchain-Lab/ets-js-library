import {
  uploadDataToIpfs,
  fetchEventsMetadata,
  deleteDataFromService,
} from "./utils/ipfs.utils.js";
import {
  AVALANCHE_TESTNET_API,
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  ABI,
} from "./configs/contract.config.js";
import { ethers } from "ethers";
import axios from "axios";

const provider = ethers.getDefaultProvider(AVALANCHE_TESTNET_API);
const eventTicketingSystemContract = new ethers.Contract(
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  ABI,
  provider
);

async function checkRemoveTransaction(address, eventId) {
  const signer = new ethers.VoidSigner(address, provider);
  const contract = new ethers.Contract(
    EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
    ABI,
    signer
  );
  const result = await contract.callStatic.removeEvent(eventId);
  return result;
}

async function checkUpdateTransaction(address, eventId) {
  const signer = new ethers.VoidSigner(address, provider);
  const contract = new ethers.Contract(
    EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
    ABI,
    signer
  );
  const result = await contract.callStatic.updateEventTokenUri(eventId, "");
  return result;
}

export async function createEvent(
  nftStorageApiKey,
  metadata,
  image,
  maxTicketPerClient
) {
  try {
    const url = await uploadDataToIpfs(nftStorageApiKey, metadata, image);
    const tx =
      await eventTicketingSystemContract.populateTransaction.createEvent(
        maxTicketPerClient,
        url
      );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function fetchEvents(eventIds) {
  try {
    const metadata = await fetchEventsMetadata(eventIds);

    return metadata;
  } catch (error) {
    throw error;
  }
}

export async function fetchOwnedEvents(address) {
  const signer = new ethers.VoidSigner(address, provider);
  const contract = new ethers.Contract(
    EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
    ABI,
    signer
  );
  const eventIds = await contract.fetchOwnedEvents();
  const events = await fetchEvents(eventIds);
  return events;
}

export async function removeEvent(nftStorageApiKey, eventId, address) {
  try {
    await checkRemoveTransaction(address, eventId);
    await deleteDataFromService(nftStorageApiKey, eventId);
    const tx =
      await eventTicketingSystemContract.populateTransaction.removeEvent(
        eventId
      );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function updateEvent(
  nftStorageApiKey,
  eventId,
  metadata,
  image,
  address
) {
  try {
    const result = await checkUpdateTransaction(address, eventId);
    await deleteDataFromService(nftStorageApiKey, eventId);
    const url = await uploadDataToIpfs(nftStorageApiKey, metadata, image);
    const tx =
      await eventTicketingSystemContract.populateTransaction.updateEventTokenUri(
        eventId,
        url
      );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function addTeamMember(eventId, role, address) {
  try {
    const tx =
      await eventTicketingSystemContract.populateTransaction.addTeamMember(
        eventId,
        role,
        address
      );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function removeTeamMember(eventId, role, address) {
  try {
    const tx =
      await eventTicketingSystemContract.populateTransaction.removeTeamMember(
        eventId,
        role,
        address
      );
    return tx;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllEventsFromServer(serverURL, JWT_SECRET, params) {
  try {
    const response = await axios.post(`${serverURL}/api/v1/events`, params, {
      headers: { Authorization: `Bearer ${JWT_SECRET}` },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
