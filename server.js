const { connectToGateway, setTemperature, disconnectFromGateway } = require('./index.js');
const http = require('http');
const fs = require('fs');

let client = null;
let gatewayIp = '';
let deviceIndex = 0;

async function initialize() {
    console.log('Add-on starting...');
    console.log('Environment variables:');
    for (let key in process.env) {
        console.log(`${key}: ${process.env[key]}`);
    }

    let config = {};
    try {
        const configData = fs.readFileSync('/data/options.json', 'utf8');
        config = JSON.parse(configData);
        console.log('Loaded config from file:', config);
    } catch (err) {
        console.error('Failed to load config file:', err);
    }

    gatewayIp = process.env.gateway_ip || process.env.HASSIO_gateway_ip || config.gateway_ip || '192.168.1.118';
    deviceIndex = parseInt(process.env.device_index || process.env.HASSIO_device_index || config.device_index || '0', 10);
    const initialLowTemp = parseInt(process.env.low_temp || process.env.HASSIO_low_temp || config.low_temp || '20', 10);
    const initialHighTemp = parseInt(process.env.high_temp || process.env.HASSIO_high_temp || config.high_temp || '29', 10);

    console.log(`Initialized with: gateway_ip=${gatewayIp}, device_index=${deviceIndex}, initial_low_temp=${initialLowTemp}, initial_high_temp=${initialHighTemp}`);
    client = await connectToGateway(gatewayIp);
    await setTemperature(client, deviceIndex, initialLowTemp, initialHighTemp);
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/setTemperature') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { lowTemp, highTemp } = JSON.parse(body);
                console.log(`Received request to set: low_temp=${lowTemp}, high_temp=${highTemp}`);
                await setTemperature(client, deviceIndex, lowTemp, highTemp);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success' }));
            } catch (err) {
                console.error('Request error:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: err.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Not Found' }));
    }
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
    initialize().catch(err => console.error('Initialization error:', err));
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down...');
    if (client) await disconnectFromGateway(client);
    server.close(() => process.exit(0));
});