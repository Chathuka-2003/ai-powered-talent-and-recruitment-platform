import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Building, MapPin, Calendar, Eye } from "lucide-react";

export default function ApplicationTracking() {
  const applications = [
    { id: 1, job: "Senior Full Stack Developer", company: "TechCorp", status: "Interview", date: "June 10, 2026", stage: 3 },
    { id: 2, job: "Lead Frontend Engineer", company: "Innovation Labs", status: "Review", date: "June 12, 2026", stage: 2 },
    { id: 3, job: "Staff Engineer", company: "CloudScale", status: "Applied", date: "June 15, 2026", stage: 1 },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Interview": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "Review": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Applied": return "bg-green-500/20 text-green-500 border-green-500/30";
      default: return "";
    }
  };

  return (
    <DashboardLayout role="job-seeker">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Application Tracking</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">{app.job}</h3>
                      <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {app.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Applied on {app.date}
                      </div>
                    </div>
                  </div>
                  <Button>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((stage) => (
                      <div key={stage} className="flex-1">
                        <div className={`h-2 rounded-full ${stage <= app.stage ? "bg-primary" : "bg-muted"}`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Applied</span>
                    <span>Screening</span>
                    <span>Interview</span>
                    <span>Offer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
