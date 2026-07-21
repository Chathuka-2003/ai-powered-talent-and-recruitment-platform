import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Shield, Users, Edit, Plus } from "lucide-react";

export function RoleManagement() {
    const roles = [
        { id: 1, name: "Administrator", users: 5, permissions: ["All Access"] },
        { id: 2, name: "Recruiter", users: 42, permissions: ["View Candidates", "Post Jobs", "Schedule Interviews"] },
        { id: 3, name: "Hiring Manager", users: 28, permissions: ["Review Candidates", "Make Decisions", "View Reports"] },
        { id: 4, name: "Job Seeker", users: 1173, permissions: ["Apply Jobs", "Update Profile", "View Applications"] },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Roles & Permissions</h1>
                    <p className="text-muted-foreground">Manage user roles and access control</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role) => (
                    <GlassCard key={role.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3">
                                <div className="rounded-lg bg-[#D4AF37]/10 p-2">
                                    <Shield className="h-5 w-5 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground mb-1">{role.name}</h3>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{role.users} users</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground mb-2">Permissions:</p>
                            {role.permissions.map((permission, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <Checkbox defaultChecked />
                                    <span className="text-sm text-gray-300">{permission}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </DashboardLayout>
    );
}
