FROM python:3.11-slim

WORKDIR /app

# Install poetry
RUN pip install poetry==1.8.5
ENV PATH="/root/.local/bin:$PATH"

# Copy algorithme files
COPY pyproject.toml poetry.lock alembic.ini ./
COPY database ./database
COPY potentiel_solaire ./potentiel_solaire
COPY notebooks/pipeline_algorithme.ipynb ./notebooks/pipeline_algorithme.ipynb
COPY README.md ./

# Install dependencies and the local package
RUN poetry install --without dev

ENTRYPOINT ["poetry", "run", "algorithme"]  
