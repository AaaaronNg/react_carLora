
#!/usr/bin/env python

import socket
import threading
import codecs
import base64
import json
import numpy as np
import datetime
import matplotlib.pyplot as plt
import websockets
import asyncio
import json


port = 8093
bufferSize = 1024

rssi = 0
snr = 0
vcc = 0

def decryptDoorSense(rawData, sf):
	data = bytearray(6)
	key = b''
	if(sf == 'SF7B'):
		key = b'\xa1\x02\xd6\x80\xac\x6e'
	elif(sf == 'SF8B'):
		key = b'\xea\xc9\xf8\x68\x27\x29'
	elif(sf == 'SF9B'):
		key = b'\x03\x8c\x53\x75\x08\x53'
	elif(sf == 'SF10'):
		key = b'\x93\x49\xd9\x79\xe9\x6f'
	elif(sf == 'SF11'):
		key = b'\x88\x34\xe8\x98\x74\xeb'
	elif(sf == 'SF12'):
		key = b'\x44\x40\x0e\x66\x27\x90'
	
	for i in range(0, 6, 1):
		data[i] = rawData[i] ^ key[i]
	for i in range(0, 6, 1):
		data[i] = data[i] ^ data[5]
	return data
 
 

def parseDoorSense(rawData, sf, rssi):
	if(len(rawData) != 6):
		return
	data = decryptDoorSense(rawData, sf)
	if(data[4] != 0xa6):
		return
	if(data[5] != 0x00):
		print(data[5])
		return
	moduleID = int.from_bytes(data[0:2], byteorder='little', signed=False)
	carStateRaw = int.from_bytes(data[2:4], byteorder='little', signed=False)& 0xFC00

	if(carStateRaw == 0xA400):
		doorState = "Available"
	else:
		doorState = "Unknown"

	vcc=1074*1024/(int.from_bytes(data[2:4], byteorder='little', signed=False) & 0x3FF)
    
    

	print("Time:" , datetime.datetime.now(), "module: ", moduleID, "State: ", doorState, " RSSI: ", rssi, " SNR: ", snr, " SF: ", sf, " vcc: ", vcc)

 
	logline = str(datetime.datetime.now()) + ", " + str(moduleID) + ", " + doorState + ", " + str(rssi) + ", " + str(snr) + ", " + str(sf) + ", " + str(vcc) + "\n"
	try:
		log = open('logDoor.csv', 'a')
	except Exception as e:
		log = open('logDoorFallback.csv', 'a')
	finally:
		log.write(logline)
		log.close()


async def server(websocket, path):
	while True:
		try:
			
			addr = 0
			payload, addr = s.recvfrom(bufferSize)
			if(addr == 0):
				continue
			if(len(payload)< 13):
				continue
			if (payload[0] != 2):
				continue
			try:
				packet = json.loads(payload[12:])
			except JSONDecodeError:
				continue
			if ("rxpk" not in packet):
				continue
			

			for i in range (len(packet["rxpk"])-1, -1, -1):
				currentPacket = packet["rxpk"][i]
				tmst=int(currentPacket["tmst"]) / 1000000
				rssi=int(currentPacket["rssi"])
				snr=int(currentPacket["lsnr"])
				sf=currentPacket["datr"][:4]
				data=base64.b64decode(currentPacket["data"])
				parseDoorSense(data, sf, rssi)
				now = datetime.datetime.now()
				current_time = now.strftime("%H:%M:%S")
				data = decryptDoorSense(data, sf)
				moduleID = int.from_bytes(data[0:2], byteorder='little', signed=False)
				rawRssi = {
					"rssi": rssi,
					"id": moduleID
				}
				jsonRssi = json.dumps(rawRssi)
				print(jsonRssi)
				await websocket.send(jsonRssi)
				


		except socket.timeout:
			continue
		except KeyboardInterrupt:
			log.close()
			exit()
		except BlockingIOError:
			continue


s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(("", port))
s.setblocking(0) # the socket is set to non-blocking
s.settimeout(.1)

print("Port opened at", port)

try:
	log = open('logDoor.csv', 'r')
except Exception as e:
	log = open('logDoor.csv', 'w')
	log.write("Time, Module, State, RSSI, SNR, SF, VCC\n")
finally: 
	log.close()


start_server = websockets.serve(server, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
