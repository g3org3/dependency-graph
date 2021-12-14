import yaml from "yaml";

const raw = `
- id: CFCCON-199
- id: CFCCON-159

- id: CFCCON-205
  parent: CFCCON-159
  status: todo

- id: CFCCON-207
  parent: CFCCON-205
  status: done

- id: CFCCON-209
  parent: CFCCON-207

- id: CFCCON-208
  parent: CFCCON-209,CFCCON-222
  status: return

- id: CFCCON-223
  status: done

- id: CFCCON-222
  parent: CFCCON-223
`;

const tickets = yaml.parse(raw);

const generateNodes = (ticket, i) => {
  const colors = {
    done: "green",
    doing: "orange",
    todo: "blue",
    return: "red"
  };
  const color = colors[ticket.status] || "black";
  const backgrounds = {
    done: "#baffba",
    doing: "#fde499",
    todo: "#b0e1ff",
    return: "#ff8c8c"
  };
  const background = backgrounds[ticket.status] || "white";
  return {
    id: ticket.id,
    status: ticket.status || "default",
    data: { label: ticket.id },
    position: { x: 0, y: i * 70 },
    style: {
      border: "1px solid " + color,
      background
    }
  };
};

const generateLinks = (ticket, i) => {
  if (!ticket.parent) return null;

  if (ticket.parent.split(",").length > 1) {
    return ticket.parent
      .split(",")
      .map((parent) => parent.trim())
      .map((parent) => ({
        id: `${parent}-${ticket.id}`,
        source: parent,
        target: ticket.id,
        animated: true
      }));
  }

  return {
    id: `${ticket.parent}-${ticket.id}`,
    source: ticket.parent,
    target: ticket.id,
    animated: true
  };
};

export default [
  ...tickets.map(generateNodes),
  ...tickets.map(generateLinks).filter(Boolean).flat()
];
