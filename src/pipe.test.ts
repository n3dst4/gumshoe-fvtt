import { pipe, chainPipe } from "./pipe";

interface V1 {
  member1: number;
}
interface V2 {
  member2: number;
}
interface V3 {
  member3: number;
}
interface V4 {
  member4: number;
}
interface V5 {
  member5: number;
}

const v1: V1 = { member1: 1 };
const v2: V2 = { member2: 2 };
const v3: V3 = { member3: 3 };
const v4: V4 = { member4: 4 };
const v5: V5 = { member5: 5 };

const v1toV2 = (seed: V1): V2 => ({ member2: seed.member1 + 1 });
const v2toV3 = (seed: V2): V3 => ({ member3: seed.member2 + 1 });
const v3toV4 = (seed: V3): V4 => ({ member4: seed.member3 + 1 });
const v4toV5 = (seed: V4): V5 => ({ member5: seed.member4 + 1 });

describe("pipe", () => {
  const v3toV5 = pipe(v3toV4, v4toV5);
  const v2toV5 = pipe(v2toV3, v3toV5);
  const v1toV5 = pipe(v1toV2, v2toV5);

  test("v1toV2", () => {
    expect(v1toV2(v1)).toEqual(v2);
  });
  test("v2toV3", () => {
    expect(v2toV3(v2)).toEqual(v3);
  });
  test("v3toV4", () => {
    expect(v3toV4(v3)).toEqual(v4);
  });
  test("v4toV5", () => {
    expect(v4toV5(v4)).toEqual(v5);
  });
  test("v3toV5", () => {
    expect(v3toV5(v3)).toEqual(v5);
  });
  test("v2toV5", () => {
    expect(v2toV5(v2)).toEqual(v5);
  });
  test("v1toV5", () => {
    expect(v1toV5(v1)).toEqual(v5);
  });
});

describe("chainPipe", () => {
  const v3toV5 = chainPipe(v3toV4, v4toV5);
  const v2toV5 = chainPipe(v2toV3, v3toV4).pipe(v4toV5);
  const v1toV5 = chainPipe(v1toV2, v2toV3).pipe(v3toV4).pipe(v4toV5);

  test("v1toV2", () => {
    expect(v1toV2(v1)).toEqual(v2);
  });
  test("v2toV3", () => {
    expect(v2toV3(v2)).toEqual(v3);
  });
  test("v3toV4", () => {
    expect(v3toV4(v3)).toEqual(v4);
  });
  test("v4toV5", () => {
    expect(v4toV5(v4)).toEqual(v5);
  });
  test("v3toV5", () => {
    expect(v3toV5(v3)).toEqual(v5);
  });
  test("v2toV5", () => {
    expect(v2toV5(v2)).toEqual(v5);
  });
  test("v1toV5", () => {
    expect(v1toV5(v1)).toEqual(v5);
  });
});
