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

### Create event (Everyone)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import createEvent function from the library.
3. Create metadata for the new event.
4. Execute creteEvent function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.

```js
import { createEvent } from "ets-js-library";

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

const contractData = {
  maxTicketPerClient: 5,
  startDate: 1666666666, // unix timestamp
  endDate: 1666666666, // unix timestamp
};

const key = "API key for NFT.storage";

const transaction = await createEvent(key, metadata, contractData);
//You need to sign and send the transaction after this.
```

### Update event metadata (Admin or Moderator)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import updateEvent, getEventIpfsUri and deleteFromIpfs from the library.
3. Create new metadata for the event.
4. Execute getEventIpfsUri function. This will return the Uri of the current metadata.
5. Execute updateEvent function. This will return an unsigned transaction.
6. Sign and send the transaction anyway you like.
7. If the transaction succeeds, you can safely delete the old metadata with deleteFromIpfs.

```js
import { updateEvent, getEventIpfsUri, deleteFromIpfs } from "ets-js-library";

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

const key = "API key for NFT.storage";
const eventId = "Id of event in smart contract";

const metadataUri = await getEventIpfsUri(eventId);

try {
  const transaction = await updateEvent(key, eventId, metadata);

  //You need to sign and send the transaction here.
  deleteFromIpfs(key, metadataUri);
} catch (error) {
  console.log(error);
}
```

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

const address = "Address of new cashier.";
const eventId = "Id of event";

const transaction = await setEventCashier(eventId, address);
//You need to sign and send the transaction after this.
```

### Create ticket category (Admin or Moderator)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import createTicketCategory function from the library.
3. Create metadata for the new category.
4. Execute createTicketCategory function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.

```js
import { createTicketCategory } from "ets-js-library";

const metadata = {
  name: "Category1",
  description: "Category1 Description",
  image: "null",
  properties: {
    ticketTypesCount: {
      type: "semi_fungible or non_fungible",
      places: 10,
    },
    design: {
      color: "color",
    },
  },
};

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

const key = "API key for NFT.storage";
const eventId = "Id of event";

const transaction = await createTicketCategory(key, eventId, metadata, contractData);
//You need to sign and send the transaction after this.
```

### Update category (Admin or Moderator)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import updateCategory from the library.
3. Create new metadata and contractData for the category.
4. Execute updateCategory function. This will return an unsigned transaction.
5. Sign and send the transaction anyway you like.

```js
import { updateCategory } from "ets-js-library";

const metadata = {
  name: "Category1",
  description: "Category1 Description",
  image: "null",
  properties: {
    ticketTypesCount: {
      type: "semi_fungible or non_fungible",
      places: 10,
    },
    design: {
      color: "color",
    },
  },
};

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

const key = "API key for NFT.storage";
const eventId = "Id of event";
const categoryId = "Id of category";

const transaction = await updateCategory(key, eventId, categoryId, metadata, contractData);
//You need to sign and send the transaction after this.
```

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

### Buy multiple tickets from multiple events and categories (Everyone)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import buyTicketsFromMultipleEvents function from the library.
3. Execute buyTicketsFromMultipleEvents function.
4. Sign and send the transaction anyway you like.

```js
import { buyTicketsFromMultipleEvents } from "ets-js-library";

const key = "API key for NFT.storage";

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

const transaction = await buyTicketsFromMultipleEvents(key, eventCategoryData, priceData, place, ticketsMetadata);
//You need to sign and send the transaction after this.
```

### Buy multiple tickets from a category from one event (Everyone)

1. Create an api token from [nft.storage](https://nft.storage/)
2. Import buyTicketsFromSingleEvent function from the library.
3. Execute buyTicketsFromSingleEvent function.
4. Sign and send the transaction anyway you like.

```js
import { buyTicketsFromSingleEvent } from "ets-js-library";

const eventId = "id of event";
const categoryId = "id of category";
const key = "API key for NFT.storage";

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

const transaction = await buyTicketsFromSingleEvent(key, eventId, categoryId, priceData, place, ticketMetadata);
//You need to sign and send the transaction after this.
```

### Add multiple refund data for an event (Admin or Moderator)

1. Import addRefundDeadlines function from the library.
2. Execute addRefundDeadlines function.
3. Sign and send the transaction anyway you like.

```js
import { addRefundDeadline } from "ets-js-library";

const eventId = "id of event";

const refundData = [
  { date: "timestamp", percentage: "percentage to return" },
  { date: "timestamp", percentage: "percentage to return" },
];

const transaction = await addRefundDeadline(eventId, refundData);
//You need to sign and send the transaction after this.
```

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

### Clip ticket (Admin, Moderator or Receptionist)

1. Import clipTicket function from the library.
2. Execute clipTicket function.
3. Sign and send the transaction anyway you like.

```js
import { clipTicket } from "ets-js-library";

const eventId = "id of event";
const ticketId = "id of ticket";

const transaction = await clipTicket(eventId, ticketId);
//You need to sign and send the transaction after this.
```

### Book tickets (Admin or Moderator)

1. Import bookTickets function from the library.
2. Execute bookTickets function.
3. Sign and send the transaction anyway you like.

```js
import { bookTickets } from "ets-js-library";

const eventId = "id of event";
const key = "API key for NFT.storage";

const categoryData = [
  {
   categoryId: 1,
   ticketAmount: 1
  },
  {
   categoryId: 2,
   ticketAmount: 1
  }
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

const ticketsMetadata = [{
  name: "ticket",
  description: "ticket for event",
  image: "Blob or File Object",
  properties: {
    note: "Note from buyer"
    returnReason: "",
  },
},
...
];

const transaction = await bookTickets(key, eventId, categoryData, place, ticketsMetadata);
//You need to sign and send the transaction after this.
```

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

### Get tickets of address for event (Admin or Moderator)

1. Import getAddressTicketIdsByEvent function from the library.
2. Execute getAddressTicketIdsByEvent function.

```js
import { getAddressTicketIdsByEvent } from "ets-js-library";

const eventId = "id of event";
const address = "0x...";

const tickets = await getAddressTicketIdsByEvent(eventId, address);
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
