import yaml from 'js-yaml'

// @ts-ignore
export const rfInstanceToYaml = (rfINstance, options?: {}): stsring => {
  const _options = options || {}
  // @ts-ignore
  const byId = rfINstance.toObject().elements.reduce((_, e) => ({ ..._, [e.id]: e }), {})

  Object.keys(byId).forEach((key) => {
    const ticket = byId[key]
    if (!ticket.source || !ticket.target) return
    const child = byId[ticket.target]
    if (!child.parent) {
      child.parent = ticket.source
    } else {
      child.parent += ',' + ticket.source
    }
  })

  const tickets = Object.values(byId)
    //@ts-ignore
    .filter((t) => !t.source)
    .map((t) => {
      const o = {
        //@ts-ignore
        id: t.id,
        //@ts-ignore
        status: t.status,
        //@ts-ignore
        notes: t.notes,
        //@ts-ignore
        label: t.label,
        //@ts-ignore
        position: t.position ? `${Math.floor(t.position.x)},${Math.floor(t.position.y)}` : null,
        //@ts-ignore
        parent: t.parent,
        //@ts-ignore
        points: t.points,
        //@ts-ignore
        owner: t.owner,
        //@ts-ignore
        colorid: _options.removeColor ? undefined : t.colorid,
      }

      return (
        Object.keys(o)
          //@ts-ignore
          .filter((k) => !!o[k])
          //@ts-ignore
          .reduce((_, k) => ({ ..._, [k]: o[k] }), {})
      )
    })

  let yamlContent = ''
  for (const id in tickets) {
    // @ts-ignore
    const ticket = tickets[id]
    yamlContent += '- '
    yamlContent += yaml.dump(ticket).split('\n').join('\n  ')
    yamlContent += '\n'
  }

  return yamlContent
}
