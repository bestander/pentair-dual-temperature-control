# Pentair Dual Temperature control (Home Assistant Add-On)

This project demonstrates how to set low and high temperature for Pentair pool systems equipped with heat pumps in both heat and cool modes, using the `node-screenlogic` library.

## Features
- Set pool temperature remotely for heat and cool modes
- Discover available ScreenLogic gateways on your network
- Handles connection timeouts and fallback discovery


## Home Assistant Integration

This project includes a Dockerfile for easy integration as a Home Assistant add-on. You can use this to set dual temperatures for Pentair systems from Home Assistant.

### Build the Docker image
```bash
docker build -t node_dual_temp .
```

### Test locally on macOS

Assuming that your Pentair controller IP is 192.168.1.118.

```bash
docker run -e gateway_ip=192.168.1.118 -e low_temp=22 -e high_temp=35 -e device_index=0 node_dual_temp
```


### Install for Home Assistant OS
1. Go to Settings > Add-ons > Add-on Store > ... > Repositories > Add https://github.com/bestander/pentair-dual-temperature-control
2. Start the service, in the Add-On it will print the service name
3. Use rest command to change temperature which you can use in scripts and controls

```
rest_command:
  set_spa_chill:
    url: "http://03b42b96-node-dual-temp-service:8080/setTemperature"
    method: POST
    content_type: "application/json"
    payload: '{"lowTemp": 10, "highTemp": 12}'

  set_spa_heat:
    url: "http://03b42b96-node-dual-temp-service:8080/setTemperature"
    method: POST
    content_type: "application/json"
    payload: '{"lowTemp": 33, "highTemp": 35}'

```

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
- `package.json` - Project dependencies

## License
MIT
