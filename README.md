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
```bash
docker run -e gateway_ip=192.168.1.118 -e low_temp=22 -e high_temp=35 -e device_index=0 node_dual_temp
```


### Package and Install for Home Assistant OS
1. Zip the repository contents:
	```bash
	zip -r node_dual_temp.zip .
	```
2. Upload `node_dual_temp.zip` to HAOS using the File Explorer add-on.
3. Open the Terminal add-on in HAOS and move/unzip the contents:
	```bash
	mv /path/to/node_dual_temp.zip /root/addons/
	cd /root/addons
	unzip node_dual_temp.zip -d node_dual_temp
	```
4. Go to Settings > Add-ons > Add-on Store > Find and install "NodeJS Dual Temp" in the Add-ons registry.

5. Use rest command to change temperature

```
rest_command:
  set_spa_chill:
    url: "http://local-node-dual-temp:8080/setTemperature"
    method: POST
    content_type: "application/json"
    payload: '{"lowTemp": 10, "highTemp": 12}'

  set_spa_heat:
    url: "http://local-node-dual-temp:8080/setTemperature"
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
