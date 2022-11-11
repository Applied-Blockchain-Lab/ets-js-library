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

### Listen for Locked ticket (Everyone)

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

### Listen for Unlocked ticket (Everyone)

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

### Listen for Ticket consecutive transfer (Everyone)

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

### Listen for category sell changed (Everyone)

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

### Listen for all categories sell changed (Everyone)

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
