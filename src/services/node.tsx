import { PreTicket } from 'modules/App'

import { getRoot } from 'services/tickets'

export const generateNodes = (ticketsById: Map<string, PreTicket>) => (ticket: PreTicket, i: number) => {
  if (!ticket) return null

  const backgrounds: { [key: string]: string } = {
    '0.': '#f8f8f8',
    '1.': 'pink',
    '2.': 'orange',
    '3.': 'yellow',
    '4.': 'cornflowerblue',
    '5.': 'green',
  }
  const backgroundKey = Object.keys(backgrounds)
    .filter((key) => ticket.status?.indexOf(key) !== -1)
    .concat(['0.'])[0]
  const background = backgrounds[backgroundKey]
  const position = { x: 0, y: i * 70 }
  if (ticket.position) {
    position.x = Number(ticket.position.split(',')[0])
    position.y = Number(ticket.position.split(',')[1])
  }
  let colorid = ticket.colorid || ticketsById.get(ticket.id)?.colorid
  if (!ticket.colorid && ticket.parent && ticket.parent.indexOf(',') === -1) {
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
                background: backgrounds['0.'],
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
          {ticket.owner ? (
            <small
              style={{
                background: '#fff',
                textAlign: 'center',
                padding: '4px',
                borderRadius: '14px',
              }}
            >
              {ticket.owner}
            </small>
          ) : null}
          {ticket.status ? (
            <small
              style={{
                background,
                textAlign: 'center',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              {ticket.status}
            </small>
          ) : null}
          <small
            style={{
              textTransform: 'capitalize',
              background: '#fff',
              textAlign: 'left',
              padding: '4px',
            }}
          >
            {ticket.notes?.indexOf('\n') !== -1 ? <pre>{ticket.notes}</pre> : ticket.notes}
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
