#!/bin/bash

touch /liveness-file
sleep 180
rm /liveness-file
sleep 600
