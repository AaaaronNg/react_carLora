import asyncio
import websockets
import time
import json
import random
from datetime import datetime

def countup():
    secs = 0
    mins = 0
    hour = 0
    
    while 1:
        if(secs == 60):
            mins += 1
            secs = 0
            timer = '{:02d}:{:02d}:{:02d}'.format(hour,mins, secs)
            print(timer, end="\r") 
            continue
        if(mins == 60):
            hour += 1
            mins = 0
            timer = '{:02d}:{:02d}:{:02d}'.format(hour,mins, secs)
            print(timer, end="\r") 
            continue
        time.sleep(1)
        secs += 1
        timer = '{:02d}:{:02d}:{:02d}'.format(hour,mins, secs)
        print(timer, end="\r") 



async def hello(websocket, path):
    print("hello")
    while(1):
        num = random.randint(1,10)
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        rawNum = {
            "rssi": num,
            "date": current_time
        }
        
        jsonNum = json.dumps(rawNum)
        
        await websocket.send(jsonNum)
        time.sleep(2)
        print(rawNum)

        

# try:
#     print("csv")
#     log = open('carRecord.csv', 'r')        
# except Exception as e:
#     print("csv1")
#     log.write("Time, Module, State, RSSI, SNR, SF, VCC\n")
# finally:
#     log.close()
    
    

start_server = websockets.serve(hello, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

  
  



