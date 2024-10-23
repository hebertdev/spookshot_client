import { Container } from "@mantine/core";
import { SignupForm } from "components/pages/Account/Signup";

export default function Signup() {
  return (
    <>
      <div className="estorbo" />
      <Container size={"xs"}>
        <SignupForm />
      </Container>
    </>
  );
}
