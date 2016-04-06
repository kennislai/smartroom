#!/bin/bash
echo "start master controller"
node bbb/controller/masterController/master-controller.js &

echo "start lighting controller"
node bbb/controller/lightingController/lighting-controller.js &

echo "start courtesy controller"
node bbb/controller/courtesyController/courtesy-controller.js &

echo "start hvac controller"
node bbb/controller/hvacController/hvac-controller.js &

echo "start remote controller"
node bbb/controller/remoteController/remote-controller.js &

echo "start sensor controller"
node bbb/controller/sensorController/sensor-controller.js &

echo "start curtain controller"
node bbb/controller/curtainController/curtain-controller.js &

echo "start web server"
node web/webserver.js
