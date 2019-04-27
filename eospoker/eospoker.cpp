#include <eosio/eosio.hpp>

#include <string>
#include <vector>
#include <map>

// //using namespace eosio; -- not using this so you can explicitly see which eosio functions are used.

class [[eosio::contract]] eospoker : public eosio::contract {

public:

    using contract::contract;

    eospoker( eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds ): eosio::contract(receiver, code, ds),  _playerstbl(receiver, code.value), _handstbl(receiver, code.value), _gamestbl(receiver, code.value)
    {}

    // [[eosio::action]] will tell eosio-cpp that the function is to be exposed as an action for user of the smart contract.
    [[eosio::action]] void version();
    [[eosio::action]] void addplayer(eosio::name s, uint64_t playerId, eosio::name playerAccountName, uint64_t buyIn);
    [[eosio::action]] void rmplayer(eosio::name s, uint64_t playerId);
    [[eosio::action]] void creategame(eosio::name s, uint64_t gameId, uint64_t maxPlayers);
    [[eosio::action]] void seatplayer(eosio::name s, uint64_t playerId, uint64_t seatPosition);
    [[eosio::action]] void startgame(eosio::name s, uint64_t smallBlind);
    [[eosio::action]] void starthand(eosio::name s, uint64_t dealerPosition, uint64_t currentPlayer, uint64_t smallBlind, std::vector<uint64_t> playersOnTable, std::vector<uint64_t> playersInHand);
    [[eosio::action]] void dealcards(eosio::name s, uint64_t handId);
    [[eosio::action]] void updcurpl(eosio::name s, uint64_t handId);
    [[eosio::action]] void actioncall(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId);
    [[eosio::action]] void actionbet(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId, uint64_t betValue);
    [[eosio::action]] void actionraise(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId, uint64_t raiseValue);
    [[eosio::action]] void actionallin(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId);
    [[eosio::action]] void actionfold(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId);
    [[eosio::action]] void openflop(eosio::name s, uint64_t handId);
    [[eosio::action]] void openturn(eosio::name s, uint64_t handId);
    [[eosio::action]] void openriver(eosio::name s, uint64_t handId);
    [[eosio::action]] void showdown(eosio::name s, uint64_t handId);

    
    //private: -- not private so the cleos get table call can see the table data.

    // create the multi index tables to store the data
    struct card {
        uint64_t rank;
        uint64_t suit;
    };



    struct cardpair {
        card firstCard;
        card secondCard; 
    };

    


    struct [[eosio::table]] players 
    {
        uint64_t    playerId; // second key, non-unique, this table will have dup rows for each user because of option
        eosio::name accountName; // name of user
        uint8_t     playerStatus = 1; // staus where 0 = off the table, 1 = on the table // If player status = 1 then the player will also have a seat position
        uint64_t    seatPosition; // At the start of the game the dealer button is at position 1, the small blind at 2, and the big bling at 3;
        uint64_t    currentChips; //value
        uint64_t    totalBuyIns; //value
        cardpair    holeCards;   

        uint64_t primary_key() const { return playerId; }
    };
    typedef eosio::multi_index<"players"_n, players> playerstbl;

    // create the multi index tables to store the data
    struct [[eosio::table]] hand
    {
        uint64_t    handId;
        uint64_t    dealerPosition;
        uint64_t    bigBlind; // value
        uint64_t    raisedBy; // index
        uint64_t    currentBetAmount; // value
        std::vector<card>   flop;
        card        turn;
        card        river;
        uint64_t    pot; //value
        uint64_t    currentPlayer; //Index
        std::vector<uint64_t> playersOnTable;
        std::vector<uint64_t>   playersInHand;
        std::vector<uint64_t> playersBetAmount; // this is exact mapping to players in Hand , for example playersInHand[0] has currentBeAmount of playersBetAmounts[0]
        std::vector<card> shuffledDeck;
        std::vector<uint64_t> handStrengths;
        uint64_t primary_key() const { return handId; }
    };
    typedef eosio::multi_index<"hand"_n, hand> handstbl;

    struct  [[eosio::table]] game
    {
        uint64_t gameId;
        uint64_t maxPlayers;
        uint64_t tablePlayersCount;
        uint64_t currentHandIndex;
        uint64_t dealeratStart;
        uint64_t primary_key() const { return gameId; }
    };
    typedef eosio::multi_index<"game"_n, game> gamestbl;

    // create the multi index tables to store the data
    
