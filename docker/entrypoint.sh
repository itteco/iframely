#!/bin/ash

export ARGV="$@"
export ARGC="$#"

function sigterm_handler() {
    echo "SIGTERM signal received."
    yarn forever stopall
}

trap "sigterm_handler; exit" TERM

function entrypoint() {
    if [ "$ARGC" -eq 0 ]
    then
        # Run server in cluster mode by default
        yarn forever start cluster.js
    else
        # Use command line arguments supplied at runtime
        yarn forever start $ARGV
    fi

    yarn forever --fifo logs 0 &
    wait
}

entrypoint
