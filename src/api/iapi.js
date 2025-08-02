import { getIpFromHeader } from "../util/util.js"
import { textDecoder } from "../server/Server.js"

export async function handleIapiRequest(server, res, req) {
  try {
    // Check if request is coming from the allowed IP address
    let ip = server.getSocketIp(res, req);
    if (ip !== "172.20.128.1") {
      res.end("no");
      return;
    }

    let url = req.getUrl()
    if (url.length > 1 && url.endsWith("/")) url = url.substring(0, url.length - 1)
    switch (url) {
      case "/iapi/payment":
        await handlePayment(server, res, req)
        return
      default:
        res.end('"Unknown request"')
    }
  } catch (error) {
    console.log(error)
  }
}

async function handlePayment(server, res, req) {
  // Parse the JSON data from request body
  let data = "";
  req.onData((chunk, isLast) => {
    data += chunk.toString();
    if (isLast) {
      try {
        let j = JSON.parse(data);

        if (!j || typeof j !== 'object') {
          res.end("no");
          return;
        }

        //console.log("payment received " + JSON.stringify(j));

        let id = j.id || "";
        let world = j.world || "main";
        let pid = j.player || 0;
        let amount = j.amount || 0.0;
        let memo = j.memo || "";

        if (id === "" || amount === 0.0) {
          res.end();
          return;
        }

        // Get client from world manager
        let { valid, client } = server.worlds.getClient(world, pid);

        console.log("Donation received id=" + id + " w=" + world + " a=" + amount + " m=" + memo);
        server.handleDonation(id, valid ? world : "", client, amount, memo);
        res.end();
      } catch (error) {
        console.error("Error processing payment:", error);
        res.end("no");
      }
    }
  });
}
