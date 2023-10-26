
namespace SCA_ITS_back_end.Services;



public sealed class MoodleSyncQueueService : BackgroundService
{
    private IServiceScope _serviceScope;
    private readonly MoodleSyncQueue queue;
    private readonly ILogger<MoodleSyncQueueService> _logger;
    private MoodleSyncService moodleSyncService;

    public MoodleSyncQueueService(ILogger<MoodleSyncQueueService> logger, IServiceProvider serviceProvider)
    {
        this._serviceScope = serviceProvider.CreateScope();
        this._logger = logger;
        this.moodleSyncService = _serviceScope.ServiceProvider.GetRequiredService<MoodleSyncService>();
        this.queue = _serviceScope.ServiceProvider.GetRequiredService<MoodleSyncQueue>();
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return ProcessTaskQueueAsync(stoppingToken);
    }

    private async Task ProcessTaskQueueAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Run(async () =>
                {
                    SYNC_TYPE value;
                    if (queue.TryDequeue(out value))
                    {
                        switch (value)
                        {
                            case SYNC_TYPE.SYNC_ALL_DATA_FROM_MOODLE:
                                await moodleSyncService.SyncAll();
                                break;
                            case SYNC_TYPE.SYNC_ALL_ITS_USERS_WITH_MOODLE:
                                await moodleSyncService.SyncAllITSUsers();
                                break;
                        }

                    }
                });
            }
            catch (OperationCanceledException)
            {
                // Prevent throwing if stoppingToken was signaled
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred executing task work item.");
            }
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            $"{nameof(MoodleSyncQueueService)} is stopping.");

        await base.StopAsync(stoppingToken);
    }
}