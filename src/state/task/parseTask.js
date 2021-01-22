import compiledParser from "./compiledParser";
const parseTaskString = (str) => {
  // console.log(parse(str));
  return (
    str.match(/(?<task>.*):\s*(?<time>\d+)(\s*-\s*(?<point>\d))?/)?.groups ?? {}
  );
};
export const parse = (str, options = {}) => {
  try {
    return compiledParser.parse(str, options)?.[0]?.[0];
  } catch (e) {
    e.message = `
    Task String: ${str}
    Regex "Parsing": ${parseTaskString(str)}

    ${e.message}
    `.replace(/^\s+/, "");
    throw e;
  }
};
