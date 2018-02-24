using System;
using System.Threading;
using System.Threading.Tasks;

namespace CSharpTest
{
    class AsyncTest
    {
        public Task<bool> SleepFor(int i)
        {
            Task<bool> task = new Task<bool>(()=>
            {
                Console.WriteLine($"{DateTime.Now} Working on {i}...");
                Thread.Sleep(1000 * i);
                Console.WriteLine($"{DateTime.Now} Finished working on {i}...");
                return i == 1;
            });
            task.Start();
            return task;
        }
    }

    class Application
    {
        public void Run()
        {
            Console.WriteLine($"{DateTime.Now} Start...");
            var test = new AsyncTest();
            var r1 = test.SleepFor(1);
            var r2 = test.SleepFor(2);
            // Console.WriteLine($"{DateTime.Now} Result: {r1.Result} & {r2.Result}");
            var res1 = r1.Result;
            var res2 = r2.Result;
            Console.WriteLine($"{DateTime.Now} Result: {res1} & {res2}");
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            new Application().Run();
            Console.WriteLine($"{DateTime.Now} Application finished");
        }
    }
}