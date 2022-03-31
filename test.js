const chai = require("chai");
const { decode } = require("./index");
const expect = chai.expect;

// UNISWAPV3 CALL
// 2 CALLS
// CALL 1 : (1 Candidate) : mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))
// CALL 2 : (1 Candidate) : createAndInitializePoolIfNecessary(address,address,uint24,uint160)
const CALLDATA1 =
  "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008413ead5620000000000000000000000005c8cd1c2f2997f7a041026cc29de8177b4c6d8ec00000000000000000000000089e54f174ca5ff39cf53ab58004158e2ca012eac0000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000000000000035f2482336c0d4c2ba6e94faa1d66f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000164883164560000000000000000000000005c8cd1c2f2997f7a041026cc29de8177b4c6d8ec00000000000000000000000089e54f174ca5ff39cf53ab58004158e2ca012eac0000000000000000000000000000000000000000000000000000000000000bb8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2764c00000000000000000000000000000000000000000000000000000000000a11a8000000000000000000000000000000000000000000000000000000e8d4a510000000000000000000000000000000000000000000000a56d35c029fd16645e079000000000000000000000000000000000000000000000000000000e840308c030000000000000000000000000000000000000000000a503344abc0fbe23670910000000000000000000000005a2b5cb4ce921abd65f0c66c2c839894bfc2076c000000000000000000000000000000000000000000000000000000006244356a00000000000000000000000000000000000000000000000000000000";

describe("Simple UniswapV3 MultiCall Test", async () => {
  let decoded;

  before(async () => {
    decoded = await decode(CALLDATA1);
  });

  it("Should return 2 decoded calls", () => {
    expect(decoded.length).to.equal(2);
  });

  it("Should asess that the 1st decoded has at least one candidate", () => {
    expect(decoded[0].length).to.be.greaterThan(0);
  });

  it("Should asess that at least one candidate of the 1st decoded call is : mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))", () => {
    let candidatesSignatures = [];

    for (const candidate of decoded[0]) {
      candidatesSignatures.push(candidate.signature);
    }

    expect(candidatesSignatures).to.include(
      "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))"
    );
  });

  it("Should asess that the 2nd decoded has at least one candidate", () => {
    expect(decoded[1].length).to.be.greaterThan(0);
  });

  it("Should asess that at least one candidate of the 2nd decoded call is : createAndInitializePoolIfNecessary(address,address,uint24,uint160)", () => {
    let candidatesSignatures = [];

    for (const candidate of decoded[1]) {
      candidatesSignatures.push(candidate.signature);
    }

    expect(candidatesSignatures).to.include(
      "createAndInitializePoolIfNecessary(address,address,uint24,uint160)"
    );
  });
});
