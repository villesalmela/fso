FROM node:23-slim


WORKDIR /app
COPY app /app
RUN npm install
RUN chmod +x /app/entrypoint.sh

ARG PORT=3001
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT [ "/app/entrypoint.sh" ]