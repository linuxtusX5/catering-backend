// Mock data
let menuItems = [
  { id: 1, name: "Pizza", price: 9.99 },
  { id: 2, name: "Burger", price: 5.99 },
];

export const getMenuItems = (req, res) => {
  res.json(menuItems);
};

export const createMenuItem = (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  menuItems.push(newItem);
  res.status(201).json(newItem);
};
