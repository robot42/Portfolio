//
//  threading.cpp
//  CppPlayground
//
//  Created by rico on 18.03.18.
//  Copyright © 2018 rico. All rights reserved.
//

#include "threading.hpp"

#include <future>
#include <string>
#include <iostream>
#include <algorithm>
#include <thread>

using namespace std;

string reverse_string(const string& s)
{
    // this_thread::sleep_for(chrono::nanoseconds(500));
    cout << "Reversing " + s << endl;
    string ss(s);
    reverse(ss.begin(), ss.end());
    return ss;
}

void test_threading()
{
    auto f = async(reverse_string, "1234567890");
    auto g = async(reverse_string, "abcdefghij");
    auto h = async(reverse_string, "1a2b3c4d5e");
    
    cout << "SHOWING RESULTS...." << endl;
    
    cout << "R1: " << f.get() << endl << endl;
    cout << "R2: " << g.get() << endl << endl;
    cout << "R3: " << h.get() << endl << endl;
}
