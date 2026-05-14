FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (gcc for C extensions, pkg-config + default-libmysqlclient-dev for mysql-connector)
RUN apt-get update && apt-get install -y \
gcc \
pkg-config \
default-libmysqlclient-dev \
&& rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 5000

# Run the application
CMD ["gunicorn", "wsgi:app", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "120"]
