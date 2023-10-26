FROM php:7.4-fpm

RUN docker-php-ext-install pdo pdo_mysql
RUN pecl install xdebug-3.1.6 && docker-php-ext-enable xdebug