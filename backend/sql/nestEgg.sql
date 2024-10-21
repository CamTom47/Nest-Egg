\echo 'Delete and recreate nestegg db?'
\prompt 'Return for yes or control -C to cancel > '


DROP DATABASE nestegg;
CREATE DATABASE nestegg;

\connect nestegg
\i nestegg-schema.sql
\i nestegg-seed.sql

\echo 'Delete and recreate nestegg_test DB?'
\prompt 'Return for yes or control -c to cancel'

DROP DATABASE nestegg_test;
CREATE DATABASE nestegg_test;

\connect nestegg_test
\i nestegg-schema.sql

