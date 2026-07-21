import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, Video, MapPin, User, Building } from "lucide-react";

export default function JobSeekerInterviews() {
  const interviews = [
    {
      id: 1,
      job: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      interviewer: "Sarah Johnson",
      date: "June 20, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Technical Interview",
      mode: "Video Call",
      status: "Upcoming",
    },
    {
      id: 2,
      job: "Lead Frontend Engineer",
      company: "Innovation Labs",
      interviewer: "Michael Chen",
      date: "June 22, 2026",
      time: "10:00 AM - 11:00 AM",
      type: "Cultural Fit",
      mode: "Video Call",
      status: "Upcoming",
    },
  ];

  return (
    <DashboardLayout role="job-seeker">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Interviews</h1>
            <p className="text-muted-foreground">Manage and prepare for your upcoming interviews</p>
          </div>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
        </div>

        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{interview.job}</h3>
                      <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                        {interview.status}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {interview.company}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {interview.interviewer}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {interview.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {interview.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        {interview.mode}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{interview.type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Join Interview
                  </Button>
                  <Button variant="outline">Reschedule</Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
