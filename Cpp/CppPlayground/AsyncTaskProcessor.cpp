#include "AsyncTaskProcessor.h"
#include "ITask.h"
#include <ppltasks.h>
#include <future>

using namespace std;

AsyncTaskProcessor::AsyncTaskProcessor()
	: isShuttingDown(false)
	, asyncExecution([]() {})
{
}

AsyncTaskProcessor::~AsyncTaskProcessor()
{
	this->isShuttingDown = true;
	this->asyncExecution.wait();

	//if (this->executionThread.joinable())
	//{
	//	this->executionThread.join();
	//}
}

void AsyncTaskProcessor::Enqueue(shared_ptr<ITask> task)
{
	if (task == nullptr || this->isShuttingDown)
	{
		return;
	}
	
	{
		lock_guard<mutex> l(this->taskQueueMutex);

		this->taskQueue.push(task);
		if (this->taskQueue.size() != 1)
		{
			return;
		}
	}

	this->asyncExecution = this->asyncExecution.then([this]()
	{
		this->ExecuteTasks();
	});
}

void AsyncTaskProcessor::ExecuteTasks()
{
	while (true)
	{
		std::shared_ptr<ITask> nextTask;

		{
			lock_guard<mutex> l(this->taskQueueMutex);

			if (this->taskQueue.empty())
			{
				return;
			}
			
			nextTask = this->taskQueue.front();
			this->taskQueue.pop();
		}

		nextTask->Execute();
	}
}