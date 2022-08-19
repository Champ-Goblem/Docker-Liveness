const fs = require('fs');
const {createServer, Server} = require('http');

const httpListener = async () => {
  console.log("Starting http listener on 0.0.0.0:8080");
  console.log("/ -> 200");
  console.log("/timeout -> 200 after 15s");
  console.log("/fail -> 500 after 15s");

  let server = createServer(async (req, res) => {
    if (req.url === "/") {
      res.statusCode = 200;
      res.end("OK");
    } else if (req.url.startsWith("/timeout")) {
      await new Promise(r => setTimeout(r, 15 * 1000));
      res.statusCode = 200;
      res.end("OK");
    } else if (req.url.startsWith("/fail")) {
      res.statusCode = 500;
      res.end("FAIL");
    }
  });

  server.listen(8080);
}

const tcpListener = async () => {
  let okServer = new Server();
  await new Promise(r => okServer.listen(8080, r));
  okServer.on("connection", (socket) => {
    socket.end();
  });
  console.log("OK listening on 8080");

  let timeoutServer = new Server();
  await new Promise(r => timeoutServer.listen(8081, r));
  timeoutServer.on("connection", async (socket) => {
    await new Promise(r => setTimeout(r, 15 * 1000));
    socket.end();
  });
  console.log("Timeout listening on 8081 with 15s timeout");
}

const fileHandler = async () => {
  fs.mkdirSync("/tmp/test", {recursive: true});
  while (true) {
    fs.writeFileSync("/tmp/test/file", "OK");
    console.log("Written file /tmp/test/file, deleting after 60s");
    await new Promise(r => setTimeout(r, 60 * 1000));
    fs.rmSync("/tmp/test/file");
    console.log("Deleted the file /tmp/test/file, waiting for 60s");
    await new Promise(r => setTimeout(r, 60 * 1000));
  }
}

(async () => {
  const type = process.env.TYPE;

  switch (type) {
    case 'HTTP': {
      await httpListener();
      break;
    }
    case 'TCP': {
      await tcpListener();
      break;
    }
    case 'CMD': {
      await fileHandler();
      break;
    }
  }
})();