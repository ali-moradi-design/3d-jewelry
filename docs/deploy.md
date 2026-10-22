# Deployment notes

The site is a static export (`pnpm build` writes `out/`). Roadmap phase 7 rsyncs `out/` to
`/srv/static/3d-jewelry` and serves it with Nginx on `3d-jewelry.ali-moradi-develop.com`.

## Nginx

```nginx
server {
    server_name 3d-jewelry.ali-moradi-develop.com;
    root /srv/static/3d-jewelry;
    index index.html;

    # Hashed build output never changes: cache it for a year.
    location /_next/static/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # The studio HDRI and posters are big and rarely change.
    location ~* \.(hdr|jpg|svg)$ {
        add_header Cache-Control "public, max-age=2592000";
    }

    # If .glb models are ever added, serve them with the right type:
    #   types { model/gltf-binary glb; }
    #   location ~* \.glb$ { add_header Cache-Control "public, max-age=31536000, immutable"; }

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/octet-stream;
}
```

Run `nginx -t` before `systemctl reload nginx`, then `certbot --nginx -d 3d-jewelry.ali-moradi-develop.com`.
