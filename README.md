# Resona DApp

frontend: apps/frontend <br/>
contracts: apps/contracts

## Overview

The users can log their mental wellness activities using the Resona DApp. They are rewarded with tokens for each logged action.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [How Resona Works](#how-resona-works)
4. [Deployment Instructions](#deployment-instructions)
5. [Future Enhancements](#future-enhancements)

## Prerequisites
- Node.js and npm installed
- Hardhat installed globally (`npm install -g hardhat`)
- VeWorld wallet to interact with the Ethereum network

## Installation
Clone the repository:
```bash
git clone <repository-url>
cd vechain-resona
```
Make sure you are using a compatible Node.js version:

Install all the packages:
```bash
yarn
```

## How Resona Works
- Resona is a DApp which helps users to keep track of their mental wellness activities and get rewarded.
- The users can log their mental wellness activities using the Resona DApp.
- The owner should fund the contract.
- Those funds will be used to reward the users with 1 VET for each action logged.

## Deployment Instructions

### Deploying the contract
1. Modify the hardhat config file (hardhat.config.ts) with owner wallet details.
2. Run the deployment script from the contracts folder.
```bash
cd apps/contracts
npx hardhat compile
```
3. Deploy the contract in the Testnet:
```bash
npm run deploy-testnet
```

### Deploying the frontend
1. Run the following command from the frontend folder.
```bash
cd apps/frontend
yarn dev
```

## Future Enhancements
1. Currently the following list of activities are supported in the DApp. The list can be grown within different categories with varying rewards as well.
	- Painting
	- Meditating
	- Journaling
	- Walking Outdoors
	- Goodnight Sleep

2. Currently the wallet directly receives the VET tokens for each logged action. This will be improved to store the points at the contract level and perform one time transfers to enhance the green foot print.

3. Interactions with in Resona Users.
	- Features can be added to share the earned tokens with in the DApp users as tokens of appreciation, gratitude or friendship.

## Team Members
1. Nuwani Senanayake - 0x700829681C615B3cBde4EdD800a24C1De440f9e3
2. Ayushi Kadam - 
