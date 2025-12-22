from datetime import datetime, timezone

def utc_now():
    return datetime.now(timezone.utc)

def iso_utc(dt):
    if not dt:
        return None
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