    // const uint64_t totalPrimes = 127;
    // const std::vector<uint64_t> primes = {
    // 29, 71, 113, 173, 229, 281, 349, 409, 463, 541,
    // 9829, 9833, 9839, 9851, 9857, 9859, 9871, 9883, 9887, 9901, 
    // 601, 659, 733 , 809, 863, 941, 1013, 1069, 1151, 1223,
    // 9649, 9661, 9677, 9679, 9689, 9697, 9719, 9721, 9733, 9739,  
    // 1291, 1373, 1451, 1511, 1583, 1657, 1733, 1811, 1889, 1987,
    // 9547, 9551, 9587, 9601, 9613, 9619, 9623, 9629, 9631, 9643, 
    // 2053, 2129, 2213, 2287, 2357, 2423, 2531, 2617, 2687, 2741,
    // 9463, 9467, 9473, 9479, 9491, 9497, 9511, 9521, 9533, 9539,  
    // 2819, 2903, 2999, 3079, 3181, 3257, 3331, 3413, 3511, 3571,
    // 4493, 4583, 4657, 4751, 4831, 4937, 5003, 5087, 9439, 9461, 
    // 3643, 3727, 3821, 3907, 3989, 4057, 4139, 4231, 4297, 4409, 
    // 9743, 9749, 9767, 9769, 9781, 9787, 9791, 9803, 9811, 9817, 
    // 9907, 9923, 9929, 9931, 9941, 9949, 9967};
    
    // uint64_t M = 2147483647;
    // uint64_t A = 16807;
    // uint64_t Q =( M / A );
    // uint64_t R =( M % A );
    // //// local instances of the multi indexes

    playerstbl _playerstbl;
    handstbl   _handstbl;
    gamestbl   _gamestbl;

    
};

// Suit to number mapping :
// 1 - Clubs
// 2 - Diamonds
// 3 - Hearts
// 4 - Spades
// Rank to number mapping :
// 1 - A
// 2 - 10
// 11 - J
// 12 - Q
// 13 - K
std::vector<eospoker::card> deck = {
        {1,1},
        {2,1},
        {3,1},
        {4,1},
        {5,1},
        {6,1},
        {7,1},
        {8,1},
        {9,1},
        {10,1},
        {11,1},
        {12,1},
        {13,1},
        {1,2},
        {2,2},
        {3,2},
        {4,2},
        {5,2},
        {6,2},
        {7,2},
        {8,2},
        {9,2},
        {10,2},
        {11,2},
        {12,2},
        {13,2},
        {1,3},
        {2,3},
        {3,3},
        {4,3},
        {5,3},
        {6,3},
        {7,3},
        {8,3},
        {9,3},
        {10,3},
        {11,3},
        {12,3},
        {13,3},
        {1,4},
        {2,4},
        {3,4},
        {4,4},
        {5,4},
        {6,4},
        {7,4},
        {8,4},
        {9,4},
        {10,4},
        {11,4},
        {12,4},
        {13,4},
    };

// note we are explcit in our use of eosio library functions
// note we liberally use print to assist in debugging

// public methods exposed via the ABI

enum HandScore
{
    high_card,
    one_pair,
    two_pair,
    three_of_a_kind,
    straight,
    flush,
    full_house,
    four_of_a_kind,
    straight_flush,
    royal_flush,
    num_scores,
};
const char* const HandScoreNames[num_scores] =
{
    "High card",
    "One Pair",
    "Two Pair",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Royal Flush",
};
const int kStartingRank = 2;
const int kNumRanks = 13;
const int kNumSuits = 4;
const int kcardsPerHand = 5;
const int kcardsPerDeck = 52;
 
struct card
{
    card(int suit_ = 0, int rank_ = kStartingRank) : rank(rank_), suit(suit_) {}
    bool operator<(const card& other) const
    {
        return std::tie(rank, suit) < std::tie(other.rank, other.suit);
    }
    int rank;
    int suit;
};

struct Hand
{
    Hand() : cards(kcardsPerHand) {}
    HandScore GetScore()
    {
        HandScore score = high_card;
        // for(int i = 0; i<cards.size(); i++)
        // {
        //  std::cout << "card : " << cards[i].rank << " "<<cards[i].suit<<" --> "; 
        // }
        // std::cout<<"\n";

        std::sort(cards.begin(), cards.end());
        int counts[kNumRanks] = {};
        int suits[kNumSuits] = {};
        for(size_t i = 0; i < cards.size(); ++i)
        {
            ++counts[cards[i].rank - kStartingRank];
            ++suits[cards[i].suit];
        }
        int pair_count = 0;
        int three_count = 0;
        int four_count = 0;
        for(int i = 0; i < kNumRanks; ++i)
        {
            if(counts[i] == 2)
            {
                ++pair_count;
            }
            else if(counts[i] == 3)
            {
                ++three_count;
            }
            else if(counts[i] == 4)
            {
                ++four_count;
            }
        }
        bool is_flush = false;
        for(int i = 0; i < kNumSuits; ++i)
        {
            if(suits[i] == kcardsPerHand)
            {
                is_flush = true;
                break;
            }
        }
        const int spread5  = cards[cards.size() - 1].rank - cards[0].rank;
        const int spread4 = cards[cards.size() - 2].rank - cards[0].rank;
        if(is_flush)
        {
            score = flush;
            if(spread5 == 4)
            {
                if(cards[0].rank == 10)
                {
                    score = royal_flush;
                }
                else
                {
                    score = straight_flush;
                }
            }
            //special check for 2345A
            else if(spread5 == 12 && spread4 == 3 && cards[0].rank == 2 && cards[cards.size() - 1].rank == 14)
            {
                score = straight_flush;
            }
        }
        else
        {
            if(spread5 == 4)
            {
                score = straight;
            }
            //special check for 2345A
            else if(spread5 == 12 && spread4 == 3 && cards[0].rank == 2 && cards[cards.size() - 1].rank == 14)
            {
                score = straight;
            }
            else if(four_count == 1)
            {
                score = four_of_a_kind;
            }
            else if(three_count == 1)
            {
                if(pair_count == 1)
                {
                    score = full_house;
                }
                else
                {
                    score = three_of_a_kind;
                }
            }
            else if(pair_count == 2)
            {
                score = two_pair;
            }
            else if(pair_count == 1)
            {
                score = one_pair;
            }
        }
        return score;
    }
    std::vector<card> cards;
};

