#pragma once

#include "AsyncTaskProcessor.h"
#include "ITask.h"

AsyncTaskProcessor::AsyncTaskProcessor()
	: isShuttingDown(false)
	, asyncExecution([]() {})
{}

AsyncTaskProcessor::~AsyncTaskProcessor()
{
	this->isShuttingDown = true;
	this->asyncExecution.wait();
}

void AsyncTaskProcessor::Enqueue(std::shared_ptr<ITask> task)
{
	if (task == nullptr || this->isShuttingDown)
	{
		return;
	}

	{
		std::lock_guard<std::mutex> l(this->taskQueueMutex);

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
	while (this->isShuttingDown == false)
	{
		std::shared_ptr<ITask> nextTask;

		{
			std::lock_guard<std::mutex> l(this->taskQueueMutex);

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