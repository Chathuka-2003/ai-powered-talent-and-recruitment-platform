import { DashboardLayout } from "../../components/DashboardLayout";
import { MessagesView } from "../shared/MessagesView";

export function JobSeekerMessages() {
  return (
    <DashboardLayout role="jobseeker">
      <MessagesView roleName="jobseeker" />
    </DashboardLayout>
  );
}
