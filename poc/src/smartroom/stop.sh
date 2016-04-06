#!/bin/bash
kill $(ps aux | grep node | grep -v grep | grep -v autorun | awk '{ print $2 }')
