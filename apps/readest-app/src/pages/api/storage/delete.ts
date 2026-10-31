import type { NextApiRequest, NextApiResponse } from 'next';
import { corsAllMethods, runMiddleware } from '@/utils/cors';
import { createSupabaseAdminClient } from '@/utils/supabase';
import { validateUserAndToken } from '@/utils/access';
import { deleteObject } from '@/utils/object';
import { parseBookFileKey } from '@/utils/bookFileKey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, corsAllMethods);

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, token } = await validateUserAndToken(req.headers['authorization']);
    if (!user || !token) {
      return res.status(403).json({ error: 'Not authenticated' });
    }

    const { fileKey } = req.query;

    if (!fileKey || typeof fileKey !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid fileKey' });
    }

    const supabase = createSupabaseAdminClient();
    let { data: fileRecord } = await supabase
      .from('files')
      .select('user_id, id, file_key')
      .eq('user_id', user.id)
      .eq('file_key', fileKey)
      .limit(1)
      .single();

    let aliasKey: string | null = null;
    if (fileKey.includes('/Yomi/Books/')) {
      aliasKey = fileKey.replace('/Yomi/Books/', '/Readest/Books/');
    } else if (fileKey.includes('/Readest/Books/')) {
      aliasKey = fileKey.replace('/Readest/Books/', '/Yomi/Books/');
    }

    if (!fileRecord && aliasKey) {
      const { data: aliasRecord } = await supabase
        .from('files')
        .select('user_id, id, file_key')
        .eq('user_id', user.id)
        .eq('file_key', aliasKey)
        .limit(1)
        .single();
      if (aliasRecord) {
        fileRecord = aliasRecord;
      }
    }

    // Same fallback as the download API: a book file uploaded under another
    // name (the calibre plugin and koplugin use `{hash}.{ext}`) is found by its
    // book hash and extension.
    const bookFile = !fileRecord && parseBookFileKey(fileKey);
    if (bookFile) {
      const { data: candidates } = await supabase
        .from('files')
        .select('user_id, id, file_key')
        .eq('user_id', user.id)
        .eq('book_hash', bookFile.bookHash)
        .is('deleted_at', null);
      fileRecord =
        candidates?.find((f) => f.file_key.endsWith(`.${bookFile.fileExtension}`)) ?? null;
    }

    if (!fileRecord) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (fileRecord.user_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized access to the file' });
    }

    try {
      // 1. Delete object from R2/S3 (and alias if present)
      await deleteObject(fileRecord.file_key);
      if (fileKey !== fileRecord.file_key) {
        await deleteObject(fileKey).catch(() => {});
      }
      if (aliasKey) {
        await deleteObject(aliasKey).catch(() => {});
      }

      // 2. Soft delete in Supabase
      const keysToSoftDelete = [fileRecord.file_key, fileKey, ...(aliasKey ? [aliasKey] : [])];
      const { error: supabaseError } = await supabase
        .from('files')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .in('file_key', keysToSoftDelete);

      if (supabaseError) {
        console.error('Error soft-deleting file metadata in Supabase:', supabaseError);
        return res.status(500).json({ error: supabaseError.message });
      }

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting file metadata or object:', error);
      res.status(500).json({ error: 'Could not delete file' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
