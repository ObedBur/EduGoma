export const ScheduleModule = {
  forRoot: () => ({
    module: class ScheduleModuleRoot {},
    providers: [],
  }),
  forRootAsync: () => ({
    module: class ScheduleModuleRootAsync {},
    providers: [],
  }),
};

export function Cron(): MethodDecorator {
  return () => undefined;
}

export const CronExpression = {
  EVERY_MINUTE: '* * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_DAY_AT_MIDNIGHT: '0 0 * * *',
  EVERY_DAY_AT_NOON: '0 12 * * *',
};
