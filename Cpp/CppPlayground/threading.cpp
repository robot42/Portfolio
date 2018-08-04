//
//  threading.cpp
//  CppPlayground
//
//  Created by rico on 18.03.18.
//  Copyright © 2018 rico. All rights reserved.
//

#include <future>
#include <string>
#include <iostream>
#include <algorithm>
#include <thread>
#include "fakeit.hpp"

using namespace std;
using namespace fakeit;

struct SomeInterface
{
    virtual int foo(int) = 0;
    virtual int bar(string) = 0;
};


void test_test()
{
    Mock<SomeInterface> mock;
    
    // Setup mock behavior
    When(Method(mock, foo)).AlwaysDo([](int x) { return 2 * x; });
    When(Method(mock, bar)).Return(1, 2, 3, 4);
    
    // Fetch the mock instance.
    SomeInterface &i = mock.get();
    
    i.foo(1);
    
    // Verify method mock.foo was invoked.
    Verify(Method(mock,foo));
    
    // Verify method mock.foo was invoked with specific arguments.
    Verify(Method(mock,foo).Using(1));
}



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
    
    test_test();
}
