import { useState, useEffect } from "react";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { User, Lock, Save } from "lucide-react";
import { api } from "../../api";

export function AccountSettingsView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // For password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Initialize from user session
  useEffect(() => {
    try {
      const stored = localStorage.getItem("talentai.user");
      if (stored) {
        const user = JSON.parse(stored);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
      }
    } catch {}
  }, []);

  const handleUpdateAccount = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("talentai.user");
      if (!stored) return;
      const user = JSON.parse(stored);
      
      const res = await api.users.updateSettings(user.id, { firstName, lastName, email });
      alert(res.message || "Settings updated successfully!");
      
      // Update local storage
      const updatedUser = { ...user, firstName, lastName, email };
      localStorage.setItem("talentai.user", JSON.stringify(updatedUser));
      
      // Reload to reflect name changes in headers if needed
      window.location.reload();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please enter both current and new passwords.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const stored = localStorage.getItem("talentai.user");
      if (!stored) return;
      const user = JSON.parse(stored);
      
      const res = await api.users.changePassword(user.id, { oldPassword, newPassword });
      alert(res.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-5 flex gap-2">
          <User className="text-[#D4AF37]" />
          Account Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">First Name</label>
            <Input 
              className="bg-secondary border-border text-foreground" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Last Name</label>
            <Input 
              className="bg-secondary border-border text-foreground" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input 
              type="email"
              className="bg-secondary border-border text-foreground" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </div>
        <Button className="mt-5" onClick={handleUpdateAccount} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-5 flex gap-2">
          <Lock className="text-[#D4AF37]" />
          Security Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Current Password</label>
            <Input 
              type="password"
              className="bg-secondary border-border text-foreground" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">New Password</label>
            <Input 
              type="password"
              className="bg-secondary border-border text-foreground" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>
        </div>
        <Button className="mt-5" onClick={handleChangePassword} disabled={pwLoading}>
          <Lock className="mr-2 h-4 w-4" />
          {pwLoading ? "Changing..." : "Change Password"}
        </Button>
      </GlassCard>
    </div>
  );
}
