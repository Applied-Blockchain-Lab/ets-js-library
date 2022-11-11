import axios from "axios";
import { eventsContract, ticketControllerContract, ticketsContract } from "#contract";
import { fetchSingleEventMetadata, makeGatewayUrl } from "#ipfs.utils";

export function listenForNewEvent(callback, contract = eventsContract) {
  contract.on("EventCreated", async (eventId, metadataUri) => {
    const url = makeGatewayUrl(metadataUri);
    const eventMetadata = await axios.get(url);

    const membersData = await contract.getEventMembers(eventId);

    const data = {
      eventId,
      metadataUri,
      eventMetadata: eventMetadata.data,
    };

    await callback(data, membersData);
  });
}

export function listenForEventUpdate(callback, contract = eventsContract) {
  contract.on("MetadataUpdate", async (contractNftEventId) => {
    // Fetch Event NFT metadata
    const eventsMetadata = await fetchSingleEventMetadata(contractNftEventId);

    const data = {
      eventId: ethers.BigNumber.from(contractNftEventId).toNumber(),
      eventMetadata: eventsMetadata[0],
    };

    await callback(data);
  });
}

export function listenForRoleGrant(callback, contract = eventsContract) {
  listenForRole("RoleGranted", contract, callback);
}

export function listenForRoleRevoke(callback, contract = eventsContract) {
  listenForRole("RoleRevoked", contract, callback);
}

function listenForRole(contractEventName, contract, callback) {
  contract.on(contractEventName, async (contractNftEventId, role, account, sender) => {
    const data = {
      eventId: contractNftEventId,
      role,
      account,
      sender,
    };

    await callback(data);
  });
}

export function listenForBoughtTicket(callback, contract = ticketControllerContract) {
  contract.on("TicketBought", async (ticketId, account) => {
    const data = {
      ticketContractId: ticketId,
      account,
    };

    await callback(data);
  });
}

export function listenForRefundedTicket(callback, contract = ticketControllerContract) {
  contract.on("TicketRefunded", async (eventId, categoryId, ticketId, account) => {
    const data = {
      eventId,
      categoryId,
      ticketContractId: ticketId,
      account,
    };

    await callback(data);
  });
}

export function listenForLockedTicked(callback, contract = ticketsContract) {
  contract.on("Locked", async (tokenId) => {
    const data = {
      ticketContractId: tokenId,
    };

    await callback(data);
  });
}

export function listenForUnlockedTicket(callback, contract = ticketsContract) {
  contract.on("Unlocked", async (tokenId) => {
    const data = {
      ticketContractId: tokenId,
    };

    await callback(data);
  });
}

export function listenForTicketTransfer(callback, contract = ticketsContract) {
  contract.on("Transfer", async (from, to, tokenId) => {
    const data = {
      from,
      to,
      ticketContractId: tokenId,
    };

    await callback(data);
  });
}

export function listenForTicketApproval(callback, contract = ticketsContract) {
  contract.on("Approval", async (owner, approved, tokenId) => {
    const data = {
      owner,
      approved,
      ticketContractId: tokenId,
    };

    await callback(data);
  });
}

export function listenForTicketApprovalForAll(callback, contract = ticketsContract) {
  contract.on("ApprovalForAll", async (owner, operator, tokenId) => {
    const data = {
      owner,
      operator,
      ticketContractId: tokenId,
    };

    await callback(data);
  });
}

export function listenForTicketConsecutiveTransfer(callback, contract = ticketsContract) {
  contract.on("ConsecutiveTransfer", async (fromTokenId, toTokenId, from, to) => {
    const data = {
      fromTokenId,
      toTokenId,
      from,
      to,
    };

    await callback(data);
  });
}

export function listenForTicketConsumed(callback, contract = ticketsContract) {
  contract.on("OnConsumption", async (consumer, assetId, amount, data) => {
    const data_ = {
      consumer,
      ticketContractId: assetId,
      amount,
      data,
    };

    await callback(data_);
  });
}

export function listenForBatchMetadataUpdate(callback, contract = eventsContract) {
  contract.on("BatchMetadataUpdate", async (_fromTokenId, _toTokenId) => {
    const data = {
      _fromTokenId,
      _toTokenId,
    };

    await callback(data);
  });
}

