# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.17.0] - 2022-11-11

### Changed

- Extract listeners to listeners.js
- Extract documentation to ./docs/listeners.md

### Added

- listenForBoughtTicket
- listenForRefundedTicket
- listenForLockedTicked
- listenForUnlockedTicket
- listenForTicketTransfer
- listenForTicketApproval
- listenForTicketApprovalForAll
- listenForTicketConsecutiveTransfer
- listenForTicketConsumed
- listenForBatchMetadataUpdate
- listenForRefund
- listenForNewEventCashier
- listenForNewCategory
- listenForCategoryUpdate
- listenForCategoryDelete
- listenForCategoryTicketsAdded
- listenForCategoryTicketsRemoved
- listenForCategorySellChanged
- listenForAllCategorySellChanged
- listenForCategorySaleDatesUpdate
- listenForNewEventRefundDate
- listenForRefundWithdraw
- listenForEventWithdraw
- listenForClipedTicket
- listenForBookedTickets
- listenForNewTicketInvitation

## [0.16.4] - 2022-11-10

### Fixed

- fetchEventsMetadata return parameter

## [0.15.2] - 2022-11-9

### Added

- Function for fetching ticket id's owner

## [0.14.1] - 2022-11-9

### Added

- Start and end time for event from smart contract in single event metadata function

## [0.14.0] - 2022-11-7

### Added

- Upload ticket metadata to ipfs.
- sendInvitation function

### Changed

## [0.11.1] - 2022-11-1

### Added

- Function for buying multiple tickets from multiple events and categories.
- Function for buying tickets from a category from one event.
- Function for adding multiple refund data for an event.
- Function for refunding ticket.
- Function for withdrawing refunds.
- Function for clipping ticket.
- Function for booking tickets.
