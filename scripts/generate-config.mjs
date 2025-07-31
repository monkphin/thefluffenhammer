import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const required = ["BASE_URL", "GITHUB_APP_ID", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing .env variable: ${key}`);
    process.exit(1);
  }
}

const config = `
backend:
  name: github
  repo: monkphin/thefluffenhammer
  branch: main
  base_url: "${process.env.BASE_URL}"
  auth_endpoint: "/api/auth"
  app_id: "${process.env.GITHUB_APP_ID}"

media_folder: "public/uploads"
public_folder: "/uploads"

media_library:
  name: cloudinary
  config:
    cloud_name: "${process.env.CLOUDINARY_CLOUD_NAME}"
    api_key: "${process.env.CLOUDINARY_API_KEY}"

collections:
  - name: "pages"
    label: "Pages"
    folder: "src/content/pages"
    create: true
    slug: "{{slug}}"
    fields:
      - label: "Title"
        name: "title"
        widget: "string"
      - label: "Body"
        name: "body"
        widget: "markdown"
`;

fs.writeFileSync('public/config.yml', config.trim() + '\n');
fs.writeFileSync('public/admin/config.yml', config.trim() + '\n');
console.log('✅ Generated config.yml');
