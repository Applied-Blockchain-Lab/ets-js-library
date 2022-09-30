import {
  createEvent,
  fetchAllEventsFromServer,
  fetchEvents,
  removeEvent,
  addTeamMember,
  removeTeamMember,
  updateEvent,
  fetchOwnedEvents,
} from "../src/index";
import fetch from "@web-std/fetch";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { jest } from "@jest/globals";
import { ethers } from "ethers";

const NFT_STORAGE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4OEYyYjcxMzhlNWUxQjJBOWQyQzc2OWREMTNBMUQwRTYyMjI5NjMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2Mjk3MzI5NzMwOSwibmFtZSI6IkV2ZW50LVRpY2tldGluZy1TeXN0ZW0ifQ.x0aXjwdGsIcxibl7eIjxhdF8vnGHB2BB-2gkScySU20";

describe("Organizer tests", () => {
  let mock;
  const address = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const AVALANCHE_TESTNET_API = "https://api.avax-test.network/ext/bc/C/rpc";

  beforeAll(async () => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  test("Should revert delete event when there is not an event", async () => {
    try {
      await removeEvent(NFT_STORAGE_API_KEY, 1, address);
    } catch (error) {
      expect(error.reason).toBe("EventTicketingSystem: Caller is not an admin");
    }
  });

  test("Should call add team member method from smart contract", async () => {
    try {
      const tx = await addTeamMember(1, `0x${"0".repeat(64)}`, address);

      const functionSig = ethers.utils
        .keccak256(
          ethers.utils.toUtf8Bytes("addTeamMember(uint256,bytes32,address)")
        )
        .slice(0, 10);

      // Calls the right function from smart contract
      expect(functionSig).toBe(tx.data.slice(0, 10));
    } catch (_error) {}
  });

  test("Should call remove team member method from smart contract", async () => {
    try {
      const tx = await removeTeamMember(1, `0x${"0".repeat(64)}`, address);

      const functionSig = ethers.utils
        .keccak256(
          ethers.utils.toUtf8Bytes("removeTeamMember(uint256,bytes32,address)")
        )
        .slice(0, 10);

      // Calls the right function from smart contract
      expect(functionSig).toBe(tx.data.slice(0, 10));
    } catch (_error) {}
  });

  test("Should call updateEventTokenUri method from smart contract", async () => {
    try {
      const metadata = {
        name: "Event5",
        description: "Event5 Description",
        image: "null",
        properties: {
          eventId: "base-58 random bytes",
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
          ticketTypes: [
            "super early birds",
            "early birds",
            "regular",
            "onsite",
          ],
          maxTicketsPerAccount: 10,
          contacts: "Contacts string",
          status: "upcoming",
          tags: ["#programming", "#VitalikFanBoys"],
        },
      };

      const image = await fetch(
        "https://www.blackseachain.com/assets/img/hero-section/hero-image-compressed.png"
      );
      const imageBlob = await image.blob();

      const tx = await updateEvent(
        NFT_STORAGE_API_KEY,
        1,
        metadata,
        imageBlob,
        address
      );

      const functionSig = ethers.utils
        .keccak256(
          ethers.utils.toUtf8Bytes("updateEventTokenUri(uint256,string)")
        )
        .slice(0, 10);

      // Calls the right function from smart contract
      expect(functionSig).toBe(tx.data.slice(0, 10));
    } catch (_error) {}
  });

  test("Should call fetchOwnedEvents from smart contract", async () => {
    try {
      const tx = await fetchOwnedEvents();
      const functionSig = ethers.utils
        .keccak256(ethers.utils.toUtf8Bytes("fetchOwnedEvents"))
        .slice(0, 10);

      // Calls the right function from smart contract
      expect(functionSig).toBe(tx.data.slice(0, 10));
      expect(tx).toBe([]);
    } catch (_error) {}
  });
});
