import slice from './App.slice'

export type { PreTicket, Ticket, State } from './App.slice'

export const actions = slice.actions
export const reducer = slice.reducer

export default slice
