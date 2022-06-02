const {isVideo, isRaw} = require('./utils');

describe("Util", () => {
  test("isVideo", () =>{
    expect(isVideo("mp4")).toStrictEqual(true);
    expect(isVideo("3gp")).toStrictEqual(true);
    expect(isVideo("4gp")).toStrictEqual(false);
    expect(isVideo("5gp")).toStrictEqual(false);
  });

  test("isRaw", () =>{
    expect(isRaw("txt")).toStrictEqual(true);
    expect(isRaw("doc")).toStrictEqual(true);
    expect(isRaw("4gp")).toStrictEqual(false);
    expect(isRaw("5gp")).toStrictEqual(false);
  });
});
