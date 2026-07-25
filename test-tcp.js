const net = require('net');
const socket = new net.Socket();

socket.setTimeout(5000);

socket.on('connect', () => {
  console.log('TCP BERHASIL connect ke port 27017');
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', () => {
  console.log('TCP TIMEOUT - port tidak merespon');
  socket.destroy();
  process.exit(1);
});

socket.on('error', (err) => {
  console.log('TCP ERROR:', err.message);
  process.exit(1);
});

socket.connect(27017, '172.18.0.3');
