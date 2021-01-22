import { createActions, createReducer, isPrimitive, match } from "./util";
const initialState = {};

export const actors = {
  add: (collection, { id, payload }) => collection.concat({ ...payload, id }),
  remove: (collection, id) => collection.filter((entry) => entry.id !== id),
  bulk: () => {}
};

const getById = (collection, id) =>
  Array.isArray(collection)
    ? collection.find((entry) => entry.id === id)
    : collection[id];

/**
 * Create a reducer that will serve for a collection of a certain type.
 * The type's reducer and actors are passed in to be used when the collection needs to target a specific entry
 * The initialState describes the initial collection, not just the type
 * @param {function(T, { type: string, payload: ...[*]= }): T} entryReducer
 * @param {Object.<string, function(...[*]=, T): T >} entryActors
 * @param {Object.<string, T>} initialState
 * @return {function(Object.<string, T>, {type: *, id?: *, payload: ...[*]=}): Object.<string, T>}
 */
export const collectionOf = (
  entryReducer,
  entryActors,
  initialState = {},
  collectionName
) => {
  let debugId = 0;
  const collectionLevelReducer = createReducer(actors, initialState);

  const collectionActions = Object.fromEntries(
    Object.entries(createActions(actions)).map(([name, func]) => [
      name,
      (...args) => ({ ...func(...args), name: collectionName })
    ])
  );

  const collectionReducer = (
    collection = initialState,
    { type, payload, ...metaData }
  ) => {
    console.log({ type, payload, ...metaData });
    if (metaData.name && metaData.name !== collectionName) return collection;
    if (type === "bulk")
      return payload
        .map((a) => ({ ...a, ...metaData }))
        .reduce(collectionReducer, collection);

    const id = match({
      true: () => debugId++,
      [!!metaData.id]: () => metaData.id,
      [!!payload]: () => payload.id,
      [!!payload && isPrimitive(payload)]: () => payload
    });

    const hasEntry = !!getById(collection, id);

    const collectionLevelAction = type in actors && hasEntry;
    const entryLevelAction = type in entryActors; // && !!collection.find((entry) => entry.id === id);

    return match({
      true: () => collection,
      [collectionLevelAction]: () =>
        collectionLevelReducer(collection, { type, id, payload }),
      [entryLevelAction]: () => {
        if (!hasEntry) {
          return collection.concat(
            entryReducer(
              {},
              {
                type,
                id,
                payload,
                ...metaData
              }
            )
          );
        }
        return collection.map((entry) =>
          entry.id === id
            ? entryReducer(entry, {
                type,
                id,
                payload,
                ...metaData
              })
            : entry
        );
      }
    });
  };
  return { collectionReducer, collectionActions };
};

export const actions = createActions(actors);

export default createReducer(actors, initialState);
