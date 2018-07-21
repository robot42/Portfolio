#pragma once

#include "ITaskProcessorFactory.h"

class ITaskProcessor;

class AsyncTaskProcessorFactory : public ITaskProcessorFactory
{
public:
	virtual std::shared_ptr<ITaskProcessor> CreateTaskProcessor() override;
};