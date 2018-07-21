#pragma once

#include <memory>

class ITask;

class ITaskProcessor
{
public:
	ITaskProcessor() {}
	virtual ~ITaskProcessor(){}
	virtual void Enqueue(std::shared_ptr<ITask> task) = 0;

private:
	ITaskProcessor(const ITaskProcessor&) = delete;
	ITaskProcessor& operator=(const ITaskProcessor&) = delete;
};