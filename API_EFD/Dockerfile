FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instalación de dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Puerto que expondrá el contenedor
EXPOSE 8001

# CMD actualizado con soporte para Proxy
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--proxy-headers", "--forwarded-allow-ips", "*"]