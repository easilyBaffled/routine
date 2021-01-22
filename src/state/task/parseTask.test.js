import { parse } from "./parseTask";
import { smartMerge } from "../util";
let task = {
  tags: [],
  name: "",
  time: 0,
  points: 0
};

const ext = (taskParts) => smartMerge(task, taskParts);

const commitment = (taskParts = {}) =>
  smartMerge(task, taskParts, { tags: ["⭕️"] });

describe("passing", () => {
  test("parse: #misc test: 12", () => {
    const actual = parse("#misc test: 12");
    const expected = ext({ tags: ["misc"], name: "test", time: 12 });

    expect(actual).toEqual(expected);
  });

  test("parse: #wrk #⭕️ PR/Mentor: 60", () => {
    const actual = parse("#wrk #⭕️ PR/Mentor: 60");
    const expected = commitment({
      tags: ["wrk"],
      name: "PR/Mentor",
      time: 60
    });

    expect(actual).toEqual(expected);
  });
});

test("parse: #wrk #⭕️ block exporting on incomplete models: 90", () => {
  const actual = parse("#wrk #⭕️ block exporting on incomplete models: 90");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #wrk #⭕️ #ci/cd What's Next With Nathan: 60", () => {
  const actual = parse("#wrk #⭕️ #ci/cd What's Next With Nathan: 60");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #home #⭕️ pack for shenendoah: 90", () => {
  const actual = parse("#home #⭕️ pack for shenendoah: 90");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #home #⭕️ Laundry: 45", () => {
  const actual = parse("#home #⭕️ Laundry: 45");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #home #⭕️ share laundry work: 45", () => {
  const actual = parse("#home #⭕️ share laundry work: 45");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #misc #⭕️ [read on the iPad](https://zapier.com/blog/better-memory/): 20", () => {
  const actual = parse(
    "#misc #⭕️ [read on the iPad](https://zapier.com/blog/better-memory/): 20"
  );
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #home #🥬 handle ugg swap: 30", () => {
  const actual = parse("#home #🥬 handle ugg swap: 30");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #wrk #🥬 test try/catch to `waterfall`: 60", () => {
  const actual = parse("#wrk #🥬 test try/catch to `waterfall`: 60");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #wrk  #🥬 read [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) <How far off are we?>: 45", () => {
  const actual = parse(
    "#wrk  #🥬 read [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) <How far off are we?>: 45"
  );
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #wrk #🥬 pick up stud finder: 20", () => {
  const actual = parse("#wrk #🥬 pick up stud finder: 20");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #wrk #🥬 ask Nathan about him talking OO with the team and make a tech talk series", () => {
  const actual = parse(
    "#wrk #🥬 ask Nathan about him talking OO with the team and make a tech talk series"
  );
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #misc #routine #🍰 [How to add PEG.js to project](https://pegjs.org/documentation#installation-browser): 60", () => {
  const actual = parse(
    "#misc #routine #🍰 [How to add PEG.js to project](https://pegjs.org/documentation#installation-browser): 60"
  );
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #misc #kart #🍰 digitize all docs: 30+5", () => {
  const actual = parse("#misc #kart #🍰 digitize all docs: 30+5");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #misc #kart #🍰 define core loops: 20", () => {
  const actual = parse("#misc #kart #🍰 define core loops: 20");
  const expected = ext();

  expect(actual).toEqual(expected);
});

test("parse: #misc #kart #🍰 describe a round: 15", () => {
  const actual = parse("#misc #kart #🍰 describe a round: 15");
  const expected = ext();

  expect(actual).toEqual(expected);
});
