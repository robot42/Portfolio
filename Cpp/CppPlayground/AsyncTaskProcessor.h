#pragma once

#include <queue>
#include <memory>
#include <mutex>

class ITask;

class AsyncTaskProcessor
{
public:
	AsyncTaskProcessor();
	virtual ~AsyncTaskProcessor();

	void Enqueue(std::shared_ptr<ITask> task);

private:
	AsyncTaskProcessor(const AsyncTaskProcessor&) = delete;
	AsyncTaskProcessor& operator=(const AsyncTaskProcessor&) = delete;

	void ExecuteTasks();

	std::queue<std::shared_ptr<ITask>> taskQueue;
	std::mutex taskQueueMutex;
	std::thread executionThread;
};

