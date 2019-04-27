!/usr/bin/env bash

NAME="eospoker"
echo "Running $NAME!"

# echo "Killing nodeos"
# pkill nodeos

# echo "Restarting nodeos"
# nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::chain_api_plugin --plugin eosio::http_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --access-control-allow-origin='*' --contracts-console --http-validate-host=false --verbose-http-errors >> nodeos.log 2>&1 &


# Wallet opening and unlocking


echo "Open eospoker wallet"
cleos wallet open -n eospoker |& tee -a output.txt
echo "Unlocking wallet"
#for piyush
# cleos wallet unlock -n eospoker --password PW5KC9XLjq1YHU4LVuLnNwmNZPFkAagXXTWLjKNH1Rkfkia5uK1NA |& tee -a output.txt

#for shubham
cleos wallet unlock -n eospoker --password PW5KeNnMQ2vD8bH8f2ZMfEVwgbVP5P15589LcF2baxe7NtHzUPP33 |& tee -a output.txt


# echo "Compiling contracts" 
# eosio-cpp -o eospoker.wasm eospoker.cpp --abigen |& tee -a output.txt

# echo "Creating account"
# cleos create account eosio eospoker EOS8aGXtspZPBMc6vUdp989jQPJGwYFy9isq15mMDTF8u6i3Kr5Vv |& tee -a output.txt

echo "Setting contract on jungle node"
cleos -u http://jungle2.cryptolions.io:80 set contract eospokergame $(pwd) -p eospokergame@active |& tee -a output.txt

# echo "Pushing action creategame"
# cleos push action eospoker creategame '["eospoker",0,8]' -p eospoker@active |& tee -a output.txt

# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 1, "piyusha", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 1, 0]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 2, "piyushb", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 2, 1]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 3, "piyushc", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 3, 2]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 4, "piyushd", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 4, 3]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 5, "piyushe", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 5, 4]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 6, "piyushf", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 6, 5]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 7, "piyushg", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 7, 6]' -p eospoker@active |& tee -a output.txt
# echo "Pushing action addplayer"
# cleos push action eospoker addplayer '["eospoker", 8, "piyushh", 1000]' -p eospoker@active |& tee -a output.txt
# echo "Seating player"
# cleos push action eospoker seatplayer '["eospoker", 8, 7]' -p eospoker@active |& tee -a output.txt

# echo "Starting game"
# cleos push action eospoker starthand '{ "s" : "eospoker", "dealerPosition": 0, "currentPlayer" : 3, "smallBlind" : 5, "playersOnTable" : [1,2,3,4,5,6,7,8], "playersInHand" : [1,2,3,4,5,6,7,8] }' -p eospoker@active |& tee -a output.txt

# echo "Deal Cards"
# cleos push action eospoker dealcards '["eospoker", 0]' -p eospoker@active |& tee -a output.txt

# echo "Testing action call"
# cleos push action eospoker actioncall '["eospoker", 1, 0, 0]' -p eospoker@active |& tee -a output.txt


# echo "Checking if 2 users have been added"
# cleos get table eosasset eosasset users |& tee -a output.txt
# echo "Adding 6 cards"
# cleos push action eosasset addasset '["eosasset",1,1,1,"rare","name1","faction1","text","keywords"]' -p eosasset@active |& tee -a output.txt
# cleos push action eosasset addasset '["eosasset",1,3,1,"rare","name1","faction1","text","keywords"]' -p eosasset@active |& tee -a output.txt
# cleos push action eosasset addasset '["eosasset",1,2,1,"rare","name1","faction1","text","keywords"]' -p eosasset@active |& tee -a output.txt
# cleos push action eosasset addasset '["eosasset",1,1,2,"rare","name1","faction1","text","keywords"]' -p eosasset@active |& tee -a output.txt
# cleos push action eosasset addasset '["eosasset",2,1,1,"rare","name1","faction1","text","keywords"]' -p eosasset@active |& tee -a output.txt
# cleos push action eosasset addasset '["eosasset",3,3,1,"rare","name1","faction1","text","keywords"]' -p eosasset@active |& tee -a output.txt

# echo "Adding a pack"
# cleos push action eosasset addwtchest '{"s":"eosasset","chestType":"gold","cardIds":[1,2,3,4,5],"cardWts":[100,100,100,100,100]}' -p eosasset@active |& tee -a output.txt
# echo "Issuing a card to piyush"
# cleos push action eosasset issuechest '["eosasset",3,0]' -p eosasset@active |& tee -a output.txt
# ehco "Opening pack"
# cleos push action eosasset openwtchest '["eosasset",1,7]' -p eosasset@active |& tee -a output.txt
# echo "Checking packs directory"
# cleos get table eosasset eosasset packdir |& tee -a output.txt
# echo "Checking cards directory"
# cleos get table eosasset eosasset carddir |& tee -a output.txt
# echo "Transfer card"
# cleos push action eosasset trnsfrcrd '["eosasset",1,"piyush","shinde"]' -p eosasset@active |& tee -a output.txt
# echo "Checking cards directory"
# cleos get table eosasset eosasset carddir |& tee -a output.txt
# echo "Checking if the user counts have been increased"
# cleos get table eosasset eosasset user |& tee -a output.txt