#include "AsyncTaskProcessorFactory.h"
#include "AsyncTaskProcessor.h"

std::shared_ptr<ITaskProcessor> AsyncTaskProcessorFactory::CreateTaskProcessor()
{
	return std::make_shared<AsyncTaskProcessor>();
}