// eslint-disable-next-line no-shadow
export enum ErrorTypes {
  AutIDExistsButInactive = 'AutID exists but is inactive',
  AutIDNotFound = 'AutID not found',
  HubSlotsFull = 'There are no free slots in this hub.',
  AlreadyAMember = 'You are already a member of this hub.',
  AutIDWithThisAddressAlreadyRegistered = 'You already registered a AutID for this wallet address.',
  CouldNotGetActivationNonce = 'Failed to retrieve activation nonce.',
  GetAccountsInProgress = 'Waiting for MetaMask login.',
}
