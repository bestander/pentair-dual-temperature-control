# screenlogic-test

This project demonstrates how to set low and high temperature for Pentair pool systems equipped with heat pumps in both heat and cool modes, using the `node-screenlogic` library.

## Features
- Set pool temperature remotely for heat and cool modes
- Discover available ScreenLogic gateways on your network
- Handles connection timeouts and fallback discovery

## Usage

### Prerequisites
- Node.js installed
- Pentair ScreenLogic gateway on your network

### Install dependencies
```bash
npm install
```


### Run the script
You can run the script with a specific gateway IP, device index, and temperature values:
```bash
node index.js <gatewayIp> <deviceIndex> <lowTemp> <highTemp>
```
Example:
```bash
node index.js 192.168.1.118 0 10 15
```
If no IP is provided, the script will attempt to discover a gateway automatically.

#### Parameters
- `gatewayIp`: IP address of the ScreenLogic gateway (leave empty to auto-discover)
- `deviceIndex`: Index of the pool/spa device (usually 0 for pool, 1 for spa)
- `lowTemp`: Cool set point temperature
- `highTemp`: Heat set point temperature

## Files
- `index.js` - Main script for setting low and high temperatures for heat/cool mode
- `index2.js` - Alternative script with fallback logic
- `package.json` - Project dependencies

## License
MIT
