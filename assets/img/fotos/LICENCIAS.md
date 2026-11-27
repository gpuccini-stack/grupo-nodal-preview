# Licencias de las fotos

Fecha de consulta: 25-nov-2026.

Todas las fotos del sitio son de **Unsplash** y se usan con la **licencia Unsplash**. No se usó ninguna foto de **Unsplash+** (la licencia paga, que es otra) ni de Pexels. La lista de fotos, autores y páginas está en `CREDITOS.md`.

## Licencia Unsplash

- URL: https://unsplash.com/license
- Consultada el 25-nov-2026. Texto copiado tal cual de la página (en inglés):

> **License**
>
> Unsplash visuals are made to be used freely. Our license reflects that.
>
> - All images can be downloaded and used for free
> - Commercial and non-commercial purposes
> - No permission needed (though attribution is appreciated!)
>
> **What is not permitted**
>
> - Images cannot be sold without significant modification.
> - Compiling images from Unsplash to replicate a similar or competing service.
>
> **Longform**
>
> Unsplash grants you an irrevocable, nonexclusive, worldwide copyright license to download, copy, modify, distribute, perform, and use images from Unsplash for free, including for commercial purposes, without permission from or attributing the photographer or Unsplash. This license does not include the right to compile images from Unsplash to replicate a similar or competing service.

**En castellano, resumido:** se pueden descargar, modificar y usar gratis, también con fines comerciales, sin pedir permiso y sin atribución obligatoria (aunque se agradece). No se pueden vender las fotos sin modificarlas de forma significativa ni juntarlas para armar un servicio parecido a Unsplash. El uso en esta web (cabeceras de página con una capa de color) está dentro de lo permitido.

## Cómo se verificó cada foto (25-nov-2026)

Con `_herramientas/fotos_detalle.py`, sobre la ficha pública de cada foto en Unsplash:

1. **No es Unsplash+:** la ficha no tiene la marca `premium` ni `plus`, y la imagen no se sirve desde `plus.unsplash.com`. El script de descarga (`_herramientas/fotos_procesar.py`) lo vuelve a comprobar y se detiene si encuentra una.
2. **Es una fotografía real, no generada por IA:** se revisaron los datos de la cámara (EXIF), la fecha de publicación y las etiquetas. Las fotos publicadas desde 2022 sin datos de cámara se descartaron, salvo una (personas en una pasarela, Armin Iranzad, 2025): se aceptó porque las demás fotos del mismo autor tienen datos de cámara (Nikon D3400 y Xiaomi) y la escena es coherente en cada detalle. La foto del plano (Daniel McCullough) no tiene datos de cámara pero es de 2017, anterior a las imágenes generadas por IA.
3. **Sin caras en primer plano ni marcas:** cada foto se miró a 1080 px antes de usarla. Se descartaron candidatas con logos visibles en cascos, chalecos, máquinas o equipos.

## Si se agregan fotos de Pexels

La licencia de Pexels es otra (https://www.pexels.com/license/). Antes de usar una foto de Pexels, copiar acá su texto con la fecha de consulta y sumarla a `CREDITOS.md`.
