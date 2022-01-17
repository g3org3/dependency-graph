import { Ticket, PreTicket } from 'modules/App'

const getRColor = (): string => Math.floor(Math.random() * 16777215).toString(16)

export const getTicketsToById = (tickets: Array<Ticket>): Map<string, Ticket> => {
  return tickets.reduce((byId: Map<string, Ticket>, t: Ticket): Map<string, Ticket> => {
    byId.set(t.id, { ...t, colorid: getRColor() })

    return byId
  }, new Map())
}

export const getPreTicketsToById = (tickets: Array<PreTicket>): Map<string, PreTicket> => {
  return tickets.reduce((byId: Map<string, PreTicket>, t: PreTicket): Map<string, PreTicket> => {
    byId.set(t.id, { ...t, colorid: getRColor() })

    return byId
  }, new Map())
}

export const getRoot = (byId: Map<string, PreTicket>, id: string): PreTicket | null => {
  const ticket = byId.get(id)
  if (!ticket) return null

  if (!ticket.parent) {
    return ticket
  }
  if (ticket.parent.indexOf(',') !== -1) {
    return ticket
  }

  return getRoot(byId, ticket.parent)
}

export const generateLinks = (ticket: PreTicket, i: number) => {
  if (!ticket.parent) return null

  if (ticket.parent.split(',').length > 1) {
    return ticket.parent
      .split(',')
      .map((parent) => parent.trim())
      .map((parent) => ({
        id: `${parent}-${ticket.id}`,
        source: parent,
        target: ticket.id,
        // type: "smoothstep"
        // animated: true
      }))
  }

  return {
    id: `${ticket.parent}-${ticket.id}`,
    source: ticket.parent,
    target: ticket.id,
    // type: "smoothstep"
    // animated: true
  }
}
