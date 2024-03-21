FROM postgres

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=dhanvantari

COPY dump.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