// // A function to print all combination of a given length from the given array.
// void gensubset(int a[], int reqLen, int start, int currLen, bool check[], int len) 
// {
//     // Return if the currrLen is more than the required length.
//     if(currLen > reqLen)
//     return;
//     // If currLen is equal to required length then print the sequence.
//     else if (currLen == reqLen) 
//     {
//         cout<<"\t";
//         for (int i = 0; i < len; i++) 
//         {
//             if (check[i] == true) 
//             {
//                 cout<<a[i]<<" ";
//             }
//         }
//         cout<<"\n";
//         return;
//     }
//     // If start equals to len then return since no further element left.
//     if (start == len) 
//     {
//         return;
//     }
//     // For every index we have two options.
//     // First is, we select it, means put true in check[] and increment currLen and start.
//     check[start] = true;
//     GenSubSet(a, reqLen, start + 1, currLen + 1, check, len);
//     // Second is, we don't select it, means put false in check[] and only start incremented.
//     check[start] = false;
//     GenSubSet(a, reqLen, start + 1, currLen, check, len);
// }

void eospoker::version() {
    eosio::print("eospoker version  0.22"); 
};

uint16_t randnumlsfr(uint16_t start_state) {
      /* Any nonzero start state will work. */
    uint16_t lfsr = start_state;
    uint16_t period = 0;
    uint16_t safeCounter = 0;

    uint16_t modulus = 65521;
    do
    {
        lfsr = (lfsr ^ lfsr >> 7) % modulus;
        lfsr = (lfsr ^ lfsr << 9) % modulus;
        lfsr = (lfsr ^ lfsr >> 13) % modulus;
        period = period + 1;
        safeCounter = safeCounter + 1;
        //eosio::print("--Random Number Period : ", period);
    }
    while (lfsr != start_state && safeCounter < 1000);
    eosio::print( "#--Period : ", period);
    return lfsr;
}


std::vector<uint16_t> shuffledeck(uint16_t start_state) {
    int N = 52;
    std::vector<uint16_t> v;
    for(uint16_t i = 0; i < 52 ; i++)
        v.push_back(i);
    uint16_t seed = start_state;
    for(int i=N-1; i>0; --i) {  // gist, note, i>0 not i>=0
        uint16_t randomNumber = randnumlsfr(seed);
        eosio::print("Random Number : ", randomNumber);
        uint16_t r = randomNumber % (i+1); // gist, note, i+1 not i. "randomnumlsfr(seed) means % (i+1)" means 
                                // generate rand numbers from 0 to i
        uint16_t temp = v[i];
        v[i] = v[r];
        v[r] = temp;

    }
    for(uint16_t i = 0 ; i < 52 ; i++)
        eosio::print("#---First Element : ", v[i]);    
    return v;
}



void eospoker::addplayer(eosio::name s, uint64_t playerId, eosio::name playerAccountName, uint64_t buyIn) {
    // require_auth(s);

    eosio::print("#---Add player ", playerAccountName.value); 

//   Check if the player has already been added
    // //std::vector<uint64_t> keysForModify;
    // // find items which are for the named user
    // for(auto& item : _users) {
    //     if (item.userName == userName) {
    //         eosio::print("The username is taken, please try something else");
    //         return;   
    //     }
    // }


    // update the table to include a new user
    _playerstbl.emplace(get_self(), [&](auto& p) {
        p.playerId = playerId;
        p.accountName = playerAccountName;
        p.playerStatus = 1;
        p.seatPosition = 0;
        p.currentChips = buyIn;
        p.totalBuyIns  = buyIn;
    });
}

void eospoker::rmplayer(eosio::name s, uint64_t playerId) {
    //require_auth(s);
    eosio::print("#---Remove player ", playerId); 

    auto itr = _playerstbl.find(playerId);;
    if(itr == _playerstbl.end()) 
    {
        eosio::print("#---Player is not on the table");
        return;
    }
    
    _playerstbl.erase(itr);
}

