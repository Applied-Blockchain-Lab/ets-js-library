# ets-js-library

## About

This is a JavaScript library for interacting with event ticketing system. It creates unsigned transactions and fetches data from smart contracts and ipfs.

### Users of the system

- Visitor:
  Can search for events and buy tickets.
- Organizers of event:
  - Admin:
    Can control everything on his events.
  - Moderator:
    Can do everything except managing roles and deleting the event.
  - Cashier:
    Can operate with the funds collected from the event.
  - Validator:
    Can mark a ticket as "used".

## How to use

Install:

```bash
npm i ets-js-library
```

## Listeners docs

Check listeners docs:[docs/listeners.md](https://github.com/Applied-Blockchain-Lab/ets-js-library/blob/main/docs/listeners.md)

## Available functionalities in format _Action name (who has the right)_

### Upload single data to IPFS with nft.storage (Everyone)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Create metadata either for event, category or ticket.

```js
import { uploadDataToIpfsNftStorage } from "ets-js-library";

const key = "API key for NFT.storage";

const metadata = {
  name: "Event1",
  description: "Event1 Description",
  image: "Blob or File Object",
  properties: {
    websiteUrl: "https://event1.com",
    location: {
      country: "Country1",
      city: "Place1",
      address: "Address1",
      coordinates: {
        latitude: "00.000",
        longitude: "00.000",
      },
    },
    contacts: "Contacts",
    status: "upcoming",
    tags: ["tag1", "tag2"],
  },
};

const ipfsUrl = await uploadDataToIpfsNftStorage(key, metadata);
```

### Upload multiple data to IPFS with nft.storage (Everyone)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Create multiple metadatas in array for tickets.

```js
import { uploadArrayToIpfsNftStorage } from "ets-js-library";

const key = "API key for NFT.storage";

const ticketsMetadata = [{
  name: "ticket",
  description: "ticket for event",
  image: "Blob or File Object",
  properties: {
    note: "Note from buyer",
    returnReason: "",
  },
},
...
];

const ipfsUrls = await uploadArrayToIpfsNftStorage(key, ticketsMetadata);
```

### Create event (Everyone)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import createEvent function from the library.
3. Create metadata for the new event.
4. Execute creteEvent function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.

```js
import { createEvent } from "ets-js-library";

const contractData = {
  maxTicketPerClient: 5,
  startDate: 1666666666, // unix timestamp
  endDate: 1666666666, // unix timestamp
};

const ipfsUrl = "ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json";

const transaction = await createEvent(ipfsUrl, contractData);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- ERC5007: Invalid endTime
- ERC721: mint to the zero address
- ERC721: token already minted
- ERC721URIStorage: URI set of nonexistent token

### Update event metadata (Admin or Moderator)

1. Import updateEvent, getEventIpfsUri and deleteFromIpfs from the library.
2. Create new metadata for the event.
3. Execute getEventIpfsUri function. This will return the Uri of the current metadata.
4. Execute updateEvent function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.
6. If the transaction succeeds, you can safely delete the old metadata with deleteFromIpfs.

```js
import { updateEvent, getEventIpfsUri, deleteFromIpfs } from "ets-js-library";

const key = "API key for NFT.storage";

const ipfsUrl = "ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json";

const eventId = "Id of event in smart contract";

const metadataUri = await getEventIpfsUri(eventId);

try {
  const transaction = await updateEvent(ipfsUrl, eventId, metadata);

  //You need to sign and send the transaction here.
  deleteFromIpfs(key, metadataUri);
} catch (error) {
  console.log(error);
}
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin or moderator
- ERC721URIStorage: URI set of nonexistent token

### Remove event (Admin)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import removeEvent and deleteFromIpfs from the library.
3. Execute removeEvent function. This will return an unsigned transaction.
4. Sign and send the transaction anyway you like.
5. If the transaction succeeds, you can safely delete the old metadata with deleteFromIpfs.

```js
import { removeEvent, deleteFromIpfs } from "ets-js-library";

const key = "API key for NFT.storage";
const eventId = "Id of event in smart contract";

const metadataUri = await getEventIpfsUri(eventId);

try {
  const transaction = await removeEvent(eventId);

  //You need to sign and send the transaction here.
  deleteFromIpfs(key, metadataUri);
} catch (error) {
  console.log(error);
}
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin
- Event: There are sold tickets

### Fetch events by Ids (Everyone)

1. Import fetchEvents from the library.
2. Execute fetchEvents.

```js
import { fetchEvents } from "ets-js-library";

//Ids of events in smart contract.
const eventIds = [1, 2, 3];

const events = fetchEvents(eventIds);
```

Return data:

```js
const events = [
{
  name: "Event1",
  description: "Event1 Description",
  image: "Blob or File Object",
  properties: {
    websiteUrl: "https://event1.com",
    location: {
      country: "Country1",
      city: "Place1",
      address: "Address1",
      coordinates: {
        latitude: "00.000",
        longitude: "00.000"
      }
    },
    contacts: "Contacts",
    status: "upcoming",
    tags: ["tag1", "tag2"]
  }
}
,
...
];
```

#### Possible error messages

- Event: Event does not exist

### Fetch owned events (Admin or Moderator)

1. Import fetchOwnedEvents function from the library.
2. Execute fetchOwnedEvents by supplying an address.

```js
import { fetchOwnedEvents } from "ets-js-library";

const address = "Address of events owner.";

const events = fetchOwnedEvents(address);
```

Return data:

```js
const events = [
{
  name: "Event1",
  description: "Event1 Description",
  image: "Blob or File Object",
  properties: {
    websiteUrl: "https://event1.com",
    location: {
      country: "Country1",
      city: "Place1",
      address: "Address1",
      coordinates: {
        latitude: "00.000",
        longitude: "00.000"
      }
    },
    contacts: "Contacts",
    status: "upcoming",
    tags: ["tag1", "tag2"]
  }
}
,
...
];
```

### Fetch cached events from server (Everyone)

1. Import fetchAllEventsFromServer function from the library.
2. Create params.
3. Execute fetchAllEventsFromServer.

```js
import { fetchAllEventsFromServer } from "ets-js-library";

const params = {
  keywords: {
    title: "",
    titleDesc: "",
    preference: "",
  },
  minStartDate: "",
  maxStartDate: "",
  eventEndDateStartingInterval: "",
  eventEndDateEndingInterval: "",
  country: "",
  place: "",
  tags: {
    tags: [],
    preference: "",
  },
  sort: {
    startDate: "",
    eventName: "",
    country: "",
    place: "",
  },
  pagination: {
    offset: "",
    limit: "",
  },
  user: "",
  tickets: "",
};

//This parameter is optional
const serverUrl = "http://localhost:1337";

const events = fetchAllEventsFromServer(params, serverUrl);
```

Return data:

```js
const events = [
  "ipfs://bafyreia6fhgdn7y2ygvmkgjqgqrnikshfgqohw5k3ophortlmgz77egtlm/metadata.json",
  "ipfs://bafyreia7oca4gvgb7ofj5lskkb7defpvtlct6kfe5sccyixdkgikx5lgli/metadata.json",
];
```

### Fetch Countries from server (Everyone)

1. Import fetchCountriesFromServer function from the library.
2. Execute fetchCountriesFromServer.

```js
import { fetchCountriesFromServer } from "ets-js-library";

//This parameter is optional
const serverUrl = "http://localhost:1337";

const countries = fetchCountriesFromServer(serverUrl);
```

Return data:

```js
const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", ...];
```

### Fetch Places from server (Everyone)

1. Import fetchPlacesFromServer function from the library.
2. Execute fetchPlacesFromServer.

```js
import { fetchPlacesFromServer } from "ets-js-library";

//This parameter is optional
const serverUrl = "http://localhost:1337";
const country = "Bulgaria";

const places = fetchPlacesFromServer(country, serverUrl);
```

Return data:

```js
const places = ["Paris", "Rome", "London", "Berlin", "Venice", ...];
```

### Add team member to event (Admin)

1. Import addTeamMember function from the library.
2. Import utils function from ethers.
3. Generate the hash of the role.
4. Execute addTeamMember function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.

```js
import { addTeamMember } from "ets-js-library";
import { utils } from "ethers";

const eventId = "Id of event in smart contract";
const address = "Address of new member.";
const role = utils.keccak256(utils.toUtf8Bytes("MODERATOR_ROLE"));

const transaction = await addTeamMember(eventId, role, address);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin
- Event: Can't set cashier here

### Remove team member from event (Admin)

1. Import removeTeamMember function from the library.
2. Import utils function from ethers.
3. Generate the hash of the role.
4. Execute removeTeamMember function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.

```js
import { removeTeamMember } from "ets-js-library";
import { utils } from "ethers";

const eventId = "Id of event in smart contract";
const address = "Address of team member.";
const role = utils.keccak256(utils.toUtf8Bytes("MODERATOR_ROLE"));

const transaction = await removeTeamMember(eventId, role, address);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin
- Event: Can't remove cashier here

### Fetch all team members of event (Everyone)

1. Import getEventMembers function from the library.
2. Execute getEventMembers function.

```js
import { getEventMembers } from "ets-js-library";

const eventId = "Id of event in smart contract";

const members = await getEventMembers(eventId);
```

Return data:

```js
const members = [
  [
    //Address
    "0xb6F32C6d8C23e5201Ec123644f11cf6F013d9363",
    //Role
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ],
  [
    //Address
    "0xB7a94AfbF92B4D2D522EaA8f7c0e07Ab6A61186E",
    //Role
    "0x21702c8af46127c7fa207f89d0b0a8441bb32959a0ac7df790e9ab1a25c98926"
  ]
...
];
```

#### Possible error messages

- Event: Event does not exist

### Fetch all event ids (Everyone)

1. Import getEventMembers function from the library.
2. Execute getEventMembers function.

```js
import { fetchAllEventIds } from "ets-js-library";

const eventIds = await fetchAllEventIds();
```

Return data:

```js
const eventIds = [1, 2, 3];
```

### Set event cashier (Admin)

1. Import setEventCashier function from the library.
2. Execute setEventCashier function. This will return an unsigned transaction.
3. Sign and send the transaction anyway you like.

```js
import { setEventCashier } from "ets-js-library";

const oldCashier = "Address of old cashier.";
const newCashier = "Address of new cashier.";
const eventId = "Id of event";

const transaction = await setEventCashier(eventId, oldCashier, newCashier);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin

### Create ticket category (Admin or Moderator)

1. Import createTicketCategory function from the library.
2. Create metadata for the new category.
3. Execute createTicketCategory function. This will return an unsigned transaction.
4. Sign and send the transaction anyway you like.

```js
import { createTicketCategory } from "ets-js-library";

const ipfsUrl = "ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json";

const contractData = {
  saleStartDate: 1666666666, // unix timestamp
  saleEndDate: 1666666666, // unix timestamp
  ticketsCount: 50,
  ticketPrice: 10,
  discountsTicketsCount: [10, 5],
  discountsPercentage: [20, 10],
  downPayment: {
    price: 2,
    finalAmountDate: 1666666666, // unix timestamp
  },
};

const eventId = "Id of event";

const transaction = await createTicketCategory(ipfsUrl, eventId, contractData);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin or moderator
- Event: Discount parameters length not eq

### Update category (Admin or Moderator)

1. Import updateCategory from the library.
2. Create new metadata and contractData for the category.
3. Execute updateCategory function. This will return an unsigned transaction.
4. Sign and send the transaction anyway you like.

```js
import { updateCategory } from "ets-js-library";

const ipfsUrl = "ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json";

const contractData = {
  saleStartDate: 1666666666, // unix timestamp
  saleEndDate: 1666666666, // unix timestamp
  ticketsCount: 50,
  ticketPrice: 10,
  discountsTicketsCount: [10, 5],
  discountsPercentage: [20, 10],
  downPayment: {
    price: 2,
    finalAmountDate: 1666666666, // unix timestamp
  },
};

const eventId = "Id of event";
const categoryId = "Id of category";

const transaction = await updateCategory(ipfsUrl, eventId, categoryId, contractData);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Caller is not an admin or moderator
- Event: Discount parameters length not eq

### Remove category (Admin or Moderator)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import removeCategory function from the library.
3. Execute removeCategory function. This will return an unsigned transaction.
4. Sign and send the transaction anyway you like.
5. If the transaction succeeds, you can safely delete the metadata with deleteFromIpfs.

```js
import { removeCategory, deleteFromIpfs } from "ets-js-library";

const key = "API key for NFT.storage";
const eventId = "Id of event";
const categoryId = "Id of category";

try {
  const transaction = await removeCategory(eventId, categoryId);
  //You need to sign and send the transaction here.
  deleteFromIpfs(key, oldMetadataUri);
} catch (error) {
  console.log(error);
}
```

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Caller is not an admin or moderator
- Event: There are sold tickets

### Add more tickets to category (Admin or Moderator)

1. Import addCategoryTicketsCount function from the library.
2. Execute addCategoryTicketsCount function. This will return an unsigned transaction.
3. Sign and send the transaction anyway you like.

```js
import { addCategoryTicketsCount } from "ets-js-library";

const eventId = "Id of event";
const categoryId = "Id of category";
const moreTickets = 5;

const transaction = await addCategoryTicketsCount(eventId, categoryId, moreTickets);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Caller is not an admin or moderator

### Remove tickets from category (Admin or Moderator)

1. Import addCategoryTicketsCount function from the library.
2. Execute addCategoryTicketsCount function. This will return an unsigned transaction.
3. Sign and send the transaction anyway you like.

```js
import { removeCategoryTicketsCount } from "ets-js-library";

const eventId = "Id of event";
const categoryId = "Id of category";
const lessTickets = 5;

const transaction = await removeCategoryTicketsCount(eventId, categoryId, lessTickets);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Caller is not an admin or moderator
- Event: Can't decrease tickets count below zero
- Event: Tickets amount can't be less than sold tickets

### Manage the sale of tickets for a category (Admin or Moderator)

1. Import manageCategorySelling function from the library.
2. Execute manageCategorySelling function. This will return an unsigned transaction.
3. Sign and send the transaction anyway you like.

```js
import { manageCategorySelling } from "ets-js-library";

const eventId = "Id of event";
const categoryId = "Id of category";
//true - sale is enabled
//false - sale is disabled
const value = true;

const transaction = await manageCategorySelling(eventId, categoryId, value);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Caller is not an admin or moderator

### Manage the sale of tickets for all categories of event (Admin or Moderator)

1. Import manageAllCategorySelling function from the library.
2. Execute manageAllCategorySelling function. This will return an unsigned transaction.
3. Sign and send the transaction anyway you like.

```js
import { manageAllCategorySelling } from "ets-js-library";

const eventId = "Id of event";
//true - sale is enabled
//false - sale is disabled
const value = true;

const transaction = await manageAllCategorySelling(eventId, value);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin or moderator

### Fetch categories of event (Everyone)

1. Import fetchCategoriesByEventId function from the library.
2. Execute fetchCategoriesByEventId function.

```js
import { fetchCategoriesByEventId } from "ets-js-library";

const eventId = "Id of event";

const categories = await fetchCategoriesByEventId(eventId);
```

Return data:

```js
const categories = [
  {
  id: 1,
  cid: "ipfs://bafyreia6fhgdn7y2ygvmkgjqgqrnikshfgqohw5k3ophortlmgz77egtlm/metadata.json",
  ticketIds: [1,2,3],
  ticketPrice: 10,
  ticketsCount: 10,
  saleStartDate: 1666666666, //unix timestamp
  saleEndDate: 1666666666, //unix timestamp
  eventId: 1,
  discountsTicketsCount: [ 5, 2 ],
  discountsPercentage: [ 10, 5 ],
  downPayment: {
    price: 2,
    finalAmountDate: 1666666666 // unix timestamp
  }
  areTicketsBuyable: true,
  }
  ...
];
```

Return data:

```js
const categories = [
  {
  id: 1,
  cid: "ipfs://bafyreia6fhgdn7y2ygvmkgjqgqrnikshfgqohw5k3ophortlmgz77egtlm/metadata.json",
  ticketIds: [1,2,3],
  ticketPrice: 10,
  ticketsCount: 10,
  saleStartDate: 1666666666, //unix timestamp
  saleEndDate: 1666666666, //unix timestamp
  eventId: 1,
  discountsTicketsCount: [ 5, 2 ],
  discountsPercentage: [ 10, 5 ],
  downPayment: {
    price: 2,
    finalAmountDate: 1666666666 // unix timestamp
  }
  areTicketsBuyable: true,
  }
  ...
];
```

#### Possible error messages

- Event: Event does not exist

### Update category sale dates (Admin or Moderator)

1. Import updateCategorySaleDates function from the library.
2. Execute updateCategorySaleDates function.
3. Sign and send the transaction anyway you like.

```js
import { updateCategorySaleDates } from "ets-js-library";

const eventId = "Id of event";
const categoryId = "Id of category";
const saleStartDate = 1666666666; //unix timestamp
const saleEndDate = 1666666666; //unix timestamp

const transaction = await updateCategorySaleDates(eventId, categoryId, saleStartDate, saleEndDate);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Caller is not an admin or moderator

### Buy tickets (Everyone)

1. Import buyTickets function from the library.
2. Execute buyTickets function.
3. Sign and send the transaction anyway you like.

```js
import { buyTickets } from "ets-js-library";

const eventCategoryData = [
  {
    eventId: "id of event",
    categoryId: "id of category",
  },
  {
    eventId: "id of event",
    categoryId: "id of category",
  },
];

const priceData = [
  {
    amount: "Amount of tickets to buy",
    price: "Price of a single ticket",
  },
  {
    amount: "Amount of tickets to buy",
    price: "Price of a single ticket",
  },
];

const place = [
  {
    row: "Row number of seat",
    seat: "Seat position on row",
  },
  {
    row: "Row number of seat",
    seat: "Seat position on row",
  },
];

const ipfsUrls = ["ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json", ...];

const transaction = await buyTickets(ipfsUrls, eventCategoryData, priceData, place);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Parameters length not eq
- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Tickets for all categories are not buyable
- Event: Tickets for this category are not buyable
- Event: Can't buy tickets for event yet
- Event: Can't buy tickets for category yet
- Event: Max tickets for account reached
- Event: Max tickets count is reached
- Event: Wrong ticket price
- Event: Msg value not eq total price
- Event: Place is taken

### Add refund data for an event (Admin or Moderator)

1. Import addRefundDeadlines function from the library.
2. Execute addRefundDeadlines function.
3. Sign and send the transaction anyway you like.

```js
import { addRefundDeadline } from "ets-js-library";

const eventId = "id of event";

const refundData = { date: "timestamp", percentage: "percentage to return" };

const transaction = await addRefundDeadline(eventId, refundData);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin or moderator

### Return ticket (Admin or Moderator)

1. Import returnTicket function from the library.
2. Execute returnTicket function.
3. Sign and send the transaction anyway you like.

```js
import { returnTicket } from "ets-js-library";

const ticketParams = { eventId: 1, categoryId: 1, ticketId: 1 };

const transaction = await returnTicket(ticketParams);
//You need to sign and send the transaction after this.
```

This function does not send the tokens immediately to the account, but saves the information in the contract, after which the user must get them through the [withdrawRefund](#withdrawrefund) function.

#### Possible error messages

- Event: Event does not exist
- Event: Category does not exist
- Event: This category is for another event
- Event: Ticket doesn't exist in this category
- Event: Can't refund for this event
- Event: Refund date is over
- Event: Contract call reverted

### withdraw the refund (Everyone)

1. Import withdrawRefund function from the library.
2. Execute withdrawRefund function.
3. Sign and send the transaction anyway you like.

```js
import { withdrawRefund } from "ets-js-library";

const eventId = "id of event";
const ticketId = "id of ticket";

const transaction = await withdrawRefund(eventId, ticketId);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Can't refund for this event
- Event: Acc refund withdraw reverted

### withdraw the balance of event (Cashier)

1. Import withdrawContractBalance function from the library.
2. Execute withdrawContractBalance function.
3. Sign and send the transaction anyway you like.
   \*The maximum withdraw amount is the amount which can't be refunded from users.

```js
import { withdrawContractBalance } from "ets-js-library";

const eventId = "id of event";

const transaction = await withdrawContractBalance(eventId);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Only cashier can withdraw contract balance
- Event: Contract balance withdraw reverted

### Clip ticket (Admin, Moderator or Receptionist)

1. Import clipTicket function from the library.
2. Execute clipTicket function.
3. Sign and send the transaction anyway you like.

```js
import { clipTicket } from "ets-js-library";

const eventId = "id of event";
const ticketId = "id of ticket";

const messageHash = ethers.utils.solidityKeccak256(["uint"], [ticketId]);
const messageHashBinary = ethers.utils.arrayify(messageHash);
const signature = await ticketOwnerWallet.signMessage(messageHashBinary);

const transaction = await clipTicket(eventId, ticketId);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin, moderator or receptionist
- Event: Wrong date for ticket clipping
- Event: Contract call reverted
- Event: Clip ticket error

### Book tickets (Admin or Moderator)

1. Import bookTickets function from the library.
2. Execute bookTickets function.
3. Sign and send the transaction anyway you like.

```js
import { bookTickets } from "ets-js-library";

const eventId = "id of event";

const categoryData = [
  {
   categoryId: 1,
   ticketAmount: 1,
  },
  {
   categoryId: 2,
   ticketAmount: 1,
  }
];

const place = [
  {
    row: "Row number of seat",
    seat: "Seat position on row",
    account: "0x...",
  },
  {
    row: "Row number of seat",
    seat: "Seat position on row",
    account: "0x...",
  },
];

const ipfsUrls = ["ipfs://bafyreiaoq6thpwbvnatxforotjs33hut7rcfzalysp7cozhh3kkgkfkhhy/metadata.json", ...];

const transaction = await bookTickets(ipfsUrls, eventId, categoryData, place);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin or moderator
- Event: Parameter array can't be empty
- Event: Parameters length not eq
- Event: Category does not exist
- Event: This category is for another event
- Event: Max tickets count is reached
- Event: Place is taken

### Send Booked tickets (Admin or Moderator)

1. Import sendInvitation function from the library.
2. Execute sendInvitation function.
3. Sign and send the transaction anyway you like.

```js
import { sendInvitation } from "ets-js-library";

const eventId = "id of event";
const ticketIds = [1, 2, 3];
const accounts = ["0x...", "0x..."];

const transaction = await sendInvitation(eventId, ticketIds, accounts);
//You need to sign and send the transaction after this.
```

#### Possible error messages

- Event: Event does not exist
- Event: Caller is not an admin or moderator
- Event: Parameter array can't be empty
- Event: Parameters length not eq

### Get tickets of address for event (Admin or Moderator)

1. Import getAddressTicketIdsByEvent function from the library.
2. Execute getAddressTicketIdsByEvent function.

```js
import { getAddressTicketIdsByEvent } from "ets-js-library";

const eventId = "id of event";
const address = "0x...";

const tickets = await getAddressTicketIdsByEvent(eventId, address);
```

#### Possible error messages

- Event: Event does not exist

### Get contract tickets for event (Admin or Moderator)

1. Import getContractTicketIdsByEvent function from the library.
2. Execute getContractTicketIdsByEvent function.

```js
import { getContractTicketIdsByEvent } from "ets-js-library";

const eventId = "id of event";

const tickets = await getContractTicketIdsByEvent(eventId);
```

#### Possible error messages

- Event: Event does not exist

### Get ticket by Id (Everyone)

1. Import getSingleTicketById function from the library.
2. Execute getSingleTicketById function.

```js
import { getSingleTicketById } from "ets-js-library";

const ticketId = "id of ticket";

const ticket = await getSingleTicketById(ticketId);
```

#### Possible error messages

- Event: Event does not exist

### Get multiple tickets by Ids (Everyone)

1. Import getTicketsByIds function from the library.
2. Execute getTicketsByIds function.

```js
import { getTicketsByIds } from "ets-js-library";

const ticketIds = [1, 2, 3];

const ticket = await getTicketsByIds(ticketIds);
```

#### Possible error messages

- Event: Event does not exist

### Fetch all ticket ids listed on for sale on secondary market (Everyone)

1. Import fetchAllListedTicketIds function from the library.
2. Execute fetchAllListedTicketIds function.

```js
import { fetchAllListedTicketIds } from "ets-js-library";

const ticketIds = await fetchAllListedTicketIds();
```

Return data:

```js
const eventIds = [1, 2, 3];
```

### Lists ticket for sale (Ticket owner)

1. Import listTicket function from the library.
2. Use ether's utility function to convert the price
3. Execute listTicket function.

```js
import { listTicket } from "ets-js-library";
import { utils } from "ethers";

const ticketId = 1; // Your ticket's id from the smart contract
const ticketPrice = ethers.utils.parseUnits("1", "ether"); // Тhe price for which it will be sold

await listTicket(ticketId, ticketPrice);
```

#### Possible error messages

- "ERC5507: Not token owner"
- "ERC5192: Ticket is soulbound"
- "TicketMarketplace: Ticket price can't be higher than the original price"

### Updates the listed ticket's price (Ticket owner)

1. Import updateListedTicketPrice function from the library.
2. Use ether's utility function to convert the price
3. Execute updateListedTicketPrice function.

```js
import { updateListedTicketPrice } from "ets-js-library";
import { utils } from "ethers";

const ticketId = 1; // Your ticket's id from the smart contract
const ticketPrice = ethers.utils.parseUnits("1", "ether"); // Тhe price for which it will be sold

await updateListedTicketPrice(ticketId, ticketPrice);
```

#### Possible error messages

- "TicketMarketplace: Ticket is not listed"
- "ERC5507: Not token owner"
- "TicketMarketplace: Ticket price can't be higher than the original price"

### Buys multiple or single listed ticket/s (Everyone)

1. Import buyListedTickets function from the library.
2. Use ether's utility function to convert the price
3. Execute buyListedTickets function.

```js
import { buyListedTickets } from "ets-js-library";
import { utils } from "ethers";

const ticketIds = [1, 2]; // Array with ticket ids to buy.
const price = ethers.utils.parseUnits("1", "ether"); // The total amount of prices for ticket ids

await buyListedTickets(ticketIds, price);
```

#### Possible error messages

- "TicketMarketplace: Parameters length not eq"
- "TicketMarketplace: Ticket is not listed"
- "TicketMarketplace: Can't buy own tickets"
- "TransferCallerNotOwnerNorApproved"

### Removes the ticket from marketplace (Ticket owner)

1. Import cancelListedTicket function from the library.
2. Execute cancelListedTicket function.

```js
import { cancelListedTicket } from "ets-js-library";

const ticketId = 1; // Your ticket's id from the smart contract

await cancelListedTicket(ticketId);
```

#### Possible error messages

- "TicketMarketplace: Ticket is not listed"
- "ERC5507: Not token owner"

### Postpones event (Admin)

1. Import postponeEvent function from the library.
2. Execute postponeEvent function.

```js
import { postponeEvent } from "ets-js-library";

const eventId = 1; // The event id generated when creating an event
const time = 86400; // The amount of seconds to postpone the event

await postponeEvent(eventId, time);
```

#### Possible error messages

- "Event: Event does not exist"
- "Event: Caller is not an admin"
- "Event: Invalid postpone time given"

### Cancels an event (Admin)

1. Import cancelEvent function from the library.
2. Execute cancelEvent function.

```js
import { cancelEvent } from "ets-js-library";

const eventId = 1; // The event id generated when creating an event

await cancelEvent(eventId);
```

#### Possible error messages

- "Event: Event does not exist"
- "Event: Caller is not an admin"
- "Event: Event canceled"
- "Event: Event can't be canceled"

### Withdraws payed tickets price from canceled event (Ticket owner)

When the event is cancelled, ticket buyers can get their money back. Event needs to be cancelled.

1. Import withdrawFromCanceledEvent function from the library.
2. Execute withdrawFromCanceledEvent function.

```js
import { withdrawFromCanceledEvent } from "ets-js-library";

const eventId = 1; // The event id generated when creating an event

await withdrawFromCanceledEvent(eventId);
```

#### Possible error messages

- "Event: Event does not exist"
- "Event: Event is not canceled"
- "Event: No withdrawals (If the user has not purchased a ticket)"
- "Event: Failed to send Ether"

### Gets the listed ticket by its id (Everyone)

1. Import getListedTicketById function from the library.
2. Execute getListedTicketById function.

```js
import { getListedTicketById } from "ets-js-library";

const ticketId = 1; // The ticket id generated when ticket is listed

await getListedTicketById(ticketId);
```

### Gets the listed ticket Data by its id (Everyone)

1. Import getListedTicketDataById function from the library.
2. Execute getListedTicketDataById function.

```js
import { getListedTicketDataById } from "ets-js-library";

const ticketId = 1; // The ticket id generated when ticket is listed

const listedTicketData = await getListedTicketDataById(ticketId);
```

Return data:

```js
const listedTicketData = {
  price: 1,
  isListed: true,
};
```

## Tests

> :warning: **hardhat@esm** is used to test the library to be able to match the type which is _module_, but official hardhat requires _commonjs_

Run tests:

```sh
npm install hardhat@esm
npm run test
```

See test coverage:

```sh
npm run coverage
```

## Conventions and standards

Commit message format

```bash
feat: Add beta sequence
^--^ ^---------------^
| |
| +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

## Contributing

**IMPORTANT**: Prepare husky after you clone the repo.

```sh
npm run prepare
```

Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!
