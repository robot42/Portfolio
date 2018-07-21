#include "SyncTaskProcessor.h"
#include "ITask.h"

void SyncTaskProcessor::Enqueue(std::shared_ptr<ITask> task)
{
	if (task == nullptr)
	{
		return;
	}

	task->Execute();
}