FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

FROM php:8.3-cli-alpine
RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /app
COPY . .
COPY --from=vendor /app/vendor ./vendor

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public", "public/index.php"]
