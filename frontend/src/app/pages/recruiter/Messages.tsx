import { DashboardLayout } from "../../components/DashboardLayout";
import { MessagesView } from "../shared/MessagesView";

export function RecruiterMessages() {
  return (
    <DashboardLayout role="recruiter">
      <MessagesView roleName="recruiter" />
    </DashboardLayout>
  );
}
