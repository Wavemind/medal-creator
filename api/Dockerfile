# Image de production de l'API (Rails 7, API seule). Les fichiers sont sur S3 : seul public/storage est monté.
FROM ruby:3.2.1-slim AS base
WORKDIR /app
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_PATH=/usr/local/bundle \
    LANG=C.UTF-8 \
    MALLOC_ARENA_MAX=2
# Ruby 3.2.1 n'existe qu'en Debian 11, dont les correctifs de sécurité sont passés sur archive.debian.org.
RUN sed -i 's|http://deb.debian.org/debian-security|http://archive.debian.org/debian-security|' /etc/apt/sources.list

FROM base AS build
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends build-essential git libpq-dev \
 && rm -rf /var/lib/apt/lists/*
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.4.21 \
 && bundle install \
 && rm -rf ~/.bundle "$BUNDLE_PATH"/ruby/*/cache "$BUNDLE_PATH"/ruby/*/bundler/gems/*/.git \
 && bundle exec bootsnap precompile --gemfile
COPY . .
RUN bundle exec bootsnap precompile app/ lib/

FROM base
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends libpq5 curl \
 && rm -rf /var/lib/apt/lists/*
# Même UID que l'ancienne image Dokku, propriétaire des fichiers de public/storage.
RUN useradd --create-home --uid 32767 --shell /bin/bash rails
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build --chown=rails:rails /app /app
RUN mkdir -p tmp/pids log public/storage && chown -R rails:rails tmp log public/storage
USER rails
ENV PORT=5000
EXPOSE 5000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
