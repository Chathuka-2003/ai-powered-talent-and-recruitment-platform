import { DashboardLayout } from "../../components/DashboardLayout";
import { NotificationsView } from "../shared/NotificationsView";

export function SeekerNotifications() {
  return (
    <DashboardLayout role="jobseeker">
      <NotificationsView />
    </DashboardLayout>
  );
}
