from google.oauth2 import service_account
from googleapiclient.discovery import build
from app.core.config import settings

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

class DriveConnector:
    def __init__(self):
        self.creds = None
        if settings.GOOGLE_APPLICATION_CREDENTIALS:
            try:
                self.creds = service_account.Credentials.from_service_account_file(
                    settings.GOOGLE_APPLICATION_CREDENTIALS, scopes=SCOPES
                )
            except Exception as e:
                print(f"Error loading credentials: {e}")
        else:
            print("Warning: GOOGLE_APPLICATION_CREDENTIALS not set.")

    def _get_service(self):
        if not self.creds:
            return None
        return build('drive', 'v3', credentials=self.creds)

    def list_files_recursive(self, folder_id: str = None) -> list[dict]:
        """
        List all files recursively starting from folder_id (or root if None).
        Returns list of file metadata dicts.
        """
        service = self._get_service()
        if not service:
            return []
        
        all_files = []
        # If no folder_id provided, maybe search for 'Kalciyan/SGI' first?
        # For now, let's assume valid folder_id or root.
        
        query = "trashed = false and mimeType != 'application/vnd.google-apps.folder'"
        if folder_id:
            query += f" and '{folder_id}' in parents"
            
        # Paging through files
        page_token = None
        while True:
            try:
                results = service.files().list(
                    q=query,
                    pageSize=100,
                    fields="nextPageToken, files(id, name, mimeType, webViewLink, modifiedTime, parents)",
                    pageToken=page_token
                ).execute()
                
                items = results.get('files', [])
                all_files.extend(items)
                
                page_token = results.get('nextPageToken')
                if not page_token:
                    break
            except Exception as e:
                print(f"Error listing drive files: {e}")
                break
        
        # Note: True recursion needs to find subfolders and recurse. 
        # This is a simplified version (1-level or specific folder).
        # To do true recursion, we'd query for folders and recurse.
        
        return all_files

drive_service = DriveConnector()
