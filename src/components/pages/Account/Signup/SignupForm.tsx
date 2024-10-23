"use client";

import { useState } from "react";

import Link from "next/link";
import {useRouter} from 'next/navigation'
// services
import { signupAPI } from "services/accounts";

// mantine
import { showNotification } from "components/Notifications";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
} from "@mantine/core";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      password_confirmation: "",
    },

    validate: {
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : "Invalid email address",
      username: (val) =>
        /^[a-zA-Z0-9]+$/.test(val)
          ? null
          : "Invalid username. Must contain only letters and numbers.",
      password: (val) =>
        val.length >= 8
          ? null
          : "Password must include at least 8 characters.",
      password_confirmation: (val, values) =>
        val === values.password
          ? null
          : "Password confirmation does not match the password.",
    },
  });

  return (
    <Paper radius="md" p="xl">
      <Text size="lg" fw={500}>
        Join Spookshot
      </Text>
      <br />

      <form
        onSubmit={form.onSubmit(async () => {
          if (loading) return;
          try {
            setLoading(true);
            await signupAPI(form.values);
            form.reset();
            showNotification({
              title: "Welcome to Spookshot!",
              message:
                "Your account has been created successfully. We're glad to have you with us!",
              color: "green",
            });
            router.push('/account/login')
            setLoading(false);
          } catch (error: any) {
            showNotification({
              title: "Error!",
              message: JSON.stringify(error?.response?.data),
              color: "red",
            });
            setLoading(false);
          }
        })}
      >
        <Stack>
          <TextInput
            required
            label="E-mail"
            placeholder="hello@spookshot.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
            autoComplete="off"
            type="email"
          />
          <TextInput
            required
            label="Username"
            placeholder="spook2023"
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue("username", event.currentTarget.value)
            }
            error={form.errors.username && "Invalid username"}
            radius="md"
            autoComplete="off"
          />
          <TextInput
            required
            label="First Name"
            placeholder="First Name"
            value={form.values.first_name}
            onChange={(event) =>
              form.setFieldValue("first_name", event.currentTarget.value)
            }
            error={form.errors.first_name && "Invalid first name"}
            radius="md"
            autoComplete="off"
          />
          <TextInput
            required
            label="Last Name"
            placeholder="Last Name"
            value={form.values.last_name}
            onChange={(event) =>
              form.setFieldValue("last_name", event.currentTarget.value)
            }
            error={form.errors.last_name && "Invalid last name"}
            radius="md"
            autoComplete="off"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 8 characters"
            }
            radius="md"
            autoComplete="off"
          />

          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm password"
            value={form.values.password_confirmation}
            onChange={(event) =>
              form.setFieldValue(
                "password_confirmation",
                event.currentTarget.value
              )
            }
            error={
              form.errors.password_confirmation &&
              "Password confirmation does not match the password."
            }
            radius="md"
            autoComplete="off"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component={Link}
            href={"/account/login"}
            type="button"
            size="xs"
          >
            Already have an account? Log in
          </Anchor>
          <Button type="submit" radius="xl" loading={loading}>
            Sign Up
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
