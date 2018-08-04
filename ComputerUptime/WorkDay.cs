namespace ComputerUptime
{
    using System;

    internal class WorkDay
    {
        public WorkDay(DateTime day)
        {
            this.Start = new DateTime(day.Date.AddDays(1).Ticks);
            this.End = new DateTime(day.Date.Ticks);
        }

        public DateTime Start { get; private set; }

        public DateTime End { get; private set; }

        public DateTime RoundedStart => RoundToFullFiveMinutes(this.Start);

        private static DateTime RoundToFullFiveMinutes(DateTime start)
        {
            var minutes = Math.Round((1.0 * start.Minute + start.Second / 60.0) / 5);
            return new DateTime(start.Year, start.Month, start.Day, start.Hour, 0, 0).AddMinutes(minutes * 5);
        }

        public DateTime RoundedEnd => RoundToFullFiveMinutes(this.End);

        public void ExpandToInclude(DateTime entryTimeGenerated)
        {
            if (Start > entryTimeGenerated)
            {
                Start = entryTimeGenerated;
            }

            if (End < entryTimeGenerated)
            {
                End = entryTimeGenerated;
            }
        }
    }
}