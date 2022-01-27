import { PreTicket } from 'modules/App'
import { getRoot } from 'services/tickets'

export const generateNodes =
  (ticketsById: Map<string, PreTicket>, colorBlind: string) => (ticket: PreTicket, i: number) => {
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
    let x = i
    if (i > 10) {
      x = i - 10
    }
    if (x > 10) {
      x = x - 10
    }
    if (x > 10) {
      x = x - 10
    }
    if (x > 10) {
      x = x - 10
    }
    if (x > 10) {
      x = x - 10
    }
    const position = { x: x * 70, y: (i % 10) * 70 }
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
      label: ticket.label,
      owner: ticket.owner,
      points: ticket.points,
      colorid,
      data: {
        label: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: ticket.notes?.indexOf('\n') !== -1 ? undefined : '150px',
            }}
          >
            <div className="react-flow--ticket" style={{ display: 'flex', alignItems: 'space-between' }}>
              <b
                style={{
                  padding: '4px 8px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                }}
              >
                {ticket.points || '_'}
              </b>
              <b
                className="react-flow--ticket"
                style={{
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
                className="react-flow--ticket"
                style={{
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
            {ticket.label ? (
              <small
                className="react-flow--ticket"
                style={{
                  textAlign: 'center',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                {ticket.label}
              </small>
            ) : null}
            <small
              className="react-flow--ticket"
              style={{
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
        border: '1px solid',
        borderColor: colorBlind === 'off' ? '#' + colorid : '#ddd',
        background: colorBlind === 'off' ? '#' + colorid : '#ddd',
      },
    }
  }
