#pragma once

#include "ITask.h"
#include <ppl.h>
#include <future>

template<typename T>
class Task : public ITask
{
public:
	Task()
	{
		this->future = this->promise.get_future();
	}

	std::future<T>& Future()
	{
		return this->future;
	}

protected:
	void SetResult(const T& resultValue)
	{
		this->promise.set_value(resultValue);
	}

private:
	std::promise<T> promise;
	std::future<T> future;
};

