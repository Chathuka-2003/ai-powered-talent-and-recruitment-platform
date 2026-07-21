import { DashboardLayout } from "../../components/DashboardLayout";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

export function UserManagement() {
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Job Seeker", status: "Active", joined: "2026-01-15" },
        { id: 2, name: "Sarah Smith", email: "sarah@techcorp.com", role: "Recruiter", status: "Active", joined: "2026-02-20" },
        { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Hiring Manager", status: "Active", joined: "2026-03-10" },
        { id: 4, name: "Emily Brown", email: "emily@startup.com", role: "Recruiter", status: "Inactive", joined: "2026-01-05" },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
                    <p className="text-muted-foreground">Manage platform users and accounts</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            <GlassCard className="p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10 bg-card border-border text-foreground"
                    />
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-[#D4AF37]">Name</TableHead>
                            <TableHead className="text-[#D4AF37]">Email</TableHead>
                            <TableHead className="text-[#D4AF37]">Role</TableHead>
                            <TableHead className="text-[#D4AF37]">Status</TableHead>
                            <TableHead className="text-[#D4AF37]">Joined</TableHead>
                            <TableHead className="text-[#D4AF37]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-border hover:bg-secondary/30">
                                <TableCell className="text-foreground">{user.name}</TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </GlassCard>
        </DashboardLayout>
    );
}
