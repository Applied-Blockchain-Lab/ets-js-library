import schema from "ets-contracts/artifacts/contracts/EventTicketingSystem.sol/EventTicketingSystem.json";
import {
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  AVALANCHE_TESTNET_API,
} from "ets-contracts/config/index.config";

const IPFS_GATEWAY_PROVIDER_URL = "https://nftstorage.link/ipfs/";
const ABI = schema.abi;
export {
  IPFS_GATEWAY_PROVIDER_URL,
  AVALANCHE_TESTNET_API,
  EVENT_TICKETING_SYSTEM_CONTRACT_ADDRESS,
  ABI,
};
