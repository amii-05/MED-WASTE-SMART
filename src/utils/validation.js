// Validation utilities

export const validators = {
  email: (value) => {
    if (!value) return "Email is required.";
    const trimmed = value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(trimmed)) return "Please enter a valid email address.";
    return null;
  },
  password: (value) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return null;
  },
  required: (value, label = "This field") => {
    if (value === undefined || value === null || String(value).trim() === "")
      return `${label} is required.`;
    return null;
  },
  number: (value, label = "This field") => {
    if (value === undefined || value === null || String(value).trim() === "")
      return `${label} is required.`;
    if (isNaN(Number(value))) return `${label} must be a number.`;
    return null;
  },
};

export const validateLogin = (values) => {
  const errors = {};
  errors.email = validators.email(values.email);
  errors.password = validators.password(values.password);
  return errors;
};

export const validateCollectionRequest = (values) => {
  const errors = {};
  errors.department =
    validators.required(values.department, "Department") ||
    (values.department ? null : null);
  errors.category = validators.required(values.category, "Waste Category");
  errors.binId = validators.required(values.binId, "Bin ID");
  errors.fillLevel = validators.required(values.fillLevel, "Fill Level");
  errors.priority = validators.required(values.priority, "Priority");
  errors.quantity = validators.number(values.quantity, "Quantity");
  return errors;
};

export const validateAddBin = (values) => {
  const errors = {};
  errors.binId = validators.required(values.binId, "Bin ID");
  errors.department = validators.required(values.department, "Department");
  errors.category = validators.required(values.category, "Waste Category");
  errors.capacity = validators.required(values.capacity, "Capacity");
  errors.location = validators.required(values.location, "Location");
  return errors;
};

export const hasErrors = (errors) =>
  Object.values(errors).some((e) => e !== null && e !== undefined && e !== "");
