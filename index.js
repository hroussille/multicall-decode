const Web3 = require("web3");
const axios = require("axios");

const FOURBYTES_ENDPOINT =
  "https://www.4byte.directory/api/v1/signatures/?hex_signature=";
const web3 = new Web3();

function extractParametersFromSignature(signature) {
  let params = [];
  const allParameters = /\b[^()]+\((.*)\)$/gm;
  const splitParameters = /((\(.+?\))|([^,() ]+)){1}/gm;

  let _allParameters = allParameters.exec(signature)[1];

  while ((match = splitParameters.exec(_allParameters))) {
    params.push(match[0]);
  }

  return params;
}

async function decodeCalls(calls) {
  let result = [];

  for (const [callId, call] of calls.entries()) {
    let strippedCall = call.replace("0x", "");
    let functionSelector = strippedCall.slice(0, 8);
    let data = strippedCall.slice(8);
    let request = await axios.get(FOURBYTES_ENDPOINT + functionSelector);

    if (request.data.results.length == 0) {
      result.push(undefined);
    }

    let candidates = [];

    for (const [
      candidateCallId,
      candidateCall,
    ] of request.data.results.entries()) {
      let signature = candidateCall.text_signature;
      let candidate = { signature: signature, _id: candidateCallId };
      let parameters = extractParametersFromSignature(signature);
      try {
        var decoded = web3.eth.abi.decodeParameters(parameters, data);
      } catch (error) {
        candidate.valid = false;
        candidates.push(candidate);
        continue;
      }

      candidate.parameters = [];

      for (const [parameterId, parameter] of parameters.entries()) {
        candidate.parameters.push({
          type: parameter,
          _id: parameterId,
          value: decoded[parameterId],
        });
      }

      candidate.valid = true;
      candidates.push(candidate);
    }

    result.push(candidates);
  }

  return result;
}

async function decodeRaw(calldata) {
  const calls = web3.eth.abi.decodeParameter("bytes[]", calldata);
  return decodeCalls(calls);
}

module.exports = {
  decodeRaw: decodeRaw,
  decodeCalls: decodeCalls,
};