export function listenForRefund(callback, contract = eventsContract) {
  contract.on("Refund", async (_sender, _tokenId) => {
    const data = {
      account: _sender,
      ticketContractId: _tokenId,
    };

    await callback(data);
  });
}

export function listenForNewEventCashier(callback, contract = eventsContract) {
  contract.on("EventCashierSet", async (eventId, account, setter) => {
    const data = {
      eventId,
      account,
      setter,
    };

    await callback(data);
  });
}

export function listenForNewCategory(callback, contract = eventsContract) {
  contract.on("CategoryCreated", async (eventId, categoryId, categoryCid) => {
    const data = {
      eventId,
      categoryId,
      categoryCid,
    };

    await callback(data);
  });
}

export function listenForCategoryUpdate(callback, contract = eventsContract) {
  contract.on("CategoryUpdated", async (eventId, categoryId) => {
    const data = {
      eventId,
      categoryId,
    };

    await callback(data);
  });
}

export function listenForCategoryDelete(callback, contract = eventsContract) {
  contract.on("CategoryDeleted", async (eventId, categoryId) => {
    const data = {
      eventId,
      categoryId,
    };

    await callback(data);
  });
}

export function listenForCategoryTicketsAdded(callback, contract = eventsContract) {
  contract.on("CategoryTicketsAdded", async (eventId, categoryId, ticketsCount) => {
    const data = {
      eventId,
      categoryId,
      ticketsCount,
    };

    await callback(data);
  });
}

export function listenForCategoryTicketsRemoved(callback, contract = eventsContract) {
  contract.on("CategoryTicketsRemoved", async (eventId, categoryId, ticketsCount) => {
    const data = {
      eventId,
      categoryId,
      ticketsCount,
    };

    await callback(data);
  });
}

export function listenForCategorySellChanged(callback, contract = eventsContract) {
  contract.on("CategorySellChanged", async (eventId, categoryId, value) => {
    const data = {
      eventId,
      categoryId,
      value,
    };

    await callback(data);
  });
}

export function listenForAllCategorySellChanged(callback, contract = eventsContract) {
  contract.on("AllCategorySellChanged", async (eventId, value) => {
    const data = {
      eventId,
      value,
    };

    await callback(data);
  });
}

export function listenForCategorySaleDatesUpdate(callback, contract = eventsContract) {
  contract.on("CategorySaleDatesUpdated", async (eventId, categoryId, staffMember) => {
    const data = {
      eventId,
      categoryId,
      staffMember,
    };

    await callback(data);
  });
}

export function listenForNewEventRefundDate(callback, contract = ticketControllerContract) {
  contract.on("EventRefundDateAdded", async (eventId, date, percentage) => {
    const data = {
      eventId,
      date,
      percentage,
    };

    await callback(data);
  });
}

export function listenForRefundWithdraw(callback, contract = ticketControllerContract) {
  contract.on("RefundWithdraw", async (ticketId, account) => {
    const data = {
      ticketContractId: ticketId,
      account,
    };

    await callback(data);
  });
}

export function listenForEventWithdraw(callback, contract = ticketControllerContract) {
  contract.on("EventWithdraw", async (eventId) => {
    const data = {
      eventId,
    };

    await callback(data);
  });
}

export function listenForClipedTicket(callback, contract = ticketControllerContract) {
  contract.on("TicketClipped", async (eventId, ticketId, staffMember) => {
    const data = {
      eventId,
      ticketContractId: ticketId,
      account: staffMember,
    };

    await callback(data);
  });
}

export function listenForBookedTickets(callback, contract = ticketControllerContract) {
  contract.on("TicketsBooked", async (eventId, ticketCount, staffMember) => {
    const data = {
      eventId,
      ticketCount,
      account: staffMember,
    };

    await callback(data);
  });
}

export function listenForNewTicketInvitation(callback, contract = ticketControllerContract) {
  contract.on("InvitationSent", async (eventId, accounts, staffMember) => {
    const data = {
      eventId,
      accounts,
      account: staffMember,
    };

    await callback(data);
  });
}
