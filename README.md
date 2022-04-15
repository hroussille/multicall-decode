# multicall-decode
EVM multicall calldata decoder

## Install

```sh
npm install multicall-decode
```

## Basic Usage : with a direct abi encoded bytes[]

```js
const { decodeRaw } = require("multicall-decode");
const CALLDATA =
  "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008413ead5620000000000000000000000005c8cd1c2f2997f7a041026cc29de8177b4c6d8ec00000000000000000000000089e54f174ca5ff39cf53ab58004158e2ca012eac0000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000000000000035f2482336c0d4c2ba6e94faa1d66f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000164883164560000000000000000000000005c8cd1c2f2997f7a041026cc29de8177b4c6d8ec00000000000000000000000089e54f174ca5ff39cf53ab58004158e2ca012eac0000000000000000000000000000000000000000000000000000000000000bb8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2764c00000000000000000000000000000000000000000000000000000000000a11a8000000000000000000000000000000000000000000000000000000e8d4a510000000000000000000000000000000000000000000000a56d35c029fd16645e079000000000000000000000000000000000000000000000000000000e840308c030000000000000000000000000000000000000000000a503344abc0fbe23670910000000000000000000000005a2b5cb4ce921abd65f0c66c2c839894bfc2076c000000000000000000000000000000000000000000000000000000006244356a00000000000000000000000000000000000000000000000000000000";
  
async function main() {
  console.log(await decodeRaw(CALLDATA));
}

main();

//[
//  [
//    {
//      signature: 'mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))',
//      _id: 0,
//      parameters: [Array],
//      valid: true
//    }
//  ],
//  [
//    {
//      signature: 'createAndInitializePoolIfNecessary(address,address,uint24,uint160)',
//      _id: 0,
//      parameters: [Array],
//      valid: true
//    }
//  ]
//]
```

## Basic Usage : with an abi decoded array of bytes

```js
const { decodeCalls } = require("multicall-decode");
const Web3 = require('web3');
const CALLDATA =
  "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008413ead5620000000000000000000000005c8cd1c2f2997f7a041026cc29de8177b4c6d8ec00000000000000000000000089e54f174ca5ff39cf53ab58004158e2ca012eac0000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000000000000035f2482336c0d4c2ba6e94faa1d66f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000164883164560000000000000000000000005c8cd1c2f2997f7a041026cc29de8177b4c6d8ec00000000000000000000000089e54f174ca5ff39cf53ab58004158e2ca012eac0000000000000000000000000000000000000000000000000000000000000bb8fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2764c00000000000000000000000000000000000000000000000000000000000a11a8000000000000000000000000000000000000000000000000000000e8d4a510000000000000000000000000000000000000000000000a56d35c029fd16645e079000000000000000000000000000000000000000000000000000000e840308c030000000000000000000000000000000000000000000a503344abc0fbe23670910000000000000000000000005a2b5cb4ce921abd65f0c66c2c839894bfc2076c000000000000000000000000000000000000000000000000000000006244356a00000000000000000000000000000000000000000000000000000000";
  
const web3 = new Web3();

async function main() {
  const calls = web3.eth.abi.decodeParameter("bytes[]", CALLDATA);
  console.log(await decodeCalls(calls));
}

main();

//[
//  [
//    {
//      signature: 'mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))',
//      _id: 0,
//      parameters: [Array],
//      valid: true
//    }
//  ],
//  [
//    {
//      signature: 'createAndInitializePoolIfNecessary(address,address,uint24,uint160)',
//      _id: 0,
//      parameters: [Array],
//      valid: true
//    }
//  ]
//]
```


## Input

The input of `decodeRaw` is expected to be an `abi encoded` hex string representing a `bytes[]`.

The input of `decodeCalls` is expected to be an `abi decoded` array of bytes.

## Output

The output is an array containing one set of candidates for each call embedded in the input.

Each set of candidates is itself an array of objects, each object describes a candidate call :

| **Property** | **Type** |                        **Description**                        | **Optional** |
|:------------:|:--------:|:-------------------------------------------------------------:|:------------:|
|   signature  |  string  |            The signature of the candidate function            |      No      |
|      _id     |  number  |                The id of the candidate function               |      No      |
|  parameters  |   array  | An array of Parameter objects describing the function's input |      Yes     |
|     valid    |  boolean |    A boolean value stating the validity of this candidate.    |      No      |


If decoding was successfull, the parameters of a *valid* candidate are present in the `parameters` array :

| **Property** |                       **Description**                       |
|:------------:|:-----------------------------------------------------------:|
|     type     |          The type of the parameter (e.g., address)          |
|      _id     | The ID of the parameter / Index in the function's signature |
|     value    |        The value of the parameter as returned by Web3       |