void eospoker::creategame(eosio::name s, uint64_t gameId, uint64_t maxPlayers)  {

    _gamestbl.emplace(get_self(), [&](auto& p) {
        p.gameId = 0; // Every game will have id 1, this is a sort of utility table
        p.maxPlayers = maxPlayers;
        p.tablePlayersCount = 0;
        p.currentHandIndex = 0;
    });
}

void eospoker::seatplayer(eosio::name s, uint64_t playerId, uint64_t seatPosition)
{
    auto itr = _playerstbl.find(playerId);
    if(itr == _playerstbl.end())
    {
        eosio::print("#---The player is not added yet. Add the player to this game first");
        return;
    }
    auto gametable = _gamestbl.get(0); 
    if(gametable.tablePlayersCount == gametable.maxPlayers)
    {
        eosio::print("#---The table is full");
        return;
    }
    auto iter = _gamestbl.find(0);
        
    if(gametable.tablePlayersCount == 0)
    {
        eosio::print("#--- Assigning dealer position to playerID : ", playerId);
        _gamestbl.modify(iter, get_self(), [&](auto& p) {
            p.dealeratStart = playerId;
        });
        _playerstbl.modify(itr, get_self(), [&](auto& p) {
            p.seatPosition = 0;
        });
        eosio::print("#---The player is now sitting at seatPosition : ", seatPosition);
    }
    else {
        _playerstbl.modify(itr, get_self(), [&](auto& p) {
            p.seatPosition = seatPosition;
        });
        eosio::print("#---The player is now sitting at seatPosition : ", seatPosition);
    }
    _gamestbl.modify(iter, get_self(), [&](auto& p) {
        p.tablePlayersCount = p.tablePlayersCount + 1;
    });
    
    // If the player is first to sit at the table, assign dealer position
    // TODO also check if the seat is already occupied, throw exception
    // TODO check if seatPosition belongs to [0,7] i.e [0,8)
    
 }

uint64_t clockwisenext(uint64_t index, uint64_t n)
{
    uint64_t nextIndex = 0;
    return (index + 1) % n;
}

 void eospoker::startgame(eosio::name s, uint64_t smallBlind)
 {
 // {
 // uint64_t gameId;
 //        uint64_t maxPlayers;
 //        uint64_t tablePlayersCount;
 //        uint64_t currentHandIndex;
 //        uint64_t dealeratStart;
    auto game = _gamestbl.get(0);
    std::vector<uint64_t> playersOnTable(8,0);

    for(auto& item : _playerstbl)
        playersOnTable[item.seatPosition] = item.playerId;

    std::vector<uint64_t> firstHandPlayers;
    for(int i = 0; i<8; i++)
    {
        if(playersOnTable[i] != 0)
            firstHandPlayers.push_back(playersOnTable[i]);
    }
    uint64_t currentPlayer = firstHandPlayers[clockwisenext(0,firstHandPlayers.size())];
    //starthand(s,0,currentPlayer,smallBlind,playersOnTable,firstHandPlayers);
    // uint64_t    handId;
    // uint64_t    dealerPosition;
    // uint64_t    bigBlind; // value
    // uint64_t    raisedBy; // index
    // uint64_t    cuurentBetAmount; // value
    // std::vector<card>   flop;
    // card        turn;
    // card        river;
    // uint64_t    pot; //value
    // uint64_t    currentPlayer; //Index
    // vector players on table
    // std::vector<uint64_t>   playersInHand;
    // std::vector<uint64_t> playersOrder; // This maintains the order of seating at the table
    // std::vector<card> shuffledDeck;

    // setting up the first hand


    // TODO fill game table so that start hand could be called


 }

void eospoker::starthand(eosio::name s, uint64_t dealerPosition, uint64_t currentPlayer, uint64_t smallBlind, std::vector<uint64_t> playersOnTable, std::vector<uint64_t> playersInHand)
{
    std::vector<uint16_t> v = shuffledeck(2);
    std::vector<card> shuffledDeck(52,{0,0});
    for(uint16_t i = 0; i < v.size(); i++)
    {
        shuffledDeck[i].rank = deck[v[i]].rank;
        shuffledDeck[i].suit = deck[v[i]].suit;
    }


/*
uint64_t    handId;
        uint64_t    dealerPosition;
        uint64_t    bigBlind; // value
        uint64_t    raisedBy; // index
        uint64_t    cuurentBetAmount; // value
        std::vector<card>   flop;
        card        turn;
        card        river;
        uint64_t    pot; //value
        uint64_t    currentPlayer; //Index
        std::vector<uint64_t> playersOnTable;
        std::vector<uint64_t>   playersInHand;
        std::vector<card> shuffledDeck;
*/
    auto bigBlindPlayer = _playerstbl.find(playersInHand[2]);
    auto smallBlindPlayer = _playerstbl.find(playersInHand[1]);
// TODO check whether BB and SB have enough chips otherwise allin
    
    _playerstbl.modify(bigBlindPlayer, get_self(), [&](auto& p) {
        p.currentChips = p.currentChips - smallBlind*2;
    });

    _playerstbl.modify(smallBlindPlayer, get_self(), [&](auto& p) {
        p.currentChips = p.currentChips - smallBlind;
    });

    std::vector<uint64_t> playersBetAmount(playersInHand.size(),0);
    playersBetAmount[1] = smallBlind;
    playersBetAmount[2] = smallBlind * 2;

    _handstbl.emplace(get_self(), [&](auto& p) {
        p.handId = _handstbl.available_primary_key();
        p.dealerPosition = dealerPosition;
        p.raisedBy = playersOnTable[dealerPosition];
        p.currentBetAmount = smallBlind * 2;
        p.pot = smallBlind * 3;
        p.currentPlayer = currentPlayer;
        p.playersOnTable = playersOnTable;
        p.playersInHand = playersInHand;
        p.playersBetAmount = playersBetAmount;
        p.shuffledDeck = shuffledDeck;
    });
}

