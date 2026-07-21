import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Search, Send } from "lucide-react";

export default function RecruiterCommunication() {
  return (
    <DashboardLayout role="recruiter">
      <Card className="h-[calc(100vh-12rem)]">
        <div className="grid md:grid-cols-3 h-full">
          <div className="border-r border-border p-6">
            <CardTitle className="mb-4">Candidates</CardTitle>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
            <div className="space-y-2">
              {["Alex Thompson", "Jessica Lee"].map((name, i) => (
                <div key={i} className="p-3 rounded-lg hover:bg-primary/5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">Click to view</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <div className="flex-1 p-6">
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a candidate to start messaging
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." />
                <Button><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
