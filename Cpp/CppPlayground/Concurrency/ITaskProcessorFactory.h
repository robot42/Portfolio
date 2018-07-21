#pragma once

#include <memory>

class ITaskProcessor;

class ITaskProcessorFactory
{
public:
	virtual ~ITaskProcessorFactory() {};

	virtual std::shared_ptr<ITaskProcessor> CreateTaskProcessor() = 0;
};