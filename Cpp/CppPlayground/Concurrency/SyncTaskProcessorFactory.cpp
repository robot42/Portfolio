#include "SyncTaskProcessorFactory.h"
#include "SyncTaskProcessor.h"

std::shared_ptr<ITaskProcessor> SyncTaskProcessorFactory::CreateTaskProcessor()
{
	return std::make_shared<SyncTaskProcessor>();
}
