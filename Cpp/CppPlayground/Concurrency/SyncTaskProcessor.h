#pragma once

#include "ITaskProcessor.h"

class SyncTaskProcessor : public ITaskProcessor
{
public:
	virtual void Enqueue(std::shared_ptr<ITask> task) override;
};

