from fastapi import HTTPException
from sqlalchemy import String, asc, desc, or_


def apply_sort(query, model, sort_by: str | None, sort_order: str = "desc"):
    if not sort_by:
        return query
    if not hasattr(model, sort_by):
        raise HTTPException(status_code=400, detail=f"Invalid sort field: {sort_by}")
    column = getattr(model, sort_by)
    return query.order_by(asc(column) if sort_order == "asc" else desc(column))


def apply_search(query, model, search: str | None, fields: list[str]):
    if not search:
        return query
    predicates = []
    for field in fields:
        if hasattr(model, field):
            column = getattr(model, field)
            if isinstance(column.type, String):
                predicates.append(column.ilike(f"%{search}%"))
    if predicates:
        query = query.filter(or_(*predicates))
    return query


def apply_offset_pagination(query, page: int, page_size: int):
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    return query.offset((page - 1) * page_size).limit(page_size), page, page_size
