using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace API.Hubs;

public class VideoHub : Hub
{
    private static readonly ConcurrentDictionary<string, List<ParticipantInfo>> RoomParticipants = new();

    public async Task JoinRoom(string roomId, string userName, string role)
    {
        var connectionId = Context.ConnectionId;
        await Groups.AddToGroupAsync(connectionId, roomId);

        var participant = new ParticipantInfo
        {
            ConnectionId = connectionId,
            UserName = userName,
            Role = role,
            IsOnline = true,
            JoinedAt = DateTime.UtcNow
        };

        var list = RoomParticipants.GetOrAdd(roomId, _ => new List<ParticipantInfo>());
        lock (list)
        {
            list.RemoveAll(p => p.ConnectionId == connectionId);
            list.Add(participant);
        }

        // Broadcast updated room participant list to all in room
        await Clients.Group(roomId).SendAsync("UserJoined", participant);
        await Clients.Group(roomId).SendAsync("UpdateParticipantList", list);
    }

    public async Task LeaveRoom(string roomId)
    {
        var connectionId = Context.ConnectionId;
        await Groups.RemoveFromGroupAsync(connectionId, roomId);

        if (RoomParticipants.TryGetValue(roomId, out var list))
        {
            lock (list)
            {
                list.RemoveAll(p => p.ConnectionId == connectionId);
            }
            await Clients.Group(roomId).SendAsync("UserLeft", connectionId);
            await Clients.Group(roomId).SendAsync("UpdateParticipantList", list);
        }
    }

    public async Task SendSignal(string roomId, object signalData)
    {
        await Clients.OthersInGroup(roomId).SendAsync("ReceiveSignal", Context.ConnectionId, signalData);
    }

    public async Task SendChatMessage(string roomId, string sender, string text)
    {
        var timeStr = DateTime.Now.ToString("hh:mm tt");
        await Clients.Group(roomId).SendAsync("ReceiveChatMessage", sender, text, timeStr);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionId = Context.ConnectionId;
        foreach (var kvp in RoomParticipants)
        {
            var roomId = kvp.Key;
            var list = kvp.Value;
            bool removed = false;
            lock (list)
            {
                removed = list.RemoveAll(p => p.ConnectionId == connectionId) > 0;
            }
            if (removed)
            {
                await Clients.Group(roomId).SendAsync("UserLeft", connectionId);
                await Clients.Group(roomId).SendAsync("UpdateParticipantList", list);
            }
        }
        await base.OnDisconnectedAsync(exception);
    }
}

public class ParticipantInfo
{
    public string ConnectionId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsOnline { get; set; } = true;
    public DateTime JoinedAt { get; set; }
}
