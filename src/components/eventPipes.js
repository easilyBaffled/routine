export const forwardEventVal = (func) => (e) => func(e.target.value);
export const onKey = (key, func) => (e) => e.key === key && func(e);
export const onEnter = (f) => onKey("Enter", f);
