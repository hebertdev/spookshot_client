//components
import { Container } from "@mantine/core";
import { LoginForm } from "components/pages/Account/Login";

export default function Login() {
  return (
    <>
      <div className="estorbo" />
      <Container size={"xs"}>
        <LoginForm />
      </Container>
    </>
  );
}
