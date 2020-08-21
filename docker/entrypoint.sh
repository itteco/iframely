#!/bin/ash

export ARGV="$@"
export ARGC="$#"

function sigterm_handler() {
    echo "SIGTERM signal received."
    forever stopall
}

trap "sigterm_handler; exit" TERM

function entrypoint() {

    if [ "${NODE_ENV}" == "development" ]
    then
      node_args="node --debug-port=9229 --inspect=0.0.0.0:9229 --stack_trace_limit=200"
    else
      node_args="node"
    fi

    if [ "$ARGC" -eq 0 ]
    then
        # Run server in cluster mode by default
        forever -c "${node_args}" start cluster.js
    else
        # Use command line arguments supplied at runtime
        forever -c "${node_args}" start $ARGV
    fi

    forever --fifo logs 0 &
    wait
}

entrypoint
