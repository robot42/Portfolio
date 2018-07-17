#pragma once

#include <queue>
#include <memory>
#include <mutex>
#include <atomic>
#include <ppltasks.h>

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
	concurrency::task<void> asyncExecution;
	std::atomic<bool> isShuttingDown;
};

