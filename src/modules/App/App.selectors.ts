import { State, Ticket } from '.'

interface Store {
  app: State
}

export const selectCount = (store: Store): number => {
  return store.app.count
}

export const selectIsTicketsEmpty = (store: Store): boolean => {
  return store.app.ticketsById.size === 0
}

export const selectTickets = (store: Store): Array<Ticket> => {
  return Array.from(store.app.ticketsById.values())
}

export const selectRFInstance = (store: Store) => {
  return store.app.rfInstance
}

export const selectIsPushed = (store: Store): boolean => {
  return store.app.isRFpushed
}
export const selectFileHandler = (store: Store) => {
  return store.app.fileHandler
}
export const selectFileName = (store: Store) => {
  return store.app.fileName
}
