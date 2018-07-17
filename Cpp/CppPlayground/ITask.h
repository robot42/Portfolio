#pragma once

class ITask
{
public:
	virtual ~ITask() = default;
	virtual void Execute() = 0;

protected:
	ITask() = default;

private:
	ITask(const ITask&) = delete;
	ITask& operator=(const ITask&) = delete;
};