void eospoker::dealcards(eosio::name s, uint64_t handId) {
    auto hand_itr = _handstbl.find(handId);
    auto currentHand = _handstbl.get(handId);
    auto shuffledDeck = currentHand.shuffledDeck;
    auto playersInHand = currentHand.playersInHand;
    uint64_t n = playersInHand.size();
    eosio::print("#---Dealing cards for the following number of players : ", n);
    uint64_t index = 0;

    // Assign hole cards one at a time to each player
    std::vector<cardpair> cardsdealt;
    for(uint64_t i = 0 ; i < n ; i++)
    {
        cardpair c= {shuffledDeck[i],shuffledDeck[n+i]};

        //Logs
        eosio::print("#--- Card pair c FIRST CARD RANK: ", c.firstCard.rank);
        eosio::print("#--- Card pair c FIRST CARD SUIT: ", c.firstCard.suit);
        eosio::print("#--- Card pair c SECOND CARD RANK: ", c.secondCard.rank);
        eosio::print("#--- Card pair c SECOND CARD RANK: ", c.secondCard.suit);
        cardsdealt.push_back(c);
    }
    
    // Assigning cards to the players from the vector cardsdealt
    for(uint64_t i = 0 ; i < n ; i++)
    {
        uint64_t playerId = playersInHand[i];
        auto plitr = _playerstbl.find(playerId);
        
        // Logger
        eosio::print("#--- Cards being assigned to the player : " , playerId);
        eosio::print("#--- First card assigned RANK: " , cardsdealt[i].firstCard.rank);
        eosio::print("#--- First card assigned SUIT: " , cardsdealt[i].firstCard.suit);
        eosio::print("#--- Second card assigned RANK: " , cardsdealt[i].secondCard.rank);
        eosio::print("#--- Second card assigned SUIT: " , cardsdealt[i].secondCard.suit);
        
        cardpair holeCards;
        holeCards.firstCard = cardsdealt[i].firstCard;
        holeCards.secondCard = cardsdealt[i].secondCard;
        
        _playerstbl.modify(plitr, get_self(), [&](auto& p){
            p.holeCards = holeCards;
        });
    }

    // Erasing the cards that have been removed from the deck
    shuffledDeck.erase(shuffledDeck.begin(), shuffledDeck.begin()+2*n);
     _handstbl.modify(hand_itr, get_self(), [&](auto& p) {
        p.shuffledDeck = shuffledDeck;
    });

    // Printing shuffled deck size for verifying that the cards have been deleted
    eosio::print("#--- Cards remaining in the shuffled deck : " , shuffledDeck.size());
}

