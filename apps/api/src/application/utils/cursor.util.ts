/**
 * Encodes cursor data to base64 string
 * Format: created_at:id
 */
export function encodeCursor(created_at: Date, id: string): string {
  const data = `${created_at.toISOString()}:${id}`;
  return Buffer.from(data).toString('base64');
}

/**
 * Decodes cursor string to { created_at, id }
 */
export function decodeCursor(cursor: string): { created_at: Date; id: string } {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    const [created_at_str, id] = decoded.split(':');

    if (!created_at_str || !id) {
      throw new Error('Invalid cursor format');
    }

    return {
      created_at: new Date(created_at_str),
      id,
    };
  } catch (error) {
    throw new Error('Invalid cursor');
  }
}
