import fs from 'fs';
import path from 'path';
import { PROTOCOL, SERVER_URL, REDIRECT_PORT } from '../config/constants';

export function renderHtmlWithUrl(filename: string): string {
  const filePath = path.join(__dirname, '../../../public', filename);
  let html = fs.readFileSync(filePath, 'utf-8');
  const baseUrl = `${PROTOCOL}://${SERVER_URL}:${REDIRECT_PORT}`;
  html = html.replace(/__SERVER_URL__/g, baseUrl);
  return html;
}