void eospoker::updcurpl(eosio::name s, uint64_t handId)
{
    // this is to update current player
    auto itr = _handstbl.find(handId);
    if(itr == _handstbl.end())
    {
        eosio::print ("Hand doesn't exist", handId);
        return;
    }
        // uint64_t    handId;
        // uint64_t    dealerPosition;
        // uint64_t    bigBlind; // value
        // uint64_t    raisedBy; // index
        // uint64_t    currentBetAmount; // value
        // std::vector<card>   flop;
        // card        turn;
        // card        river;
        // uint64_t    pot; //value
        // uint64_t    currentPlayer; //Index
        // std::vector<uint64_t> playersOnTable;
        // std::vector<uint64_t>   playersInHand;
        // std::vector<uint64_t> playersBetAmount; // this is exact mapping to players in Hand , for example playersInHand[0] has currentBeAmount of playersBetAmounts[0]
        // std::vector<card> shuffledDeck;
        // std::vector<uint64_t> handStrengths;

    auto hand = _handstbl.get(handId);
    auto playersInHand = hand.playersInHand;
    for(uint64_t i = 0 ; i < playersInHand.size(); i++)
    {
        if(hand.currentPlayer == playersInHand[i])
        {
            uint64_t index = clockwisenext(i,playersInHand.size());
            _handstbl.modify(itr, get_self(), [&](auto& p) {
                p.currentPlayer = playersInHand[index];
            });
            break;
        }
    }
}
void eospoker::actioncall(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId) // handSeatId can be ommitted but let it be for now
{
    auto currentHand = _handstbl.get(handId);
    //auto shuffledDeck = currentHand.shuffledDeck;
    auto currentPlayer = _playerstbl.get(playerId);
    if(currentHand.currentPlayer != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }

        // uint64_t    playerId; // second key, non-unique, this table will have dup rows for each user because of option
        // eosio::name accountName; // name of user
        // uint8_t     playerStatus = 1; // staus where 0 = off the table, 1 = on the table // If player status = 1 then the player will also have a seat position
        // uint64_t    seatPosition; // At the start of the game the dealer button is at position 1, the small blind at 2, and the big bling at 3;
        // uint64_t    currentChips; //value
        // uint64_t    totalBuyIns; //value
        // cardpair    holeCards;   


        // uint64_t    handId;
        // uint64_t    dealerPosition;
        // uint64_t    bigBlind; // value
        // uint64_t    raisedBy; // index
        // uint64_t    currentBetAmount; // value
        // std::vector<card>   flop;
        // card        turn;
        // card        river;
        // uint64_t    pot; //value
        // uint64_t    currentPlayer; //Index
        // std::vector<uint64_t> playersOnTable;
        // std::vector<uint64_t>   playersInHand;
        // std::vector<card> shuffledDeck;

    if(currentHand.playersInHand[handSeatId] != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }
    uint64_t callValue = currentHand.currentBetAmount - currentHand.playersBetAmount[handSeatId];
    if(currentPlayer.currentChips < callValue)
    {
        eosio::print("The user doesn't have enough chips, has to be all in. Player has chips :  ", currentPlayer.currentChips);
        callValue = currentPlayer.currentChips;
    }

    auto playeriter = _playerstbl.find(playerId);

    _playerstbl.modify(playeriter, get_self(), [&](auto& p) {
        p.currentChips = p.currentChips - callValue;
    });

    auto handiter = _handstbl.find(handId);
    _handstbl.modify(handiter, get_self(), [&](auto& p) {
        p.pot = p.pot + callValue;
        p.playersBetAmount[handSeatId] += callValue;
    });
    eosio::print("Current Pot : ", currentHand.pot);

    updcurpl(s,handId);
    
}

void eospoker::actionbet(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId, uint64_t betValue) // handSeatId can be ommitted but let it be for now
{
    auto currentHand = _handstbl.get(handId);
    //auto shuffledDeck = currentHand.shuffledDeck;
    auto currentPlayer = _playerstbl.get(playerId);
    if(currentHand.currentPlayer != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }

        // uint64_t    playerId; // second key, non-unique, this table will have dup rows for each user because of option
        // eosio::name accountName; // name of user
        // uint8_t     playerStatus = 1; // staus where 0 = off the table, 1 = on the table // If player status = 1 then the player will also have a seat position
        // uint64_t    seatPosition; // At the start of the game the dealer button is at position 1, the small blind at 2, and the big bling at 3;
        // uint64_t    currentChips; //value
        // uint64_t    totalBuyIns; //value
        // cardpair    holeCards;   


        // uint64_t    handId;
        // uint64_t    dealerPosition;
        // uint64_t    bigBlind; // value
        // uint64_t    raisedBy; // index
        // uint64_t    currentBetAmount; // value
        // std::vector<card>   flop;
        // card        turn;
        // card        river;
        // uint64_t    pot; //value
        // uint64_t    currentPlayer; //Index
        // std::vector<uint64_t> playersOnTable;
        // std::vector<uint64_t>   playersInHand;
        // std::vector<card> shuffledDeck;

    if(currentHand.playersInHand[handSeatId] != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }
    uint64_t callValue = currentHand.currentBetAmount;
    if(currentPlayer.currentChips < callValue + betValue)
    {
        eosio::print("The user doesn't have enough chips, has to be all in. Player has chips :  ", currentPlayer.currentChips);
        callValue = currentPlayer.currentChips;
    }

    auto playeriter = _playerstbl.find(playerId);

    _playerstbl.modify(playeriter, get_self(), [&](auto& p) {
        p.currentChips = p.currentChips - (callValue+betValue);
    });

    auto handiter = _handstbl.find(handId);
    _handstbl.modify(handiter, get_self(), [&](auto& p) {
        p.pot = p.pot + callValue + betValue;
        p.playersBetAmount[handSeatId] += (callValue + betValue);
        p.currentBetAmount = p.currentBetAmount + betValue;
    });

    eosio::print("Current Pot : ", currentHand.pot);
    
    updcurpl(s,handId);
}

