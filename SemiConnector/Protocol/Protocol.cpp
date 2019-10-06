//
//  Protocol.cpp
//  Protocol
//
//  Created by rico on 28.09.19.
//  Copyright © 2019 rico. All rights reserved.
//

#include <iostream>
#include "Protocol.hpp"
#include "ProtocolPriv.hpp"

void Protocol::HelloWorld(const char * s)
{
    ProtocolPriv *theObj = new ProtocolPriv;
    theObj->HelloWorldPriv(s);
    delete theObj;
};

void ProtocolPriv::HelloWorldPriv(const char * s) 
{
    std::cout << s << std::endl;
};

