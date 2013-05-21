## Dev: install plugins dependency

    cd <iframely root>
    cd iframely-plugins
    sudo npm link
    cd ../iframely-proxy
    npm link iframely-plugins

## Dev: install iframely-node2 dependency

    cd <iframely root>
    cd iframely-node2
    sudo npm link
    cd ../iframely-proxy
    npm link iframely-node2

## Install

    npm install