import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch';
import { TextEncoder, TextDecoder } from 'util';

const connectToController = {
    EOS_CONTRACT_NAME: "eospokergame",
    EOS_HTTP_ENDPOINT: "http://jungle2.cryptolions.io:80",
    KEY: "5HzHemUESLjVts2oh8hYPj2ei9vewYa1Zo4CLfZKkYLJZGtLaE6"
}

const actor = connectToController.EOS_CONTRACT_NAME;
const key = connectToController.KEY;

// Main action call to blockchain
//takes action name, values, and key & actor i.e Action taker.
async function takeAction(actor, key, action, dataValue, EndPoint) {
  const privateKey = key
  // console.log(key);
  const rpc = new JsonRpc(EndPoint.EOS_HTTP_ENDPOINT, { fetch });
  const signatureProvider = new JsSignatureProvider([privateKey]);
//   const signatureProvider = privateKey;
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  // console.log(await rpc.get_account('user1account'));
  // Main call to blockchain after setting action, account_name and data
  try {
    console.log(dataValue);
    const resultWithConfig = await api.transact({
      actions: [{
        account: EndPoint.EOS_CONTRACT_NAME,
        name: action,
        authorization: [{
          actor,
          permission: 'active',
        }],
        data: dataValue,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    return resultWithConfig;
  } catch (err) {
    throw("err TakeAction " + action,err)
  }
}


async function getTable(EndPoint, Table, options) {
  try {
    const rpc = new JsonRpc(EndPoint.EOS_HTTP_ENDPOINT, {fetch});
    const result = await rpc.get_table_rows({
      "reverse": options.reverse && options.reverse,
      "json": true,
      "code": EndPoint.EOS_CONTRACT_NAME,    // contract who owns the table
      "scope": EndPoint.EOS_CONTRACT_NAME,   // scope of the table
      "table": Table,    // name of the table as specified by the contract abi
      "limit": options.limit && options.limit,
      "index_position": "primary",
      "lower_bound": options.lower_bound && options.lower_bound,
      "index_position": options.index_position && options.index_position,
    });
    // console.log(EndPoint);
    return result.rows;
  } catch (err) {
    console.error("err in getTable "+Table,err);
    return err;
  }
}

class ApiService {

  static makeAction( actor, key, action, parameters, connectToController) {
    return takeAction( actor, key, action, parameters, connectToController);
  }

  static getTableRows(connectToController, table, options = {limit: 500}) {
    return getTable(connectToController, table, options);
  }

}

export default ApiService;