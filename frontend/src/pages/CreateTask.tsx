import PageContainer from "../components/PageContainer";
import TaskForm from "../components/TaskForm";

export default function CreateTask() {
  return (
    <PageContainer
      title="New Task"
      breadcrumbs={[{ title: "Tasks", path: "/" }, { title: "New" }]}
    >
      <TaskForm />
    </PageContainer>
  );
}
