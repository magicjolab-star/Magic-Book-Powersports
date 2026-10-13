#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'ehtvkqzqijjswqvxeyeu';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const TEMPLATE_PATH = path.resolve(
  process.env.SUPABASE_MAGIC_LINK_TEMPLATE || 'supabase/templates/magic-link.html',
);
const API_URL = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;
const SUBJECT = process.env.SUPABASE_MAGIC_LINK_SUBJECT || 'Ton code de connexion Magic Book';

function assertTemplate(template) {
  if (!template.includes('{{ .Token }}')) {
    throw new Error('Template rejected: {{ .Token }} is missing.');
  }
  if (template.includes('{{ .ConfirmationURL }}') || template.includes('.ConfirmationURL')) {
    throw new Error('Template rejected: ConfirmationURL is forbidden.');
  }
  const visible = template
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (visible !== '{{ .Token }}') {
    throw new Error(`Template rejected: visible content must be only {{ .Token }}; received ${JSON.stringify(visible)}.`);
  }
}

async function api(method, body) {
  const response = await fetch(API_URL, {
    method,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Supabase Management API ${method} failed (${response.status}): ${JSON.stringify(payload)}`);
  }
  return payload;
}

async function main() {
  if (!ACCESS_TOKEN) {
    throw new Error('SUPABASE_ACCESS_TOKEN is missing; hosted Auth templates require a Supabase Management API access token.');
  }
  if (!/^[a-z0-9]{20}$/.test(PROJECT_REF)) {
    throw new Error(`Invalid SUPABASE_PROJECT_REF: ${PROJECT_REF}`);
  }

  const template = await fs.readFile(TEMPLATE_PATH, 'utf8');
  assertTemplate(template);

  const before = await api('GET');
  const previous = before.mailer_templates_magic_link_content ?? null;

  await api('PATCH', {
    mailer_subjects_magic_link: SUBJECT,
    mailer_templates_magic_link_content: template,
  });

  const after = await api('GET');
  const deployed = after.mailer_templates_magic_link_content;
  assertTemplate(deployed);
  if (deployed.trim() !== template.trim()) {
    throw new Error('Supabase returned a Magic Link template different from the requested template.');
  }

  console.log(JSON.stringify({
    ok: true,
    projectRef: PROJECT_REF,
    field: 'mailer_templates_magic_link_content',
    confirmationUrlPresent: deployed.includes('.ConfirmationURL'),
    tokenPresent: deployed.includes('{{ .Token }}'),
    changed: previous?.trim() !== deployed.trim(),
  }, null, 2));
  console.log('SUPABASE_MAGIC_LINK_TEMPLATE_OK');
}

main().catch((error) => {
  console.error(`SUPABASE_MAGIC_LINK_TEMPLATE_FAILED ${error.message}`);
  process.exit(1);
});
