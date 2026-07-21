import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Search, Send, Paperclip } from "lucide-react";

export default function JobSeekerCommunication() {
  const conversations = [
    { id: 1, recruiter: "Sarah Johnson", company: "TechCorp", lastMessage: "Your interview is scheduled for...", time: "2h ago", unread: 2 },
    { id: 2, recruiter: "Michael Chen", company: "Innovation Labs", lastMessage: "Thank you for your application...", time: "1d ago", unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "Sarah Johnson", content: "Hi John, thank you for applying!", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", content: "Thank you for considering my application!", time: "10:35 AM", isMe: true },
    { id: 3, sender: "Sarah Johnson", content: "Your interview is scheduled for June 20 at 2 PM", time: "10:40 AM", isMe: false },
  ];

  return (
    <DashboardLayout role="job-seeker">
      <Card className="h-[calc(100vh-12rem)]">
        <div className="grid md:grid-cols-3 h-full">
          <div className="border-r border-border">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </CardHeader>
            <div className="overflow-y-auto h-[calc(100%-140px)]">
              {conversations.map((conv) => (
                <div key={conv.id} className="p-4 border-b border-border hover:bg-primary/5 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conv.recruiter.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{conv.recruiter}</h4>
                        {conv.unread > 0 && <Badge className="bg-primary">{conv.unread}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conv.company}</p>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-xs text-muted-foreground">TechCorp Solutions</p>
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-3 rounded-lg ${msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input placeholder="Type a message..." />
                <Button>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