void eospoker::actionraise(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId, uint64_t raiseValue) // handSeatId can be ommitted but let it be for now
{
    auto currentHand = _handstbl.get(handId);
    //auto shuffledDeck = currentHand.shuffledDeck;
    auto currentPlayer = _playerstbl.get(playerId);
    if(currentHand.currentPlayer != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }

        // uint64_t    playerId; // second key, non-unique, this table will have dup rows for each user because of option
        // eosio::name accountName; // name of user
        // uint8_t     playerStatus = 1; // staus where 0 = off the table, 1 = on the table // If player status = 1 then the player will also have a seat position
        // uint64_t    seatPosition; // At the start of the game the dealer button is at position 1, the small blind at 2, and the big bling at 3;
        // uint64_t    currentChips; //value
        // uint64_t    totalBuyIns; //value
        // cardpair    holeCards;   


        // uint64_t    handId;
        // uint64_t    dealerPosition;
        // uint64_t    bigBlind; // value
        // uint64_t    raisedBy; // index
        // uint64_t    currentBetAmount; // value
        // std::vector<card>   flop;
        // card        turn;
        // card        river;
        // uint64_t    pot; //value
        // uint64_t    currentPlayer; //Index
        // std::vector<uint64_t> playersOnTable;
        // std::vector<uint64_t>   playersInHand;
        // std::vector<card> shuffledDeck;

    if(currentHand.playersInHand[handSeatId] != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }
    uint64_t callValue = currentHand.currentBetAmount;
    if(currentPlayer.currentChips < callValue + raiseValue)
    {
        eosio::print("The user doesn't have enough chips, has to be all in. Player has chips :  ", currentPlayer.currentChips);
        callValue = currentPlayer.currentChips;
    }

    auto playeriter = _playerstbl.find(playerId);

    _playerstbl.modify(playeriter, get_self(), [&](auto& p) {
        p.currentChips = p.currentChips - (callValue+raiseValue);
    });

    auto handiter = _handstbl.find(handId);
    _handstbl.modify(handiter, get_self(), [&](auto& p) {
        p.pot = p.pot + callValue + raiseValue;
        p.playersBetAmount[handSeatId] += (callValue + raiseValue);
        p.currentBetAmount = p.currentBetAmount + raiseValue;
    });

    eosio::print("Current Pot : ", currentHand.pot);
    
    updcurpl(s,handId);
}

void eospoker::actionallin(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId) // handSeatId can be ommitted but let it be for now
{
    auto currentHand = _handstbl.get(handId);
    //auto shuffledDeck = currentHand.shuffledDeck;
    auto currentPlayer = _playerstbl.get(playerId);
    if(currentHand.currentPlayer != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }

        // uint64_t    playerId; // second key, non-unique, this table will have dup rows for each user because of option
        // eosio::name accountName; // name of user
        // uint8_t     playerStatus = 1; // staus where 0 = off the table, 1 = on the table // If player status = 1 then the player will also have a seat position
        // uint64_t    seatPosition; // At the start of the game the dealer button is at position 1, the small blind at 2, and the big bling at 3;
        // uint64_t    currentChips; //value
        // uint64_t    totalBuyIns; //value
        // cardpair    holeCards;   


        // uint64_t    handId;
        // uint64_t    dealerPosition;
        // uint64_t    bigBlind; // value
        // uint64_t    raisedBy; // index
        // uint64_t    currentBetAmount; // value
        // std::vector<card>   flop;
        // card        turn;
        // card        river;
        // uint64_t    pot; //value
        // uint64_t    currentPlayer; //Index
        // std::vector<uint64_t> playersOnTable;
        // std::vector<uint64_t>   playersInHand;
        // std::vector<card> shuffledDeck;

    if(currentHand.playersInHand[handSeatId] != playerId)
    {
        eosio::print("The player cannot call this action ", playerId);
        return;
    }
    
    uint64_t allinValue = currentPlayer.currentChips;
    auto playeriter = _playerstbl.find(playerId);

    _playerstbl.modify(playeriter, get_self(), [&](auto& p) {
        p.currentChips = 0;
    });
    uint64_t betRaiseAmount = 0;
    if(allinValue > currentHand.currentBetAmount)
    {
        betRaiseAmount = allinValue - currentHand.currentBetAmount; 
    }

    auto handiter = _handstbl.find(handId);
    _handstbl.modify(handiter, get_self(), [&](auto& p) {
        p.pot = p.pot + allinValue;
        p.playersBetAmount[handSeatId] += (allinValue);
        p.currentBetAmount = p.currentBetAmount + betRaiseAmount;
    });

    eosio::print("Current Pot : ", currentHand.pot);
    
    updcurpl(s,handId);
}

