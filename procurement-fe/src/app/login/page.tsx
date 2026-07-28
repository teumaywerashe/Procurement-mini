"use client";

import { useState } from "react";
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
import { notifications } from "@mantine/notifications";
import { IconShoppingBag, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/store/api/userApi";
import { useDispatch } from "react-redux";
import { logIn } from "@/src/store/auth/authSlice";
import { AuthResponse } from "@/src/types";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email"),
      password: (v) =>
        v.length >= 8 ? null : "Password must be at least 8 characters",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result: AuthResponse = await loginUser(values).unwrap();
      // .catch((err) => {
      //   setError(err.data?.message || "An error occurred");
      // });
      dispatch(logIn(result.user));
      console.log(result.user);
      router.push("/tender");
    } catch (error: unknown) {
      setError(
        (error as { data?: { message?: string } }).data?.message ||
          "An error occurred",
      );
      console.log(error);
      // notifications.show({
      //   title: "Login Failed",
      //   message: (error as { data?: { message?: string } }).data?.message || "An error occurred",
      //   color: "red",
      // });
    }
  };

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
              Sign in to your account
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
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
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
                placeholder="Your password"
                autoComplete="current-password"
                required
                {...form.getInputProps("password")}
              />

              <Anchor
                href="#"
                size="xs"
                ta="right"
                mt={-8}
                style={{ display: "block" }}
              >
                Forgot password?
              </Anchor>

              <Button type="submit" fullWidth loading={isLoading} mt="xs">
                Sign in
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm" mt="lg" c="dimmed">
            Don&apos;t have an account?{" "}
            <Anchor component={Link} href="/registration" size="sm">
              Create one
            </Anchor>
          </Text>
        </Paper>
      </Box>
    </Box>
  );
}
