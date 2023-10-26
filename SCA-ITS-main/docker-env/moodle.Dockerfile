
FROM bitnami/moodle:4.1.1-debian-11-r6


RUN install_packages vim git php-imagick

# make pdfs readable in imagick
RUN sed -i 's/<policy domain="coder" rights="none" pattern="PDF" \/>/<policy domain="coder" rights="read" pattern="PDF" \/>/' /etc/ImageMagick-6/policy.xml  

# enable imagick
RUN echo "extension=imagick.so" > /opt/bitnami/php/etc/conf.d/imagick.ini 
