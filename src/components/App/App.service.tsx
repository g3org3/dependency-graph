export interface PreTicket {

  colorid?: number
  id: string
  notes?: string
  owner?: string
  parent?: string
  points?: number
  position?: string
  status?: string
}
export interface Ticket extends PreTicket {
  colorid: number
}
export interface TicketsById {
  [id: string]: Ticket
}
const getRColor = () => Math.floor(Math.random() * 16777215).toString(16)

export const getTicketsToById = (tickets: Array<PreTicket>): TicketsById => {
  return tickets.reduce((_: {}, t: PreTicket): TicketsById => {
    return ({ ..._, [t.id]: { ...t, colorid: getRColor() } })
  }, {})
}

const getRoot = (byId: TicketsById, id: string): Ticket => {
  const ticket = byId[id]
  if (!ticket) return null;

  if (!ticket.parent) {
    return ticket
  }
  if (ticket.parent.indexOf(',') !== -1) {
    return ticket
  }
  return getRoot(byId, ticket.parent)
}

export const generateNodes = (ticketsById: TicketsById) => (ticket: PreTicket, i: number) => {
  if (!ticket) return null

  const backgrounds: { [key: string]: string } = {
    default: '#f8f8f8',
    doing: 'orange',
    done: 'green',
    return: 'red',
    todo: 'cornflowerblue',
  }
  const background = backgrounds[ticket.status || 'default']
  const position = { x: 0, y: i * 70 }
  if (ticket.position) {
    position.x = Number(ticket.position.split(',')[0])
    position.y = Number(ticket.position.split(',')[1])
  }
  let colorid = ticket.colorid || ticketsById[ticket.id].colorid
  if (!ticket.colorid && ticket.parent && ticket.parent.indexOf(',') === -1) {
    // @ts-ignore
    const t = getRoot(ticketsById, ticket.parent)
    if (t) {
      colorid = t.colorid
    }
  }
  return {
    id: ticket.id,
    status: ticket.status,
    notes: ticket.notes,
    owner: ticket.owner,
    points: ticket.points,
    colorid,
    data: {
      label: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'space-between' }}>
            <b
              style={{
                background,
                border: '2px solid white',
                color: '#000',
                padding: '4px 8px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            >
              {ticket.points || '_'}
            </b>
            <b
              style={{
                background: '#fff',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            >
              {ticket.id}
            </b>
          </div>
          {ticket.owner ? <small style={{
            background: '#fff',
            textAlign: 'center',
            padding: '4px',
            borderRadius: '14px'
          }}>{ticket.owner}</small>
            : null}
          <small
            style={{
              textTransform: 'capitalize',
              background: '#fff',
              textAlign: 'left',
              padding: '4px',
            }}
          >
            {ticket.notes}
          </small>
        </div>
      ),
    },
    position,
    style: {
      border: '1px solid #' + colorid,
      background: '#' + colorid,
    },
  }
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