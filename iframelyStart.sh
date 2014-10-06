#!/bin/bash
NOW=$(date +"%m-%d-%Y")
mv ~/.forever/iframely.log ~/.forever/iframely.log-$NOW
forever start -l iframely.log server.js
