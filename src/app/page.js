import fs from 'fs';
import path from 'path';
import ClientPage from './ClientPage';

export const dynamic = 'force-dynamic';

export default function Home() {
  let content = null;
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    content = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to read CMS content:", error);
  }

  return <ClientPage data={content} />;
}
