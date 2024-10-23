"use client";

import Link from "next/link";

// services
import { loginAPI } from "services/accounts";

// helpers
import { setToken } from "helpers/auth";

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
import { useState } from "react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      password: (val) =>
        val.length < 8
          ? "Password must include at least 8 characters."
          : null,
    },
  });

  return (
    <Paper radius="md" p="xl">
      <Text size="lg" fw={500}>
        Welcome to Spookshot
      </Text>

      <br />
      <form
        onSubmit={form.onSubmit(async () => {
          if (loading) return;
          try {
            setLoading(true);
            const data = await loginAPI(form.values);
            form.reset();
            showNotification({
              title: "Welcome!",
              message: `Hello, ${data.user.first_name}! We're glad to have you here.`,
              color: "green",
            });
            setToken(data.access_token)
            window.location.href = "/";
          } catch (error: any) {
            form.reset();
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
            label="E-mail or Username"
            placeholder="your username"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
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
              "Password must include at least 8 characters"
            }
            radius="md"
            autoComplete="off"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component={Link}
            href={"/account/signup"}
            type="button"
            size="xs"
          >
            Don't have an account? Sign up
          </Anchor>
          <Button type="submit" radius="xl" loading={loading}>
            Log In
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
