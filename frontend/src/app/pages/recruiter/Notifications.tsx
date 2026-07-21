import { DashboardLayout } from "../../components/DashboardLayout";
import { NotificationsView } from "../shared/NotificationsView";

export function RecruiterNotifications() {
  return (
    <DashboardLayout role="recruiter">
      <NotificationsView />
    </DashboardLayout>
  );
}
