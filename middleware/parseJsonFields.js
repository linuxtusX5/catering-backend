// middleware/parseJsonFields.js
export const parseJsonFields = (req, res, next) => {
  const fieldsToParse = ["ingredients", "allergens", "nutritionalInfo"];
  fieldsToParse.forEach((field) => {
    if (typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        // If parsing fails, continue as is (validation will catch bad format)
      }
    }
  });
  next();
};
