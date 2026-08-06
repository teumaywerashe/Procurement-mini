"use client";

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
import { IconShoppingBag, IconAlertCircle, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/store/api/userApi";
import { useDispatch } from "react-redux";
import { logIn } from "@/src/store/auth/authSlice";
import { AuthResponse } from "@/src/types";
import { getErrorMessage } from "@/src/utilis/getErrorMessage";
import { loginSchema } from "@/src/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { error, isLoading }] = useLoginMutation();

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v:string) => {
        const result = loginSchema.shape.email.safeParse(v);
        return result.success ? null : result.error.issues[0].message;
      },
      password: (v:string) => {
        const result = loginSchema.shape.password.safeParse(v);
        return result.success ? null : result.error.issues[0].message;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const result: AuthResponse = await loginUser(values).unwrap();
      dispatch(logIn(result.user));
      router.push("/tenders");
    } catch (error: unknown) {
      console.log("error occurred", error);
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
          (e.currentTarget as HTMLElement).style.background =
            "var(--mantine-color-dark-6)";
          (e.currentTarget as HTMLElement).style.color =
            "var(--mantine-color-gray-0)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color =
            "var(--mantine-color-dimmed)";
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
              {getErrorMessage(error)}
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
