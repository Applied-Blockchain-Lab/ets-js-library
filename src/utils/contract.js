import { ethers } from "ethers";
import {
  NET_RPC_URL,
  EVENTS_CONTRACT_ADDRESS,
  TICKETS_CONTRACT_ADDRESS,
  EVENT_FACET_ABI,
  TICKET_CONTROLLER_FACET_ABI,
  TICKET_FACET_ABI,
} from "#config";

const provider = ethers.getDefaultProvider(NET_RPC_URL);
const eventsContract = new ethers.Contract(EVENTS_CONTRACT_ADDRESS, EVENT_FACET_ABI, provider);
const ticketControllerContract = new ethers.Contract(EVENTS_CONTRACT_ADDRESS, TICKET_CONTROLLER_FACET_ABI, provider);
const ticketsContract = new ethers.Contract(TICKETS_CONTRACT_ADDRESS, TICKET_FACET_ABI, provider);

export { eventsContract, ticketControllerContract, ticketsContract };
