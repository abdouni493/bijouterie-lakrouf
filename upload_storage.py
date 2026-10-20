"""
Upload the storage backup (zip downloaded from the old Supabase project)
into the new Supabase project's buckets. Reads files straight from the zip,
no extraction needed. Safe to re-run: existing files are overwritten.

Run AFTER supabase_schema.sql (which creates the buckets):

    python upload_storage.py "C:\\Users\\Admin\\Downloads\\xhmwvlwjjlpzndlhknrz.storage.zip"

It asks for the new project's service_role key
(Dashboard -> Project Settings -> API Keys). The key is never saved.
"""
import getpass
import mimetypes
import sys
import urllib.error
import urllib.parse
import urllib.request
import zipfile

SUPABASE_URL = 'https://ttqdallrdkqnuyduodrf.supabase.co'


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    key = getpass.getpass('service_role key (input hidden): ').strip()
    z = zipfile.ZipFile(sys.argv[1])
    files = [i for i in z.infolist() if not i.is_dir()]
    ok, failed = 0, []
    for n, info in enumerate(files, 1):
        # zip layout: <old-project-ref>/<bucket>/<path>
        bucket, path = info.filename.split('/', 1)[1].split('/', 1)
        url = f'{SUPABASE_URL}/storage/v1/object/{bucket}/{urllib.parse.quote(path)}'
        req = urllib.request.Request(url, data=z.read(info), method='POST', headers={
            'Authorization': f'Bearer {key}',
            'apikey': key,
            'Content-Type': mimetypes.guess_type(path)[0] or 'application/octet-stream',
            'x-upsert': 'true',
        })
        try:
            urllib.request.urlopen(req, timeout=120).read()
            ok += 1
            print(f'[{n}/{len(files)}] OK   {bucket}/{path}')
        except urllib.error.HTTPError as e:
            failed.append(f'{bucket}/{path}')
            print(f'[{n}/{len(files)}] FAIL {bucket}/{path}: {e.code} {e.read()[:200]!r}')
        except Exception as e:
            failed.append(f'{bucket}/{path}')
            print(f'[{n}/{len(files)}] FAIL {bucket}/{path}: {e}')
    print(f'\nDone: {ok} uploaded, {len(failed)} failed (expected 236 uploaded).')
    if failed:
        print('Re-run the script to retry the failed files.')


if __name__ == '__main__':
    main()
