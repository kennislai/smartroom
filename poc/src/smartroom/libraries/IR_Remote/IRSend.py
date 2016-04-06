import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.PWM as PWM
#import ctypes, time, sys
import ctypes, sys
import json

# Load libc shared library:
libc = ctypes.CDLL('libc.so.6')

#RESOLUTION = 1e-6
FREQ = 38000

'''
ADJ = 150
LG_HDR_MARK = (9000)
LG_HDR_SPACE = (4500)
LG_BIT_MARK = (560 - ADJ)
LG_ONE_SPACE = (1680 - ADJ)
LG_ZERO_SPACE = (560 - ADJ)
'''

def ConvertHexToBinary(hex):
    scale = 16
    num_of_bits = 32
    return bin(int(hex, scale))[2:].zfill(num_of_bits)

def Mark(us, pin):
    PWM.set_duty_cycle(pin, 30)
    libc.usleep(us)

def Space(us, pin):
    PWM.set_duty_cycle(pin, 0)
    libc.usleep(us)

def SendLG(protocol, hex, pin):
    signal = list(ConvertHexToBinary(hex))
    protocol["BIT_MARK"] = protocol["BIT_MARK"] - protocol["ADJ"]
    protocol["ONE_SPACE"] = protocol["ONE_SPACE"] - protocol["ADJ"]
    protocol["ZERO_SPACE"] = protocol["ZERO_SPACE"] - protocol["ADJ"]

    #Header
    Mark(protocol["HDR_MARK"], pin)
    Space(protocol["HDR_SPACE"], pin)
    Mark(protocol["BIT_MARK"], pin)
    #Data
    for i in range(len(signal)):
        if signal[i]== '1':
            Space(protocol["ONE_SPACE"], pin)
            Mark(protocol["BIT_MARK"], pin)
        else:
            Space(protocol["ZERO_SPACE"], pin)
            Mark(protocol["BIT_MARK"], pin)

    Space(0, pin)

if len(sys.argv) > 3:
    OUTPUT_PIN = "P8_19" #default
    if sys.argv > 4:
        OUTPUT_PIN = sys.argv[3]

    PWM.start(OUTPUT_PIN, 0, FREQ)
    SendLG(json.loads(sys.argv[1]), sys.argv[2], OUTPUT_PIN)
    #PWM.stop(OUTPUT_PIN)
else:
    print 'Command not found.'
