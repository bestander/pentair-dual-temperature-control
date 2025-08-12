const { connectToGateway, setTemperature, disconnectFromGateway } = require('./index.js');
const http = require('http');
const fs = require('fs');

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

    const gatewayIp = process.env.gateway_ip || process.env.HASSIO_gateway_ip || config.gateway_ip || '192.168.1.118';
    const deviceIndex = parseInt(process.env.device_index || process.env.HASSIO_device_index || config.device_index || '0', 10);

    console.log(`Initialized with: gateway_ip=${gatewayIp}, device_index=${deviceIndex}`);
    return { gatewayIp, deviceIndex };
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/setTemperature') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { gatewayIp, deviceIndex } = await initialize(); // Reinitialize config for each request
                const { lowTemp, highTemp } = JSON.parse(body);
                console.log(`Received request to set: gateway_ip=${gatewayIp}, device_index=${deviceIndex}, low_temp=${lowTemp}, high_temp=${highTemp}`);

                let client;
                try {
                    client = await connectToGateway(gatewayIp);
                    await setTemperature(client, deviceIndex, lowTemp, highTemp);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'success' }));
                } finally {
                    if (client) await disconnectFromGateway(client);
                }
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
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down...');
    server.close(() => process.exit(0));
});