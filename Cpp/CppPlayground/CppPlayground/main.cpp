#include <iostream>
#include <memory>
#include <string>
#include <algorithm>
#include <ctype.h>
#include "threading.hpp"

class ISaxCallback
{
  public:
    virtual ~ISaxCallback() {}

    virtual void OnStartDocument() = 0;
    virtual void OnEndDocument() = 0;
    virtual void OnStartElement(std::string name) = 0;
    virtual void OnEndElement() = 0;
    virtual void OnAttribute(std::string name, std::string value) = 0;
};

class DefaultSaxCallback : public ISaxCallback
{
    virtual void OnStartDocument()
    {
         std::cout << "document begin" << std::endl;
    }

    virtual void OnEndDocument()
    {
         std::cout << "document end" << std::endl;
    }

    virtual void OnStartElement(std::string name) { std::cout << "element " << name << " begin"; }
    virtual void OnEndElement()  { std::cout << " and end" << std::endl; }
    virtual void OnAttribute(std::string name, std::string value) { std::cout << "attribute " << name << " with value " << value << std::endl; }
};

class XmlParser
{
  public:
    explicit XmlParser(std::shared_ptr<ISaxCallback> callback)
    {
        this->callback = callback;
    }

    void Parse(std::string xml)
    {
        this->xml = xml;
        this->callback->OnStartDocument();
        std::string::const_iterator currentPosition = std::find(this->xml.cbegin(), this->xml.cend(), '<');

        std::string nodeName;
        if (currentPosition != this->xml.end() && this->TryReadNodeName(++currentPosition, nodeName, currentPosition))
        {
            currentPosition = this->SkipWhitespace(currentPosition);
            // read attributes or end of tag or subelements
            if (*currentPosition == '/')
            {

            }
            else if (*currentPosition == '>')
            {
                
            }
            // while ()
        }
        this->callback->OnEndDocument();
    }

  private:
    XmlParser(const XmlParser &) = delete;
    void operator=(const XmlParser &) = delete;

    std::string::const_iterator SkipWhitespace(std::string::const_iterator startPosition)
    {
        return std::find_if_not(startPosition, this->xml.cend(), isspace);
    }

    bool TryReadNodeName(
        const std::string::const_iterator& startPosition,
        std::string& outNodeName,
        std::string::const_iterator& outNextPosition)
        {
            std::string::const_iterator start = std::find_if(startPosition, this->xml.cend(), XmlParser::IsNodeNameBegin);
            std::string::const_iterator end   = std::find_if(start, this->xml.cend(), XmlParser::IsNodeNameEnd);

            if (start == this->xml.cend() || end == this->xml.cend())
            {
                return false;
            }

            outNodeName = std::string(start, end);
            outNextPosition = end;
            return true;
        }

    static bool IsNodeNameBegin(char c)
    {
        return isalnum(c);
    }

    static bool IsNodeNameEnd(char c)
    {
        return isspace(c) || c == '/' || c == '>';
    }

    std::shared_ptr<ISaxCallback> callback;
    std::string xml;
};

int main(int argc, const char *argv[])
{
    test_threading();
    
    // insert code here...
    XmlParser p(std::shared_ptr<ISaxCallback>(new DefaultSaxCallback));
    std::string xml =
    "<root>   \n"
    "    < subnode attribute1=\"value 1\"   / >   \n"
    "    < subnode attribute2=\"value 1\"  > < / subnode >  \n"
    "    <nodes>\n"
    "        <node1 attribute2 = \"value 1\" />\n"
    "        <node2 attribute2 = 'value 1' >innter text</node2> \n"
    "    </nodes>\n"
    "</root>\n";

    // p.Parse(xml);
    // std::cout << "Hello, World!\n";
    return 0;
}
