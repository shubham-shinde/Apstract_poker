#include <algorithm>
#include <cmath>
#include <cstdlib>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <tuple>
#include <vector>
#include <iostream>

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
        // 	std::cout << "card : " << cards[i].rank << " "<<cards[i].suit<<" --> "; 
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
 
struct Deck
{
    Deck() : cards(kcardsPerDeck)
    {
        for(int s = 0; s < kNumSuits; ++s)
        {
            for(int r = 0; r < kNumRanks; ++r)
            {
                cards[s * kNumRanks + r] = card(s, r + kStartingRank);
            }
        }
    }
    void shuffle()
    {
        std::random_shuffle(cards.begin(), cards.end());
    }
    void deal(Hand& h)
    {
        for(size_t i = 0; i < h.cards.size(); ++i)
        {
            h.cards[i] = cards[i];
        }
    }
    std::vector<card> cards;
};
 
int main()
{
    std::srand(static_cast<unsigned int>(std::time(0)));
    Deck deck;
    Hand hand;
    int scores[num_scores] = {};
    const int num_hands = 1000;
    const int num_width = static_cast<int>(std::log10(num_hands) + 1);
    for(int i = 0; i < num_hands; ++i)
    {
        deck.shuffle();
        deck.deal(hand);
        std::cout<<hand.GetScore()<<"\n";
        ++scores[hand.GetScore()];
    }
    std::cout << "Results for " << num_hands << " Hands:" << std::endl;
    for(int i = 0; i < num_scores; ++i)
    {
        std::cout << std::setw(num_width) << std::right << scores[i] << " - " << HandScoreNames[i] << std::endl;
    }
    return 0;
}