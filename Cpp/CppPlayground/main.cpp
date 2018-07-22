
#include "Concurrency/ITaskProcessor.h"
#include "Concurrency/SyncTaskProcessorFactory.h"
#include "Concurrency/AsyncTaskProcessorFactory.h"
#include "Concurrency/Task.h"
#include <iostream>
#include "boost/format.hpp"
#include <pplawait.h>

using namespace std;

class Waiter : public Task<int>
{
public:
	Waiter(int delayInSeconds)
		: delay(delayInSeconds)
	{
	}

	virtual void Execute()
	{
		std::cout << "Waiter " << this->delay << " started on " << this_thread::get_id() << endl;
		this_thread::sleep_for(std::chrono::seconds(this->delay));
		std::cout << "Waiter " << this->delay << " finished" << endl;
		this->SetResult(this->delay);
	}
private:
	int delay;
};

concurrency::task<int> Save(int i)
{
	this_thread::sleep_for(std::chrono::seconds(i));
	std::cout << boost::format("%1%") % i << endl;
	co_return i;
}

future<void> test(shared_ptr<ITaskProcessorFactory> factory)
{
	std::cout << "Staring in thread " << this_thread::get_id() << endl;

	// auto result = co_await Save(10);

	auto p1 = factory->CreateTaskProcessor();
	auto p2 = factory->CreateTaskProcessor();
	auto task1 = make_shared<Waiter>(1);
	auto task2 = make_shared<Waiter>(2);
	auto task3 = make_shared<Waiter>(3);

	
	p2->Enqueue(task1);
	auto result1 = co_await task1->Future();
	cout << "Waiter " << result1 << " returned" << endl;

	p1->Enqueue(task3);
	auto result3 = co_await task3->Future();
	cout << "Waiter " << result3 << " returned" << endl;

	p2->Enqueue(task2);
	auto result2 = co_await task2->Future();
	cout << "Waiter " << result2 << " returned" << endl;

	std::cout << "Ending in thread " << this_thread::get_id() << endl;
}

int main(int argc, const char *argv[])
{
	// shared_ptr<ITaskProcessorFactory> factory = make_shared<SyncTaskProcessorFactory>();
	shared_ptr<ITaskProcessorFactory> factory = make_shared<AsyncTaskProcessorFactory>();
	test(factory).wait();

	int temp;
	cin >> temp;
    return 0;
}
