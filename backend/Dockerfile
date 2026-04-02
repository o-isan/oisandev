# ========================
# Base
# ========================
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# ========================
# Development
# ========================
FROM base AS dev
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ========================
# Production
# ========================
FROM base AS prod
RUN pip install gunicorn
CMD ["gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000"]
