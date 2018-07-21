#pragma once

#include "ITaskProcessor.h"
#include <queue>
#include <mutex>
#include <atomic>
#include <ppltasks.h>

class AsyncTaskProcessor : public ITaskProcessor
{
public:
	AsyncTaskProcessor();
	virtual ~AsyncTaskProcessor() override;

	virtual void Enqueue(std::shared_ptr<ITask> task) override;

private:
	AsyncTaskProcessor(const AsyncTaskProcessor&) = delete;
	AsyncTaskProcessor& operator=(const AsyncTaskProcessor&) = delete;

	void ExecuteTasks();

	std::queue<std::shared_ptr<ITask>> taskQueue;
	std::mutex taskQueueMutex;
	concurrency::task<void> asyncExecution;
	std::atomic<bool> isShuttingDown;
};

