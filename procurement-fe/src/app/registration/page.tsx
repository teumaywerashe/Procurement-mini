'use client';

import React, { useState } from 'react';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconShoppingBag,
  IconAlertCircle,
  IconCircleCheck,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function RegistrationPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validate: {
      name: (v) => (v.trim().length > 0 ? null : 'Name is required'),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Enter a valid email'),
      password: (v) => (v.length >= 8 ? null : 'Password must be at least 8 characters'),
      confirmPassword: (v, values) =>
        v === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--mantine-color-dark-8)',
          padding: '1rem',
        }}
      >
        <Stack align="center" gap="md">
          <ThemeIcon size={64} radius="xl" variant="light" color="teal">
            <IconCircleCheck size={36} />
          </ThemeIcon>
          <Title order={2}>Account created</Title>
          <Text c="dimmed" size="sm">You&apos;re all set. Sign in to get started.</Text>
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--mantine-color-dark-8)',
        padding: '1rem',
      }}
    >
      <Box w="100%" maw={420}>
        <Center mb="xl">
          <Stack align="center" gap="xs">
            <ThemeIcon size={56} radius="xl" variant="filled" color="indigo">
              <IconShoppingBag size={28} />
            </ThemeIcon>
            <Title order={2} ta="center">ProcureHub</Title>
            <Text c="dimmed" size="sm">Create your account</Text>
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
                label="Full name"
                placeholder="Jane Doe"
                autoComplete="name"
                required
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email address"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Confirm password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                {...form.getInputProps('confirmPassword')}
              />

              <Button type="submit" fullWidth loading={loading} mt="xs">
                Create account
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm" mt="lg" c="dimmed">
            Already have an account?{' '}
            <Anchor component={Link} href="/login" size="sm">
              Sign in
            </Anchor>
          </Text>
        </Paper>
      </Box>
    </Box>
  );
}
