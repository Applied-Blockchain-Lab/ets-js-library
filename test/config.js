const NFT_STORAGE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4OEYyYjcxMzhlN" +
  "WUxQjJBOWQyQzc2OWREMTNBMUQwRTYyMjI5NjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2Mjk" +
  "3MzI5NzMwOSwibmFtZSI6IkV2ZW50LVRpY2tldGluZy1TeXN0ZW0ifQ.x0aXjwdGsIcxibl7eIjxhdF8vnGHB2BB-2gkScySU20";

const EXAMPLE_ADDRESS = "0x16514b719274484b06d56459f97139b333bd8130";
const SECOND_EXAMPLE_ADDRESS = "0xB7a94AfbF92B4D2D522EaA8f7c0e07Ab6A61186E";

const mockedMetadata = {
  name: "Event5",
  description: "Event5 Description",
  image: "null",
  properties: {
    websiteUrl: "https://event1.com",
    date: {
      start: "2022-10-01 10:45:29.971113+03",
      end: "2022-10-03 10:45:29.971113+03",
    },
    location: {
      country: "Bulgaria",
      city: "Razgrad",
      address: "Front Beach Alley, 9007 Golden Sands",
      coordinates: {
        latitude: "43.28365485346511",
        longitude: "28.042738484752096",
      },
    },
    ticketTypes: ["super early birds", "early birds", "regular", "onsite"],
    maxTicketsPerAccount: 10,
    contacts: "Contacts string",
    status: "upcoming",
    tags: ["#programming", "#VitalikFanBoys"],
  },
};

const mockedEventParams = {
  title: "",
  description: "",
  eventStartDateStartingInterval: "",
  eventStartDateEndingInterval: "",
  eventEndDateStartingInterval: "",
  eventEndDateEndingInterval: "",
  country: "",
  place: "",
  tags: [],
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
};

const mockedCategoryMetadata = {
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

const date = Math.floor(Date.now() / 1000); // buddy ignore:line
const DAY = 86400;
const HOUR = 3600;

const mockedContractData = {
  saleStartDate: date + 1 * DAY, // buddy ignore:line
  saleEndDate: date + 3 * DAY, // buddy ignore:line
  ticketsCount: 50,
  ticketPrice: 10,
  discountsTicketsCount: [10, 5], // buddy ignore:line
  discountsPercentage: [20, 10], // buddy ignore:line
  downPayment: {
    price: 2,
    finalAmountDate: 1666666666, // unix timestamp
  },
};

const mockedTicketMetadata = {
  name: "ticket",
  description: "ticket for event",
  image: "null",
  properties: {
    note: "Note from buyer",
    returnReason: "",
  },
};

const errorMessages = {
  eventDoesNotExist: "Event: Event does not exist",
  callerIsNotAdmin: "Event: Caller is not an admin",
  callerIsNotAdminOrModerator: "Event: Caller is not an admin or moderator",
  categoryStartDateIsIncorrect: "Event: Category start date is incorrect",
  categoryEndDateIsIncorrect: "Event: Category end date is incorrect",
  categoryDoesNotExist: "Event: Category does not exist",
  callReverted: "Event: Contract call reverted",
  callerIsNotAdminModOrRec: "Event: Caller is not an admin, moderator or receptionist",
  wrongClipDate: "Event: Wrong date for ticket clipping",
  parametersLengthNotEqual: "Event: Parameters length not eq",
  categoryIsFromAnotherEvent: "Event: This category is for another event",
  placeIsTaken: "Event: Place is taken",
  onlyCashier: "Event: Only cashier can withdraw contract balance",
  notTokenOwner: "ERC5507: Not token owner",
  ticketIsSoulbound: "ERC5192: Ticket is soulbound",
  ticketPriceCantBeHigherThanOriginalPrice: "TicketMarketplace: Ticket price can't be higher than the original price",
  ticketIsNotListed: "TicketMarketplace: Ticket is not listed",
  cantBuyOwnTickets: "TicketMarketplace: Can't buy own tickets",
  invalidPostponeTime: "Event: Invalid postpone time given",
  eventCanceled: "Event: Event canceled",
  eventIsNotCanceled: "Event: Event is not canceled",
  noWithdrawal: "Event: No withdrawals",
};

const DATES = {
  EARLY_SALE_START_DATE: date - 1000, // buddy ignore:line
  LATE_SALE_END_DATE: date + 5000001, // buddy ignore:line
  EVENT_START_DATE: date + 10 * DAY, // buddy ignore:line
  EVENT_END_DATE: date + 20 * DAY, // buddy ignore:line
  DAY,
  HOUR,
};

export {
  NFT_STORAGE_API_KEY,
  EXAMPLE_ADDRESS,
  SECOND_EXAMPLE_ADDRESS,
  mockedMetadata,
  mockedEventParams,
  mockedCategoryMetadata,
  mockedContractData,
  mockedTicketMetadata,
  errorMessages,
  DATES,
};
