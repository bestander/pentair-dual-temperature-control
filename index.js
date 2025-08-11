
const { FindUnits, UnitConnection } = require('node-screenlogic');

async function setDualTemperature(gatewayIp, deviceIndex, lowTemp, highTemp) {
    let client;
    let ip = gatewayIp;
    try {
        if (!ip) {
            const finder = new FindUnits();
            const units = await finder.searchAsync(25000);
            finder.close();

            if (!units || units.length === 0) {
                console.log('No units found');
                return;
            }

            const unit = units[0]; // Use the first found unit
            console.log(`Found unit: ${JSON.stringify(unit)}`);
            ip = units[0].address;
        }
        console.log(`Using gateway IP: ${ip}`);

        client = new UnitConnection();
        client.init('', ip, 80);

        await client.connectAsync();
        console.log('Connected to gateway');

        const version = await client.getVersionAsync();
        console.log('Gateway version:', version.version);

        await client.bodies.setCoolSetPointAsync(deviceIndex, lowTemp);
        await client.bodies.setSetPointAsync(deviceIndex, highTemp);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) {
            try {
                await client.closeAsync();
            } catch (closeErr) {
                console.error('Error during client close:', closeErr);
            }
        }
    }

}

const gatewayIp = process.argv[2];
const deviceIndex = process.argv[3];
const lowTemp = process.argv[4];
const highTemp = process.argv[5];

setDualTemperature(gatewayIp, deviceIndex, lowTemp, highTemp);
