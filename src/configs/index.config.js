import eventSchema from "#contract.config/EventFacet.json" assert { type: "json" };
import ticketControllerSchema from "#contract.config/EventTicketControllerFacet.json" assert { type: "json" };
import ticketFacetSchema from "#contract.config/TicketFacet.json" assert { type: "json" };
import {
  EVENTS_CONTRACT_ADDRESS,
  TICKETS_CONTRACT_ADDRESS,
  NET_RPC_URL,
  NET_RPC_URL_ID,
  TOKEN_NAME,
  NET_LABEL,
} from "#contract.config/constants.cjs";

const EVENT_FACET_ABI = eventSchema.abi;
const TICKET_CONTROLLER_FACET_ABI = ticketControllerSchema.abi;
const TICKET_FACET_ABI = ticketFacetSchema.abi;
const IPFS_GATEWAY_PROVIDER_URL = "https://nftstorage.link/ipfs/";
const ETS_SERVER_URL = "http://127.0.0.1:1337";

export {
  EVENT_FACET_ABI,
  TICKET_CONTROLLER_FACET_ABI,
  TICKET_FACET_ABI,
  IPFS_GATEWAY_PROVIDER_URL,
  ETS_SERVER_URL,
  EVENTS_CONTRACT_ADDRESS,
  TICKETS_CONTRACT_ADDRESS,
  NET_RPC_URL,
  NET_RPC_URL_ID,
  TOKEN_NAME,
  NET_LABEL,
};
