
#include "AsyncTaskProcessor.h"
#include "Task.h"
#include <iostream>
#include <thread>
#include <pplawait.h>

using namespace std;

class Waiter : public Task<int>
{
public:
	Waiter(int delayInSeconds)
		: delay(delayInSeconds)
	{
	}

	virtual void Execute() override
	{
		cout << "Waiter " << this->delay << " started" << endl;
		this_thread::sleep_for(std::chrono::seconds(this->delay));
		cout << "Waiter " << this->delay << " finished" << endl;
		this->SetResult(this->delay);
	}
private:
	int delay;
};



future<void> test()
{
	AsyncTaskProcessor p1;
	AsyncTaskProcessor p2;

	auto task1 = make_shared<Waiter>(1);
	auto task2 = make_shared<Waiter>(2);
	auto task3 = make_shared<Waiter>(3);

	p1.Enqueue(task3);
	p2.Enqueue(task2);
	p2.Enqueue(task1);

	auto result1 = co_await task1->Future();
	cout << "Waiter " << result1 << " returned" << endl;
	auto result2 = co_await task2->Future();
	cout << "Waiter " << result2 << " returned" << endl;
	auto result3 = co_await task3->Future();
	cout << "Waiter " << result3 << " returned" << endl;
}

int main(int argc, const char *argv[])
{
	test().wait();

	int temp;
	cin >> temp;
    return 0;
}