void eospoker::actionfold(eosio::name s, uint64_t playerId, uint64_t handId, uint64_t handSeatId)
{
    // checks
    auto hand_itr = _handstbl.find(handId);
    auto player_itr = _playerstbl.find(playerId);
    if(hand_itr == _handstbl.end())
    {
        eosio::print("The hand doesn't exist", handId);
        return;
    }
    if(player_itr == _playerstbl.end())
    {
        eosio::print("The player doesn't exist", playerId);
        return;
    }
    auto currentHand = _handstbl.get(handId);
    auto playersInHand = currentHand.playersInHand;
    uint64_t index = 1000;
    for(uint64_t i =0 ; i < playersInHand.size(); i++)
    {
        if(playersInHand[i]==playerId)
        {
            index = i;
        }
    }
    if(index == 1000)
    {
        eosio::print("The player is not in the hand", playerId);
        return;
    }
    playersInHand.erase(playersInHand.begin() + index);
    _handstbl.modify(hand_itr, get_self(), [&](auto& p) {
        p.playersInHand = playersInHand;
    });
    eosio::print("The player has been removed from the hand");

    updcurpl(s,handId);
}
void eospoker::openflop(eosio::name s, uint64_t handId)
{
    auto itr = _handstbl.find(handId);
    if(itr == _handstbl.end())
    {
        eosio::print("The hand doesnt exist : ", handId);
        return;
    }
    auto hand = _handstbl.get(handId);
    auto shuffledDeck = hand.shuffledDeck;
    std::vector<card> flop;
    shuffledDeck.erase(shuffledDeck.begin());
    for(uint64_t i = 0 ; i < 2 ; i++)
    {
        flop.push_back(shuffledDeck[0]);
        shuffledDeck.erase(shuffledDeck.begin());
    }
    _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.flop = flop;

    }); 

     _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.shuffledDeck = shuffledDeck;
    });
}
void eospoker::openturn(eosio::name s, uint64_t handId)
{
    auto itr = _handstbl.find(handId);
    if(itr == _handstbl.end())
    {
        eosio::print("The hand doesnt exist : ", handId);
        return;
    }
    auto hand = _handstbl.get(handId);
    auto shuffledDeck = hand.shuffledDeck;
    std::vector<card> flop;
    shuffledDeck.erase(shuffledDeck.begin());
    card turn = shuffledDeck[0];
    _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.turn = turn;

    });
     _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.shuffledDeck = shuffledDeck;
    });
}
void eospoker::openriver(eosio::name s, uint64_t handId)
{
    auto itr = _handstbl.find(handId);
    if(itr == _handstbl.end())
    {
        eosio::print("The hand doesnt exist : ", handId);
        return;
    }
    auto hand = _handstbl.get(handId);
    auto shuffledDeck = hand.shuffledDeck;
    std::vector<card> flop;
    shuffledDeck.erase(shuffledDeck.begin());
    card river = shuffledDeck[0];
    _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.river = river;

    });
     _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.shuffledDeck = shuffledDeck;
    });
}

void eospoker::showdown(eosio::name s, uint64_t handId)
{
    auto itr = _handstbl.find(handId);
    if(itr == _handstbl.end())
    {
        eosio::print("The hand doesn't exist");
        return;
    }
    auto hand = _handstbl.get(handId);
    auto playersInHand = hand.playersInHand;
    std::map<uint64_t, std::vector<card>> playerToCards;
    std::map<uint64_t, uint64_t> playerToScore;
    std::vector<card> temp;
    std::vector<uint64_t> handStrengths;
    for(uint64_t i = 0 ; i < playersInHand.size() ; i++)
    {
        uint64_t maxScore = 0;
        temp.clear();
        auto pl = _playerstbl.get(playersInHand[i]);
        cardpair holeCards = pl.holeCards;
        temp.push_back({holeCards.firstCard});
        temp.push_back({holeCards.secondCard});
        temp.push_back(hand.flop[0]);
        temp.push_back(hand.flop[1]);
        temp.push_back(hand.flop[2]);
        temp.push_back(hand.turn);
        temp.push_back(hand.river);
        uint64_t playerId = playersInHand[i];
        playerToCards[playerId] = temp;
        std::vector<card> handForComparison; 
        for( int j = 0 ; j < 7 ; j++)
        {
            for(int k = j+1; k< 7 ; k++)
            {
                Hand tempHand;
                for( int l = 0 ; l < 7 ; l++)
                {
                    if(l!=j && l!=k)
                    {
                        tempHand.cards.push_back({(int)temp[l].rank, (int)temp[l].suit});
                    }
                }
               
                int score = tempHand.GetScore();
                if(score>maxScore)
                    maxScore = score;
            }
        }
        handStrengths.push_back(maxScore);
    }
    _handstbl.modify(itr, get_self(), [&](auto& p) {
        p.handStrengths = handStrengths;
    });
}
EOSIO_DISPATCH( eospoker, (version)(addplayer)(rmplayer)(creategame)(seatplayer)(startgame)(starthand)(dealcards)(updcurpl)(actioncall)(actionbet)(actionraise)(actionallin)(actionfold)(openflop)(openturn)(openriver)(showdown))
