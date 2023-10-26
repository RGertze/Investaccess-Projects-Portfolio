using System.Collections.Concurrent;

public enum SYNC_TYPE
{
    SYNC_ALL_DATA_FROM_MOODLE = 0,
    SYNC_ALL_ITS_USERS_WITH_MOODLE = 1
}

public class MoodleSyncQueue : ConcurrentQueue<SYNC_TYPE>
{

}