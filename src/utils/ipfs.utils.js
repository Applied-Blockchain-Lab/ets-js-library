import { NFTStorage } from "nft.storage";
import axios from "axios";
import { ethers } from "ethers";
import {
  AVALANCHE_TESTNET_API,
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  ABI,
  IPFS_GATEWAY_PROVIDER_URL,
} from "../configs/contract.config.js";
const provider = ethers.getDefaultProvider(AVALANCHE_TESTNET_API);
const eventTicketingSystemContract = new ethers.Contract(
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  ABI,
  provider
);

function makeGatewayUrl(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, IPFS_GATEWAY_PROVIDER_URL);
}

async function uploadDataToIpfs(nftStorageApiKey, metadata, image) {
  const client = new NFTStorage({ token: nftStorageApiKey });
  metadata.image = image;

  const cid = await client.store(metadata);

  return cid.url;
}

async function deleteDataFromService(nftStorageApiKey, eventId) {
  const eventUri = await eventTicketingSystemContract.tokenURI(eventId);

  const cid = eventUri.split("/")[2];

  const client = new NFTStorage({ token: nftStorageApiKey });

  await client.delete(cid);
}

async function fetchEventsMetadata(eventIds) {
  const eventsMetadata = [];

  for (const eventId of eventIds) {
    try {
      const eventUri = await eventTicketingSystemContract.tokenURI(eventId);
      const url = makeGatewayUrl(eventUri);

      const eventMetadata = await axios.get(url);

      eventsMetadata.push(eventMetadata.data);
    } catch (error) {
      return { error: error.reason };
    }
  }

  return eventsMetadata;
}

export { uploadDataToIpfs, deleteDataFromService, fetchEventsMetadata };
