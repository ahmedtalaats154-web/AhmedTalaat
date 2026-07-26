import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Construct absolute path to the data file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read content:", error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // In a production app, you would validate the body here
    
    // Write the updated JSON back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), 'utf8');
    
    return NextResponse.json({ message: 'Content updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to save content:", error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
