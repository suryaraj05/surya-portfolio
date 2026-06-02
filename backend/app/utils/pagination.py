from math import ceil


def pagination_meta(total: int, page: int, page_size: int) -> dict[str, int]:
    total_pages = ceil(total / page_size) if page_size else 0
    return {"total": total, "page": page, "page_size": page_size, "total_pages": total_pages}
