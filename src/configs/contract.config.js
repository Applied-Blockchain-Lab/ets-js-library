import schema from "../../node_modules/event-ticketing-system/artifacts/contracts/EventTicketingSystem.sol/EventTicketingSystem.json";
import {EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS, AVALANCHE_TESTNET_API} from "../../node_modules/event-ticketing-system/config/index.config.js";
const IPFS_GATEWAY_PROVIDER_URL = "https://nftstorage.link/ipfs/";
const ABI = schema.abi;
export {
  IPFS_GATEWAY_PROVIDER_URL,
  AVALANCHE_TESTNET_API,
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  ABI,
};
