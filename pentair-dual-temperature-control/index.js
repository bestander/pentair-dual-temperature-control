const { UnitConnection } = require('node-screenlogic');

async function connectToGateway(ip) {
    let client = new UnitConnection();
    try {
        client.init('', ip, 80);
        await client.connectAsync();
        console.log('Connected to gateway');
        const version = await client.getVersionAsync();
        console.log('Gateway version:', version.version);
        return client;
    } catch (err) {
        console.error('Connection error:', err);
        throw err;
    }
}

async function setTemperature(client, deviceIndex, lowTemp, highTemp) {
    try {
        await client.bodies.setCoolSetPointAsync(deviceIndex, parseInt(lowTemp));
        await client.bodies.setSetPointAsync(deviceIndex, parseInt(highTemp));
        console.log(`Set dual temperature: Low ${lowTemp}°C, High ${highTemp}°C`);
    } catch (err) {
        console.error('Set temperature error:', err);
        throw err;
    }
}

async function disconnectFromGateway(client) {
    try {
        await client.closeAsync();
    } catch (err) {
        console.error('Error during client close:', err);
    }
}

async function setDualTemperature(gatewayIp, deviceIndex, lowTemp, highTemp) {
    let client;
    try {
        client = await connectToGateway(gatewayIp);
        await setTemperature(client, deviceIndex, lowTemp, highTemp);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) await disconnectFromGateway(client);
    }
}

// Export functions for server.js
module.exports = { setDualTemperature, connectToGateway, setTemperature, disconnectFromGateway };

// Command-line execution
if (require.main === module) {
    const gatewayIp = process.env.gateway_ip || process.env.HASSIO_gateway_ip || process.argv[2] || '192.168.1.118';
    const deviceIndex = parseInt(process.env.device_index || process.env.HASSIO_device_index || process.argv[3] || '0', 10);
    const lowTemp = parseInt(process.env.low_temp || process.env.HASSIO_low_temp || process.argv[4] || '20', 10);
    const highTemp = parseInt(process.env.high_temp || process.env.HASSIO_high_temp || process.argv[5] || '29', 10);

    console.log(`Starting with: gateway_ip=${gatewayIp}, device_index=${deviceIndex}, low_temp=${lowTemp}, high_temp=${highTemp}`);
    setDualTemperature(gatewayIp, deviceIndex, lowTemp, highTemp).catch(err => console.error('Execution error:', err));
}