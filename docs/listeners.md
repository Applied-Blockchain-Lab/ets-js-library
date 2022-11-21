# Listeners docs

### Listen for new events (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForNewEvent as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data, membersData) {
  //This function will be called when the event is emitted.
}

listeners.listenForNewEvent(callback);
```

#### Emitted by:

- createEvent()

### Listen for event update (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForEventUpdate as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForEventUpdate(callback);
```

#### Emitted by:

- updateEvent()

### Listen for Role Granted (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForRoleGrant as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForRoleGrant(callback);
```

#### Emitted by:

- createEvent()
- addTeamMember()

### Listen for Role Revoked (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForRoleRevoke as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForRoleRevoke(callback);
```

#### Emitted by:

- removeTeamMember()

### Listen for Bought ticket (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForBoughtTicket as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForBoughtTicket(callback);
```

#### Emitted by:

- buyTicketsFromMultipleEvents()
- buyTicketsFromSingleEvent()

### Listen for Refunded ticket (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForRefundedTicket as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForRefundedTicket(callback);
```

#### Emitted by:

- returnTicket()

### Listen for Locked ticket (Everyone)

\*If a ticket is locked it cannot be transferred.

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForLockedTicked as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForLockedTicked(callback);
```

#### Emitted by:

- sendInvitation()
- bookTickets()

### Listen for Unlocked ticket (Everyone)

\*If a ticket is unlocked it can be transferred.

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForUnlockedTicket as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForUnlockedTicket(callback);
```

#### Emitted by:

- buyTicketsFromMultipleEvents()
- buyTicketsFromSingleEvent()
- returnTicket()
- bookTickets()

### Listen for Ticket transfer (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForTicketTransfer as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForTicketTransfer(callback);
```

#### Emitted by:

- buyTicketsFromMultipleEvents()
- buyTicketsFromSingleEvent()
- removeEvent()

### Listen for Ticket approval (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForTicketApproval as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForTicketApproval(callback);
```

#### Emitted by:

Can not be emitted by functions in this library.

### Listen for Ticket approval for all (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForTicketApprovalForAll as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForTicketApprovalForAll(callback);
```

#### Emitted by:

Can not be emitted by functions in this library.

### Listen for Ticket consecutive transfer (Everyone)

\*Transfer of multiple tickets at once.

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForTicketConsecutiveTransfer as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForTicketConsecutiveTransfer(callback);
```

#### Emitted by:

Can not be emitted by functions in this library.

### Listen for Ticket consumed (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForTicketConsumed as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForTicketConsumed(callback);
```

#### Emitted by:

- clipTicket()

### Listen for batch metadata update (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForBatchMetadataUpdate as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForBatchMetadataUpdate(callback);
```

#### Emitted by:

Can not be emitted by functions in this library.

### Listen for refund (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForRefund as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForRefund(callback);
```

#### Emitted by:

Can not be emitted by functions in this library.

### Listen for new event Cashier (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForNewEventCashier as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForNewEventCashier(callback);
```

#### Emitted by:

- setEventCashier()

### Listen for new category (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForNewCategory as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForNewCategory(callback);
```

#### Emitted by:

- createTicketCategory()

### Listen for new category update (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCategoryUpdate as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCategoryUpdate(callback);
```

#### Emitted by:

- updateCategory()

### Listen for category delete (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCategoryDelete as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCategoryDelete(callback);
```

#### Emitted by:

- removeCategory()

### Listen for category tickets added (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCategoryTicketsAdded as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCategoryTicketsAdded(callback);
```

#### Emitted by:

- addCategoryTicketsCount()

### Listen for category tickets removed (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCategoryTicketsRemoved as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCategoryTicketsRemoved(callback);
```

#### Emitted by:

- removeCategoryTicketsCount()

### Listen for category sell changed (Everyone)

\*Stop/Start the sale of tickets for a category.

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCategorySellChanged as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCategorySellChanged(callback);
```

#### Emitted by:

- manageCategorySelling()

### Listen for all categories sell changed (Everyone)

\*Stop/Start the sale of tickets for all categories.

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForAllCategorySellChanged as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForAllCategorySellChanged(callback);
```

#### Emitted by:

- manageAllCategorySelling()

### Listen for category sale dates update (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCategorySaleDatesUpdate as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCategorySaleDatesUpdate(callback);
```

#### Emitted by:

- updateCategorySaleDates()

### Listen for new event refund date (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForNewEventRefundDate as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForNewEventRefundDate(callback);
```

#### Emitted by:

- addRefundDeadline()

### Listen for refund withdraw (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForRefundWithdraw as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForRefundWithdraw(callback);
```

#### Emitted by:

- withdrawRefund()

### Listen for event withdraw (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForEventWithdraw as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForEventWithdraw(callback);
```

#### Emitted by:

- withdrawContractBalance()

### Listen for cliped ticket (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForClipedTicket as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForClipedTicket(callback);
```

#### Emitted by:

- clipTicket()

### Listen for booked tickets (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForBookedTickets as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForBookedTickets(callback);
```

#### Emitted by:

- bookTickets()

### Listen for new ticket invitation (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForNewTicketInvitation as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForNewTicketInvitation(callback);
```

#### Emitted by:

- sendInvitation()

### Listen for new listed ticket (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForTicketListed as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForTicketListed(callback);
```

#### Emitted by:

- listTicket()

### Listen for update on listed ticket's price (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForUpdatedListedTicketPrice as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForUpdatedListedTicketPrice(callback);
```

#### Emitted by:

- updateListedTicketPrice()

### Listen for buy on listed ticket (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForBoughtListedTicket as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForBoughtListedTicket(callback);
```

#### Emitted by:

- buyListedTicket()

### Listen for buy on multiple listed tickets (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForMultipleTicketsBought as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForMultipleTicketsBought(callback);
```

#### Emitted by:

- buyMultipleListedTickets()

### Listen for cancel on listed ticket (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForCanceledListedTicket as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForCanceledListedTicket(callback);
```

#### Emitted by:

- cancelListedTicket()

### Listen for postpone on event (Everyone)

1. Import listeners from the library.
2. Create a callback function.
3. Supply callback function to listeners.listenForEventPostponed as parameter.

```js
import { listeners } from "ets-js-library";

function callback(data) {
  //This function will be called when the event is emitted.
}

listeners.listenForEventPostponed(callback);
```

#### Emitted by:

- postponeEvent()
