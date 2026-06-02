import base64
from cryptography.fernet import Fernet
from app.config import settings


def _get_fernet() -> Fernet:
    key_str = settings.encryption_key
    # If already a valid Fernet key (44 chars base64url), use directly
    try:
        key_bytes = base64.urlsafe_b64decode(key_str)
        if len(key_bytes) == 32:
            fernet_key = base64.urlsafe_b64encode(key_bytes)
        else:
            # Pad/truncate to 32 bytes
            key_bytes = (key_bytes + b'\x00' * 32)[:32]
            fernet_key = base64.urlsafe_b64encode(key_bytes)
    except Exception:
        # Fallback: use raw bytes padded to 32
        raw = key_str.encode()[:32].ljust(32, b'\x00')
        fernet_key = base64.urlsafe_b64encode(raw)
    return Fernet(fernet_key)


def encrypt_api_key(plaintext_key: str) -> str:
    return _get_fernet().encrypt(plaintext_key.encode()).decode()


def decrypt_api_key(encrypted_key: str) -> str:
    return _get_fernet().decrypt(encrypted_key.encode()).decode()
