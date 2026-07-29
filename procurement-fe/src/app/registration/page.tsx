"use client";

import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Alert,
  Stack,
  Center,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRegisterMutation } from "@/src/store/api/userApi";
import {
  IconShoppingBag,
  IconAlertCircle,
  IconCircleCheck,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { getErrorMessage } from "@/src/utilis/getErrorMessage";

export default function RegistrationPage() {
  // const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validate: {
      name: (v) => (v.trim().length > 0 ? null : "Name is required"),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email"),
      password: (v) =>
        v.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: (v, values) =>
        v === values.password ? null : "Passwords do not match",
    },
  });

  const [registerUser, { error, isLoading: loading }] = useRegisterMutation();
  const handleSubmit = async (values: typeof form.values) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      setSuccess(true);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  if (success) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--mantine-color-dark-8)",
          padding: "1rem",
        }}
      >
        <Stack align="center" gap="md">
          <ThemeIcon size={64} radius="xl" variant="light" color="teal">
            <IconCircleCheck size={36} />
          </ThemeIcon>
          <Title order={2}>Account created</Title>
          <Text c="dimmed" size="sm">
            You&apos;re all set. Sign in to get started.
          </Text>
          <Button component={Link} href="/login" variant="filled" mt="xs">
            Go to login
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--mantine-color-dark-8)",
        padding: "1rem",
        position: "relative",
      }}
    >
      {/* Close button */}
      <Link
        href="/"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2rem",
          height: "2rem",
          borderRadius: "0.5rem",
          border: "1px solid var(--mantine-color-dark-4)",
          color: "var(--mantine-color-dimmed)",
          transition: "all 0.15s",
          zIndex: 50,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--mantine-color-dark-6)";
          (e.currentTarget as HTMLElement).style.color = "var(--mantine-color-gray-0)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--mantine-color-dimmed)";
        }}
        title="Back to home"
      >
        <IconX size={16} />
      </Link>

      <Box w="100%" maw={420}>
        <Center mb="xl">
          <Stack align="center" gap="xs">
            <ThemeIcon size={56} radius="xl" variant="filled" color="indigo">
              <IconShoppingBag size={28} />
            </ThemeIcon>
            <Title order={2} ta="center">
              ProcureHub
            </Title>
            <Text c="dimmed" size="sm">
              Create your account
            </Text>
          </Stack>
        </Center>

        <Paper withBorder shadow="md" p="xl" radius="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              mb="md"
              variant="light"
            >
              {error
                ? getErrorMessage(error)
                : "An error occurred. Please try again."}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Full name"
                placeholder="Jane Doe"
                autoComplete="name"
                required
                {...form.getInputProps("name")}
              />

              <TextInput
                label="Email address"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label="Confirm password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                {...form.getInputProps("confirmPassword")}
              />

              <Button type="submit" fullWidth loading={loading} mt="xs">
                Create account
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm" mt="lg" c="dimmed">
            Already have an account?{" "}
            <Anchor component={Link} href="/login" size="sm">
              Sign in
            </Anchor>
          </Text>
        </Paper>
      </Box>
    </Box>
  );
}
